// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Buffers.Binary;
using System.Collections.Generic;
using System.Linq;
using BossRush.Core.Patching;
using SoulsFormats;
using Xunit;

namespace BossRush.Tests;

/// <summary>
/// Regression tests for <see cref="EmevdPatcher.RebuildRewardEvent"/>.
///
/// The patcher USED to wipe the entire event body when rebuilding a reward
/// event's dispatch. That caused the two in-game bugs we're specifically
/// guarding against here:
///
///   1. Bosses dropping nothing — because the wipe deleted the downstream
///      $InitializeCommonEvent(0, 90001052/54/55) calls that actually grant
///      items for the award flags we set.
///   2. Teleporter sending the player back to the boss they just killed —
///      because the wipe deleted the `SetEventFlagID(X0_4, ON)` instruction
///      that marks the boss as defeated.
///
/// These tests fabricate a minimal EMEVD.Event that mimics the structure of
/// a real reward event (prolog + dispatch block + epilog + conditional
/// WaitFor) and assert that after the rebuild:
///
///   * The prolog instructions are preserved byte-for-byte.
///   * The dispatch block is replaced by the inline SkipIf chain.
///   * The epilog instructions (AwardItemLot stand-in + SetEventFlagID X0_4 +
///     InitializeCommonEvent 90001052) are preserved byte-for-byte.
///   * The conditional-guard on WaitFor(SyncDoneFlag) is stripped so the
///     WaitFor is unconditional.
/// </summary>
public class RewardEventSpliceTests
{
    // ---- sentinel-instruction helpers ------------------------------------
    // We use a distinctive opcode that the patcher never manufactures
    // (SetNetworkconnectedEventFlags or similar would be overkill) — a simple
    // "SetEventFlag with a recognizable flag id" works because we only inspect
    // ArgData, not opcode identity. We pick a bank/id that's clearly not in
    // PatchConstants to keep the sentinels distinguishable from the inserted
    // inline-chain SetEventFlags (which use bank=2003 id=66).
    //
    // Pragmatic shortcut: use bank=2003 id=42 (an arbitrary unused id within
    // the event bank) so we know the sentinel can't match the guard / anchor
    // detection logic, and tag the flagId with a high sentinel value.
    private const int SentinelBank = 2003;
    private const int SentinelId = 42;

    private static EMEVD.Instruction MakeSentinel(uint tag)
    {
        // 8 bytes: [tag:u32 LE][pad:u32]. Padding chosen so ArgData.Length >= 8
        // (matches the minimum our detection helpers probe).
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

    private static EMEVD.Instruction MakeSkipIfEventFlag(byte skip, uint flagId)
    {
        // bank=1003 id=1 args: u8 skip, u8 flagState, u8 flagType, u32 flagId
        // layout: [skip:1][state:1][type:1][pad:1][flagId:4]  → 8 bytes
        byte[] data = new byte[8];
        data[0] = skip;
        data[1] = 1;  // flagState = ON
        data[2] = 0;  // flagType = EventFlag
        data[3] = 0;  // padding
        BinaryPrimitives.WriteUInt32LittleEndian(data.AsSpan(4, 4), flagId);
        return new EMEVD.Instruction(
            PatchConstants.BankControlFlowEvent,
            PatchConstants.IdSkipIfEventFlag,
            data);
    }

    private static EMEVD.Instruction MakeSkipUnconditionally(byte skip)
    {
        // bank=1000 id=3 args: u8 skip. Padded to 4 bytes.
        byte[] data = new byte[4] { skip, 0, 0, 0 };
        return new EMEVD.Instruction(
            PatchConstants.BankControlFlowSystem,
            PatchConstants.IdSkipUnconditionally,
            data);
    }

    private static EMEVD.Instruction MakeInitializeCommonEvent(uint targetEventId, uint slot = 0)
    {
        // bank=2000 id=6 args: i32 slot, u32 eventId, (variadic u32)
        // layout: [slot:4][eventId:4]  → 8 bytes (no variadic for our fixture)
        byte[] data = new byte[8];
        BinaryPrimitives.WriteUInt32LittleEndian(data.AsSpan(0, 4), slot);
        BinaryPrimitives.WriteUInt32LittleEndian(data.AsSpan(4, 4), targetEventId);
        return new EMEVD.Instruction(
            PatchConstants.BankSystem,
            PatchConstants.IdInitializeCommonEvent,
            data);
    }

    private static EMEVD.Instruction MakeWaitForEventFlag(uint flagId)
    {
        // bank=1003 id=0 args: u8 flagState, u8 flagType, u32 flagId
        // layout: [state:1][type:1][pad:2][flagId:4]  → 8 bytes
        byte[] data = new byte[8];
        data[0] = 1; // state ON
        data[1] = 0; // type EventFlag
        BinaryPrimitives.WriteUInt32LittleEndian(data.AsSpan(4, 4), flagId);
        return new EMEVD.Instruction(
            PatchConstants.BankControlFlowEvent,
            PatchConstants.IdWaitForEventFlag,
            data);
    }

    // ---- fixture builder -------------------------------------------------
    // Builds a fake reward event that mirrors the critical instruction shape
    // the real mod uses:
    //
    //   sentinel(PROLOG)                 ← must be preserved
    //   SkipIfEventFlag(flag=1049300055) ← dispatch guard 1
    //   SkipIfEventFlag(flag=1049300061) ← dispatch guard 2
    //   InitializeCommonEvent(_, 90001050) ← dispatch anchor
    //   SkipUnconditionally              ← jumps past else-if
    //   SkipIfEventFlag(flag=1049300063) ← else-if guard, skip=1
    //   sentinel(ELSE_BODY)              ← the single instruction the else-if guards
    //   sentinel(EPILOG_AWARD)           ← must be preserved (AwardItemLot stand-in)
    //   sentinel(EPILOG_BOSSFLAG)        ← must be preserved (SetEventFlagID X0_4 stand-in)
    //   SkipIfEventFlag(flag=1049300055) ← WaitFor guard 1
    //   SkipIfEventFlag(flag=1049300061) ← WaitFor guard 2
    //   WaitFor(EventFlag(SyncDoneFlag)) ← must be preserved, guards stripped
    //   sentinel(EPILOG_FINAL)           ← must be preserved
    private static EMEVD.Event BuildFakeRewardEvent()
    {
        var ev = new EMEVD.Event(id: 90001033, restBehavior: EMEVD.Event.RestBehaviorType.Default);
        ev.Instructions.AddRange(new[]
        {
            MakeSentinel(TagProlog),
            MakeSkipIfEventFlag(skip: 1, flagId: 1049300055u),
            MakeSkipIfEventFlag(skip: 1, flagId: 1049300061u),
            MakeInitializeCommonEvent(targetEventId: 90001050u),
            MakeSkipUnconditionally(skip: 2),
            MakeSkipIfEventFlag(skip: 1, flagId: 1049300063u),
            MakeSentinel(TagElseBody),
            MakeSentinel(TagEpilogAward),
            MakeSentinel(TagEpilogBossFlag),
            MakeSkipIfEventFlag(skip: 1, flagId: 1049300055u),
            MakeSkipIfEventFlag(skip: 1, flagId: 1049300061u),
            MakeWaitForEventFlag(PatchConstants.SyncDoneFlag),
            MakeSentinel(TagEpilogFinal),
        });
        return ev;
    }

    private const uint TagProlog        = 0xA0A0_0001;
    private const uint TagElseBody      = 0xA0A0_0002;
    private const uint TagEpilogAward   = 0xA0A0_0003;
    private const uint TagEpilogBossFlag= 0xA0A0_0004;
    private const uint TagEpilogFinal   = 0xA0A0_0005;

    // Build a synthetic branch row. BranchEntry is internal; we use
    // InternalsVisibleTo to reach it.
    private static EmevdPatcher.BranchEntry MakeBranch(long bossFlag)
    {
        return new EmevdPatcher.BranchEntry
        {
            BossFlag = bossFlag,
            AwardFlagWeapon   = 0x1000_0001u,
            AwardFlagArmor    = 0x1000_0002u,
            AwardFlagTalisman = 0x1000_0003u,
            AwardFlagSpell    = 0x1000_0004u,
            AwardFlagAowTool  = 0x1000_0005u,
            AwardFlagAshesTear= 0x1000_0006u,
        };
    }

    // ---- actual tests ----------------------------------------------------

    [Fact]
    public void SurgicalSplice_PreservesPrologAndEpilog()
    {
        var ev = BuildFakeRewardEvent();
        var rows = new List<EmevdPatcher.BranchEntry>
        {
            MakeBranch(1049304237),
            MakeBranch(1049304164),
        };
        EmevdPatcher.RebuildRewardEvent(ev, rewardEventId: 90001033, rows);

        // Expected instructions (in order):
        //   [0] PROLOG sentinel
        //   [1..16] inline chain: per branch 1 SkipIfComparison + 7 SetEventFlag (=8)
        //           2 branches → 16; plus 1 trailing fallback SetEventFlag → 17 total
        //   [18] EPILOG_AWARD
        //   [19] EPILOG_BOSSFLAG
        //   [20] WaitFor (guards stripped)
        //   [21] EPILOG_FINAL
        int inlineLen = rows.Count * 8 + 1;

        Assert.True(IsSentinelWithTag(ev.Instructions[0], TagProlog),
            "Prolog sentinel must be at index 0");

        // Inline chain should start at index 1.
        var firstInlineSkip = ev.Instructions[1];
        Assert.Equal(PatchConstants.BankControlFlowSystem, firstInlineSkip.Bank);
        Assert.Equal(PatchConstants.IdSkipIfComparison, firstInlineSkip.ID);

        // After inline chain: epilog must be contiguous.
        int epilogStart = 1 + inlineLen;
        Assert.True(IsSentinelWithTag(ev.Instructions[epilogStart], TagEpilogAward),
            "EPILOG_AWARD must immediately follow the inline chain");
        Assert.True(IsSentinelWithTag(ev.Instructions[epilogStart + 1], TagEpilogBossFlag),
            "EPILOG_BOSSFLAG (SetEventFlagID X0_4 stand-in) must be preserved");

        // WaitFor guards stripped — WaitFor should be at epilogStart + 2
        var waitFor = ev.Instructions[epilogStart + 2];
        Assert.Equal(PatchConstants.BankControlFlowEvent, waitFor.Bank);
        Assert.Equal(PatchConstants.IdWaitForEventFlag, waitFor.ID);

        // And the final sentinel is last.
        Assert.True(IsSentinelWithTag(ev.Instructions[epilogStart + 3], TagEpilogFinal),
            "EPILOG_FINAL (sub-event dispatcher stand-in) must be preserved");

        // Total length: 1 prolog + inline + 2 epilog + 1 WaitFor + 1 final = 1 + inlineLen + 4
        Assert.Equal(1 + inlineLen + 4, ev.Instructions.Count);
    }

    [Fact]
    public void SurgicalSplice_RemovesOldDispatchInstructions()
    {
        var ev = BuildFakeRewardEvent();
        var rows = new List<EmevdPatcher.BranchEntry> { MakeBranch(1049304237) };
        EmevdPatcher.RebuildRewardEvent(ev, 90001033, rows);

        // The dispatch anchor (InitializeCommonEvent targeting 90001050) must
        // no longer exist.
        foreach (var ins in ev.Instructions)
        {
            if (ins.Bank != PatchConstants.BankSystem) continue;
            if (ins.ID != PatchConstants.IdInitializeCommonEvent) continue;
            if (ins.ArgData.Length < 8) continue;
            uint target = BinaryPrimitives.ReadUInt32LittleEndian(ins.ArgData.AsSpan(4, 4));
            Assert.NotEqual(90001050u, target);
        }

        // The ELSE_BODY sentinel (unreachable post-dispatch) must be removed.
        foreach (var ins in ev.Instructions)
        {
            Assert.False(IsSentinelWithTag(ins, TagElseBody),
                "Else-body sentinel should have been removed during splice");
        }
    }

    [Fact]
    public void SurgicalSplice_StripsWaitForGuard()
    {
        var ev = BuildFakeRewardEvent();
        var rows = new List<EmevdPatcher.BranchEntry> { MakeBranch(1049304237) };
        EmevdPatcher.RebuildRewardEvent(ev, 90001033, rows);

        // Find the WaitFor.
        int waitIdx = -1;
        for (int i = 0; i < ev.Instructions.Count; i++)
        {
            var ins = ev.Instructions[i];
            if (ins.Bank == PatchConstants.BankControlFlowEvent
                && ins.ID == PatchConstants.IdWaitForEventFlag)
            {
                waitIdx = i;
                break;
            }
        }
        Assert.True(waitIdx > 0, "WaitFor must still be present in the event");

        // The instruction immediately before the WaitFor must NOT be a guard
        // SkipIfEventFlag checking the mode flags — if it is, the guard was
        // not stripped.
        var prev = ev.Instructions[waitIdx - 1];
        bool isGuard = prev.Bank == PatchConstants.BankControlFlowEvent
            && prev.ID == PatchConstants.IdSkipIfEventFlag
            && prev.ArgData.Length >= 8;
        if (isGuard)
        {
            uint flagId = BinaryPrimitives.ReadUInt32LittleEndian(prev.ArgData.AsSpan(4, 4));
            Assert.NotEqual(1049300055u, flagId);
            Assert.NotEqual(1049300061u, flagId);
        }
    }

    [Fact]
    public void SurgicalSplice_InlineChainUsesBossFlagParameters()
    {
        var ev = BuildFakeRewardEvent();
        var rows = new List<EmevdPatcher.BranchEntry>
        {
            MakeBranch(1049304237),
            MakeBranch(1049304164),
            MakeBranch(1049304100),
        };
        EmevdPatcher.RebuildRewardEvent(ev, 90001033, rows);

        // Exactly `rows.Count` Parameters should target SkipIfComparison
        // instructions in the inline chain, each with targetStartByte=4
        // (the lhs slot) and byteCount=4 (pulling X0_4 = boss_flag).
        int boundSkips = 0;
        foreach (var p in ev.Parameters)
        {
            Assert.True(p.InstructionIndex >= 0 && p.InstructionIndex < ev.Instructions.Count,
                $"Parameter InstructionIndex {p.InstructionIndex} out of bounds");
            var target = ev.Instructions[(int)p.InstructionIndex];
            if (target.Bank == PatchConstants.BankControlFlowSystem
                && target.ID == PatchConstants.IdSkipIfComparison
                && p.TargetStartByte == InstructionFactory.SkipIfComparisonLhsOffset
                && p.SourceStartByte == 0
                && p.ByteCount == 4)
            {
                boundSkips++;
            }
        }
        Assert.Equal(rows.Count, boundSkips);
    }

    [Fact]
    public void SurgicalSplice_EmptyRows_StillStripsAndLeavesEpilogIntact()
    {
        var ev = BuildFakeRewardEvent();
        var rows = new List<EmevdPatcher.BranchEntry>(); // no bosses map to this event

        EmevdPatcher.RebuildRewardEvent(ev, 90001033, rows);

        // With 0 branches the inline chain is just the fallback sync flag (1
        // SetEventFlag), so the event should be:
        //   [0] PROLOG
        //   [1] SetEventFlag(SyncDoneFlag) ← fallback
        //   [2] EPILOG_AWARD
        //   [3] EPILOG_BOSSFLAG  ← teleporter depends on this!
        //   [4] WaitFor          ← unconditional now
        //   [5] EPILOG_FINAL
        Assert.Equal(6, ev.Instructions.Count);

        Assert.True(IsSentinelWithTag(ev.Instructions[0], TagProlog));

        Assert.Equal(PatchConstants.BankEvent, ev.Instructions[1].Bank);
        Assert.Equal(PatchConstants.IdSetEventFlag, ev.Instructions[1].ID);

        Assert.True(IsSentinelWithTag(ev.Instructions[2], TagEpilogAward));
        Assert.True(IsSentinelWithTag(ev.Instructions[3], TagEpilogBossFlag));

        Assert.Equal(PatchConstants.BankControlFlowEvent, ev.Instructions[4].Bank);
        Assert.Equal(PatchConstants.IdWaitForEventFlag, ev.Instructions[4].ID);

        Assert.True(IsSentinelWithTag(ev.Instructions[5], TagEpilogFinal));

        // No parameters should remain (dispatch block gone, fallback uses no params).
        Assert.Empty(ev.Parameters);
    }

    [Fact]
    public void SurgicalSplice_FindDispatchAnchor_ThrowsIfMissing()
    {
        // Event without InitializeCommonEvent(_, 90001050) — the splice must
        // fail loudly rather than silently produce a broken event.
        var ev = new EMEVD.Event(id: 12345, restBehavior: EMEVD.Event.RestBehaviorType.Default);
        ev.Instructions.Add(MakeSentinel(TagProlog));
        ev.Instructions.Add(MakeInitializeCommonEvent(targetEventId: 99999u)); // wrong target
        ev.Instructions.Add(MakeSentinel(TagEpilogFinal));

        var rows = new List<EmevdPatcher.BranchEntry> { MakeBranch(1049304237) };
        var ex = Assert.Throws<InvalidOperationException>(() =>
            EmevdPatcher.RebuildRewardEvent(ev, 12345, rows));
        Assert.Contains("90001050", ex.Message);
    }
}
