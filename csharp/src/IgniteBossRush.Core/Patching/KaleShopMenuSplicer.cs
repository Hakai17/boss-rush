// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using System.Linq;
using IgniteBossRush.Core.Io;
using SoulsFormats;

namespace IgniteBossRush.Core.Patching;

/// <summary>
/// Adds nine tier-gated "Boss Rush Tier <i>N</i>" entries to the Ignite Rush
/// Arena Hub's progression-mode shop menu (<c>t314001110.esd</c> state group
/// <see cref="KaleMainMenuGroupId"/>, decompiled as <c>t314001110_x3</c>'s
/// progression-branch — the menu offering Upgrade Materials, Basic Weapons,
/// Unlocked Weapons, Armor, Spells, Ashes of War, Tools, Consumables, Ammo,
/// Crafting Materials, Gestures) so players can open the per-tier shops we
/// wrote into <c>ShopLineupParam</c> in rows <c>8000100..8000910</c>.
///
/// <para>
/// <b>Naming note.</b> The class is still called <c>KaleShopMenuSplicer</c>
/// for historical reasons — the original target was assumed to be Merchant
/// Kalé's <c>t600001110.esd</c>, which turned out to be Twin Maiden Husks
/// (wrong NPC entirely). The class should eventually be renamed
/// <c>ArenaShopMenuSplicer</c> but we're deferring that until the splice
/// is verified working in-game.
/// </para>
///
/// <para>
/// <b>Why splice rather than rewrite.</b> The stock menu already contains
/// twelve hard-coded category shops in state 7 (entry list + ShowShopMessage)
/// and state 8 (<c>GetTalkListEntryResult()</c> branch table). Rewriting the
/// group from scratch would invalidate cross-references across 41 states;
/// the splicer instead inserts nine entries into state 7 BEFORE the trailing
/// ShowShopMessage call, inserts nine new branch conditions in state 8
/// before the trailing always-true else, and adds nine new OpenRegularShop
/// states that route back to state 0 (the dispatcher) just like the stock
/// shop states (states 9..20) do.
/// </para>
///
/// <para>
/// <b>Tier gating.</b> Each new menu entry is an <c>AddTalkListDataIf</c>
/// whose condition is <c>GetEventFlag(ShopVisibilityFlagBase + tier) == 1</c>
/// — the exact same visibility flag range the regulation patch gates each
/// tier's 11 ShopLineupParam rows behind. So a tier that hasn't been cleared
/// yet has its row invisible in the shop UI AND its menu entry hidden —
/// belt and suspenders against "empty Kalé menu" or "unclearable tier"
/// regressions.
/// </para>
///
/// <para>
/// <b>Idempotency.</b> Re-running the splicer detects prior-run entries by
/// looking for menu indices in the reserved range
/// <see cref="MenuIndexBase"/>..<see cref="MenuIndexBase"/>+8 on state 2's
/// AddTalkListDataIf list; if found, the splicer bails out with a silent
/// no-op. That mirrors the patch-level idempotency of
/// <see cref="TierClearEventSplicer"/>. If you need to force a re-splice,
/// delete the relevant menu entries and rerun.
/// </para>
/// </summary>
public static class KaleShopMenuSplicer
{
    /// <summary>The state-group ID of the Arena Hub shop NPC's top-level menu
    /// (<c>t314001110.esd</c>, the "gear/cheat shop" NPC that exposes
    /// categories like Basic Weapons, Armor, Spells, Ashes of War, Gestures).
    /// Retargeted 2026-04-14 after confirming the previous target
    /// (<c>t600001110.esd</c> = Twin Maiden Husks) was the wrong NPC entirely.
    /// Group 2147483644 corresponds to <c>t314001110_x3()</c>, the dispatcher
    /// that routes to one of three menu branches (uninitialized/progression/
    /// sandbox) based on <c>GetEventFlag(1049300000)</c> and
    /// <c>GetEventFlag(1049300057)</c>.</summary>
    public const long KaleMainMenuGroupId = 2147483644L;

    /// <summary>State IDs in the progression-mode branch of the Arena Hub's
    /// top-level menu. Group 2147483644 layout (41 states total):
    ///   State 0: Flag dispatcher — routes to state 1 (uninit), 7 (progression),
    ///            or 22 (sandbox). Also the re-entry target after any shop
    ///            closes, so looping through state 0 re-builds the menu.
    ///   State 7: Progression-mode entry list. Monolithic EntryCommands:
    ///            ClearTalkActionState, bank=1 id=35, ClearTalkListData,
    ///            12 AddTalkListData* entries (slots 1..11, 12 conditional),
    ///            slot 99 "Leave" entry, then ShowShopMessage (bank=1 id=10).
    ///            We must INSERT new entries BEFORE the Leave entry. The
    ///            game's talk UI appears to treat Leave as a terminator —
    ///            entries positioned after Leave in the list parse cleanly
    ///            through inspect-esd but DO NOT render in-game.
    ///            Condition → state 8 with 39-byte menu-closed evaluator.
    ///   State 8: Branch table. 12 conditions `GetTalkListEntryResult()==N`
    ///            (N=1..12) targeting states 9..20, plus always-true else
    ///            (`41 a1`) → state 21 (terminal). New tier branches must be
    ///            inserted BEFORE the always-true else.
    ///   State 9: Template OpenRegularShop(7000800, 7000899) — the "upgrade
    ///            materials" shop. Its condition routes back to state 0 with
    ///            the 39-byte shop-closed evaluator. New tier shop states
    ///            clone state 9's structure verbatim with new shop row ranges.
    ///   State 0 is the loop-back target: on shop close, state 0's dispatcher
    ///   re-evaluates the flags and lands back in state 7 → menu rebuilt.</summary>
    public const long EntryListStateId = 7L;
    public const long BranchStateId    = 8L;
    public const long TemplateShopStateId = 9L;      // OpenRegularShop(7000800, 7000899) → state 0
    public const long BackToClearStateId  = 0L;      // Dispatcher; re-entry rebuilds the menu

    /// <summary>Command bank+id of <c>ShowShopMessage(1)</c>. Used as a
    /// fallback insertion anchor if no "Leave" entry is found in the list.</summary>
    private const int ShowShopMessageBank = 1;
    private const int ShowShopMessageId   = 10;

    /// <summary>Slot index for the "Leave" entry that conventionally closes
    /// every Ignite Rush talk menu. The game's talk-menu UI appears to stop
    /// rendering (or visually caps) at the Leave entry, so new tier entries
    /// MUST be inserted BEFORE Leave or they won't appear in-game even though
    /// the bytecode is valid and round-trips through inspect-esd.</summary>
    private const int LeaveSlot = 99;

    /// <summary>First menu-entry index we claim for tier menu entries.
    /// Must not collide with any of Kalé's stock indices (seen: 1..7, 99,
    /// plus the sub-menus' 60..69). 30..38 is a clean nine-slot run.</summary>
    public const int MenuIndexBase = 30;

    /// <summary>First state ID we add to the main menu group. Kalé's stock
    /// group uses 0..24; 100..108 keeps the new states far enough above the
    /// existing range that future source-mod updates are unlikely to
    /// collide.</summary>
    public const long NewStateIdBase = 100L;

    /// <summary>Placeholder text ID for the menu entries. Reusing the vanilla
    /// "Leave" string (20000009) until we plumb real FMG entries. Swap via
    /// <see cref="KaleShopMenuSplicerOptions.MenuTextId"/> once we have them.</summary>
    public const int PlaceholderMenuTextId = 20000009;

    /// <summary>Default FMG text IDs for per-tier menu labels. Claimed in a
    /// reserved 99999201..99999209 block that does NOT collide with any of the
    /// mod's existing 99999xxx rows (seen in t314001110.esd: 99999001..99999010,
    /// 99999025..99999028, 99999064, 99999127). The IgniteBossRush deploy
    /// checklist requires adding these nine rows to TalkMsg FMG via Smithbox
    /// with strings "Boss Rush — Tier 1" … "Boss Rush — Tier 9". Until those
    /// FMG rows exist in the mod, entries will render blank in-game (same
    /// failure mode as any other orphaned FMG reference — not a splicer bug).</summary>
    public static readonly int[] DefaultTierMenuTextIds =
    {
        99999201, 99999202, 99999203, 99999204, 99999205,
        99999206, 99999207, 99999208, 99999209,
    };

    /// <summary>
    /// Vanilla shop categories to strip from state 7's entry list before we
    /// splice the tier entries in. These are categories the Boss Rush mode
    /// doesn't want exposed at the top-level menu:
    ///   slot  2 — "Basic Weapons"         (text 99999028)
    ///   slot  3 — "Unlocked Weapons"      (text 99999027)
    ///   slot  4 — "Armor"                 (text 99999001)
    ///   slot  5 — "Spells"                (text 99999002)
    ///   slot  6 — "Ashes of War"          (text 99999005)
    ///   slot 11 — "Unlock all gestures"   (text 99999010)
    ///   slot 12 — conditional sub-menu    (text 99999064)
    /// Slots NOT in this set (1, 7, 8, 9, 10, 99 = Leave) are kept, giving
    /// the player: Upgrade Materials, Tools/Misc. Items, Consumables,
    /// Ammunition, Crafting Materials, Leave — plus the tier entries the
    /// splicer inserts. This matches the baseline menu the Boss Rush mode
    /// wants to expose.
    ///
    /// <para>We only strip entries from <c>state 7.EntryCommands</c>; the
    /// corresponding branches in state 8 are left intact but become
    /// unreachable (<c>GetTalkListEntryResult()</c> never returns a stripped
    /// slot number because the player can't pick a hidden entry). Leaving
    /// the branches avoids having to renumber anything and preserves the
    /// state-ID layout that <see cref="NewStateIdBase"/> and
    /// <see cref="MenuIndexBase"/> were chosen to steer clear of.</para>
    /// </summary>
    public static readonly int[] DefaultStrippedVanillaSlots = { 2, 3, 4, 5, 6, 11, 12 };

    /// <summary>Mutates <paramref name="esd"/> in place. Returns per-tier
    /// statistics; on idempotent re-runs returns with
    /// <see cref="KaleShopMenuSpliceResult.AlreadyPresent"/> set and the ESD
    /// untouched.</summary>
    public static KaleShopMenuSpliceResult Apply(ESD esd, KaleShopMenuSplicerOptions? options = null)
    {
        if (esd is null) throw new ArgumentNullException(nameof(esd));
        options ??= new KaleShopMenuSplicerOptions();

        if (!esd.StateGroups.TryGetValue(KaleMainMenuGroupId, out var group))
            throw new InvalidOperationException(
                $"Kalé menu group {KaleMainMenuGroupId} not found in ESD. "
                + "The source ESD does not match t314001110.esd.");

        if (!group.TryGetValue(EntryListStateId, out var entryState))
            throw new InvalidOperationException(
                $"State {EntryListStateId} (entry list) missing in menu group {KaleMainMenuGroupId}.");
        if (!group.TryGetValue(BranchStateId, out var branchState))
            throw new InvalidOperationException(
                $"State {BranchStateId} (branch table) missing in menu group {KaleMainMenuGroupId}.");
        if (!group.TryGetValue(TemplateShopStateId, out var templateShopState))
            throw new InvalidOperationException(
                $"State {TemplateShopStateId} (template OpenRegularShop state) missing in menu group {KaleMainMenuGroupId}.");

        // Idempotency: if any AddTalkListDataIf in state 2 already has an
        // index in our reserved range, assume a prior run already did this.
        if (AlreadyPresentIn(entryState))
        {
            return new KaleShopMenuSpliceResult(
                Inserted: false,
                AlreadyPresent: true,
                TierEntries: Array.Empty<PerTierEntry>());
        }

        // Strip the vanilla shop categories the Boss Rush menu doesn't want
        // exposed (Basic Weapons, Armor, Spells, Ashes of War, Unlock all
        // gestures, and the conditional slot-12 sub-menu). Must run BEFORE
        // the tier-entry insertion so the InsertBeforeLeave anchor scan is
        // working against the already-culled list. The stripped entries'
        // slot numbers are configurable via KaleShopMenuSplicerOptions but
        // default to the set documented on DefaultStrippedVanillaSlots.
        int[] stripSlots = options.StrippedVanillaSlots
                         ?? DefaultStrippedVanillaSlots;
        int strippedCount = StripVanillaSlots(entryState.EntryCommands, stripSlots);

        // Clone the template state's "menu closed → back to state 1"
        // condition evaluator verbatim rather than re-synthesize 39 bytes of
        // opcodes we don't fully understand. This is the critical safety
        // property — every new shop state routes back to state 1 using the
        // exact same predicate the existing shop state uses.
        byte[] menuClosedEvaluator = ExtractMenuClosedEvaluator(templateShopState);

        var entries = new List<PerTierEntry>(TierClearConstants.LastTier);
        for (int tier = TierClearConstants.FirstTier; tier <= TierClearConstants.LastTier; tier++)
        {
            int menuIndex = MenuIndexBase + (tier - TierClearConstants.FirstTier);
            long newStateId = NewStateIdBase + (tier - TierClearConstants.FirstTier);
            uint visibilityFlag = (uint)(TierClearConstants.ShopVisibilityFlagBase + tier);
            int shopStart = RegulationConstants.ShopLineupRowBase
                          + tier * RegulationConstants.ShopLineupTierStride;
            // ShopSlotsPerTier is the BASE count (7 fixed slots: stones +
            // weapons + tears). When a tier wins the 15% "lucky" roll,
            // ShopRollGenerator appends a Great Rune at slot index
            // ShopSlotsPerTier (row shopBase + 7). The scan range must cover
            // that optional slot too — otherwise the Great Rune row exists
            // in ShopLineupParam but Kalé never shows it. Tiers without a
            // Great Rune simply have no row at shopBase + 7, and
            // OpenRegularShop silently skips missing row IDs inside a range.
            int shopEnd   = shopStart + RegulationConstants.ShopSlotsPerTier;

            // ---- (1) Insert menu entry in state 7 EntryCommands,
            //          BEFORE the trailing slot-99 "Leave" entry. ----
            // All 9 tiers use the conditional form gated on their
            // ShopVisibilityFlagBase+tier flag. Tier 1's flag is flipped ON
            // from the mod's init event by Tier1VisibilityBootstrapSplicer
            // so its entry is effectively "always on from game start" without
            // the splicer needing an UNCONDITIONAL AddTalkListData special
            // case (the previous debug-bypass that displayed tier 1 as
            // "basic weapons" has been removed now that the bootstrap is
            // confirmed working).
            int textId = tier >= 1 && tier <= DefaultTierMenuTextIds.Length
                ? (options.TierMenuTextIds?[tier - 1] ?? DefaultTierMenuTextIds[tier - 1])
                : options.MenuTextId;
            byte[] cond = EsdBytecode.GetEventFlagEquals1Evaluator(visibilityFlag);
            var newEntryCmd = EsdBytecode.AddTalkListDataIf(
                cond,
                index: menuIndex,
                textId: textId,
                reqId: -1);
            InsertBeforeLeave(entryState.EntryCommands, newEntryCmd);

            // ---- (2) Insert branch condition in state 4, before the
            //          trailing always-true else. The else must remain last. ----
            InsertBranchCondition(branchState, menuIndex, newStateId);

            // ---- (3) Add new state that opens the per-tier shop ----
            // OpenPuppetShop (bank=1 id=144) — purchases cost Starlight
            // Shards instead of runes ("for N Starlight Shards" purchase
            // confirm text). Byte-for-byte modelled on Athena Randomizer's
            // Moonwalk Starlight Shop state 4 (t460006100.esd).
            //
            // IMPORTANT — no ShowShopMessage(1) prefix, and the exit
            // condition evaluator is puppet-shop-flavoured (NOT cloned
            // from the regular-shop template). The earlier attempt that
            // reused the regular-shop menu-closed evaluator made the
            // state auto-exit on the first tick because the regular-shop
            // menu was never open (a puppet shop was), so the exit
            // predicate evaluated true immediately → silent no-op. The
            // new evaluator checks for CheckSpecificPersonMenuIsOpen(28, 0)
            // where 28 is the ER-native puppet-shop menu-type id.
            var newState = new ESD.State
            {
                EntryCommands = new List<ESD.CommandCall>
                {
                    EsdBytecode.OpenPuppetShop(shopStart, shopEnd),
                },
                ExitCommands = new List<ESD.CommandCall>(),
                WhileCommands = new List<ESD.CommandCall>(),
                Conditions = new List<ESD.Condition>
                {
                    new ESD.Condition(
                        targetState: BackToClearStateId,
                        evaluator: EsdBytecode.CloneBytes(EsdBytecode.PuppetShopMenuClosedEvaluator)),
                },
            };
            group[newStateId] = newState;

            entries.Add(new PerTierEntry(tier, menuIndex, newStateId, visibilityFlag, shopStart, shopEnd));
        }

        return new KaleShopMenuSpliceResult(
            Inserted: true,
            AlreadyPresent: false,
            TierEntries: entries);
    }

    // ------------------------------------------------------------------
    // Private helpers
    // ------------------------------------------------------------------

    private static bool AlreadyPresentIn(ESD.State entryState)
    {
        // AddTalkListData (bank=1 id=19 args=3): arg[0] is the i32 menu index.
        // AddTalkListDataIf (bank=5 id=19 args=4): arg[1] is the i32 menu index.
        // Both encode the i32 push as "82 <LE32> a1" (6 bytes).
        foreach (var cmd in entryState.EntryCommands)
        {
            if (cmd.CommandID != 19) continue;
            int indexArgPos;
            if (cmd.CommandBank == 1) indexArgPos = 0;
            else if (cmd.CommandBank == 5) indexArgPos = 1;
            else continue;

            if (cmd.Arguments is null || cmd.Arguments.Count <= indexArgPos) continue;
            var arg = cmd.Arguments[indexArgPos];
            if (arg is null || arg.Length != 6) continue;
            if (arg[0] != 0x82 || arg[5] != EsdBytecode.End) continue;
            int idx = arg[1] | (arg[2] << 8) | (arg[3] << 16) | (arg[4] << 24);
            if (idx >= MenuIndexBase && idx < MenuIndexBase + TierClearConstants.LastTier)
                return true;
        }
        return false;
    }

    /// <summary>Insert <paramref name="newCmd"/> before the "Leave" entry
    /// in <paramref name="entryCommands"/>. The Leave entry is conventionally
    /// the LAST AddTalkListData call in every Ignite Rush menu and the game's
    /// talk UI treats it as the terminator — entries positioned after Leave
    /// are not rendered even though the ESD parses them cleanly. Falls back
    /// to insert-before-ShowShopMessage, then append, if no Leave is found.
    /// <para>Leave is identified by its slot index (arg[0] for bank=1 id=19,
    /// arg[1] for bank=5 id=19) being <see cref="LeaveSlot"/> (99). That's
    /// more robust than matching the text ID since different branches use
    /// different Leave strings (20000009 vs 26000004).</para></summary>
    private static void InsertBeforeLeave(List<ESD.CommandCall> entryCommands, ESD.CommandCall newCmd)
    {
        for (int i = 0; i < entryCommands.Count; i++)
        {
            if (IsLeaveEntry(entryCommands[i]))
            {
                entryCommands.Insert(i, newCmd);
                return;
            }
        }
        // Fallback: insert before ShowShopMessage.
        for (int i = 0; i < entryCommands.Count; i++)
        {
            var c = entryCommands[i];
            if (c.CommandBank == ShowShopMessageBank && c.CommandID == ShowShopMessageId)
            {
                entryCommands.Insert(i, newCmd);
                return;
            }
        }
        entryCommands.Add(newCmd);
    }

    /// <summary>Remove every AddTalkListData* entry whose slot index is in
    /// <paramref name="stripSlots"/>. Returns the number of commands removed.
    /// Leaves non-entry commands (ClearTalkListData, ShowShopMessage, etc.)
    /// alone, so the surrounding setup/teardown sequence is preserved.
    /// Safe when <paramref name="stripSlots"/> is empty (no-op).</summary>
    internal static int StripVanillaSlots(List<ESD.CommandCall> entryCommands, int[] stripSlots)
    {
        if (stripSlots is null || stripSlots.Length == 0) return 0;
        var stripSet = new HashSet<int>(stripSlots);
        int removed = 0;
        for (int i = entryCommands.Count - 1; i >= 0; i--)
        {
            int? slot = TryReadSlotIndex(entryCommands[i]);
            if (slot is int s && stripSet.Contains(s))
            {
                entryCommands.RemoveAt(i);
                removed++;
            }
        }
        return removed;
    }

    /// <summary>Returns the slot index of an AddTalkListData(-If) call, or
    /// null if <paramref name="cmd"/> isn't one of those / the arg isn't in
    /// the expected 6-byte literal-push shape.</summary>
    private static int? TryReadSlotIndex(ESD.CommandCall cmd)
    {
        if (cmd.CommandID != 19) return null;
        int slotArgPos;
        if (cmd.CommandBank == 1) slotArgPos = 0;
        else if (cmd.CommandBank == 5) slotArgPos = 1;
        else return null;
        if (cmd.Arguments is null || cmd.Arguments.Count <= slotArgPos) return null;
        var arg = cmd.Arguments[slotArgPos];
        if (arg is null || arg.Length != 6) return null;
        if (arg[0] != 0x82 || arg[5] != EsdBytecode.End) return null;
        return arg[1] | (arg[2] << 8) | (arg[3] << 16) | (arg[4] << 24);
    }

    /// <summary>True if <paramref name="cmd"/> is an AddTalkListData* call
    /// whose slot index equals <see cref="LeaveSlot"/>.</summary>
    private static bool IsLeaveEntry(ESD.CommandCall cmd)
        => TryReadSlotIndex(cmd) is int slot && slot == LeaveSlot;

    private static byte[] ExtractMenuClosedEvaluator(ESD.State templateShopState)
    {
        // Template (Kalé's state 9) has a single condition whose evaluator
        // is the 39-byte "shop message was closed" predicate; it targets
        // state 1. We copy that evaluator verbatim for our new states.
        if (templateShopState.Conditions.Count == 0)
            throw new InvalidOperationException(
                $"Template state {TemplateShopStateId} has no conditions — cannot extract menu-closed evaluator.");
        var firstCond = templateShopState.Conditions[0];
        if (firstCond.Evaluator is null || firstCond.Evaluator.Length == 0)
            throw new InvalidOperationException(
                $"Template state {TemplateShopStateId} first condition has empty evaluator.");
        return EsdBytecode.CloneBytes(firstCond.Evaluator);
    }

    private static void InsertBranchCondition(ESD.State branchState, int menuIndex, long targetState)
    {
        // The branch state's conditions end with an "always-true" else
        // condition (evaluator `41 a1`). New conditions must be inserted
        // BEFORE the else, otherwise they're unreachable. If for some reason
        // the else isn't present (unexpected layout), we still append and
        // let the caller notice in-game.
        int insertAt = branchState.Conditions.Count;
        for (int i = 0; i < branchState.Conditions.Count; i++)
        {
            var e = branchState.Conditions[i].Evaluator;
            if (IsAlwaysTrueEvaluator(e))
            {
                insertAt = i;
                break;
            }
        }

        var newCond = new ESD.Condition(
            targetState: targetState,
            evaluator: EsdBytecode.GetTalkListEntryResultEqualsEvaluator(menuIndex));
        branchState.Conditions.Insert(insertAt, newCond);
    }

    private static bool IsAlwaysTrueEvaluator(byte[]? bytes)
        => bytes is { Length: 2 } && bytes[0] == 0x41 && bytes[1] == EsdBytecode.End;
}

// =======================================================================
// Options + result types
// =======================================================================
public sealed class KaleShopMenuSplicerOptions
{
    /// <summary>Legacy single-text-ID fallback. Used when
    /// <see cref="TierMenuTextIds"/> is null or a tier is out of range. Kept
    /// for API back-compat with older callers that only want one shared label
    /// across all 9 tiers.</summary>
    public int MenuTextId { get; init; } = KaleShopMenuSplicer.PlaceholderMenuTextId;

    /// <summary>Per-tier FMG text IDs (length 9). Index 0 = Tier 1. When null
    /// the splicer uses <see cref="KaleShopMenuSplicer.DefaultTierMenuTextIds"/>
    /// (the 99999201..99999209 reserved block — requires the matching FMG rows
    /// to be added to the mod's TalkMsg bnd via Smithbox before the labels
    /// render in-game).</summary>
    public int[]? TierMenuTextIds { get; init; }

    /// <summary>Vanilla slot indices to strip from state 7's entry list before
    /// the tier entries are spliced. When null the splicer uses
    /// <see cref="KaleShopMenuSplicer.DefaultStrippedVanillaSlots"/>, which
    /// culls Basic Weapons / Unlocked Weapons / Armor / Spells / Ashes of War
    /// / Unlock all gestures / slot-12 — leaving Upgrade Materials, Tools/Misc.
    /// Items, Consumables, Ammunition, Crafting Materials, Leave.
    /// Pass an empty array to disable culling entirely (keeps every vanilla
    /// category visible alongside the tier entries).</summary>
    public int[]? StrippedVanillaSlots { get; init; }
}

public sealed record KaleShopMenuSpliceResult(
    bool Inserted,
    bool AlreadyPresent,
    IReadOnlyList<PerTierEntry> TierEntries);

public sealed record PerTierEntry(
    int Tier,
    int MenuIndex,
    long NewStateId,
    uint VisibilityFlag,
    int ShopStartRow,
    int ShopEndRow);
