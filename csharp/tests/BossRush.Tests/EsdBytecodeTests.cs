// SPDX-License-Identifier: GPL-3.0-only
using System;
using BossRush.Core.Patching;
using Xunit;

namespace BossRush.Tests;

/// <summary>
/// Byte-precise unit tests for <see cref="EsdBytecode"/>. Each assertion pins
/// an exact opcode sequence against a sample observed in Kalé's dumped ESD
/// (see notes on each fact). If a future SoulsFormats update changes how we
/// emit bytes, these tests fire first — before any real TalkESD is corrupted.
/// </summary>
public class EsdBytecodeTests
{
    // ------------------------------------------------------------------
    // Literal / terminator primitives
    // ------------------------------------------------------------------

    [Fact]
    public void PushInt32_Emits_82_Opcode_Then_LE32_NoTerminator()
    {
        // 0x01020304 little-endian is 04 03 02 01.
        byte[] bytes = EsdBytecode.PushInt32(0x01020304);
        Assert.Equal(new byte[] { 0x82, 0x04, 0x03, 0x02, 0x01 }, bytes);
    }

    [Fact]
    public void End_IsA1()
    {
        // 0xa1 is the expression-terminator in every observed evaluator and
        // CommandCall arg. Pin it so a refactor can't silently change it.
        Assert.Equal(0xa1, EsdBytecode.End);
    }

    [Fact]
    public void ArgInt32_Is_82_LE32_A1_SixBytes()
    {
        // Matches the exact 6-byte shape `82 a8 8d 01 00 a1` observed for
        // OpenRegularShop(101800) in Kalé's state 9 (0x00018DA8 = 101800).
        byte[] bytes = EsdBytecode.ArgInt32(101800);
        Assert.Equal(new byte[] { 0x82, 0xa8, 0x8d, 0x01, 0x00, 0xa1 }, bytes);
        Assert.Equal(6, bytes.Length);
    }

    [Fact]
    public void ArgInt32_EncodesNegativeValuesAsTwosComplementLE()
    {
        // -1 ⇒ 0xFFFFFFFF ⇒ ff ff ff ff. Catches accidental use of
        // WriteUInt32 with abs() or similar.
        byte[] bytes = EsdBytecode.ArgInt32(-1);
        Assert.Equal(new byte[] { 0x82, 0xff, 0xff, 0xff, 0xff, 0xa1 }, bytes);
    }

    [Fact]
    public void ArgUInt32_MatchesArgInt32ForIdenticalBitPattern()
    {
        // ArgUInt32 must reinterpret, not re-encode. 0xFFFFFFFF should round
        // through identically regardless of signed/unsigned entry point.
        Assert.Equal(
            EsdBytecode.ArgInt32(-1),
            EsdBytecode.ArgUInt32(0xFFFFFFFFu));
    }

    // ------------------------------------------------------------------
    // Evaluators
    // ------------------------------------------------------------------

    [Fact]
    public void AlwaysTrueEvaluator_IsTwoBytes_41_A1()
    {
        // This is the trailing `else` evaluator used at the end of every
        // condition chain in Kalé's branch-table state (state 4).
        byte[] bytes = EsdBytecode.AlwaysTrueEvaluator();
        Assert.Equal(new byte[] { 0x41, 0xa1 }, bytes);
    }

    [Fact]
    public void GetTalkListEntryResultEqualsEvaluator_MatchesDumpedPattern()
    {
        // Verified against Kalé's state 4 condition for n=1 ("Purchase
        // Weapons" menu result): `57 84 82 01 00 00 00 95 a1`.
        byte[] bytes = EsdBytecode.GetTalkListEntryResultEqualsEvaluator(1);
        Assert.Equal(
            new byte[] { 0x57, 0x84, 0x82, 0x01, 0x00, 0x00, 0x00, 0x95, 0xa1 },
            bytes);
        Assert.Equal(9, bytes.Length);
    }

    [Fact]
    public void GetTalkListEntryResultEqualsEvaluator_EmbedsLiteralLittleEndian()
    {
        // For a tier-menu index like 30 (0x1e), we expect the literal bytes
        // 1e 00 00 00 at offset 3..6.
        byte[] bytes = EsdBytecode.GetTalkListEntryResultEqualsEvaluator(30);
        Assert.Equal(0x1e, bytes[3]);
        Assert.Equal(0x00, bytes[4]);
        Assert.Equal(0x00, bytes[5]);
        Assert.Equal(0x00, bytes[6]);
    }

    [Fact]
    public void GetEventFlagEquals1Atom_Is13Bytes_WithNoTerminator()
    {
        // Atom layout verified empirically from Kalé's state 14
        // AddTalkListDataIf condition args:
        //   4f 82 <flag-LE32> 85 82 01 00 00 00 95   (13 bytes, NO trailing a1)
        const uint flag = 1049308401;
        byte[] atom = EsdBytecode.GetEventFlagEquals1Atom(flag);

        Assert.Equal(13, atom.Length);
        Assert.Equal(0x4f, atom[0]);
        Assert.Equal(0x82, atom[1]);
        // Bytes 2..5 are the flag id, little-endian. Round-trip rather than
        // hand-compute to avoid mental-hex errors.
        uint decoded =
              (uint)atom[2]
            | ((uint)atom[3] << 8)
            | ((uint)atom[4] << 16)
            | ((uint)atom[5] << 24);
        Assert.Equal(flag, decoded);
        Assert.Equal(0x85, atom[6]);
        Assert.Equal(0x82, atom[7]);
        Assert.Equal(0x01, atom[8]);
        Assert.Equal(0x00, atom[9]);
        Assert.Equal(0x00, atom[10]);
        Assert.Equal(0x00, atom[11]);
        Assert.Equal(0x95, atom[12]);
        // Crucially: no 0xa1 at the end. The atom is expected to be joined
        // with 0x99 (OR) or wrapped by the Evaluator variant.
        Assert.DoesNotContain(EsdBytecode.End, atom);
    }

    [Fact]
    public void GetEventFlagEquals1Evaluator_IsAtomPlusTerminator_14Bytes()
    {
        byte[] eval = EsdBytecode.GetEventFlagEquals1Evaluator(1049308401);
        byte[] atom = EsdBytecode.GetEventFlagEquals1Atom(1049308401);

        Assert.Equal(atom.Length + 1, eval.Length);
        Assert.Equal(EsdBytecode.End, eval[^1]);
        // The atom bytes should be present verbatim as the prefix.
        for (int i = 0; i < atom.Length; i++)
            Assert.Equal(atom[i], eval[i]);
    }

    // ------------------------------------------------------------------
    // CommandCall factories
    // ------------------------------------------------------------------

    [Fact]
    public void OpenRegularShop_MatchesDumpedKaleBellBearingShopShape()
    {
        // Kalé's state 9 calls OpenRegularShop(101800, 101897). The dumped
        // bytes for that call are bank=1 id=22 args=2 with args
        // `82 a8 8d 01 00 a1` and `82 09 8e 01 00 a1`. Pin every field.
        var cmd = EsdBytecode.OpenRegularShop(101800, 101897);

        Assert.Equal(1, cmd.CommandBank);
        Assert.Equal(22, cmd.CommandID);
        Assert.Equal(2, cmd.Arguments.Count);
        Assert.Equal(
            new byte[] { 0x82, 0xa8, 0x8d, 0x01, 0x00, 0xa1 },
            cmd.Arguments[0]);
        Assert.Equal(
            new byte[] { 0x82, 0x09, 0x8e, 0x01, 0x00, 0xa1 },
            cmd.Arguments[1]);
    }

    [Fact]
    public void ClearTalkListData_IsBank1Id20_ZeroArgs()
    {
        var cmd = EsdBytecode.ClearTalkListData();
        Assert.Equal(1, cmd.CommandBank);
        Assert.Equal(20, cmd.CommandID);
        Assert.Empty(cmd.Arguments);
    }

    [Fact]
    public void ShowShopMessage_IsBank1Id10_OneArg()
    {
        var cmd = EsdBytecode.ShowShopMessage(1);
        Assert.Equal(1, cmd.CommandBank);
        Assert.Equal(10, cmd.CommandID);
        Assert.Single(cmd.Arguments);
        Assert.Equal(new byte[] { 0x82, 0x01, 0x00, 0x00, 0x00, 0xa1 }, cmd.Arguments[0]);
    }

    [Fact]
    public void CloseShopMessage_IsBank1Id110_ZeroArgs()
    {
        var cmd = EsdBytecode.CloseShopMessage();
        Assert.Equal(1, cmd.CommandBank);
        Assert.Equal(110, cmd.CommandID);
        Assert.Empty(cmd.Arguments);
    }

    [Fact]
    public void AddTalkListData_IsBank1Id19_ThreeArgs_ExactBytes()
    {
        // reqId=-1 is the common "no requirement" sentinel; must round-trip
        // via two's complement to FF FF FF FF.
        var cmd = EsdBytecode.AddTalkListData(index: 30, textId: 20000009, reqId: -1);

        Assert.Equal(1, cmd.CommandBank);
        Assert.Equal(19, cmd.CommandID);
        Assert.Equal(3, cmd.Arguments.Count);
        // 30 = 0x1e LE ⇒ 1e 00 00 00
        Assert.Equal(new byte[] { 0x82, 0x1e, 0x00, 0x00, 0x00, 0xa1 }, cmd.Arguments[0]);
        // 20000009 = 0x01312D09 LE ⇒ 09 2d 31 01
        Assert.Equal(new byte[] { 0x82, 0x09, 0x2d, 0x31, 0x01, 0xa1 }, cmd.Arguments[1]);
        Assert.Equal(new byte[] { 0x82, 0xff, 0xff, 0xff, 0xff, 0xa1 }, cmd.Arguments[2]);
    }

    [Fact]
    public void AddTalkListDataIf_IsBank5Id19_FourArgs_CondBytesVerbatim()
    {
        // Arg 0 is raw condition bytecode (must already be terminated).
        // The factory must not wrap, pad, or rewrite it — whatever we
        // hand in must land byte-for-byte.
        byte[] cond = EsdBytecode.GetEventFlagEquals1Evaluator(1049308405);

        var cmd = EsdBytecode.AddTalkListDataIf(cond, index: 34, textId: 20000009, reqId: -1);

        Assert.Equal(5, cmd.CommandBank);
        Assert.Equal(19, cmd.CommandID);
        Assert.Equal(4, cmd.Arguments.Count);
        Assert.Same(cond, cmd.Arguments[0]);
        Assert.Equal(new byte[] { 0x82, 0x22, 0x00, 0x00, 0x00, 0xa1 }, cmd.Arguments[1]); // 34 = 0x22
    }

    [Fact]
    public void AddTalkListDataIf_NullCondition_Throws()
    {
        Assert.Throws<ArgumentNullException>(
            () => EsdBytecode.AddTalkListDataIf(null!, 30, 20000009, -1));
    }

    // ------------------------------------------------------------------
    // CloneBytes
    // ------------------------------------------------------------------

    [Fact]
    public void CloneBytes_ReturnsEqualButNotAliased()
    {
        byte[] src = new byte[] { 1, 2, 3, 4 };
        byte[] dst = EsdBytecode.CloneBytes(src);

        Assert.Equal(src, dst);
        Assert.NotSame(src, dst);

        // Mutating the source must not touch the clone.
        src[0] = 99;
        Assert.Equal(1, dst[0]);
    }

    [Fact]
    public void CloneBytes_Null_Throws()
    {
        Assert.Throws<ArgumentNullException>(() => EsdBytecode.CloneBytes(null!));
    }
}
