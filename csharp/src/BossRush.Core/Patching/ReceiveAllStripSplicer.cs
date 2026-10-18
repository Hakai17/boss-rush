// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Buffers.Binary;
using System.Collections.Generic;
using SoulsFormats;

namespace BossRush.Core.Patching;

/// <summary>
/// Zeros every <c>AwardItemLot</c> call inside the "receive all items at
/// shop" events in <c>m11_10_00_00.emevd.dcx</c>. These events (11107822–
/// 11107841) are the sandbox-mode bulk-grant path: each waits for a trigger
/// flag set by the Arena Hub NPC's talk script, then fires a volley of
/// <c>AwardItemLot</c> calls that dump an entire item category into the
/// player's inventory. In Boss Rush progression mode the events are gated
/// by <c>EndIf(EventFlag(1049300057))</c>, but the gate is only as
/// reliable as the mod's flag management — if the flag isn't set, or the
/// player somehow enters sandbox mode, the events fire and award hundreds
/// of items.
///
/// <para>
/// The splicer zeros the lot-ID argument of every <c>AwardItemLot</c>
/// instruction (<c>bank 2003, id 4</c>) in each target event.
/// <c>AwardItemLot(0)</c> is a no-op (lot 0 doesn't exist in
/// <c>ItemLotParam_map</c>). The <c>EndIf</c>, <c>WaitFor</c>,
/// <c>SetEventFlagID</c>, and <c>RestartEvent</c> instructions are left
/// untouched so the event's control flow is preserved — no skip-count
/// adjustments needed.
/// </para>
///
/// <para>
/// <b>Scope.</b> Only the 20 events listed in <see cref="ReceiveAllEventIds"/>
/// are scanned. We do NOT walk the entire EMEVD to avoid accidental
/// collateral in unrelated events that may legitimately use
/// <c>AwardItemLot</c>.
/// </para>
/// </summary>
public static class ReceiveAllStripSplicer
{
    /// <summary>
    /// The 20 "receive all items at shop" events in
    /// <c>m11_10_00_00.emevd.dcx</c>. Each follows the same pattern:
    /// <code>
    ///   EndIf(EventFlag(1049300057));      // progression gate
    ///   WaitFor(EventFlag(&lt;trigger&gt;));     // sandbox trigger flag
    ///   SetEventFlagID(&lt;trigger&gt;, OFF);    // clear trigger
    ///   AwardItemLot(...) × N;             // bulk awards ← ZEROED
    ///   RestartEvent();                    // loop
    /// </code>
    /// </summary>
    public static readonly IReadOnlyList<long> ReceiveAllEventIds = new long[]
    {
        11107822, // weapons
        11107823, // upgraded weapons
        11107824, // armor
        11107825, // spells
        11107826, // ashes of war
        11107827, // talismans
        11107828, // spirit ashes
        11107829, // upgraded spirit ashes
        11107830, // tools/misc
        11107831, // consumables/ammo/materials
        11107832, // DLC weapons
        11107833, // DLC upgraded weapons
        11107834, // DLC armor
        11107835, // DLC spells
        11107836, // DLC ashes of war
        11107837, // DLC talismans
        11107838, // DLC spirit ashes
        11107839, // DLC upgraded spirit ashes
        11107840, // DLC tools/misc
        11107841, // DLC consumables/ammo/materials
    };

    private static readonly HashSet<long> TargetSet = new(ReceiveAllEventIds);

    /// <summary>
    /// Walk the target events in <paramref name="mapEmevd"/> and zero the
    /// lot-ID argument of every <c>AwardItemLot</c> instruction.
    /// </summary>
    public static ReceiveAllStripResult Apply(EMEVD mapEmevd)
    {
        if (mapEmevd is null)
            throw new ArgumentNullException(nameof(mapEmevd));

        int totalLotsZeroed = 0;
        int eventsPatched = 0;
        var perEvent = new List<ReceiveAllStripEventStats>();

        foreach (var ev in mapEmevd.Events)
        {
            if (!TargetSet.Contains(ev.ID))
                continue;

            int zeroed = 0;
            foreach (var ins in ev.Instructions)
            {
                if (ins.Bank == PatchConstants.BankEvent
                    && ins.ID == PatchConstants.IdAwardItemLot
                    && ins.ArgData.Length >= 4)
                {
                    // ArgData layout: [0..3] i32 itemLotId
                    // Zero the lot ID — AwardItemLot(0) is a no-op.
                    BinaryPrimitives.WriteInt32LittleEndian(
                        ins.ArgData.AsSpan(0, 4), 0);
                    zeroed++;
                }
            }

            if (zeroed > 0)
            {
                totalLotsZeroed += zeroed;
                eventsPatched++;
                perEvent.Add(new ReceiveAllStripEventStats(ev.ID, zeroed));
            }
        }

        return new ReceiveAllStripResult(totalLotsZeroed, eventsPatched, perEvent);
    }
}

/// <summary>Result of the "receive all items" strip pass.</summary>
public sealed record ReceiveAllStripResult(
    /// <summary>Total <c>AwardItemLot</c> instructions whose lot-ID was
    /// zeroed across all target events.</summary>
    int AwardItemLotsZeroed,

    /// <summary>Number of target events that contained at least one
    /// <c>AwardItemLot</c> instruction.</summary>
    int EventsPatched,

    /// <summary>Per-event breakdown.</summary>
    IReadOnlyList<ReceiveAllStripEventStats> PerEvent);

/// <summary>Per-event stats from the "receive all" strip.</summary>
public sealed record ReceiveAllStripEventStats(
    long EventId,
    int AwardItemLotsZeroed);
