// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Buffers.Binary;
using System.Linq;
using BossRush.Core.Patching;
using SoulsFormats;
using Xunit;

namespace BossRush.Tests;

/// <summary>
/// Unit tests for <see cref="TierCompletionTriggerSplicer"/>. The splicer
/// targets <c>m11_10_00_00.emevd</c> (Roundtable Hold) and inserts an
/// <c>InitializeCommonEvent(0, 90009990+N)</c> immediately after each tier
/// completion event's <c>SetEventFlagID(1049300005+N, ON)</c> call.
///
/// Invariants:
///   * Splice lands at anchor + 1; anchor itself untouched.
///   * Target event ID is the correct per-tier OnTierClear ID.
///   * Idempotent re-apply leaves the instruction stream identical.
///   * Missing completion event throws.
///   * Missing cleared-flag anchor inside a completion event throws.
///   * Multiple cleared-flag sets in the same event throw (ambiguous).
/// </summary>
public class TierCompletionTriggerSplicerTests
{
    private const int SentinelBank = 2003;
    private const int SentinelId   = 42;

    private static EMEVD.Instruction MakeSentinel(uint tag)
    {
        byte[] data = new byte[8];
        BinaryPrimitives.WriteUInt32LittleEndian(data.AsSpan(0, 4), tag);
        return new EMEVD.Instruction(SentinelBank, SentinelId, data);
    }

    /// <summary>SetEventFlag(type=EventFlag, flagId, state=ON) — matches what
    /// the splicer scans for. Arg layout: [type:1][pad:3][flagId:4][state:1][pad:3].</summary>
    private static EMEVD.Instruction MakeSetFlagOn(uint flagId)
    {
        byte[] data = new byte[12];
        data[0] = PatchConstants.FlagTypeEventFlag;
        BinaryPrimitives.WriteUInt32LittleEndian(data.AsSpan(4, 4), flagId);
        data[8] = PatchConstants.FlagStateOn;
        return new EMEVD.Instruction(
            PatchConstants.BankEvent, PatchConstants.IdSetEventFlag, data);
    }

    private static EMEVD.Instruction MakeInitCommon(uint slot, uint target)
    {
        byte[] data = new byte[8];
        BinaryPrimitives.WriteUInt32LittleEndian(data.AsSpan(0, 4), slot);
        BinaryPrimitives.WriteUInt32LittleEndian(data.AsSpan(4, 4), target);
        return new EMEVD.Instruction(
            PatchConstants.BankSystem, PatchConstants.IdInitializeCommonEvent, data);
    }

    /// <summary>
    /// Build a fake completion event that mirrors the mod's shape:
    /// some prolog sentinels (stand-ins for EndIf latch gates), a
    /// SetEventFlagID(clearedFlag, ON), more sentinels (the second if-block
    /// that sets a different flag, which we don't need to emulate), and an
    /// epilog sentinel. Splicer should land the trigger at anchor + 1.
    /// </summary>
    private static EMEVD.Event BuildFakeCompletion(long eventId, uint clearedFlag)
    {
        var ev = new EMEVD.Event(id: eventId, restBehavior: EMEVD.Event.RestBehaviorType.Default);
        ev.Instructions.Add(MakeSentinel(0xAAAA_0001));
        ev.Instructions.Add(MakeSentinel(0xAAAA_0002));
        ev.Instructions.Add(MakeSetFlagOn(clearedFlag));   // anchor
        ev.Instructions.Add(MakeSentinel(0xAAAA_0003));
        ev.Instructions.Add(MakeSetFlagOn(clearedFlag + 100)); // different flag
        ev.Instructions.Add(MakeSentinel(0xAAAA_0004));
        return ev;
    }

    private static EMEVD BuildFakeM11_10()
    {
        var emevd = new EMEVD();
        foreach (var kv in TierClearConstants.TierCompletionEventIds)
        {
            uint clearedFlag = (uint)(TierClearConstants.TierClearedFlagBase + kv.Key);
            emevd.Events.Add(BuildFakeCompletion(kv.Value, clearedFlag));
        }
        return emevd;
    }

    [Fact]
    public void Apply_InsertsNineTriggers_OneAfterEachCompletionEventAnchor()
    {
        var emevd = BuildFakeM11_10();
        var result = TierCompletionTriggerSplicer.Apply(emevd);

        Assert.Equal(9, result.TriggersInserted);
        Assert.Equal(0, result.TriggersAlreadyPresent);

        foreach (var kv in TierClearConstants.TierCompletionEventIds)
        {
            int tier = kv.Key;
            long parentId = kv.Value;
            uint expectedTarget = (uint)(TierClearConstants.OnTierClearEventBase + tier);
            uint clearedFlag = (uint)(TierClearConstants.TierClearedFlagBase + tier);

            var parent = emevd.Events.Single(e => e.ID == parentId);
            // Anchor was at idx 2 pre-splice; trigger must be at idx 3.
            Assert.Equal(7, parent.Instructions.Count);
            var anchor = parent.Instructions[2];
            Assert.Equal(PatchConstants.IdSetEventFlag, anchor.ID);
            Assert.Equal(clearedFlag,
                BinaryPrimitives.ReadUInt32LittleEndian(anchor.ArgData.AsSpan(4, 4)));

            var trigger = parent.Instructions[3];
            Assert.Equal(PatchConstants.BankSystem, trigger.Bank);
            Assert.Equal(PatchConstants.IdInitializeCommonEvent, trigger.ID);
            Assert.Equal(expectedTarget,
                BinaryPrimitives.ReadUInt32LittleEndian(trigger.ArgData.AsSpan(4, 4)));
            Assert.Equal(0u,
                BinaryPrimitives.ReadUInt32LittleEndian(trigger.ArgData.AsSpan(0, 4)));
        }
    }

    [Fact]
    public void Apply_IsIdempotent()
    {
        var emevd = BuildFakeM11_10();
        TierCompletionTriggerSplicer.Apply(emevd);
        var second = TierCompletionTriggerSplicer.Apply(emevd);

        Assert.Equal(0, second.TriggersInserted);
        Assert.Equal(9, second.TriggersAlreadyPresent);

        // Each completion event should still have exactly one trigger for its tier.
        foreach (var kv in TierClearConstants.TierCompletionEventIds)
        {
            int tier = kv.Key;
            uint expectedTarget = (uint)(TierClearConstants.OnTierClearEventBase + tier);
            var parent = emevd.Events.Single(e => e.ID == kv.Value);
            int count = parent.Instructions.Count(i =>
                i.Bank == PatchConstants.BankSystem
                && i.ID == PatchConstants.IdInitializeCommonEvent
                && i.ArgData.Length >= 8
                && BinaryPrimitives.ReadUInt32LittleEndian(i.ArgData.AsSpan(4, 4)) == expectedTarget);
            Assert.Equal(1, count);
        }
    }

    [Fact]
    public void Apply_MissingCompletionEvent_Throws()
    {
        var emevd = BuildFakeM11_10();
        // Drop tier 5's completion event (11107740).
        long missingId = TierClearConstants.TierCompletionEventIds[5];
        emevd.Events.RemoveAll(e => e.ID == missingId);

        var ex = Assert.Throws<InvalidOperationException>(() =>
            TierCompletionTriggerSplicer.Apply(emevd));
        Assert.Contains(missingId.ToString(), ex.Message);
        Assert.Contains("tier 5", ex.Message);
    }

    [Fact]
    public void Apply_MissingClearedFlagAnchor_Throws()
    {
        var emevd = BuildFakeM11_10();
        // Strip tier 1's SetEventFlag anchor.
        long parentId = TierClearConstants.TierCompletionEventIds[1];
        uint clearedFlag = (uint)(TierClearConstants.TierClearedFlagBase + 1);
        var parent = emevd.Events.Single(e => e.ID == parentId);
        parent.Instructions.RemoveAll(i =>
            i.Bank == PatchConstants.BankEvent
            && i.ID == PatchConstants.IdSetEventFlag
            && i.ArgData.Length >= 9
            && BinaryPrimitives.ReadUInt32LittleEndian(i.ArgData.AsSpan(4, 4)) == clearedFlag);

        var ex = Assert.Throws<InvalidOperationException>(() =>
            TierCompletionTriggerSplicer.Apply(emevd));
        Assert.Contains("anchor", ex.Message);
        Assert.Contains("tier 1", ex.Message);
    }

    [Fact]
    public void Apply_MultipleClearedFlagAnchors_Throws()
    {
        var emevd = BuildFakeM11_10();
        // Duplicate tier 2's anchor — ambiguous splice point.
        long parentId = TierClearConstants.TierCompletionEventIds[2];
        uint clearedFlag = (uint)(TierClearConstants.TierClearedFlagBase + 2);
        var parent = emevd.Events.Single(e => e.ID == parentId);
        parent.Instructions.Add(MakeSetFlagOn(clearedFlag));

        var ex = Assert.Throws<InvalidOperationException>(() =>
            TierCompletionTriggerSplicer.Apply(emevd));
        Assert.Contains("multiple", ex.Message, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("tier 2", ex.Message);
    }

    [Fact]
    public void Apply_PerTierStats_ReportExpectedFields()
    {
        var emevd = BuildFakeM11_10();
        var result = TierCompletionTriggerSplicer.Apply(emevd);

        Assert.Equal(9, result.PerTier.Count);
        foreach (var s in result.PerTier)
        {
            Assert.True(s.Inserted);
            Assert.False(s.AlreadyPresent);
            Assert.Equal(TierClearConstants.TierCompletionEventIds[s.Tier], s.ParentEventId);
            Assert.Equal((uint)(TierClearConstants.OnTierClearEventBase + s.Tier), s.OnTierClearEventId);
            Assert.Equal((uint)(TierClearConstants.TierClearedFlagBase + s.Tier), s.ClearedFlagId);
            // Anchor was at idx 2 in our fake shape; splice lands at 3.
            Assert.Equal(2, s.AnchorInstructionIndex);
            Assert.Equal(3, s.SpliceInstructionIndex);
        }
    }
}
