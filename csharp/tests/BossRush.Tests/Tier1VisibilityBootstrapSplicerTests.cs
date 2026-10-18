// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Buffers.Binary;
using System.Linq;
using BossRush.Core.Patching;
using SoulsFormats;
using Xunit;

namespace BossRush.Tests;

/// <summary>
/// Unit tests for <see cref="Tier1VisibilityBootstrapSplicer"/>. Same fabricated-
/// EMEVD pattern as <see cref="TierClearEventSplicerTests"/>: build a minimal
/// init event mirroring the real <c>10010001</c> shape, run the splicer,
/// assert the byte-precise shape of the result.
///
/// Critical invariants under test:
///   * The bootstrap SetEventFlagID lands at exactly <c>anchor + 1</c>, with
///     the BatchSetEventFlags untouched at <c>anchor</c>.
///   * Re-running is a silent no-op (detected by exact-arg match on the
///     instruction immediately after the anchor).
///   * Missing init event, missing anchor, multiple anchors all throw — the
///     splicer never falls back to a best guess.
///   * Parameter indices targeting instructions ≥ splice point shift by +1.
///   * Other batch resets in the init event (with different ranges) are
///     correctly ignored — only the (1049308400..999, OFF) batch matches.
/// </summary>
public class Tier1VisibilityBootstrapSplicerTests
{
    // ---- sentinel-instruction helpers (same convention as TierClearEventSplicerTests) ----
    private const int SentinelBank = 2003;
    private const int SentinelId   = 42;

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

    /// <summary>Build a BatchSetEventFlags instruction with the exact arg
    /// layout the splicer matches on. Args: (u32 start, u32 end, u8 state)
    /// packed to 12 bytes (state at offset 8, then 3-byte tail pad).</summary>
    private static EMEVD.Instruction MakeBatchSet(uint start, uint end, byte state)
    {
        byte[] data = new byte[12];
        BinaryPrimitives.WriteUInt32LittleEndian(data.AsSpan(0, 4), start);
        BinaryPrimitives.WriteUInt32LittleEndian(data.AsSpan(4, 4), end);
        data[8] = state;
        return new EMEVD.Instruction(
            PatchConstants.BankEvent, PatchConstants.IdBatchSetEventFlags, data);
    }

    /// <summary>Build a fake init event mirroring 10010001's relevant slice:
    ///   [prolog]
    ///   [unrelated batch reset for a different range]   ← MUST NOT be matched
    ///   [BatchSetEventFlags(1049308400, 1049308999, OFF)] ← anchor
    ///   [epilog]
    ///
    /// Plus one Parameter targeting the epilog (idx 3) so we can verify the
    /// splicer shifts it to idx 4 after insertion.</summary>
    private static EMEVD BuildFakeCommonFunc()
    {
        var ev = new EMEVD.Event(
            id: TierClearConstants.ModInitEventId,
            restBehavior: EMEVD.Event.RestBehaviorType.Default);
        ev.Instructions.AddRange(new[]
        {
            MakeSentinel(TagProlog),
            // Different range — SHOULD be ignored by the splicer.
            MakeBatchSet(1049304400, 1049304999, PatchConstants.FlagStateOff),
            // The real anchor.
            MakeBatchSet(
                TierClearConstants.BatchResetStart,
                TierClearConstants.BatchResetEnd,
                PatchConstants.FlagStateOff),
            MakeSentinel(TagEpilog),
        });
        ev.Parameters.Add(new EMEVD.Parameter(
            instrIndex: 3, targetStartByte: 0, srcStartByte: 0, byteCount: 4));

        var emevd = new EMEVD();
        emevd.Events.Add(ev);
        return emevd;
    }

    private const uint TagProlog = 0xA0A0_0001;
    private const uint TagEpilog = 0xA0A0_0002;

    // ===================================================================
    // Tests
    // ===================================================================

    [Fact]
    public void Apply_InsertsSetEventFlagOn_ImmediatelyAfterAnchor()
    {
        var emevd = BuildFakeCommonFunc();
        var result = Tier1VisibilityBootstrapSplicer.Apply(emevd);

        Assert.True(result.Inserted);
        Assert.False(result.AlreadyPresent);
        Assert.Equal(2, result.AnchorInstructionIndex);
        Assert.Equal(3, result.SpliceInstructionIndex);

        var ev = emevd.Events.Single(e => e.ID == TierClearConstants.ModInitEventId);
        Assert.Equal(5, ev.Instructions.Count);

        // [0] prolog sentinel
        Assert.True(IsSentinelWithTag(ev.Instructions[0], TagProlog));

        // [1] unrelated batch set — preserved unchanged
        Assert.Equal(PatchConstants.IdBatchSetEventFlags, ev.Instructions[1].ID);
        Assert.Equal(1049304400u,
            BinaryPrimitives.ReadUInt32LittleEndian(ev.Instructions[1].ArgData.AsSpan(0, 4)));

        // [2] anchor — preserved unchanged
        Assert.Equal(PatchConstants.IdBatchSetEventFlags, ev.Instructions[2].ID);
        Assert.Equal(TierClearConstants.BatchResetStart,
            BinaryPrimitives.ReadUInt32LittleEndian(ev.Instructions[2].ArgData.AsSpan(0, 4)));

        // [3] NEW — SetEventFlagID(Tier1VisibilityFlag, ON)
        var bootstrap = ev.Instructions[3];
        Assert.Equal(PatchConstants.BankEvent, bootstrap.Bank);
        Assert.Equal(PatchConstants.IdSetEventFlag, bootstrap.ID);
        Assert.Equal(PatchConstants.FlagTypeEventFlag, bootstrap.ArgData[0]);
        Assert.Equal(TierClearConstants.Tier1VisibilityFlag,
            BinaryPrimitives.ReadUInt32LittleEndian(bootstrap.ArgData.AsSpan(4, 4)));
        Assert.Equal(PatchConstants.FlagStateOn, bootstrap.ArgData[8]);

        // [4] epilog sentinel — shifted from index 3
        Assert.True(IsSentinelWithTag(ev.Instructions[4], TagEpilog));
    }

    [Fact]
    public void Apply_ShiftsParameterIndicesAtOrAfterSplicePoint()
    {
        var emevd = BuildFakeCommonFunc();
        Tier1VisibilityBootstrapSplicer.Apply(emevd);

        // The fake event's only Parameter pointed at the epilog (idx 3).
        // After splicing one instruction at idx 3, that parameter must shift
        // to idx 4.
        var ev = emevd.Events.Single(e => e.ID == TierClearConstants.ModInitEventId);
        Assert.Single(ev.Parameters);
        Assert.Equal(4, ev.Parameters[0].InstructionIndex);
    }

    [Fact]
    public void Apply_RunningTwice_IsIdempotent_NoDuplicateBootstrap()
    {
        var emevd = BuildFakeCommonFunc();
        var first = Tier1VisibilityBootstrapSplicer.Apply(emevd);
        var second = Tier1VisibilityBootstrapSplicer.Apply(emevd);

        Assert.True(first.Inserted);
        Assert.False(second.Inserted);
        Assert.True(second.AlreadyPresent);
        Assert.Equal(first.AnchorInstructionIndex, second.AnchorInstructionIndex);
        Assert.Equal(first.SpliceInstructionIndex, second.SpliceInstructionIndex);

        // Exactly one SetEventFlagID(Tier1VisibilityFlag, ON) in the init event —
        // not two stacked from the second run.
        var ev = emevd.Events.Single(e => e.ID == TierClearConstants.ModInitEventId);
        int matches = ev.Instructions.Count(i =>
            i.Bank == PatchConstants.BankEvent
            && i.ID == PatchConstants.IdSetEventFlag
            && i.ArgData.Length >= 9
            && i.ArgData[0] == PatchConstants.FlagTypeEventFlag
            && BinaryPrimitives.ReadUInt32LittleEndian(i.ArgData.AsSpan(4, 4))
                 == TierClearConstants.Tier1VisibilityFlag
            && i.ArgData[8] == PatchConstants.FlagStateOn);
        Assert.Equal(1, matches);
    }

    [Fact]
    public void Apply_MissingInitEvent_ThrowsLoudly()
    {
        var emevd = new EMEVD(); // no events at all
        var ex = Assert.Throws<InvalidOperationException>(
            () => Tier1VisibilityBootstrapSplicer.Apply(emevd));
        Assert.Contains(TierClearConstants.ModInitEventId.ToString(), ex.Message);
    }

    [Fact]
    public void Apply_MissingBatchResetAnchor_ThrowsLoudly()
    {
        // Init event exists but lacks the (1049308400, 1049308999, OFF) batch.
        // The splicer must not silently no-op or fall back to a different
        // batch reset — that's exactly the kind of silent failure that hid
        // the original tier-clear collision.
        var ev = new EMEVD.Event(
            id: TierClearConstants.ModInitEventId,
            restBehavior: EMEVD.Event.RestBehaviorType.Default);
        ev.Instructions.AddRange(new[]
        {
            MakeSentinel(TagProlog),
            MakeBatchSet(1049304400, 1049304999, PatchConstants.FlagStateOff),
            MakeSentinel(TagEpilog),
        });
        var emevd = new EMEVD();
        emevd.Events.Add(ev);

        var exc = Assert.Throws<InvalidOperationException>(
            () => Tier1VisibilityBootstrapSplicer.Apply(emevd));
        Assert.Contains(TierClearConstants.BatchResetStart.ToString(), exc.Message);
        Assert.Contains(TierClearConstants.BatchResetEnd.ToString(), exc.Message);
    }

    [Fact]
    public void Apply_MultipleMatchingBatchResets_ThrowsLoudly()
    {
        // Two batch resets with identical (start, end, state) — ambiguous
        // anchor. The splicer must refuse to guess.
        var ev = new EMEVD.Event(
            id: TierClearConstants.ModInitEventId,
            restBehavior: EMEVD.Event.RestBehaviorType.Default);
        ev.Instructions.AddRange(new[]
        {
            MakeBatchSet(
                TierClearConstants.BatchResetStart,
                TierClearConstants.BatchResetEnd,
                PatchConstants.FlagStateOff),
            MakeSentinel(TagProlog),
            MakeBatchSet(
                TierClearConstants.BatchResetStart,
                TierClearConstants.BatchResetEnd,
                PatchConstants.FlagStateOff),
        });
        var emevd = new EMEVD();
        emevd.Events.Add(ev);

        var exc = Assert.Throws<InvalidOperationException>(
            () => Tier1VisibilityBootstrapSplicer.Apply(emevd));
        Assert.Contains("multiple", exc.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void Apply_BatchResetWithRightRangeButWrongState_DoesNotMatch()
    {
        // A BatchSetEventFlags(1049308400, 1049308999, ON) — same range but
        // turning the flags ON instead of OFF — must NOT be matched. The
        // bootstrap depends on splicing AFTER an OFF reset; matching an ON
        // would put our SetEventFlagID(ON) right after another ON, which
        // would still work but for the wrong reason and would silently mask
        // a source-mod refactor that flips the reset's polarity.
        var ev = new EMEVD.Event(
            id: TierClearConstants.ModInitEventId,
            restBehavior: EMEVD.Event.RestBehaviorType.Default);
        ev.Instructions.Add(MakeBatchSet(
            TierClearConstants.BatchResetStart,
            TierClearConstants.BatchResetEnd,
            PatchConstants.FlagStateOn)); // wrong state
        var emevd = new EMEVD();
        emevd.Events.Add(ev);

        Assert.Throws<InvalidOperationException>(
            () => Tier1VisibilityBootstrapSplicer.Apply(emevd));
    }

    [Fact]
    public void Apply_AnchorAtEndOfEvent_AppendsBootstrapAtTail()
    {
        // Edge case: the anchor is the last instruction in the event. The
        // splice index = anchor + 1 is then equal to instructions.Count, and
        // List<T>.Insert at Count appends. No idempotency conflict because
        // there's no existing instruction at the splice slot to compare.
        var ev = new EMEVD.Event(
            id: TierClearConstants.ModInitEventId,
            restBehavior: EMEVD.Event.RestBehaviorType.Default);
        ev.Instructions.Add(MakeSentinel(TagProlog));
        ev.Instructions.Add(MakeBatchSet(
            TierClearConstants.BatchResetStart,
            TierClearConstants.BatchResetEnd,
            PatchConstants.FlagStateOff));
        var emevd = new EMEVD();
        emevd.Events.Add(ev);

        var result = Tier1VisibilityBootstrapSplicer.Apply(emevd);
        Assert.True(result.Inserted);
        Assert.Equal(1, result.AnchorInstructionIndex);
        Assert.Equal(2, result.SpliceInstructionIndex);

        Assert.Equal(3, ev.Instructions.Count);
        Assert.Equal(PatchConstants.IdSetEventFlag, ev.Instructions[2].ID);
        Assert.Equal(TierClearConstants.Tier1VisibilityFlag,
            BinaryPrimitives.ReadUInt32LittleEndian(ev.Instructions[2].ArgData.AsSpan(4, 4)));
    }
}
