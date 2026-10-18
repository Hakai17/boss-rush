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
/// Tests for <see cref="TierClearEventSplicer"/>, now scoped to a single
/// job: inserting the 9 OnTierClear event bodies into <c>common_func.emevd</c>.
/// Trigger wiring lives in <see cref="TierCompletionTriggerSplicer"/> against
/// <c>m11_10_00_00.emevd</c> and is tested separately.
/// </summary>
public class TierClearEventSplicerTests
{
    private const int SentinelBank = 2003;
    private const int SentinelId = 42;

    private static EMEVD.Instruction MakeSentinel(uint tag)
    {
        byte[] data = new byte[8];
        BinaryPrimitives.WriteUInt32LittleEndian(data.AsSpan(0, 4), tag);
        return new EMEVD.Instruction(SentinelBank, SentinelId, data);
    }

    private static bool IsSentinelWithTag(EMEVD.Instruction ins, uint expected)
    {
        if (ins.Bank != SentinelBank || ins.ID != SentinelId) return false;
        if (ins.ArgData.Length < 4) return false;
        uint tag = BinaryPrimitives.ReadUInt32LittleEndian(ins.ArgData.AsSpan(0, 4));
        return tag == expected;
    }

    private static TierRewardsPlan BuildPlan()
    {
        var tiers = new List<TierPlan>();
        for (int t = TierClearConstants.FirstTier; t <= TierClearConstants.LastTier; t++)
        {
            tiers.Add(new TierPlan
            {
                Tier = t,
                TierFlag            = TierClearConstants.TierFlagBase            + t,
                ShopVisibilityFlag  = TierClearConstants.ShopVisibilityFlagBase  + t,
                ShardAwardCount     = 5,
                ShardAwardEventFlag = TierClearConstants.ShardAwardEventFlagBase + t,
                Slots = new List<ShopSlot>(),
            });
        }
        return new TierRewardsPlan
        {
            CompetitionSeed = "test-seed",
            DomainTag = "kale_shop_tier",
            Tiers = tiers,
        };
    }

    [Fact]
    public void Apply_InsertsAllNineOnTierClearEvents()
    {
        var emevd = new EMEVD();
        var result = TierClearEventSplicer.Apply(emevd, BuildPlan());

        Assert.Equal(9, result.EventsInserted);
        Assert.Equal(0, result.EventsAlreadyPresent);

        for (int t = TierClearConstants.FirstTier; t <= TierClearConstants.LastTier; t++)
        {
            long expectedId = TierClearConstants.OnTierClearEventBase + t;
            Assert.Single(emevd.Events.Where(e => e.ID == expectedId));
        }
    }

    [Fact]
    public void Apply_RunningTwice_IsIdempotent_NoDuplicateEvents()
    {
        var emevd = new EMEVD();
        var plan = BuildPlan();

        TierClearEventSplicer.Apply(emevd, plan);
        var second = TierClearEventSplicer.Apply(emevd, plan);

        Assert.Equal(0, second.EventsInserted);
        Assert.Equal(9, second.EventsAlreadyPresent);

        for (int t = TierClearConstants.FirstTier; t <= TierClearConstants.LastTier; t++)
        {
            long expectedId = TierClearConstants.OnTierClearEventBase + t;
            Assert.Single(emevd.Events.Where(e => e.ID == expectedId));
        }
    }

    [Fact]
    public void Apply_OverwriteExistingEvents_ReplacesPriorOnTierClearBody()
    {
        var emevd = new EMEVD();
        var stale = new EMEVD.Event(
            id: TierClearConstants.OnTierClearEventBase + 3,
            restBehavior: EMEVD.Event.RestBehaviorType.Default);
        stale.Instructions.Add(MakeSentinel(0xDEAD_BEEF));
        emevd.Events.Add(stale);

        var result = TierClearEventSplicer.Apply(emevd, BuildPlan(),
            new SplicerOptions { OverwriteExistingEvents = true });

        var tier3 = emevd.Events.Where(e => e.ID == TierClearConstants.OnTierClearEventBase + 3).ToList();
        Assert.Single(tier3);
        Assert.DoesNotContain(tier3[0].Instructions, i => IsSentinelWithTag(i, 0xDEAD_BEEF));

        Assert.Equal(9, result.EventsInserted);
        Assert.Equal(0, result.EventsAlreadyPresent);
    }

    [Fact]
    public void Apply_ExistingEventsStaysPut_ByDefault()
    {
        // Default behavior (OverwriteExistingEvents=false) treats a pre-existing
        // event with an OnTierClear ID as "already present" — this is the
        // idempotent re-patch case, not a collision failure.
        var emevd = new EMEVD();
        var stale = new EMEVD.Event(
            id: TierClearConstants.OnTierClearEventBase + 4,
            restBehavior: EMEVD.Event.RestBehaviorType.Default);
        stale.Instructions.Add(MakeSentinel(0xC0FFEE));
        emevd.Events.Add(stale);

        var result = TierClearEventSplicer.Apply(emevd, BuildPlan());

        Assert.Equal(8, result.EventsInserted);
        Assert.Equal(1, result.EventsAlreadyPresent);

        var tier4 = emevd.Events.Single(e => e.ID == TierClearConstants.OnTierClearEventBase + 4);
        Assert.Contains(tier4.Instructions, i => IsSentinelWithTag(i, 0xC0FFEE));
    }
}
