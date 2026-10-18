// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Buffers.Binary;
using System.Collections.Generic;
using SoulsFormats;

namespace BossRush.Core.Patching;

/// <summary>
/// Splices per-tier shop-visibility flips into the Boss Rush source mod's
/// tier-unlock-banner events in <c>m11_10_00_00.emevd.dcx</c> (Roundtable Hold).
///
/// <para>
/// <b>What gets patched.</b> For each tier N in 2..9 the splicer finds the
/// unlock event <see cref="TierClearConstants.TierUnlockEventIds"/>[N] and,
/// immediately after that event's <c>SetEventFlagID(latch(N), ON)</c> call,
/// inserts two instructions:
/// <list type="number">
///   <item><c>SetEventFlagOff(ShopVisibilityFlag(N-1))</c></item>
///   <item><c>SetEventFlagOn(ShopVisibilityFlag(N))</c></item>
/// </list>
/// The result: when the player kills the last boss of tier N-1, the mod's
/// own one-shot unlock event fires, displays the "Tier N Unlocked" banner,
/// sets its latch ON, and — via our splice — flips Kalé's menu from the
/// prior tier's row to the new tier's row in the same atomic step.
/// </para>
///
/// <para>
/// <b>Why here instead of OnTierClear[N].</b> The OnTierClear body used to
/// own this flip, but doing so caused multiple shop rows to appear in
/// Kalé's menu (tiers 1, 2, 3 all visible after clearing tier 1) — either
/// because the tier-2 completion event latched early in Boss-Rush mode or
/// because the vis flip was cascading through some other path. Hooking
/// into the unlock events gives a cleaner signal: each unlock event has a
/// single-boss-marker gate (the "last boss of prior tier" marker), so
/// there's one well-defined moment at which the visibility transition
/// should happen, and the mod's own latch guarantees it fires exactly
/// once.
/// </para>
///
/// <para>
/// <b>Tier 1.</b> Not handled here — tier 1's visibility is bootstrapped
/// ON at game start by <see cref="Tier1VisibilityBootstrapSplicer"/>.
/// Tier 9's unlock event does flip vis(8) OFF and vis(9) ON per the
/// "only one tier visible at a time" rule; once tier 9 is cleared the
/// OnTierClear body keeps vis(9) ON (tier 9's shop persists per spec).
/// </para>
///
/// <para>
/// <b>Idempotency.</b> Re-running on an already-patched EMEVD is a no-op:
/// the splicer checks whether instructions at anchor+1 and anchor+2 are
/// already the matching SetEventFlag pair for this tier.
/// </para>
///
/// <para>
/// <b>Loud failure modes.</b> Missing unlock event, zero or more than one
/// matching <c>SetEventFlagID(latch, ON)</c> inside an unlock event — all
/// throw. Matches the defensive posture of the other splicers.
/// </para>
/// </summary>
public static class TierUnlockVisibilitySplicer
{
    /// <summary>First tier for which an unlock event exists (tier 1 is the
    /// starting tier and is bootstrapped visible at game load instead).</summary>
    public const int FirstUnlockTier = 2;

    /// <summary>
    /// Mutates <paramref name="m11_10"/> in place. Returns per-tier
    /// disposition (freshly inserted vs. already present) and aggregated totals.
    /// </summary>
    public static TierUnlockVisibilitySpliceResult Apply(EMEVD m11_10)
    {
        ArgumentNullException.ThrowIfNull(m11_10);

        var byId = new Dictionary<long, EMEVD.Event>(m11_10.Events.Count);
        foreach (var ev in m11_10.Events)
        {
            if (!byId.ContainsKey(ev.ID)) byId[ev.ID] = ev;
        }

        var perTier = new List<TierUnlockVisibilityStats>(
            TierClearConstants.LastTier - FirstUnlockTier + 1);
        int flipsInserted = 0;
        int flipsAlreadyPresent = 0;

        for (int tierNum = FirstUnlockTier; tierNum <= TierClearConstants.LastTier; tierNum++)
        {
            if (!TierClearConstants.TierUnlockEventIds.TryGetValue(tierNum, out long parentEventId))
            {
                throw new InvalidOperationException(
                    $"Tier unlock visibility splicer: no unlock event ID registered for tier {tierNum} "
                    + "in TierClearConstants.TierUnlockEventIds. This is a programmer error.");
            }

            uint latchFlag = (uint)(TierClearConstants.TierUnlockLatchFlagBase + tierNum);
            uint prevVisFlag = (uint)(TierClearConstants.ShopVisibilityFlagBase + (tierNum - 1));
            uint thisVisFlag = (uint)(TierClearConstants.ShopVisibilityFlagBase + tierNum);

            var stats = SpliceOne(
                byId,
                parentEventId: parentEventId,
                latchFlag: latchFlag,
                prevVisFlag: prevVisFlag,
                thisVisFlag: thisVisFlag,
                tierNum: tierNum);

            perTier.Add(stats);
            if (stats.Inserted) flipsInserted++;
            else if (stats.AlreadyPresent) flipsAlreadyPresent++;
        }

        return new TierUnlockVisibilitySpliceResult(
            FlipsInserted: flipsInserted,
            FlipsAlreadyPresent: flipsAlreadyPresent,
            PerTier: perTier);
    }

    // ------------------------------------------------------------------
    private static TierUnlockVisibilityStats SpliceOne(
        Dictionary<long, EMEVD.Event> byId,
        long parentEventId,
        uint latchFlag,
        uint prevVisFlag,
        uint thisVisFlag,
        int tierNum)
    {
        if (!byId.TryGetValue(parentEventId, out var parent))
        {
            throw new InvalidOperationException(
                $"Tier unlock visibility splicer: unlock event {parentEventId} "
                + $"(tier {tierNum}) not found in m11_10_00_00.emevd. The source mod "
                + "does not match the expected Boss Rush Roundtable Hold layout.");
        }

        int anchorIdx = -1;
        for (int i = 0; i < parent.Instructions.Count; i++)
        {
            if (!IsSetEventFlagOnFor(parent.Instructions[i], latchFlag)) continue;
            if (anchorIdx >= 0)
            {
                throw new InvalidOperationException(
                    $"Tier unlock visibility splicer: multiple SetEventFlagID({latchFlag}, ON) "
                    + $"calls in unlock event {parentEventId} (tier {tierNum}) at indices "
                    + $"{anchorIdx} and {i}. Expected exactly one.");
            }
            anchorIdx = i;
        }
        if (anchorIdx < 0)
        {
            throw new InvalidOperationException(
                $"Tier unlock visibility splicer: anchor SetEventFlagID({latchFlag}, ON) "
                + $"not found in unlock event {parentEventId} (tier {tierNum}). "
                + "Source mod does not match the expected Boss Rush layout.");
        }

        // Idempotency: if the next two instructions are already our exact
        // vis-flip pair for this tier, leave untouched.
        int spliceIdx = anchorIdx + 1;
        if (spliceIdx + 1 < parent.Instructions.Count
            && IsSetEventFlagFor(parent.Instructions[spliceIdx],     prevVisFlag, PatchConstants.FlagStateOff)
            && IsSetEventFlagFor(parent.Instructions[spliceIdx + 1], thisVisFlag, PatchConstants.FlagStateOn))
        {
            return new TierUnlockVisibilityStats(
                Tier: tierNum,
                ParentEventId: parentEventId,
                LatchFlagId: latchFlag,
                PrevShopVisibilityFlagId: prevVisFlag,
                ThisShopVisibilityFlagId: thisVisFlag,
                Inserted: false,
                AlreadyPresent: true,
                AnchorInstructionIndex: anchorIdx,
                SpliceInstructionIndex: spliceIdx);
        }

        var visOff = InstructionFactory.SetEventFlagOff(prevVisFlag);
        var visOn  = InstructionFactory.SetEventFlagOn(thisVisFlag);
        // Insert visOff first, then visOn AFTER visOff — ordering matters so
        // the OFF lands at spliceIdx and the ON at spliceIdx+1.
        parent.Instructions.Insert(spliceIdx,     visOff);
        parent.Instructions.Insert(spliceIdx + 1, visOn);

        // Two instructions inserted → shift any parameter bindings that
        // reference indices at or past spliceIdx by +2.
        foreach (var p in parent.Parameters)
        {
            if (p.InstructionIndex >= spliceIdx)
                p.InstructionIndex += 2;
        }

        // Adjust preceding count-based skips. Run twice (once per insert)
        // because AdjustPrecedingSkipCounts is documented as "single-insert"
        // aware; the second call correctly accounts for the second insertion.
        SpliceHelpers.AdjustPrecedingSkipCounts(parent.Instructions, spliceIdx);
        SpliceHelpers.AdjustPrecedingSkipCounts(parent.Instructions, spliceIdx + 1);

        return new TierUnlockVisibilityStats(
            Tier: tierNum,
            ParentEventId: parentEventId,
            LatchFlagId: latchFlag,
            PrevShopVisibilityFlagId: prevVisFlag,
            ThisShopVisibilityFlagId: thisVisFlag,
            Inserted: true,
            AlreadyPresent: false,
            AnchorInstructionIndex: anchorIdx,
            SpliceInstructionIndex: spliceIdx);
    }

    // ------------------------------------------------------------------
    private static bool IsSetEventFlagOnFor(EMEVD.Instruction ins, uint flagId)
        => IsSetEventFlagFor(ins, flagId, PatchConstants.FlagStateOn);

    private static bool IsSetEventFlagFor(EMEVD.Instruction ins, uint flagId, byte state)
    {
        if (ins.Bank != PatchConstants.BankEvent) return false;
        if (ins.ID != PatchConstants.IdSetEventFlag) return false;
        if (ins.ArgData.Length < 9) return false;
        byte type     = ins.ArgData[0];
        uint id       = BinaryPrimitives.ReadUInt32LittleEndian(ins.ArgData.AsSpan(4, 4));
        byte actState = ins.ArgData[8];
        return type     == PatchConstants.FlagTypeEventFlag
            && id       == flagId
            && actState == state;
    }
}

// =======================================================================
// Result types
// =======================================================================
public sealed record TierUnlockVisibilitySpliceResult(
    int FlipsInserted,
    int FlipsAlreadyPresent,
    IReadOnlyList<TierUnlockVisibilityStats> PerTier);

public sealed record TierUnlockVisibilityStats(
    int Tier,
    long ParentEventId,
    uint LatchFlagId,
    uint PrevShopVisibilityFlagId,
    uint ThisShopVisibilityFlagId,
    bool Inserted,
    bool AlreadyPresent,
    int AnchorInstructionIndex,
    int SpliceInstructionIndex);
