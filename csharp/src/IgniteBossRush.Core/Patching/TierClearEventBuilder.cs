// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using IgniteBossRush.Core.Models;
using SoulsFormats;

namespace IgniteBossRush.Core.Patching;

/// <summary>
/// Builds per-tier <c>OnTierClear[N]</c> EMEVD events (90009991..90009999).
///
/// Each event is invoked from the Ignite Rush Roundtable Hold completion
/// events 11107716 / 11107737..11107744 (see
/// <see cref="TierCompletionTriggerSplicer"/>). Those events have an
/// <c>EndIf(EventFlag(clearedFlag) &amp;&amp; ...)</c> latch at the top and only
/// reach the <c>SetEventFlagID(clearedFlag, ON)</c> instruction once per
/// genuine tier-N clear — so our trigger fires <b>exactly once</b> per
/// clear and the OnTierClear body needs no tier-exclusive gate. The body is
/// now minimal:
///
///   1. <b>Engine-guard short-circuit.</b> If
///      <see cref="TierPlan.ShardAwardEventFlag"/> is already ON, skip
///      to End. Belt-and-braces against any future re-entry path (and
///      against the mild coroutine race where two concurrent re-invocations
///      could both observe the flag OFF before either sets it). The flag
///      is set ATOMICALLY by the engine inside <c>AwardItemLot</c> — see
///      <see cref="RegulationConstants.ItemLotField_GetItemFlagId"/>.
///   2. <b>Wipe unspent Amber Shards</b> via RemoveItemFromPlayer with
///      number=999 (EMEDF max, effectively "remove all").
///   3. <b>Award 5 fresh Amber Shards</b> via the tier's pre-allocated
///      ItemLot row. The lot's <c>getItemFlagId</c> = ShardAwardEventFlag,
///      so the engine atomically checks (flag OFF) → awards items → sets
///      flag ON. No explicit SetEventFlagOn is needed — the regulation
///      patcher wired it into the param row.
///
/// <b>Visibility flips live elsewhere.</b> Earlier builds emitted
/// <c>SetEventFlagOff(vis(N))</c> + <c>SetEventFlagOn(vis(N+1))</c> as part
/// of the OnTierClear body. That caused multiple shop rows to appear in
/// Kalé's menu when Boss-Rush-mode invocations or other paths double-fired
/// the OnTierClear trigger. The flip has moved out into
/// <see cref="TierUnlockVisibilitySplicer"/>, which hooks the mod's own
/// one-shot tier-unlock-banner events (11107705..11107711, 11107701) where
/// each event is single-boss-marker-gated and fires exactly once per
/// tier transition. The OnTierClear body is no longer responsible for
/// visibility; its job is shard wipe + award only.
///
/// <b>Tier 9 special-case.</b> The locked spec says "Tier 9 inventory persists
/// after final clear". For tier 9 we still award shards (5 per tier, 45 total)
/// and the engine still sets the award guard, but we SKIP the shard wipe.
/// Result: the player keeps any leftover shards and Tier 9's 7 shop slots
/// remain visible (TierUnlockVisibilitySplicer set vis(9) ON on unlock; no
/// subsequent flip to OFF exists).
///
/// <para>
/// <b>History.</b> Earlier iterations had an 8-instruction body (tiers 1-8)
/// with a seal-gate preamble and seal-consume step. The seal existed because
/// the trigger was wired into 90009921 (shared warp handler) which fires
/// ~20× per warp; we needed a tier-exclusive "tier N just cleared" signal.
/// Moving the trigger to the Roundtable completion events — which already
/// provide that signal via the mod's own one-shot latch — obsoleted the
/// seal architecture and the <c>DispatcherSealSplicer</c>.
/// </para>
/// </summary>
public static class TierClearEventBuilder
{
    /// <summary>
    /// Build one OnTierClear event for the given <paramref name="tier"/>.
    /// The returned <see cref="EMEVD.Event"/> has its <c>ID</c> set to
    /// <see cref="TierClearConstants.OnTierClearEventBase"/> + tier number,
    /// rest behavior <c>Default</c>, and the body described above.
    /// </summary>
    public static EMEVD.Event BuildEvent(TierPlan tier)
    {
        ArgumentNullException.ThrowIfNull(tier);
        if (tier.Tier < TierClearConstants.FirstTier || tier.Tier > TierClearConstants.LastTier)
            throw new ArgumentOutOfRangeException(
                nameof(tier),
                $"Tier number must be in [{TierClearConstants.FirstTier}, {TierClearConstants.LastTier}], got {tier.Tier}");

        ValidateFlagAlignment(tier);

        bool isFinalTier = tier.Tier == TierClearConstants.LastTier;
        long eventId = TierClearConstants.OnTierClearEventBase + tier.Tier;
        var ev = new EMEVD.Event(id: eventId, restBehavior: EMEVD.Event.RestBehaviorType.Default);

        var instr = ev.Instructions;

        // (1) Engine-guard short-circuit on ShardAwardEventFlag.
        //     The ItemLot's getItemFlagId is wired to ShardAwardEventFlag by
        //     the regulation patcher: the engine atomically (checks flag OFF
        //     → awards items → sets flag ON) inside AwardItemLot, so the
        //     flag is the canonical "this tier already paid out" signal. We
        //     re-check it here as belt-and-braces against any future path
        //     that could invoke this event twice within a single session
        //     (Boss-Rush-mode refight sequences, NG+, etc.). Idempotent: a
        //     second entry with the flag ON bails before the wipe and vis
        //     flip, so those side effects stay tight to a single fire.
        instr.Add(InstructionFactory.SkipIfEventFlag(
            skip: 1,
            flagState: PatchConstants.FlagStateOff,
            flagId: (uint)tier.ShardAwardEventFlag));
        instr.Add(InstructionFactory.EndUnconditionally());

        // (2) Wipe unspent shards (skipped on the final tier — leftover shards
        //     are harmless and per spec inventory persists after tier 9).
        if (!isFinalTier)
        {
            instr.Add(InstructionFactory.RemoveItemFromPlayer(
                itemType: PatchConstants.ItemTypeGoods,
                itemId: TierClearConstants.AmberShardGoodsId,
                number: PatchConstants.RemoveItemAllCount));
        }

        // (3) Award fresh shards via the tier's ItemLot row. The lot has
        //     getItemFlagId = ShardAwardEventFlag; the engine atomically
        //     checks (flag OFF) → awards items → sets flag ON. No explicit
        //     SetEventFlagOn needed — the regulation patcher wired it into
        //     the param row.
        int shardLotId = TierClearConstants.ShardAwardItemLotBase + tier.Tier;
        instr.Add(InstructionFactory.AwardItemLot(shardLotId));

        // (4) Shop visibility flipping has been moved out of this body —
        //     TierUnlockVisibilitySplicer wires it into the mod's own
        //     tier-unlock-banner events where each transition is
        //     single-boss-marker-gated. Keeping the flip out of here means
        //     OnTierClear[N] is idempotent with respect to Kalé's menu even
        //     if a future path ever does fire it more than once.

        // No trailing End — EMEVD events fall off the end naturally and the
        // mod-wide convention (visible in every reward event) is to omit a
        // trailing End when no early-exit follow-up is needed. The early-exit
        // case at instruction index 1 (already awarded) has its own End.
        return ev;
    }

    /// <summary>
    /// Convenience: build all 9 OnTierClear events from the plan in tier order.
    /// </summary>
    public static IReadOnlyList<EMEVD.Event> BuildAllEvents(TierRewardsPlan plan)
    {
        ArgumentNullException.ThrowIfNull(plan);
        if (plan.Tiers.Count != TierClearConstants.LastTier)
            throw new ArgumentException(
                $"TierRewardsPlan must contain exactly {TierClearConstants.LastTier} tiers, got {plan.Tiers.Count}",
                nameof(plan));

        var events = new List<EMEVD.Event>(plan.Tiers.Count);
        // Iterate in tier-number order so output is deterministic regardless
        // of the input list's ordering.
        for (int tierNum = TierClearConstants.FirstTier; tierNum <= TierClearConstants.LastTier; tierNum++)
        {
            TierPlan? match = null;
            foreach (var t in plan.Tiers)
            {
                if (t.Tier == tierNum) { match = t; break; }
            }
            if (match is null)
                throw new ArgumentException(
                    $"TierRewardsPlan missing tier {tierNum}", nameof(plan));
            events.Add(BuildEvent(match));
        }
        return events;
    }

    // ------------------------------------------------------------------
    // Internal validation
    // ------------------------------------------------------------------
    private static void ValidateFlagAlignment(TierPlan tier)
    {
        // Cross-check that the plan's flag IDs match the bases we use to
        // compute "next tier" — if Generation.ShopRollGenerator ever changes
        // its base values without this file being updated, we want to fail
        // loudly at patch time rather than silently emit wrong opcodes.
        int expectedTier   = TierClearConstants.TierFlagBase            + tier.Tier;
        int expectedVis    = TierClearConstants.ShopVisibilityFlagBase  + tier.Tier;
        int expectedShard  = TierClearConstants.ShardAwardEventFlagBase + tier.Tier;

        if (tier.TierFlag != expectedTier)
            throw new InvalidOperationException(
                $"Tier {tier.Tier}: plan.TierFlag={tier.TierFlag}, expected {expectedTier} "
                + $"(TierFlagBase={TierClearConstants.TierFlagBase} + tier). "
                + "ShopRollGenerator and TierClearConstants are out of sync.");
        if (tier.ShopVisibilityFlag != expectedVis)
            throw new InvalidOperationException(
                $"Tier {tier.Tier}: plan.ShopVisibilityFlag={tier.ShopVisibilityFlag}, expected {expectedVis}");
        if (tier.ShardAwardEventFlag != expectedShard)
            throw new InvalidOperationException(
                $"Tier {tier.Tier}: plan.ShardAwardEventFlag={tier.ShardAwardEventFlag}, expected {expectedShard}");
    }
}
