// SPDX-License-Identifier: GPL-3.0-only
using SoulsFormats;

namespace BossRush.Core.Patching;

/// <summary>
/// Builders for the handful of EMEVD instructions the patcher emits.
///
/// SoulsFormats' <see cref="EMEVD.Instruction.PackArgs(System.Collections.Generic.IEnumerable{object})"/>
/// already encodes Elden Ring's native padding rules (u8 no pad, u16 Pad(2),
/// u32/i32/f32 Pad(4), final Pad(4)) so we drive it with typed boxes to get
/// byte-exact ArgData. The ArgData sizes below are asserted in-line so any
/// future refactor that changes padding blows up loudly at patch time rather
/// than at game-load time.
/// </summary>
internal static class InstructionFactory
{
    /// <summary>
    /// SKIP IF Comparison (1000, 5)
    /// Args: (u8 skip, i8 cmpType, i32 lhs, i32 rhs)
    /// Packed layout: [skip:1][cmp:1][pad:2][lhs:4][rhs:4]  → 12 bytes.
    /// The lhs slot starts at offset 4 — that's the TargetStartByte the
    /// Parameter substitution uses to inject the caller's X0_4 param.
    /// </summary>
    public const int SkipIfComparisonLhsOffset = 4;
    public const int SkipIfComparisonArgLen    = 12;

    public static EMEVD.Instruction SkipIfComparison(byte skip, sbyte cmp, int lhs, int rhs)
    {
        var instr = new EMEVD.Instruction(
            PatchConstants.BankControlFlowSystem,
            PatchConstants.IdSkipIfComparison,
            new object[] { skip, cmp, lhs, rhs });
        AssertSize(instr, SkipIfComparisonArgLen, "SkipIfComparison");
        return instr;
    }

    /// <summary>
    /// Set Event Flag (2003, 66)
    /// Args: (u8 flagType, u32 flagId, u8 flagState)
    /// Packed layout: [type:1][pad:3][flagId:4][state:1][pad:3]  → 12 bytes.
    /// </summary>
    public const int SetEventFlagArgLen = 12;

    public static EMEVD.Instruction SetEventFlagOn(uint flagId)
    {
        var instr = new EMEVD.Instruction(
            PatchConstants.BankEvent,
            PatchConstants.IdSetEventFlag,
            new object[] {
                PatchConstants.FlagTypeEventFlag,
                flagId,
                PatchConstants.FlagStateOn,
            });
        AssertSize(instr, SetEventFlagArgLen, "SetEventFlag");
        return instr;
    }

    /// <summary>
    /// End Unconditionally (1000, 4)
    /// Args: (u8 endType)
    /// Packed layout: [endType:1][pad:3]  → 4 bytes.
    /// </summary>
    public const int EndUnconditionallyArgLen = 4;

    public static EMEVD.Instruction EndUnconditionally()
    {
        var instr = new EMEVD.Instruction(
            PatchConstants.BankControlFlowSystem,
            PatchConstants.IdEndUnconditionally,
            new object[] { PatchConstants.EndTypeEnd });
        AssertSize(instr, EndUnconditionallyArgLen, "EndUnconditionally");
        return instr;
    }

    /// <summary>
    /// SKIP IF Event Flag (1003, 1)
    /// Args: (u8 skip, u8 flagState, u8 flagType, u32 flagId)
    /// Packed layout: [skip:1][state:1][type:1][pad:1][flagId:4]  → 8 bytes.
    /// </summary>
    public const int SkipIfEventFlagArgLen = 8;

    public static EMEVD.Instruction SkipIfEventFlag(byte skip, byte flagState, uint flagId)
    {
        var instr = new EMEVD.Instruction(
            PatchConstants.BankControlFlowEvent,
            PatchConstants.IdSkipIfEventFlag,
            new object[] {
                skip,
                flagState,
                PatchConstants.FlagTypeEventFlag,
                flagId,
            });
        AssertSize(instr, SkipIfEventFlagArgLen, "SkipIfEventFlag");
        return instr;
    }

    /// <summary>
    /// Set Event Flag (2003, 66) — OFF variant. Same opcode as
    /// <see cref="SetEventFlagOn"/> but with FlagState=OFF.
    /// </summary>
    public static EMEVD.Instruction SetEventFlagOff(uint flagId)
    {
        var instr = new EMEVD.Instruction(
            PatchConstants.BankEvent,
            PatchConstants.IdSetEventFlag,
            new object[] {
                PatchConstants.FlagTypeEventFlag,
                flagId,
                PatchConstants.FlagStateOff,
            });
        AssertSize(instr, SetEventFlagArgLen, "SetEventFlagOff");
        return instr;
    }

    /// <summary>
    /// Award Item Lot (2003, 4)
    /// Args: (i32 itemLotId)
    /// Packed layout: [itemLotId:4]  → 4 bytes.
    /// </summary>
    public const int AwardItemLotArgLen = 4;

    public static EMEVD.Instruction AwardItemLot(int itemLotId)
    {
        var instr = new EMEVD.Instruction(
            PatchConstants.BankEvent,
            PatchConstants.IdAwardItemLot,
            new object[] { itemLotId });
        AssertSize(instr, AwardItemLotArgLen, "AwardItemLot");
        return instr;
    }

    /// <summary>
    /// Remove Item From Player (2003, 24)
    /// Args: (u8 itemType, i32 itemId, i32 number)
    /// Packed layout: [type:1][pad:3][itemId:4][number:4]  → 12 bytes.
    /// number == -1 means "remove all" — the conventional wipe value.
    /// </summary>
    public const int RemoveItemFromPlayerArgLen = 12;

    public static EMEVD.Instruction RemoveItemFromPlayer(byte itemType, int itemId, int number)
    {
        var instr = new EMEVD.Instruction(
            PatchConstants.BankEvent,
            PatchConstants.IdRemoveItemFromPlayer,
            new object[] { itemType, itemId, number });
        AssertSize(instr, RemoveItemFromPlayerArgLen, "RemoveItemFromPlayer");
        return instr;
    }

    /// <summary>
    /// Initialize Common Event (2000, 6)
    /// Args: (i32 slot, u32 eventId, [u32 params...])
    /// Packed layout for no-arg target: [slot:4][eventId:4]  → 8 bytes.
    ///
    /// We always emit the no-arg form here — the events the tier-clear
    /// splicer wires up (90009941..949) take no parameters. If a future
    /// caller needs to forward args we'll add an overload then.
    /// </summary>
    public const int InitializeCommonEventNoArgsLen = 8;

    public static EMEVD.Instruction InitializeCommonEvent(int slot, uint targetEventId)
    {
        var instr = new EMEVD.Instruction(
            PatchConstants.BankSystem,
            PatchConstants.IdInitializeCommonEvent,
            new object[] { slot, targetEventId });
        AssertSize(instr, InitializeCommonEventNoArgsLen, "InitializeCommonEvent");
        return instr;
    }

    /// <summary>
    /// Initialize Event (2000, 0) — non-Common variant.
    /// Args: (i32 slot, u32 eventId, [u32 params...])
    /// Packed layout for no-arg target: [slot:4][eventId:4]  → 8 bytes.
    ///
    /// Used to wire a map-local event into the map's <c>$Event(0, Default,
    /// …)</c> constructor. The Roundtable care-package splicer appends an
    /// <c>InitializeEvent(0, 11105800)</c> here so the new event runs every
    /// time the map loads (with the one-shot guard flag inside the body
    /// gating actual execution to "first visit only").
    /// </summary>
    public const int InitializeEventNoArgsLen = 8;

    public static EMEVD.Instruction InitializeEvent(int slot, uint targetEventId)
    {
        var instr = new EMEVD.Instruction(
            PatchConstants.BankSystem,
            PatchConstants.IdInitializeEvent,
            new object[] { slot, targetEventId });
        AssertSize(instr, InitializeEventNoArgsLen, "InitializeEvent");
        return instr;
    }

    /// <summary>
    /// End If Event Flag (1003, 2). Args: (u8 endType, u8 flagState,
    /// u8 flagType, u32 flagId). Packed layout: [endType:1][state:1][type:1]
    /// [pad:1][flagId:4] → 8 bytes (same packing as
    /// <see cref="SkipIfEventFlag"/>, just with endType in the first byte
    /// instead of a skip count).
    /// </summary>
    public const int EndIfEventFlagArgLen = 8;

    /// <summary>
    /// Emit <c>EndIf(EventFlag(flagId))</c> — end the event when
    /// <paramref name="flagId"/> is currently ON. Hardcodes endType=END,
    /// flagState=ON, flagType=EventFlag, which is what 99% of guard usage
    /// in the source mod (and vanilla EMEVD) wants.
    /// </summary>
    public static EMEVD.Instruction EndIfEventFlagOn(uint flagId)
    {
        var instr = new EMEVD.Instruction(
            PatchConstants.BankControlFlowEvent,
            PatchConstants.IdEndIfEventFlag,
            new object[] {
                PatchConstants.EndTypeEnd,
                PatchConstants.FlagStateOn,
                PatchConstants.FlagTypeEventFlag,
                flagId,
            });
        AssertSize(instr, EndIfEventFlagArgLen, "EndIfEventFlagOn");
        return instr;
    }

    /// <summary>
    /// Emit <c>EndIf(ThisEventSlot())</c> — end the event when the current
    /// event slot has been marked completed (i.e. <see cref="SetThisEventSlotOn"/>
    /// was called in a prior run). The engine persists per-event-slot
    /// completion in save data, so this idiom dedups a one-shot event
    /// across save-loads without consuming a flag.
    ///
    /// Same opcode (1003/2) and ArgLen (8) as <see cref="EndIfEventFlagOn"/>;
    /// the only difference is <c>flagType=<see cref="PatchConstants.FlagTypeEventSlot"/></c>
    /// instead of <c>FlagTypeEventFlag</c>, and the flagId arg is unused
    /// (the slot identity is implicit — the current event's own slot).
    /// Decoded reference: m10_00 event 10000519 instruction [0].
    /// </summary>
    public static EMEVD.Instruction EndIfThisEventSlotOn()
    {
        var instr = new EMEVD.Instruction(
            PatchConstants.BankControlFlowEvent,
            PatchConstants.IdEndIfEventFlag,
            new object[] {
                PatchConstants.EndTypeEnd,
                PatchConstants.FlagStateOn,
                PatchConstants.FlagTypeEventSlot,
                (uint)0, // flagId unused for EventSlot type — identity is implicit
            });
        AssertSize(instr, EndIfEventFlagArgLen, "EndIfThisEventSlotOn");
        return instr;
    }

    /// <summary>
    /// Emit <c>SetThisEventSlot(ON)</c> — mark the current event slot as
    /// completed. Pairs with <see cref="EndIfThisEventSlotOn"/> at the top
    /// of the event body. Same opcode (2003/66) and ArgLen (12) as
    /// <see cref="SetEventFlagOn"/>, but with
    /// <c>flagType=<see cref="PatchConstants.FlagTypeEventSlot"/></c>
    /// (slot identity is implicit). Decoded reference: m10_00 event 10000519
    /// instruction [2].
    /// </summary>
    public static EMEVD.Instruction SetThisEventSlotOn()
    {
        var instr = new EMEVD.Instruction(
            PatchConstants.BankEvent,
            PatchConstants.IdSetEventFlag,
            new object[] {
                PatchConstants.FlagTypeEventSlot,
                (uint)0, // flagId unused for EventSlot type
                PatchConstants.FlagStateOn,
            });
        AssertSize(instr, SetEventFlagArgLen, "SetThisEventSlotOn");
        return instr;
    }

    /// <summary>
    /// Wait Fixed Time Seconds (1001, 0). Args: (f32 seconds).
    /// Packed layout: [seconds:4] → 4 bytes (single little-endian float).
    /// </summary>
    public const int WaitFixedTimeSecondsArgLen = 4;

    public static EMEVD.Instruction WaitFixedTimeSeconds(float seconds)
    {
        var instr = new EMEVD.Instruction(
            PatchConstants.BankWait,
            PatchConstants.IdWaitFixedTimeSeconds,
            new object[] { seconds });
        AssertSize(instr, WaitFixedTimeSecondsArgLen, "WaitFixedTimeSeconds");
        return instr;
    }

    /// <summary>
    /// Directly Give Player Item (2003, 43). Args:
    /// (u32 itemType, u32 itemId, u32 eventFlagId, u32 count).
    /// Packed layout: [type:4][id:4][flag:4][count:4] → 16 bytes.
    ///
    /// <para>
    /// <b>itemType</b> uses the EMEVD ItemType enum:
    /// 0=Weapon, 1=Protector (armor), 2=Accessory (talisman), 3=Goods.
    /// </para>
    /// <para>
    /// <b>eventFlagId</b> is a per-item dedup flag the engine reads/writes
    /// atomically: the give is skipped when the flag is ON and the engine
    /// sets it ON after a successful give. The Roundtable care-package
    /// splicer allocates 20 stride-1 flags (1049308318..1049308337) so each
    /// <c>DirectlyGivePlayerItem</c> in the chain has its own dedup slot —
    /// the outer event-level guard already prevents re-entry, but the per-
    /// item flag adds a second line of defence and matches the vanilla
    /// usage pattern.
    /// </para>
    /// </summary>
    public const int DirectlyGivePlayerItemArgLen = 16;

    public static EMEVD.Instruction DirectlyGivePlayerItem(
        uint itemType, uint itemId, uint eventFlagId, uint count)
    {
        var instr = new EMEVD.Instruction(
            PatchConstants.BankEvent,
            PatchConstants.IdDirectlyGivePlayerItem,
            new object[] { itemType, itemId, eventFlagId, count });
        AssertSize(instr, DirectlyGivePlayerItemArgLen, "DirectlyGivePlayerItem");
        return instr;
    }

    /// <summary>
    /// Builds a Parameter entry that forwards the current event's first arg
    /// (X0_4 = boss_flag) into a SkipIfComparison instruction's lhs slot.
    /// </summary>
    public static EMEVD.Parameter BossFlagParameter(int instructionIndex)
    {
        return new EMEVD.Parameter(
            instrIndex: instructionIndex,
            targetStartByte: SkipIfComparisonLhsOffset,
            srcStartByte: 0,
            byteCount: 4);
    }

    private static void AssertSize(EMEVD.Instruction instr, int expected, string name)
    {
        if (instr.ArgData.Length != expected)
        {
            throw new System.InvalidOperationException(
                $"{name} produced ArgData len {instr.ArgData.Length}, expected {expected}. "
                + "EMEVD padding rules may have drifted — patcher refuses to emit malformed bytecode.");
        }
    }
}
