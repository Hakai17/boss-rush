// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Buffers.Binary;
using System.Linq;
using BossRush.Core.Patching;
using SoulsFormats;
using Xunit;

namespace BossRush.Tests;

/// <summary>
/// Unit tests for <see cref="TierUnlockVisibilitySplicer"/>. The splicer
/// targets each of the source mod's per-tier unlock-banner events in
/// <c>m11_10_00_00.emevd</c> (11107705..11107711 for tiers 2..8 and
/// 11107701 for tier 9) and inserts a shop-visibility flip
/// (<c>SetEventFlagOff(vis(N-1))</c> + <c>SetEventFlagOn(vis(N))</c>)
/// immediately after each event's <c>SetEventFlagID(latch(N), ON)</c>.
///
/// Invariants:
///   * 8 flips inserted per fresh apply (tiers 2..9 inclusive); 0 for tier 1.
///   * Splice lands at anchor + 1 and anchor + 2; anchor itself untouched.
///   * Vis flags are exactly vis(N-1) OFF then vis(N) ON.
///   * Idempotent re-apply leaves the instruction stream identical.
///   * Missing unlock event throws.
///   * Missing latch anchor inside an unlock event throws.
///   * Multiple latch sets in the same event throw (ambiguous).
/// </summary>
public class TierUnlockVisibilitySplicerTests
{
    private const int SentinelBank = 2003;
    private const int SentinelId   = 42;

    private static EMEVD.Instruction MakeSentinel(uint tag)
    {
        byte[] data = new byte[8];
        BinaryPrimitives.WriteUInt32LittleEndian(data.AsSpan(0, 4), tag);
        return new EMEVD.Instruction(SentinelBank, SentinelId, data);
    }

    /// <summary>SetEventFlag(type=EventFlag, flagId, state=ON/OFF) — byte-layout
    /// matches what InstructionFactory.SetEventFlagOn/Off emits and what the
    /// splicer scans for. Arg layout: [type:1][pad:3][flagId:4][state:1][pad:3].</summary>
    private static EMEVD.Instruction MakeSetFlag(uint flagId, byte state)
    {
        byte[] data = new byte[12];
        data[0] = PatchConstants.FlagTypeEventFlag;
        BinaryPrimitives.WriteUInt32LittleEndian(data.AsSpan(4, 4), flagId);
        data[8] = state;
        return new EMEVD.Instruction(
            PatchConstants.BankEvent, PatchConstants.IdSetEventFlag, data);
    }

    /// <summary>
    /// Build a fake unlock event mirroring the mod's shape: a prolog sentinel
    /// (stand-in for the two EndIf latch gates), a
    /// SetEventFlagID(latch, ON) anchor, and an epilog sentinel. Splicer
    /// should land the OFF flip at anchor + 1 and the ON flip at anchor + 2.
    /// </summary>
    private static EMEVD.Event BuildFakeUnlock(long eventId, uint latchFlag)
    {
        var ev = new EMEVD.Event(id: eventId, restBehavior: EMEVD.Event.RestBehaviorType.Default);
        ev.Instructions.Add(MakeSentinel(0xBBBB_0001));
        ev.Instructions.Add(MakeSentinel(0xBBBB_0002));
        ev.Instructions.Add(MakeSetFlag(latchFlag, PatchConstants.FlagStateOn));   // anchor
        ev.Instructions.Add(MakeSentinel(0xBBBB_0003));
        return ev;
    }

    private static EMEVD BuildFakeM11_10()
    {
        var emevd = new EMEVD();
        foreach (var kv in TierClearConstants.TierUnlockEventIds)
        {
            uint latch = (uint)(TierClearConstants.TierUnlockLatchFlagBase + kv.Key);
            emevd.Events.Add(BuildFakeUnlock(kv.Value, latch));
        }
        return emevd;
    }

    [Fact]
    public void Apply_InsertsEightFlipPairs_OneAfterEachUnlockAnchor()
    {
        var emevd = BuildFakeM11_10();
        var result = TierUnlockVisibilitySplicer.Apply(emevd);

        // Tiers 2..9 = 8 flip pairs.
        Assert.Equal(8, result.FlipsInserted);
        Assert.Equal(0, result.FlipsAlreadyPresent);

        foreach (var kv in TierClearConstants.TierUnlockEventIds)
        {
            int tier = kv.Key;
            long parentId = kv.Value;
            uint latchFlag = (uint)(TierClearConstants.TierUnlockLatchFlagBase + tier);
            uint prevVis   = (uint)(TierClearConstants.ShopVisibilityFlagBase + (tier - 1));
            uint thisVis   = (uint)(TierClearConstants.ShopVisibilityFlagBase + tier);

            var parent = emevd.Events.Single(e => e.ID == parentId);
            // Anchor was at idx 2 pre-splice; flips must land at idx 3 and 4.
            Assert.Equal(6, parent.Instructions.Count);

            var anchor = parent.Instructions[2];
            Assert.Equal(PatchConstants.IdSetEventFlag, anchor.ID);
            Assert.Equal(latchFlag,
                BinaryPrimitives.ReadUInt32LittleEndian(anchor.ArgData.AsSpan(4, 4)));

            var visOff = parent.Instructions[3];
            Assert.Equal(PatchConstants.BankEvent, visOff.Bank);
            Assert.Equal(PatchConstants.IdSetEventFlag, visOff.ID);
            Assert.Equal(prevVis,
                BinaryPrimitives.ReadUInt32LittleEndian(visOff.ArgData.AsSpan(4, 4)));
            Assert.Equal(PatchConstants.FlagStateOff, visOff.ArgData[8]);

            var visOn = parent.Instructions[4];
            Assert.Equal(PatchConstants.BankEvent, visOn.Bank);
            Assert.Equal(PatchConstants.IdSetEventFlag, visOn.ID);
            Assert.Equal(thisVis,
                BinaryPrimitives.ReadUInt32LittleEndian(visOn.ArgData.AsSpan(4, 4)));
            Assert.Equal(PatchConstants.FlagStateOn, visOn.ArgData[8]);
        }
    }

    [Fact]
    public void Apply_IsIdempotent()
    {
        var emevd = BuildFakeM11_10();
        TierUnlockVisibilitySplicer.Apply(emevd);
        var second = TierUnlockVisibilitySplicer.Apply(emevd);

        Assert.Equal(0, second.FlipsInserted);
        Assert.Equal(8, second.FlipsAlreadyPresent);

        // Each unlock event should still have exactly one OFF-ON pair for its tier.
        foreach (var kv in TierClearConstants.TierUnlockEventIds)
        {
            int tier = kv.Key;
            uint prevVis = (uint)(TierClearConstants.ShopVisibilityFlagBase + (tier - 1));
            uint thisVis = (uint)(TierClearConstants.ShopVisibilityFlagBase + tier);
            var parent = emevd.Events.Single(e => e.ID == kv.Value);

            int offCount = parent.Instructions.Count(i =>
                i.Bank == PatchConstants.BankEvent
                && i.ID == PatchConstants.IdSetEventFlag
                && i.ArgData.Length >= 9
                && BinaryPrimitives.ReadUInt32LittleEndian(i.ArgData.AsSpan(4, 4)) == prevVis
                && i.ArgData[8] == PatchConstants.FlagStateOff);
            int onCount = parent.Instructions.Count(i =>
                i.Bank == PatchConstants.BankEvent
                && i.ID == PatchConstants.IdSetEventFlag
                && i.ArgData.Length >= 9
                && BinaryPrimitives.ReadUInt32LittleEndian(i.ArgData.AsSpan(4, 4)) == thisVis
                && i.ArgData[8] == PatchConstants.FlagStateOn);
            Assert.Equal(1, offCount);
            Assert.Equal(1, onCount);
        }
    }

    [Fact]
    public void Apply_MissingUnlockEvent_Throws()
    {
        var emevd = BuildFakeM11_10();
        // Drop tier 5's unlock event (11107708).
        long missingId = TierClearConstants.TierUnlockEventIds[5];
        emevd.Events.RemoveAll(e => e.ID == missingId);

        var ex = Assert.Throws<InvalidOperationException>(() =>
            TierUnlockVisibilitySplicer.Apply(emevd));
        Assert.Contains(missingId.ToString(), ex.Message);
        Assert.Contains("tier 5", ex.Message);
    }

    [Fact]
    public void Apply_MissingLatchAnchor_Throws()
    {
        var emevd = BuildFakeM11_10();
        // Strip tier 2's latch anchor.
        long parentId = TierClearConstants.TierUnlockEventIds[2];
        uint latchFlag = (uint)(TierClearConstants.TierUnlockLatchFlagBase + 2);
        var parent = emevd.Events.Single(e => e.ID == parentId);
        parent.Instructions.RemoveAll(i =>
            i.Bank == PatchConstants.BankEvent
            && i.ID == PatchConstants.IdSetEventFlag
            && i.ArgData.Length >= 9
            && BinaryPrimitives.ReadUInt32LittleEndian(i.ArgData.AsSpan(4, 4)) == latchFlag);

        var ex = Assert.Throws<InvalidOperationException>(() =>
            TierUnlockVisibilitySplicer.Apply(emevd));
        Assert.Contains("anchor", ex.Message);
        Assert.Contains("tier 2", ex.Message);
    }

    [Fact]
    public void Apply_MultipleLatchAnchors_Throws()
    {
        var emevd = BuildFakeM11_10();
        // Duplicate tier 3's anchor — ambiguous splice point.
        long parentId = TierClearConstants.TierUnlockEventIds[3];
        uint latchFlag = (uint)(TierClearConstants.TierUnlockLatchFlagBase + 3);
        var parent = emevd.Events.Single(e => e.ID == parentId);
        parent.Instructions.Add(MakeSetFlag(latchFlag, PatchConstants.FlagStateOn));

        var ex = Assert.Throws<InvalidOperationException>(() =>
            TierUnlockVisibilitySplicer.Apply(emevd));
        Assert.Contains("multiple", ex.Message, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("tier 3", ex.Message);
    }

    [Fact]
    public void Apply_PerTierStats_ReportExpectedFields()
    {
        var emevd = BuildFakeM11_10();
        var result = TierUnlockVisibilitySplicer.Apply(emevd);

        Assert.Equal(8, result.PerTier.Count);
        foreach (var s in result.PerTier)
        {
            Assert.True(s.Inserted);
            Assert.False(s.AlreadyPresent);
            Assert.Equal(TierClearConstants.TierUnlockEventIds[s.Tier], s.ParentEventId);
            Assert.Equal((uint)(TierClearConstants.TierUnlockLatchFlagBase + s.Tier), s.LatchFlagId);
            Assert.Equal((uint)(TierClearConstants.ShopVisibilityFlagBase + (s.Tier - 1)), s.PrevShopVisibilityFlagId);
            Assert.Equal((uint)(TierClearConstants.ShopVisibilityFlagBase + s.Tier), s.ThisShopVisibilityFlagId);
            // Anchor was at idx 2 in our fake shape; splice lands at 3.
            Assert.Equal(2, s.AnchorInstructionIndex);
            Assert.Equal(3, s.SpliceInstructionIndex);
        }
    }

    [Fact]
    public void Apply_Tier1_HasNoUnlockEntry_SoNoTier1Flip()
    {
        // Tier 1 is bootstrapped visible at game load by
        // Tier1VisibilityBootstrapSplicer; no unlock event exists and the
        // splicer must NOT attempt to find or patch one.
        Assert.False(TierClearConstants.TierUnlockEventIds.ContainsKey(1));

        var emevd = BuildFakeM11_10();
        var result = TierUnlockVisibilitySplicer.Apply(emevd);
        // No tier-1 entry in PerTier.
        Assert.DoesNotContain(result.PerTier, s => s.Tier == 1);
    }
}
