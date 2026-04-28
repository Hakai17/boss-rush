// SPDX-License-Identifier: GPL-3.0-only
using System;
using SoulsFormats;

namespace IgniteBossRush.Core.Patching;

/// <summary>
/// Builds the Roundtable Hold "care package" EMEVD event body.
///
/// <para>
/// <b>Layout (decompiled equivalent):</b>
/// <code>
/// $Event(11105800, Default, function() {
///     EndIf(EventFlag(1049308317));                                      // already-given guard
///     WaitFixedTimeSeconds(1);                                           // load-settle
///     SetEventFlagID(1049308317, ON);                                    // mark given (before the chain)
///     DirectlyGivePlayerItem(ItemType.Armor, head[0],  6001, 1);
///     DirectlyGivePlayerItem(ItemType.Armor, head[1],  6001, 1);
///     ...                                                                // 20 calls in head→chest→arms→legs order
///     DirectlyGivePlayerItem(ItemType.Armor, legs[4], 6001, 1);
/// });
/// </code>
/// </para>
///
/// <para>
/// <b>Why a global flag, not <c>ThisEventSlot()</c>?</b> The
/// <c>EndIf(ThisEventSlot()) / SetThisEventSlot(ON)</c> idiom would be
/// cleaner (no plateau allocation), but empirically the slot completion
/// state does NOT survive a Boss Rush tier warp — when the player warps
/// from Roundtable to a boss arena, m11_10 unloads, and the event slot
/// state goes with it. The vanilla Default+ThisEventSlot pattern (m10_00
/// event 10000519 "Elevator initial flag setting") only persists in
/// contexts where the host map never fully unloads. For our case the
/// warp cycle clears the slot, so we use a flag from the global event-
/// flag table which is map-independent.
/// </para>
///
/// <para>
/// <b>Why guard ⇒ wait ⇒ set ⇒ give chain.</b> The guard sits BEFORE the
/// wait so a second concurrent run bails immediately rather than sleeping
/// for a second first. The set sits BEFORE the give chain so a crash or
/// save-scum mid-grant doesn't re-trigger the whole package on next load.
/// </para>
/// </summary>
public static class CarePackageEventBuilder
{
    /// <summary>
    /// Build the care-package event from <paramref name="roll"/>. Returns a
    /// freshly-allocated <see cref="EMEVD.Event"/> with id
    /// <see cref="RoundtableCarePackageConstants.CarePackageEventId"/>; the
    /// caller (the splicer) is responsible for inserting it into the
    /// target EMEVD's <c>Events</c> list and wiring it into the constructor.
    /// </summary>
    public static EMEVD.Event BuildEvent(CarePackageRoll roll)
    {
        ArgumentNullException.ThrowIfNull(roll);

        var giveOrder = roll.InGiveOrder();
        if (giveOrder.Count != RoundtableCarePackageConstants.TotalItems)
        {
            throw new InvalidOperationException(
                $"CarePackageRoll produced {giveOrder.Count} ids in give-order, "
                + $"expected {RoundtableCarePackageConstants.TotalItems}.");
        }

        // RestBehavior=Default. The one-shot guard flag at instruction [0]
        // handles cross-load dedup at the EMEVD level; rest behavior just
        // needs to NOT auto-restart the event mid-flight on save-load.
        var ev = new EMEVD.Event(
            id: RoundtableCarePackageConstants.CarePackageEventId,
            restBehavior: EMEVD.Event.RestBehaviorType.Default);

        var instr = ev.Instructions;

        // (1) One-shot guard — bail if the global guard flag is ON
        //     (set by a prior successful run in this save).
        instr.Add(InstructionFactory.EndIfEventFlagOn(
            RoundtableCarePackageConstants.OneShotGuardFlag));

        // (2) Settle delay so the engine's load chrome is out of the way
        //     before items pop into the inventory toast.
        instr.Add(InstructionFactory.WaitFixedTimeSeconds(
            RoundtableCarePackageConstants.LoadSettleSeconds));

        // (3) Mark as given BEFORE the give chain. Two reasons:
        //     - If a give silently fails (e.g. invalid item id), we still
        //       consider the package delivered — flipping the guard ON last
        //       would create a reload-loop that re-grants partial packages.
        //     - If the player save-scums DURING the give chain (very tight
        //       window), we want the dedup to already be locked in.
        instr.Add(InstructionFactory.SetEventFlagOn(
            RoundtableCarePackageConstants.OneShotGuardFlag));

        // (4) The 20 give calls in stable order: head → chest → arms → legs.
        //     All gives share eventFlagId=6001 — the engine ignores the
        //     dedup-flag aspect of that arg for this opcode (verified
        //     empirically; see RoundtableCarePackageConstants.SharedGiveFlagId).
        for (int i = 0; i < giveOrder.Count; i++)
        {
            var (slot, itemId) = giveOrder[i];
            // Slot is information-only here — DirectlyGivePlayerItem takes
            // the EMEVD ItemType byte (Armor=1) regardless of which of
            // the four armor slots the row actually fills. (The slot field
            // on EquipParamProtector decides where the engine equips it.)
            _ = slot;

            instr.Add(InstructionFactory.DirectlyGivePlayerItem(
                itemType: PatchConstants.ItemTypeArmor,
                itemId: (uint)itemId,
                eventFlagId: RoundtableCarePackageConstants.SharedGiveFlagId,
                count: 1u));
        }

        return ev;
    }
}
