// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Buffers.Binary;
using System.Collections.Generic;
using System.Linq;
using BossRush.Core.Models;
using BossRush.Core.Patching;
using SoulsFormats;
using Xunit;

namespace BossRush.Tests;

/// <summary>
/// Behavior tests for <see cref="TierClearEventBuilder"/>. The event body is
/// the player-visible contract — every instruction in the emitted EMEVD has
/// an in-game effect, so each test pins down a specific behavior:
///
///   * Engine-guard short-circuit at index [0..1] using
///     <see cref="TierPlan.ShardAwardEventFlag"/>. The OnTierClear trigger now
///     fires exactly once per genuine tier-N clear (the Roundtable completion
///     event's EndIf-latch supplies that guarantee — see
///     <see cref="TierCompletionTriggerSplicer"/>), so the body no longer
///     needs its own tier-exclusive seal gate. The engine guard stays as
///     belt-and-braces against any future re-entry path.
///   * RemoveItemFromPlayer wipes <see cref="TierClearConstants.AmberShardGoodsId"/>
///     with number=RemoveItemAllCount.
///   * AwardItemLot references <c>ShardAwardItemLotBase + tier</c>. The
///     engine sets ShardAwardEventFlag ON atomically via ItemLotParam's
///     getItemFlagId; the body emits no explicit SetEventFlagOn for it.
///   * Visibility flipping has been REMOVED from the OnTierClear body —
///     the flip now lives in TierUnlockVisibilitySplicer (hooking the mod's
///     own tier-unlock-banner events). The body must emit NO SetEventFlag
///     for any ShopVisibilityFlag.
///   * Tier 9 omits the wipe (no leftover shards to clear).
/// </summary>
public class TierClearEventBuilderTests
{
    // ------------------------------------------------------------------
    // Helpers — build a minimal TierPlan whose flag IDs match the bases
    // TierClearConstants enforces (else BuildEvent throws on the alignment
    // check).
    // ------------------------------------------------------------------
    private static TierPlan MakeTierPlan(int tierNum)
    {
        return new TierPlan
        {
            Tier = tierNum,
            TierFlag            = TierClearConstants.TierFlagBase            + tierNum,
            ShopVisibilityFlag  = TierClearConstants.ShopVisibilityFlagBase  + tierNum,
            ShardAwardCount     = 5,
            ShardAwardEventFlag = TierClearConstants.ShardAwardEventFlagBase + tierNum,
            // Slots are not consulted by the event builder — empty list is fine.
            Slots = new List<ShopSlot>(),
        };
    }

    // ---- accessors -----------------------------------------------------
    private static uint ReadFlagId(EMEVD.Instruction ins, int flagIdOffset)
        => BinaryPrimitives.ReadUInt32LittleEndian(ins.ArgData.AsSpan(flagIdOffset, 4));

    private static int ReadInt(EMEVD.Instruction ins, int offset)
        => BinaryPrimitives.ReadInt32LittleEndian(ins.ArgData.AsSpan(offset, 4));

    // ------------------------------------------------------------------
    // Tier 1 — full body (guard + wipe + award + flip)
    // ------------------------------------------------------------------
    [Fact]
    public void BuildEvent_Tier1_ShortCircuitsOnEngineGuard()
    {
        var ev = TierClearEventBuilder.BuildEvent(MakeTierPlan(1));
        Assert.Equal(TierClearConstants.OnTierClearEventBase + 1, ev.ID);

        // [0] SkipIfEventFlag(OFF, ShardAwardEventFlag, skip=1) — engine-owned
        //     idempotency short-circuit. After the ItemLot's first successful
        //     award the engine sets this flag ON atomically; any re-entry on
        //     a later session (Boss-Rush refight, NG+, etc.) bails here.
        var guardSkip = ev.Instructions[0];
        Assert.Equal(PatchConstants.BankControlFlowEvent, guardSkip.Bank);
        Assert.Equal(PatchConstants.IdSkipIfEventFlag, guardSkip.ID);
        Assert.Equal((byte)1, guardSkip.ArgData[0]);
        Assert.Equal(PatchConstants.FlagStateOff, guardSkip.ArgData[1]);
        Assert.Equal((uint)(TierClearConstants.ShardAwardEventFlagBase + 1), ReadFlagId(guardSkip, 4));

        // [1] EndUnconditionally — taken when the guard is already ON.
        var guardEnd = ev.Instructions[1];
        Assert.Equal(PatchConstants.BankControlFlowSystem, guardEnd.Bank);
        Assert.Equal(PatchConstants.IdEndUnconditionally, guardEnd.ID);
    }

    [Fact]
    public void BuildEvent_Tier1_WipesAmberShards_ThenAwardsLot()
    {
        var ev = TierClearEventBuilder.BuildEvent(MakeTierPlan(1));
        // Body (4 instructions — vis flip moved to TierUnlockVisibilitySplicer):
        //   [0] GuardSkip(ShardAwardFlag, OFF, skip=1)
        //   [1] End
        //   [2] RemoveItemFromPlayer(Goods, AmberShardId, RemoveItemAllCount)
        //   [3] AwardItemLot(ShardLotBase + 1)
        Assert.Equal(4, ev.Instructions.Count);

        var remove = ev.Instructions[2];
        Assert.Equal(PatchConstants.IdRemoveItemFromPlayer, remove.ID);
        Assert.Equal(PatchConstants.ItemTypeGoods, remove.ArgData[0]);
        Assert.Equal(TierClearConstants.AmberShardGoodsId, ReadInt(remove, 4));
        Assert.Equal(PatchConstants.RemoveItemAllCount, ReadInt(remove, 8));

        var award = ev.Instructions[3];
        Assert.Equal(PatchConstants.IdAwardItemLot, award.ID);
        Assert.Equal(TierClearConstants.ShardAwardItemLotBase + 1, ReadInt(award, 0));
    }

    [Fact]
    public void BuildEvent_Tier1_DoesNotEmitAnyShopVisibilityFlagSet()
    {
        // Regression: the old body flipped vis(N) OFF + vis(N+1) ON. That
        // caused a cascade in Kalé's menu when the OnTierClear trigger fired
        // more than once (Boss Rush refight paths). Visibility is now
        // TierUnlockVisibilitySplicer's responsibility, and the OnTierClear
        // body must NOT touch any ShopVisibilityFlag.
        var ev = TierClearEventBuilder.BuildEvent(MakeTierPlan(1));
        for (int tier = TierClearConstants.FirstTier; tier <= TierClearConstants.LastTier + 1; tier++)
        {
            uint vis = (uint)(TierClearConstants.ShopVisibilityFlagBase + tier);
            Assert.DoesNotContain(ev.Instructions,
                i => i.Bank == PatchConstants.BankEvent
                  && i.ID == PatchConstants.IdSetEventFlag
                  && i.ArgData.Length >= 9
                  && ReadFlagId(i, 4) == vis);
        }
    }

    [Fact]
    public void BuildEvent_Tier1_NoExplicitSetEventFlagOnForAwardGuard()
    {
        // Regression: the old body emitted an explicit SetEventFlagOn for
        // ShardAwardEventFlag before the award. With the engine-level
        // getItemFlagId on the ItemLot row, that SetEventFlag is redundant
        // (and was racy under concurrent coroutines) — the engine handles
        // the set atomically inside AwardItemLot. Pin that it stays removed.
        var ev = TierClearEventBuilder.BuildEvent(MakeTierPlan(1));
        uint shardAwardFlag = (uint)(TierClearConstants.ShardAwardEventFlagBase + 1);
        Assert.DoesNotContain(ev.Instructions,
            i => i.Bank == PatchConstants.BankEvent
              && i.ID == PatchConstants.IdSetEventFlag
              && ReadFlagId(i, 4) == shardAwardFlag);
    }

    // ------------------------------------------------------------------
    // Tier 9 — special case: no wipe, no flip
    // ------------------------------------------------------------------
    [Fact]
    public void BuildEvent_Tier9_OmitsWipe_ButStillAwards()
    {
        var ev = TierClearEventBuilder.BuildEvent(MakeTierPlan(TierClearConstants.LastTier));
        Assert.Equal(TierClearConstants.OnTierClearEventBase + TierClearConstants.LastTier, ev.ID);

        // Expected body for tier 9:
        //   [0] SkipIfEventFlag(OFF, GuardFlag(9), skip=1)
        //   [1] End
        //   [2] AwardItemLot(ShardLotBase + 9)
        // No RemoveItemFromPlayer. Vis flips live in TierUnlockVisibilitySplicer
        // (and tier 9's vis(9) is set ON by that splicer when tier 9 unlocks;
        // nothing ever flips it OFF, so tier 9's shop persists post-clear).
        // No explicit SetEventFlagOn for the guard — the engine sets it
        // atomically via getItemFlagId on the ItemLot row.
        Assert.Equal(3, ev.Instructions.Count);

        // Verify there's NO RemoveItemFromPlayer.
        Assert.DoesNotContain(ev.Instructions,
            i => i.ID == PatchConstants.IdRemoveItemFromPlayer
                && i.Bank == PatchConstants.BankEvent);

        // Verify there are NO SetEventFlag instructions at all on tier 9
        // (no guard-set, no visibility flips, no seal).
        Assert.DoesNotContain(ev.Instructions,
            i => i.Bank == PatchConstants.BankEvent && i.ID == PatchConstants.IdSetEventFlag);

        // Verify the AwardItemLot points at tier 9's lot.
        var award = ev.Instructions[2];
        Assert.Equal(PatchConstants.IdAwardItemLot, award.ID);
        Assert.Equal(TierClearConstants.ShardAwardItemLotBase + 9, ReadInt(award, 0));
    }

    // ------------------------------------------------------------------
    // Determinism / per-tier ID derivation
    // ------------------------------------------------------------------
    [Theory]
    [InlineData(1)]
    [InlineData(2)]
    [InlineData(5)]
    [InlineData(8)]
    [InlineData(9)]
    public void BuildEvent_EventId_IsBasePlusTier(int tierNum)
    {
        long expectedEventId = TierClearConstants.OnTierClearEventBase + tierNum;
        var ev = TierClearEventBuilder.BuildEvent(MakeTierPlan(tierNum));
        Assert.Equal(expectedEventId, ev.ID);
    }

    [Theory]
    [InlineData(0)]   // below FirstTier
    [InlineData(10)]  // above LastTier
    [InlineData(-3)]
    public void BuildEvent_TierOutOfRange_Throws(int badTier)
    {
        var plan = new TierPlan
        {
            Tier = badTier,
            TierFlag            = TierClearConstants.TierFlagBase            + badTier,
            ShopVisibilityFlag  = TierClearConstants.ShopVisibilityFlagBase  + badTier,
            ShardAwardCount     = 5,
            ShardAwardEventFlag = TierClearConstants.ShardAwardEventFlagBase + badTier,
            Slots = new List<ShopSlot>(),
        };
        Assert.Throws<ArgumentOutOfRangeException>(() => TierClearEventBuilder.BuildEvent(plan));
    }

    [Fact]
    public void BuildEvent_FlagAlignmentMismatch_Throws()
    {
        var plan = new TierPlan
        {
            Tier = 3,
            TierFlag            = TierClearConstants.TierFlagBase            + 3,
            ShopVisibilityFlag  = 999_999_999, // intentionally wrong
            ShardAwardCount     = 5,
            ShardAwardEventFlag = TierClearConstants.ShardAwardEventFlagBase + 3,
            Slots = new List<ShopSlot>(),
        };
        var ex = Assert.Throws<InvalidOperationException>(() => TierClearEventBuilder.BuildEvent(plan));
        Assert.Contains("ShopVisibilityFlag", ex.Message);
    }

    // ------------------------------------------------------------------
    // BuildAllEvents — ordering, completeness, no duplicates
    // ------------------------------------------------------------------
    [Fact]
    public void BuildAllEvents_ReturnsNineEvents_InTierOrder_RegardlessOfPlanOrder()
    {
        var shuffledTiers = new List<TierPlan>
        {
            MakeTierPlan(7), MakeTierPlan(1), MakeTierPlan(9),
            MakeTierPlan(4), MakeTierPlan(2), MakeTierPlan(3),
            MakeTierPlan(5), MakeTierPlan(8), MakeTierPlan(6),
        };
        var plan = new TierRewardsPlan
        {
            CompetitionSeed = "test",
            DomainTag = "kale_shop_tier",
            Tiers = shuffledTiers,
        };

        var events = TierClearEventBuilder.BuildAllEvents(plan);
        Assert.Equal(9, events.Count);
        for (int i = 0; i < 9; i++)
        {
            Assert.Equal(TierClearConstants.OnTierClearEventBase + (i + 1), events[i].ID);
        }
        var ids = events.Select(e => e.ID).ToHashSet();
        Assert.Equal(9, ids.Count);
    }

    [Fact]
    public void BuildAllEvents_PlanMissingATier_Throws()
    {
        var tiers = new List<TierPlan>();
        for (int i = 1; i <= 9; i++)
            if (i != 5) tiers.Add(MakeTierPlan(i));

        var plan = new TierRewardsPlan
        {
            CompetitionSeed = "test",
            DomainTag = "kale_shop_tier",
            Tiers = tiers, // 8 tiers — missing tier 5
        };
        Assert.Throws<ArgumentException>(() => TierClearEventBuilder.BuildAllEvents(plan));
    }
}
