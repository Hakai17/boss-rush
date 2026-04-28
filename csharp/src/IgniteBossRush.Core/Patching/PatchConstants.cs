// SPDX-License-Identifier: GPL-3.0-only
using System.Collections.Generic;

namespace IgniteBossRush.Core.Patching;

/// <summary>
/// Numeric EMEVD opcodes + flag IDs that the patcher uses. All values are
/// cross-referenced to <c>emedf/er-common.emedf.json</c> (EMEDF bank.id) and
/// to the mod's own <c>common_func.emevd.dcx.js</c> source (flag IDs).
///
/// Changing any value here without updating the EMEDF is a recipe for
/// crashes at game-load time; this is the single point of definition.
/// </summary>
public static class PatchConstants
{
    // ------------------------------------------------------------------
    // EMEVD instruction opcodes (bank, id)
    // ------------------------------------------------------------------
    //
    // Verified against emedf/er-common.emedf.json:
    //   bank 1000 id  3  "SKIP Unconditionally"            args: u8 skip
    //   bank 1000 id  4  "END Unconditionally"             args: u8 endType
    //   bank 1000 id  5  "SKIP IF Comparison"              args: u8 skip, i8 cmpType, i32 lhs, i32 rhs
    //   bank 1003 id  0  "WAIT For Event Flag"             args: u8 flagState, u8 flagType, u32 flagId
    //   bank 1003 id  1  "SKIP IF Event Flag"              args: u8 skip, u8 flagState, u8 flagType, u32 flagId
    //   bank 2000 id  6  "Initialize Common Event"         args: i32 slot, u32 eventId, (variadic u32 params…)
    //   bank 2000 id  0  "Initialize Event"                args: i32 slot, u32 eventId, (variadic u32 params…)
    //   bank 2003 id 66  "Set Event Flag"                  args: u8 flagType, u32 flagId, u8 flagState
    //
    public const int BankControlFlowSystem = 1000;
    public const int BankWait              = 1001;
    public const int BankControlFlowEvent  = 1003;
    public const int BankControlFlowLabel  = 1014;
    public const int BankSystem            = 2000;
    public const int BankEvent             = 2003;

    /// <summary>
    /// Label-based unconditional goto (bank 1000, id 103; EMEDF
    /// "GOTO Unconditionally"). Arg: (u32 labelId). Unlike
    /// <see cref="IdSkipUnconditionally"/> (which uses a relative count),
    /// Goto targets a LABEL instruction defined elsewhere in the event —
    /// inserting new instructions between a Goto and its label does NOT
    /// shift the resolved target, so <see cref="SpliceHelpers.AdjustPrecedingSkipCounts"/>
    /// cannot correct for it. The splicer handles this by moving the
    /// insertion point to <i>before</i> an unconditional Goto that
    /// precedes the splice anchor — see <see cref="TierClearEventSplicer"/>.
    /// </summary>
    public const int IdGotoUnconditionally = 103;

    /// <summary>
    /// Label-marker instruction (bank 1014, id 0..N; EMEDF "Label 0",
    /// "Label 1", …). Zero-arg opcode that acts as a jump target for
    /// Goto / GotoIf instructions. The splicer looks for Label 0
    /// immediately preceding the splice anchor as the tell-tale that a
    /// Goto jumps INTO the anchor region — see
    /// <see cref="TierClearEventSplicer"/>.
    /// </summary>
    public const int IdLabel0 = 0;

    public const int IdSkipUnconditionally = 3;
    public const int IdEndUnconditionally  = 4;
    public const int IdSkipIfComparison    = 5;

    public const int IdWaitForEventFlag    = 0;
    public const int IdSkipIfEventFlag     = 1;
    /// <summary>End If Event Flag (1003, 2). Args: (u8 endType, u8 flagState,
    /// u8 flagType, u32 flagId). Same 8-byte packing as
    /// <see cref="IdSkipIfEventFlag"/> but with an endType prefix instead of
    /// a skip count. Decoded from event 10002670 of m10_00_00_00.emevd:
    /// <c>EndIf(EventFlag(eventFlagId))</c> compiles to bytes
    /// <c>00 01 00 00 00 00 00 00</c> (END=0, ON=1, EventFlag=0, flagId=0
    /// param-substituted). Used by <see cref="InstructionFactory.EndIfEventFlagOn"/>
    /// to short-circuit the Roundtable care-package event when its
    /// one-shot guard flag is already ON.</summary>
    public const int IdEndIfEventFlag      = 2;

    /// <summary>Wait Fixed Time Seconds (1001, 0). Args: (f32 seconds).
    /// Argument is a single 4-byte little-endian float. Used by
    /// <see cref="InstructionFactory.WaitFixedTimeSeconds"/> to give the
    /// engine a beat after a Roundtable load before the
    /// <c>DirectlyGivePlayerItem</c> chain fires (mirrors the vanilla
    /// pattern in 10002670 / 10002671 tutorial popups).</summary>
    public const int IdWaitFixedTimeSeconds = 0;

    public const int IdInitializeEvent       = 0;
    public const int IdInitializeCommonEvent = 6;

    public const int IdSetEventFlag         = 66;
    public const int IdAwardItemLot         = 4;
    public const int IdRemoveItemFromPlayer = 24;

    /// <summary>Directly Give Player Item (2003, 43). Args:
    /// (u32 itemType, u32 itemId, u32 eventFlagId, u32 count) — 16 bytes,
    /// no padding since every arg is a u32. Decoded from event 10002670 of
    /// m10_00_00_00.emevd where <c>DirectlyGivePlayerItem(ItemType.Goods,
    /// 9101, eventFlagId, 1)</c> compiles to bytes
    /// <c>03 00 00 00 8d 23 00 00 00 00 00 00 01 00 00 00</c>.
    /// The third arg is a per-item dedup flag — the engine sets it ON when
    /// the item is given and refuses subsequent gives if it's already ON.
    /// Used by the Roundtable care-package event to grant 20 armor pieces
    /// in one shot.</summary>
    public const int IdDirectlyGivePlayerItem = 43;

    /// <summary>
    /// Batch Set Event Flags (2003, 22). Args: (u32 startId, u32 endId, u8 state).
    /// Verified against emedf/er-common.emedf.json (bank 2003 instr 22).
    /// Used by the tier-1 visibility bootstrap splicer to locate the call
    /// <c>BatchSetEventFlags(1049308400, 1049308999, OFF)</c> in event 10010001
    /// and splice a <c>SetEventFlagID(1049308401, ON)</c> immediately after it.
    /// </summary>
    public const int IdBatchSetEventFlags   = 22;

    // ------------------------------------------------------------------
    // Enum values we embed into arg blobs
    // ------------------------------------------------------------------
    public const byte FlagStateOn        = 1;  // "ON" / "Desired state = on"
    public const byte FlagStateOff       = 0;  // "OFF" / "Desired state = off"
    public const byte FlagTypeEventFlag  = 0;  // "Event Flag" (as opposed to "Event Value" / "World Flag")

    /// <summary>
    /// "Event slot completion" flag type — used by the
    /// <c>EndIf(ThisEventSlot())</c> / <c>SetThisEventSlot(ON)</c> idiom.
    /// Same opcodes as the regular event-flag check/set (1003/2 and 2003/66)
    /// but the engine reads/writes per-event-slot state in save data instead
    /// of the global event-flag table. Lets us implement "fire once per save,
    /// ever" without consuming a flag from the 1049308xxx plateau. Decoded
    /// from m10_00 event 10000519 (Elevator initial flag setting), which
    /// uses the pattern verbatim.
    /// </summary>
    public const byte FlagTypeEventSlot  = 2;

    // Item Type enum used by RemoveItemFromPlayer / AwardItem / DirectlyGivePlayerItem
    // (EMEDF "Item Type"):
    //   0 = Weapon, 1 = Armor (the param table is named EquipParamProtector but
    //   the EMEDF / DarkScript decompiler exposes the enum as "Armor"),
    //   2 = Ring (Talisman), 3 = Goods.
    public const byte ItemTypeWeapon     = 0;
    public const byte ItemTypeArmor      = 1;
    public const byte ItemTypeAccessory  = 2;
    public const byte ItemTypeGoods      = 3;
    // RemoveItemFromPlayer "Number" field: EMEDF schema declares min=0, max=999
    // for this arg. DarkScript convention says -1 is the "remove all" sentinel,
    // but the ER engine has been observed to clamp out-of-bounds values,
    // silently turning the wipe into a no-op (shards from prior tier clears
    // then carry forward to the next tier). 999 is the EMEDF ceiling and more
    // than any realistic Amber Shard count — functionally equivalent to
    // "remove all" while staying inside the sanctioned range.
    public const int  RemoveItemAllCount = 999;

    // Comparison types used by "SKIP IF Comparison" (1000[5]). These mirror ER's
    // canonical comparison enum, verified against the emedf CompareOp table.
    public const sbyte CmpEqual          = 0;
    public const sbyte CmpNotEqual       = 1;
    public const sbyte CmpGreater        = 2;
    public const sbyte CmpLess           = 3;
    public const sbyte CmpGreaterEqual   = 4;
    public const sbyte CmpLessEqual      = 5;

    public const byte EndTypeEnd         = 0;  // "End"

    // ------------------------------------------------------------------
    // Reward events the patcher rebuilds
    // ------------------------------------------------------------------
    public static readonly IReadOnlyList<long> RewardEvents = new long[]
    {
        90001032, 90001033, 90001034, 90001035, 90001036,
        90001042, 90001043, 90001044, 90001045, 90001046,
        90001080,
    };

    /// <summary>Event ID the patcher flattens to an empty (no-op) body.</summary>
    public const long CraftingDispatcherEventId = 90001003;

    /// <summary>Flag the original mod uses to signal "RNG roll completed".</summary>
    public const uint SyncDoneFlag = 1049302620;

    // ------------------------------------------------------------------
    // Stone-slot indices per reward event (matches Python STONE_SLOT_INDICES)
    // ------------------------------------------------------------------
    // Index semantics: raw_args[0] = boss_flag (X0); subsequent indices follow
    // the schema documented in boss_catalog.json.
    public static readonly IReadOnlyDictionary<int, int[]> StoneSlotIndices =
        new Dictionary<int, int[]>
        {
            [90001032] = new[] { 1, 2, 3 },
            [90001033] = new[] { 1, 2, 3 },
            [90001034] = new[] { 1, 2, 3 },
            [90001035] = new[] { 1, 2, 3 },
            [90001036] = new[] { 1 },       // only X4 tool slot
            [90001080] = new[] { 1, 2, 3 },
            [90001042] = new[] { 1, 2 },    // DLC: X4, X8 tool slots only
            [90001043] = new[] { 1, 2 },
            [90001044] = new[] { 1, 2 },
            [90001045] = new[] { 1, 2 },
            [90001046] = new[] { 1, 2 },
        };
}
