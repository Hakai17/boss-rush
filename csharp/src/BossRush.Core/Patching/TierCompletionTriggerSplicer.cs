// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Buffers.Binary;
using System.Collections.Generic;
using SoulsFormats;

namespace BossRush.Core.Patching;

/// <summary>
/// Splices per-tier OnTierClear triggers into the Boss Rush source mod's
/// Roundtable Hold completion events (<c>m11_10_00_00.emevd.dcx</c>,
/// NOT <c>common_func</c>).
///
/// <para>
/// <b>What gets patched.</b> For each tier N in 1..9 the splicer finds the
/// corresponding completion event in <see cref="TierClearConstants.TierCompletionEventIds"/>
/// (11107716 for tier 1; 11107737..11107744 for tiers 2..9) and inserts a
/// <c>InitializeCommonEvent(0, 90009990+N)</c> instruction immediately after
/// the event's <c>SetEventFlagID(TierClearedFlagBase+N, ON)</c> call.
/// </para>
///
/// <para>
/// <b>Why this hook.</b> Each completion event opens with
/// <c>EndIf(EventFlag(clearedFlag) &amp;&amp; EventFlag(...))</c>, so it becomes
/// a no-op once the cleared flag is ON. The <c>SetEventFlagID(clearedFlag, ON)</c>
/// inside the first if-block therefore transitions OFF→ON <b>exactly once</b>
/// per genuine tier-N clear. Splicing our trigger immediately after it means
/// OnTierClear[N] fires exactly once per clear, which eliminates the need for
/// the old tier-exclusive seal flag (<c>TierClearSealFlagBase</c>) and its
/// companion <see cref="T:BossRush.Core.Patching.DispatcherSealSplicer"/>.
/// </para>
///
/// <para>
/// <b>Idempotency.</b> Re-running on an already-patched EMEVD is a no-op:
/// each splice point is detected by checking whether the instruction
/// immediately after the SetEventFlagID is already the matching
/// <c>InitializeCommonEvent(0, 90009990+N)</c>.
/// </para>
///
/// <para>
/// <b>Loud failure modes.</b> Missing tier-completion event, zero or more
/// than one matching <c>SetEventFlagID(clearedFlag, ON)</c> inside a
/// completion event — all throw. Same defensive posture as the other
/// splicers in this namespace.
/// </para>
/// </summary>
public static class TierCompletionTriggerSplicer
{
    /// <summary>
    /// Mutates <paramref name="m11_10"/> in place. Returns per-tier disposition
    /// (freshly inserted vs. already present) and aggregated totals.
    /// </summary>
    public static TierCompletionTriggerSpliceResult Apply(EMEVD m11_10)
    {
        ArgumentNullException.ThrowIfNull(m11_10);

        var byId = new Dictionary<long, EMEVD.Event>(m11_10.Events.Count);
        foreach (var ev in m11_10.Events)
        {
            if (!byId.ContainsKey(ev.ID)) byId[ev.ID] = ev;
        }

        var perTier = new List<TierCompletionTriggerStats>(TierClearConstants.LastTier);
        int triggersInserted = 0;
        int triggersAlreadyPresent = 0;

        for (int tierNum = TierClearConstants.FirstTier; tierNum <= TierClearConstants.LastTier; tierNum++)
        {
            if (!TierClearConstants.TierCompletionEventIds.TryGetValue(tierNum, out long parentEventId))
            {
                throw new InvalidOperationException(
                    $"Tier completion trigger splicer: no completion event ID registered for tier {tierNum} "
                    + "in TierClearConstants.TierCompletionEventIds. This is a programmer error.");
            }

            uint clearedFlag = (uint)(TierClearConstants.TierClearedFlagBase + tierNum);
            uint targetEventId = (uint)(TierClearConstants.OnTierClearEventBase + tierNum);

            var stats = SpliceOne(
                byId,
                parentEventId: parentEventId,
                clearedFlag: clearedFlag,
                targetEventId: targetEventId,
                tierNum: tierNum);

            perTier.Add(stats);
            if (stats.Inserted) triggersInserted++;
            else if (stats.AlreadyPresent) triggersAlreadyPresent++;
        }

        return new TierCompletionTriggerSpliceResult(
            TriggersInserted: triggersInserted,
            TriggersAlreadyPresent: triggersAlreadyPresent,
            PerTier: perTier);
    }

    // ------------------------------------------------------------------
    private static TierCompletionTriggerStats SpliceOne(
        Dictionary<long, EMEVD.Event> byId,
        long parentEventId,
        uint clearedFlag,
        uint targetEventId,
        int tierNum)
    {
        if (!byId.TryGetValue(parentEventId, out var parent))
        {
            throw new InvalidOperationException(
                $"Tier completion trigger splicer: completion event {parentEventId} "
                + $"(tier {tierNum}) not found in m11_10_00_00.emevd. The source mod "
                + "does not match the expected Boss Rush Roundtable Hold layout.");
        }

        // Locate EXACTLY ONE SetEventFlagID(clearedFlag, ON). The mod's
        // second if-block in each event sets a DIFFERENT flag (the "22..30"
        // companion), so the match on (flagId == clearedFlag, state == ON)
        // is tier-exclusive.
        int anchorIdx = -1;
        for (int i = 0; i < parent.Instructions.Count; i++)
        {
            if (!IsSetEventFlagOnFor(parent.Instructions[i], clearedFlag)) continue;
            if (anchorIdx >= 0)
            {
                throw new InvalidOperationException(
                    $"Tier completion trigger splicer: multiple SetEventFlagID({clearedFlag}, ON) "
                    + $"calls in completion event {parentEventId} (tier {tierNum}) at indices "
                    + $"{anchorIdx} and {i}. Expected exactly one.");
            }
            anchorIdx = i;
        }
        if (anchorIdx < 0)
        {
            throw new InvalidOperationException(
                $"Tier completion trigger splicer: anchor SetEventFlagID({clearedFlag}, ON) "
                + $"not found in completion event {parentEventId} (tier {tierNum}). "
                + "Source mod does not match the expected Boss Rush layout.");
        }

        // Idempotency: if the instruction at anchor+1 is already our
        // InitializeCommonEvent(0, targetEventId), leave untouched.
        int spliceIdx = anchorIdx + 1;
        if (spliceIdx < parent.Instructions.Count
            && IsInitCommonTargeting(parent.Instructions[spliceIdx], targetEventId))
        {
            return new TierCompletionTriggerStats(
                Tier: tierNum,
                ParentEventId: parentEventId,
                OnTierClearEventId: targetEventId,
                ClearedFlagId: clearedFlag,
                Inserted: false,
                AlreadyPresent: true,
                AnchorInstructionIndex: anchorIdx,
                SpliceInstructionIndex: spliceIdx);
        }

        var trigger = InstructionFactory.InitializeCommonEvent(
            slot: TierClearConstants.InitializeSlotZero,
            targetEventId: targetEventId);
        parent.Instructions.Insert(spliceIdx, trigger);

        foreach (var p in parent.Parameters)
        {
            if (p.InstructionIndex >= spliceIdx)
                p.InstructionIndex += 1;
        }

        SpliceHelpers.AdjustPrecedingSkipCounts(parent.Instructions, spliceIdx);

        return new TierCompletionTriggerStats(
            Tier: tierNum,
            ParentEventId: parentEventId,
            OnTierClearEventId: targetEventId,
            ClearedFlagId: clearedFlag,
            Inserted: true,
            AlreadyPresent: false,
            AnchorInstructionIndex: anchorIdx,
            SpliceInstructionIndex: spliceIdx);
    }

    // ------------------------------------------------------------------
    private static bool IsSetEventFlagOnFor(EMEVD.Instruction ins, uint flagId)
    {
        if (ins.Bank != PatchConstants.BankEvent) return false;
        if (ins.ID != PatchConstants.IdSetEventFlag) return false;
        if (ins.ArgData.Length < 9) return false;
        byte type  = ins.ArgData[0];
        uint id    = BinaryPrimitives.ReadUInt32LittleEndian(ins.ArgData.AsSpan(4, 4));
        byte state = ins.ArgData[8];
        return type  == PatchConstants.FlagTypeEventFlag
            && id    == flagId
            && state == PatchConstants.FlagStateOn;
    }

    private static bool IsInitCommonTargeting(EMEVD.Instruction ins, uint expectedTarget)
    {
        if (ins.Bank != PatchConstants.BankSystem) return false;
        if (ins.ID != PatchConstants.IdInitializeCommonEvent) return false;
        if (ins.ArgData.Length < 8) return false;
        uint target = BinaryPrimitives.ReadUInt32LittleEndian(ins.ArgData.AsSpan(4, 4));
        return target == expectedTarget;
    }
}

// =======================================================================
// Result types
// =======================================================================
public sealed record TierCompletionTriggerSpliceResult(
    int TriggersInserted,
    int TriggersAlreadyPresent,
    IReadOnlyList<TierCompletionTriggerStats> PerTier);

public sealed record TierCompletionTriggerStats(
    int Tier,
    long ParentEventId,
    uint OnTierClearEventId,
    uint ClearedFlagId,
    bool Inserted,
    bool AlreadyPresent,
    int AnchorInstructionIndex,
    int SpliceInstructionIndex);
