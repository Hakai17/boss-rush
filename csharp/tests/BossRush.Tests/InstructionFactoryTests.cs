// SPDX-License-Identifier: GPL-3.0-only
using System.Buffers.Binary;
using BossRush.Core.Patching;
using SoulsFormats;
using Xunit;

namespace BossRush.Tests;

/// <summary>
/// Byte-exact audits of the EMEVD instructions the patcher emits. If these
/// drift, the patcher will silently produce bytecode the game refuses to run
/// (or worse: runs wrongly), so the ArgData layout is pinned here.
///
/// Layouts are cross-checked against emedf/er-common.emedf.json and the mod's
/// round-tripped reference bytes in Phase0_RoundTripTest/.
/// </summary>
public class InstructionFactoryTests
{
    [Fact]
    public void SkipIfComparison_ArgData_IsTwelveBytes_LhsAtOffsetFour()
    {
        EMEVD.Instruction instr = InstructionFactory.SkipIfComparison(
            skip: 7,
            cmp: PatchConstants.CmpNotEqual,
            lhs: 0,
            rhs: 0x1234_5678);

        Assert.Equal(PatchConstants.BankControlFlowSystem, instr.Bank);
        Assert.Equal(PatchConstants.IdSkipIfComparison, instr.ID);
        Assert.Equal(InstructionFactory.SkipIfComparisonArgLen, instr.ArgData.Length);

        // [skip:u8][cmp:i8][pad:2][lhs:i32 LE][rhs:i32 LE]
        Assert.Equal((byte)7, instr.ArgData[0]);
        Assert.Equal((byte)PatchConstants.CmpNotEqual, instr.ArgData[1]);
        int lhs = BinaryPrimitives.ReadInt32LittleEndian(instr.ArgData.AsSpan(4, 4));
        int rhs = BinaryPrimitives.ReadInt32LittleEndian(instr.ArgData.AsSpan(8, 4));
        Assert.Equal(0, lhs);
        Assert.Equal(0x1234_5678, rhs);
        Assert.Equal(4, InstructionFactory.SkipIfComparisonLhsOffset);
    }

    [Fact]
    public void SetEventFlagOn_ArgData_IsTwelveBytes_FlagIdAtOffsetFour()
    {
        const uint flagId = 0xDEAD_BEEF;
        EMEVD.Instruction instr = InstructionFactory.SetEventFlagOn(flagId);

        Assert.Equal(PatchConstants.BankEvent, instr.Bank);
        Assert.Equal(PatchConstants.IdSetEventFlag, instr.ID);
        Assert.Equal(InstructionFactory.SetEventFlagArgLen, instr.ArgData.Length);

        // [type:u8][pad:3][flagId:u32 LE][state:u8][pad:3]
        Assert.Equal(PatchConstants.FlagTypeEventFlag, instr.ArgData[0]);
        uint readFlag = BinaryPrimitives.ReadUInt32LittleEndian(instr.ArgData.AsSpan(4, 4));
        Assert.Equal(flagId, readFlag);
        Assert.Equal(PatchConstants.FlagStateOn, instr.ArgData[8]);
    }

    [Fact]
    public void EndUnconditionally_ArgData_IsFourBytes_EndTypeZero()
    {
        EMEVD.Instruction instr = InstructionFactory.EndUnconditionally();

        Assert.Equal(PatchConstants.BankControlFlowSystem, instr.Bank);
        Assert.Equal(PatchConstants.IdEndUnconditionally, instr.ID);
        Assert.Equal(InstructionFactory.EndUnconditionallyArgLen, instr.ArgData.Length);
        Assert.Equal(PatchConstants.EndTypeEnd, instr.ArgData[0]);
    }

    [Fact]
    public void EndIfEventFlagOn_ArgData_MatchesDecodedReferenceBytes()
    {
        // Reference bytes from m10_00_00_00.emevd event 10002670 instruction [1]:
        //   bank=1003 id=2 argLen=8 hex: 00 01 00 00 00 00 00 00
        //     [endType=END=0][state=ON=1][type=EventFlag=0][pad=0][flagId=u32 LE]
        const uint flagId = 0x1234_5678;
        EMEVD.Instruction instr = InstructionFactory.EndIfEventFlagOn(flagId);

        Assert.Equal(PatchConstants.BankControlFlowEvent, instr.Bank);
        Assert.Equal(PatchConstants.IdEndIfEventFlag, instr.ID);
        Assert.Equal(InstructionFactory.EndIfEventFlagArgLen, instr.ArgData.Length);

        Assert.Equal(PatchConstants.EndTypeEnd, instr.ArgData[0]);
        Assert.Equal(PatchConstants.FlagStateOn, instr.ArgData[1]);
        Assert.Equal(PatchConstants.FlagTypeEventFlag, instr.ArgData[2]);
        Assert.Equal((byte)0, instr.ArgData[3]); // padding
        uint readFlag = BinaryPrimitives.ReadUInt32LittleEndian(instr.ArgData.AsSpan(4, 4));
        Assert.Equal(flagId, readFlag);
    }

    [Fact]
    public void WaitFixedTimeSeconds_ArgData_IsFourBytes_LittleEndianFloat()
    {
        EMEVD.Instruction instr = InstructionFactory.WaitFixedTimeSeconds(1.0f);

        Assert.Equal(PatchConstants.BankWait, instr.Bank);
        Assert.Equal(PatchConstants.IdWaitFixedTimeSeconds, instr.ID);
        Assert.Equal(InstructionFactory.WaitFixedTimeSecondsArgLen, instr.ArgData.Length);

        // 1.0f LE = 00 00 80 3f (matches the reference instruction in event
        // 10002670 inst [18] of m10_00_00_00).
        Assert.Equal((byte)0x00, instr.ArgData[0]);
        Assert.Equal((byte)0x00, instr.ArgData[1]);
        Assert.Equal((byte)0x80, instr.ArgData[2]);
        Assert.Equal((byte)0x3f, instr.ArgData[3]);
    }

    [Fact]
    public void DirectlyGivePlayerItem_ArgData_MatchesDecodedReferenceBytes()
    {
        // Reference bytes from m10_00_00_00.emevd event 10002670 last instruction:
        //   bank=2003 id=43 argLen=16 hex:
        //     03 00 00 00 8d 23 00 00 00 00 00 00 01 00 00 00
        //     [type=Goods=3][id=9101][flag=0 param-substituted][count=1]
        EMEVD.Instruction instr = InstructionFactory.DirectlyGivePlayerItem(
            itemType: PatchConstants.ItemTypeGoods,
            itemId: 9101u,
            eventFlagId: 0u,
            count: 1u);

        Assert.Equal(PatchConstants.BankEvent, instr.Bank);
        Assert.Equal(PatchConstants.IdDirectlyGivePlayerItem, instr.ID);
        Assert.Equal(InstructionFactory.DirectlyGivePlayerItemArgLen, instr.ArgData.Length);

        uint type  = BinaryPrimitives.ReadUInt32LittleEndian(instr.ArgData.AsSpan(0,  4));
        uint id    = BinaryPrimitives.ReadUInt32LittleEndian(instr.ArgData.AsSpan(4,  4));
        uint flag  = BinaryPrimitives.ReadUInt32LittleEndian(instr.ArgData.AsSpan(8,  4));
        uint count = BinaryPrimitives.ReadUInt32LittleEndian(instr.ArgData.AsSpan(12, 4));
        Assert.Equal(3u, type);
        Assert.Equal(9101u, id);
        Assert.Equal(0u, flag);
        Assert.Equal(1u, count);
    }

    [Fact]
    public void InitializeEvent_ArgData_IsEightBytes_SlotZero_TargetAtOffsetFour()
    {
        EMEVD.Instruction instr = InstructionFactory.InitializeEvent(
            slot: 0, targetEventId: 11105800u);

        Assert.Equal(PatchConstants.BankSystem, instr.Bank);
        Assert.Equal(PatchConstants.IdInitializeEvent, instr.ID);
        Assert.Equal(InstructionFactory.InitializeEventNoArgsLen, instr.ArgData.Length);

        int slot = BinaryPrimitives.ReadInt32LittleEndian(instr.ArgData.AsSpan(0, 4));
        uint target = BinaryPrimitives.ReadUInt32LittleEndian(instr.ArgData.AsSpan(4, 4));
        Assert.Equal(0, slot);
        Assert.Equal(11105800u, target);
    }

    [Fact]
    public void BossFlagParameter_TargetsLhsSlot_Of_SkipIfComparison()
    {
        // Parameter semantics: "for instruction N, copy srcStartByte..srcStartByte+byteCount
        // of the parent event's X args into targetStartByte..targetStartByte+byteCount
        // of this instruction's ArgData."
        //
        // For SkipIfComparison that means we overwrite the 4-byte lhs field
        // (offset 4) with the caller's X0_4 (boss_flag).
        EMEVD.Parameter p = InstructionFactory.BossFlagParameter(instructionIndex: 3);

        Assert.Equal(3, p.InstructionIndex);
        Assert.Equal(InstructionFactory.SkipIfComparisonLhsOffset, p.TargetStartByte);
        Assert.Equal(0, p.SourceStartByte);
        Assert.Equal(4, p.ByteCount);
    }

    [Fact]
    public void SkipIfComparison_SkipCountFitsByte_AtMost255()
    {
        // The reward-event branch body we emit is 7 instructions long, well
        // under the u8 skip-count cap of 255. Sanity-check the boundary so a
        // future refactor that bloats a branch past u8 range fails loudly.
        EMEVD.Instruction ok = InstructionFactory.SkipIfComparison(
            skip: 255, cmp: PatchConstants.CmpEqual, lhs: 0, rhs: 0);
        Assert.Equal((byte)255, ok.ArgData[0]);
    }

    // ------------------------------------------------------------------
    // Step 6 — tier-clear instruction builders
    // ------------------------------------------------------------------
    [Fact]
    public void SkipIfEventFlag_ArgData_IsEightBytes_FlagIdAtOffsetFour()
    {
        const uint flagId = 0xCAFE_BABE;
        EMEVD.Instruction instr = InstructionFactory.SkipIfEventFlag(
            skip: 5, flagState: PatchConstants.FlagStateOff, flagId: flagId);

        Assert.Equal(PatchConstants.BankControlFlowEvent, instr.Bank);
        Assert.Equal(PatchConstants.IdSkipIfEventFlag, instr.ID);
        Assert.Equal(InstructionFactory.SkipIfEventFlagArgLen, instr.ArgData.Length);

        // [skip:1][state:1][type:1][pad:1][flagId:4]
        Assert.Equal((byte)5, instr.ArgData[0]);
        Assert.Equal(PatchConstants.FlagStateOff, instr.ArgData[1]);
        Assert.Equal(PatchConstants.FlagTypeEventFlag, instr.ArgData[2]);
        uint readFlag = BinaryPrimitives.ReadUInt32LittleEndian(instr.ArgData.AsSpan(4, 4));
        Assert.Equal(flagId, readFlag);
    }

    [Fact]
    public void SetEventFlagOff_ArgData_HasFlagStateZero_AtOffsetEight()
    {
        const uint flagId = 0xDEAD_F00D;
        EMEVD.Instruction instr = InstructionFactory.SetEventFlagOff(flagId);

        Assert.Equal(PatchConstants.BankEvent, instr.Bank);
        Assert.Equal(PatchConstants.IdSetEventFlag, instr.ID);
        Assert.Equal(InstructionFactory.SetEventFlagArgLen, instr.ArgData.Length);

        Assert.Equal(PatchConstants.FlagTypeEventFlag, instr.ArgData[0]);
        uint readFlag = BinaryPrimitives.ReadUInt32LittleEndian(instr.ArgData.AsSpan(4, 4));
        Assert.Equal(flagId, readFlag);
        Assert.Equal(PatchConstants.FlagStateOff, instr.ArgData[8]);
    }

    [Fact]
    public void AwardItemLot_ArgData_IsFourBytes_LotIdAtOffsetZero()
    {
        const int lotId = 9000003;
        EMEVD.Instruction instr = InstructionFactory.AwardItemLot(lotId);

        Assert.Equal(PatchConstants.BankEvent, instr.Bank);
        Assert.Equal(PatchConstants.IdAwardItemLot, instr.ID);
        Assert.Equal(InstructionFactory.AwardItemLotArgLen, instr.ArgData.Length);

        int readLot = BinaryPrimitives.ReadInt32LittleEndian(instr.ArgData.AsSpan(0, 4));
        Assert.Equal(lotId, readLot);
    }

    [Fact]
    public void RemoveItemFromPlayer_ArgData_IsTwelveBytes_FieldsAtKnownOffsets()
    {
        // [type:1][pad:3][itemId:4][number:4]
        EMEVD.Instruction instr = InstructionFactory.RemoveItemFromPlayer(
            itemType: PatchConstants.ItemTypeGoods,
            itemId: TierClearConstants.AmberShardGoodsId,
            number: PatchConstants.RemoveItemAllCount);

        Assert.Equal(PatchConstants.BankEvent, instr.Bank);
        Assert.Equal(PatchConstants.IdRemoveItemFromPlayer, instr.ID);
        Assert.Equal(InstructionFactory.RemoveItemFromPlayerArgLen, instr.ArgData.Length);

        Assert.Equal(PatchConstants.ItemTypeGoods, instr.ArgData[0]);
        int readId = BinaryPrimitives.ReadInt32LittleEndian(instr.ArgData.AsSpan(4, 4));
        int readNum = BinaryPrimitives.ReadInt32LittleEndian(instr.ArgData.AsSpan(8, 4));
        Assert.Equal(TierClearConstants.AmberShardGoodsId, readId);
        Assert.Equal(PatchConstants.RemoveItemAllCount, readNum);
    }

    [Fact]
    public void InitializeCommonEvent_ArgData_IsEightBytes_SlotAndEventIdLE()
    {
        const int slot = 0;
        const uint targetEventId = 90009941u;
        EMEVD.Instruction instr = InstructionFactory.InitializeCommonEvent(slot, targetEventId);

        Assert.Equal(PatchConstants.BankSystem, instr.Bank);
        Assert.Equal(PatchConstants.IdInitializeCommonEvent, instr.ID);
        Assert.Equal(InstructionFactory.InitializeCommonEventNoArgsLen, instr.ArgData.Length);

        int readSlot = BinaryPrimitives.ReadInt32LittleEndian(instr.ArgData.AsSpan(0, 4));
        uint readId = BinaryPrimitives.ReadUInt32LittleEndian(instr.ArgData.AsSpan(4, 4));
        Assert.Equal(slot, readSlot);
        Assert.Equal(targetEventId, readId);
    }
}
