// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Buffers.Binary;
using System.Collections.Generic;
using SoulsFormats;

namespace IgniteBossRush.Core.Patching;

/// <summary>
/// Tiny builder for the <b>ESDLang bytecode</b> that appears in
/// <see cref="ESD.Condition.Evaluator"/> and <see cref="ESD.CommandCall.Arguments"/>.
/// Only the subset we actually need for the Kalé-menu splicer is implemented.
///
/// <para>
/// Opcodes were reverse-engineered empirically by dumping Kalé's own TalkESD
/// (<c>t600001110.esd</c>) via <c>igniterush inspect-esd</c> and matching the
/// byte patterns against the decompiled script (<c>t600001110.py</c>).
/// Verified correspondences (used here verbatim):
/// </para>
/// <list type="bullet">
///   <item><c>0x82 &lt;LE32&gt;</c> — push i32 literal.</item>
///   <item><c>0x95</c> — close subexpression / pop.</item>
///   <item><c>0xa1</c> — end-of-expression marker (required terminator).</item>
///   <item><c>0x85</c> — binary <c>==</c>.</item>
///   <item><c>0x99</c> — binary <c>||</c> (short-circuit OR).</item>
///   <item><c>0x4f</c> — open subexpression (paired with <c>0x95</c>).</item>
///   <item><c>0x57 0x84</c> — <c>GetTalkListEntryResult()</c> call (no args).</item>
///   <item><c>0x85 0xa9 0x00</c> — <c>GetEventFlag(n)</c> call (n is the preceding pushed literal).</item>
///   <item><c>0x41</c> — push small literal <c>true</c> (used alone with <c>0xa1</c> as the "always" evaluator).</item>
/// </list>
///
/// <para>
/// We deliberately <i>don't</i> synthesize more exotic evaluators (like the
/// 39-byte "menu was closed" predicate that Kalé's state 9 uses). Those are
/// cloned byte-for-byte from existing states via
/// <see cref="CloneBytes"/> — less risk of getting the opcode wrong on a
/// predicate we don't fully understand.
/// </para>
/// </summary>
internal static class EsdBytecode
{
    // ------------------------------------------------------------------
    // Raw building blocks
    // ------------------------------------------------------------------

    /// <summary>Push a 32-bit int literal (little-endian). 5 bytes. Does NOT
    /// emit the terminating <c>0xa1</c> — callers that use this as a
    /// standalone expression (e.g. a <see cref="ESD.CommandCall"/> arg) must
    /// append <see cref="End"/>.</summary>
    public static byte[] PushInt32(int value)
    {
        var buf = new byte[5];
        buf[0] = 0x82;
        BinaryPrimitives.WriteInt32LittleEndian(buf.AsSpan(1, 4), value);
        return buf;
    }

    /// <summary>Push a 32-bit uint literal (little-endian). 5 bytes.</summary>
    public static byte[] PushUInt32(uint value) => PushInt32(unchecked((int)value));

    /// <summary>End-of-expression terminator (0xa1). Every standalone
    /// <see cref="ESD.Condition.Evaluator"/> and every
    /// <see cref="ESD.CommandCall.Arguments"/> entry must end with this byte.</summary>
    public const byte End = 0xa1;

    // ------------------------------------------------------------------
    // CommandCall argument helper
    // ------------------------------------------------------------------

    /// <summary>A 6-byte <see cref="ESD.CommandCall"/> argument that pushes a
    /// single i32 literal and terminates. Matches the empirical pattern
    /// <c>82 LE32 a1</c> used for every OpenRegularShop / AddTalkListData
    /// scalar arg in Kalé's ESD.</summary>
    public static byte[] ArgInt32(int value)
    {
        var buf = new byte[6];
        buf[0] = 0x82;
        BinaryPrimitives.WriteInt32LittleEndian(buf.AsSpan(1, 4), value);
        buf[5] = End;
        return buf;
    }

    public static byte[] ArgUInt32(uint value) => ArgInt32(unchecked((int)value));

    // ------------------------------------------------------------------
    // Condition evaluators
    // ------------------------------------------------------------------

    /// <summary>The always-true evaluator <c>41 a1</c> — used for the trailing
    /// "else" slot of a condition chain. 2 bytes.</summary>
    public static byte[] AlwaysTrueEvaluator() => new byte[] { 0x41, End };

    /// <summary>The 9-byte evaluator <c>57 84 82 &lt;N-LE32&gt; 95 a1</c> that
    /// tests <c>GetTalkListEntryResult() == n</c>. Matches Kalé's state-4
    /// branching evaluators byte-for-byte for n in 1..7.</summary>
    public static byte[] GetTalkListEntryResultEqualsEvaluator(int n)
    {
        var buf = new byte[9];
        buf[0] = 0x57;
        buf[1] = 0x84;
        buf[2] = 0x82;
        BinaryPrimitives.WriteInt32LittleEndian(buf.AsSpan(3, 4), n);
        buf[7] = 0x95;
        buf[8] = End;
        return buf;
    }

    /// <summary>The 13-byte ATOM that checks <c>GetEventFlag(flag) == 1</c>.
    /// Does NOT include the trailing <c>0xa1</c> — this is designed to be
    /// joined via <c>0x99</c> (OR) or used as the sole atom by a caller that
    /// appends <see cref="End"/> itself. Pattern mirrors the one Kalé uses
    /// inside <c>AddTalkListDataIf</c> condition args.
    ///
    /// <para>
    /// Byte layout (verified against Kalé's state 14 arg[0] for flag 11109752):
    /// <c>4f 82 &lt;flagId-LE32&gt; 85 82 01 00 00 00 95</c>. The leading
    /// <c>0x4f</c> appears to be an opcode that treats the next pushed i32 as
    /// a GetEventFlag argument (implicit call), so no explicit function-id
    /// bytes follow.
    /// </para></summary>
    public static byte[] GetEventFlagEquals1Atom(uint flagId)
    {
        var buf = new byte[13];
        buf[0]  = 0x4f;
        buf[1]  = 0x82;
        BinaryPrimitives.WriteUInt32LittleEndian(buf.AsSpan(2, 4), flagId);
        buf[6]  = 0x85;                 // ==
        buf[7]  = 0x82;                 // push i32
        buf[8]  = 0x01;
        buf[9]  = 0x00;
        buf[10] = 0x00;
        buf[11] = 0x00;                 // literal 1 (LE32)
        buf[12] = 0x95;                 // close subexpr
        return buf;
    }

    /// <summary>Wrap a single <see cref="GetEventFlagEquals1Atom"/> atom in a
    /// complete standalone evaluator (appends the <c>0xa1</c> terminator).
    /// 16 bytes total.</summary>
    public static byte[] GetEventFlagEquals1Evaluator(uint flagId)
    {
        var atom = GetEventFlagEquals1Atom(flagId);
        var buf = new byte[atom.Length + 1];
        Array.Copy(atom, buf, atom.Length);
        buf[atom.Length] = End;
        return buf;
    }

    // ------------------------------------------------------------------
    // CommandCall factories
    // ------------------------------------------------------------------

    /// <summary><c>ClearTalkListData()</c> — bank 1, id 20, 0 args.</summary>
    public static ESD.CommandCall ClearTalkListData()
        => new ESD.CommandCall { CommandBank = 1, CommandID = 20, Arguments = new List<byte[]>() };

    /// <summary><c>ShowShopMessage(n)</c> — bank 1, id 10, 1 arg.</summary>
    public static ESD.CommandCall ShowShopMessage(int n)
        => new ESD.CommandCall
        {
            CommandBank = 1, CommandID = 10,
            Arguments = new List<byte[]> { ArgInt32(n) },
        };

    /// <summary><c>CloseShopMessage()</c> — bank 1, id 110, 0 args.</summary>
    public static ESD.CommandCall CloseShopMessage()
        => new ESD.CommandCall { CommandBank = 1, CommandID = 110, Arguments = new List<byte[]>() };

    /// <summary><c>OpenRegularShop(start, end)</c> — bank 1, id 22, 2 args.
    /// Verified: Kalé's state 9 uses exactly this shape to call
    /// <c>OpenRegularShop(101800, 101897)</c> for the bell-bearing goods.</summary>
    public static ESD.CommandCall OpenRegularShop(int start, int end)
        => new ESD.CommandCall
        {
            CommandBank = 1, CommandID = 22,
            Arguments = new List<byte[]> { ArgInt32(start), ArgInt32(end) },
        };

    /// <summary>
    /// <c>OpenPuppetShop(start, end)</c> — bank 1, id 144, 2 args.
    /// Purchases from this shop cost <b>Starlight Shards</b> instead of
    /// runes — closes the long-pinned "for N runes" UI label bug. Same
    /// arg shape as <see cref="OpenRegularShop"/>: two ShopLineupParam
    /// row IDs.
    ///
    /// <para>
    /// <b>Opcode source.</b> Confirmed by decoding Athena Randomizer
    /// v0.20's Moonwalk-patched talkesdbnd bundle at
    /// <c>me3-v0.8.0/dlc/script/talk/m61_00_00_00.talkesdbnd.dcx</c>,
    /// specifically Athena's new <c>t460006100.esd</c> (Millicent
    /// Starlight Shop) which vanilla ER doesn't include. States 2/3/4
    /// of that ESD invoke <c>bank=1 id=144 args=2</c> with arg bytes
    /// that decode to the exact ShopLineupParam row ranges Athena's
    /// "Merchant Millicent - Starlight Shop" rows occupy
    /// (<c>9200000..9203255</c>). The triangulation with vawser's
    /// ER-Documentation (which places OpenPuppetShop adjacent to
    /// OpenAshOfWarShop in the menu-type table) completes the
    /// identification.
    /// </para>
    ///
    /// <para>
    /// <b>Known prior no-op test.</b> An earlier in-game test of
    /// id=144 on Kalé's Boss Rush tier button produced a silent no-op.
    /// Root cause was NOT the opcode — Athena's successful use of 144
    /// is definitive. The most likely no-op cause was that the patched
    /// ESD didn't reach the game (pipeline or Matt's merge didn't
    /// deploy) OR the FMG entries referenced via <c>menuTitleMsgId</c>
    /// were missing at runtime. Subsequent attempts should confirm
    /// both payloads land before concluding the opcode is wrong again.
    /// </para>
    /// </summary>
    public static ESD.CommandCall OpenPuppetShop(int start, int end)
        => new ESD.CommandCall
        {
            CommandBank = 1, CommandID = 144,
            Arguments = new List<byte[]> { ArgInt32(start), ArgInt32(end) },
        };

    /// <summary>
    /// 33-byte ESDLang evaluator matching Athena Randomizer's working
    /// Moonwalk Starlight Shop state 2 exit condition. Decompiles to:
    /// <code>
    /// assert not (CheckSpecificPersonMenuIsOpen(28, 0)
    ///             and not CheckSpecificPersonGenericDialogIsOpen(0))
    /// </code>
    ///
    /// <para>
    /// The constant <c>28</c> (<c>0x1C</c>) is the ER-native menu-type id
    /// for <see cref="OpenPuppetShop"/>'s shop UI. Pair this evaluator
    /// with an <see cref="OpenPuppetShop"/> EntryCommand on a new state:
    /// cloning the regular-shop menu-closed evaluator from Kalé's
    /// template instead made the state auto-transition out on the first
    /// tick (regular-shop menu was never open → exit condition fired
    /// immediately → silent no-op).
    /// </para>
    ///
    /// <para>
    /// <b>Byte source.</b> Pulled verbatim from <c>inspect-esd</c> dump
    /// of Athena's <c>t460006100.esd</c>, StateGroup 2147483643, State 2,
    /// Condition[0].Evaluator — the shop-state-exit predicate that pairs
    /// with Athena's verified-working OpenPuppetShop(9200000, 9201511)
    /// Moonveil shop.
    /// </para>
    /// </summary>
    public static readonly byte[] PuppetShopMenuClosedEvaluator = new byte[]
    {
        0x7b,                                  // CheckSpecificPersonMenuIsOpen (2-arg call open)
        0x82, 0x1c, 0x00, 0x00, 0x00,          //   push i32 28 (puppet-shop menu-type id)
        0x82, 0x00, 0x00, 0x00, 0x00,          //   push i32 0
        0x86,                                  // (close 2-arg call)
        0x7a,                                  // CheckSpecificPersonGenericDialogIsOpen (1-arg call open)
        0x82, 0x00, 0x00, 0x00, 0x00,          //   push i32 0
        0x85,                                  // (close 1-arg call)
        0x82, 0x00, 0x00, 0x00, 0x00, 0x95,    // == 0    ("dialog NOT open")
        0x98,                                  // logical NOT  (-> "dialog IS open")
        0x82, 0x00, 0x00, 0x00, 0x00, 0x95,    // == 0
        End,                                   // 0xa1 terminator
    };

    /// <summary><c>AddTalkListData(index, textId, reqId)</c> — bank 1, id 19,
    /// 3 args. Matches the non-conditional menu entries in Kalé's state 2.</summary>
    public static ESD.CommandCall AddTalkListData(int index, int textId, int reqId)
        => new ESD.CommandCall
        {
            CommandBank = 1, CommandID = 19,
            Arguments = new List<byte[]> { ArgInt32(index), ArgInt32(textId), ArgInt32(reqId) },
        };

    /// <summary><c>AddTalkListDataIf(condBytecode, index, textId, reqId)</c> —
    /// bank 5, id 19, 4 args. Arg 0 is the raw condition bytecode (must end
    /// with <c>0xa1</c>); args 1..3 are i32 literals.</summary>
    public static ESD.CommandCall AddTalkListDataIf(byte[] condBytecode, int index, int textId, int reqId)
    {
        if (condBytecode is null) throw new ArgumentNullException(nameof(condBytecode));
        return new ESD.CommandCall
        {
            CommandBank = 5, CommandID = 19,
            Arguments = new List<byte[]>
            {
                condBytecode,
                ArgInt32(index),
                ArgInt32(textId),
                ArgInt32(reqId),
            },
        };
    }

    // ------------------------------------------------------------------
    // Misc helpers
    // ------------------------------------------------------------------

    /// <summary>Defensive copy — used when we clone an existing Condition's
    /// evaluator byte-for-byte rather than re-synthesize it. Ensures mutations
    /// to the new state don't alias bytes inside the source state.</summary>
    public static byte[] CloneBytes(byte[] src)
    {
        if (src is null) throw new ArgumentNullException(nameof(src));
        var buf = new byte[src.Length];
        Array.Copy(src, buf, src.Length);
        return buf;
    }
}
