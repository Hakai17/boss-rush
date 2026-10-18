// SPDX-License-Identifier: GPL-3.0-only
namespace BossRush.Core.Patching;

/// <summary>
/// Numeric IDs and conventions specific to the Boss Rush shop's tier-clear
/// EMEVD splice (Step 6). All values are owned by BossRush — they are
/// NOT part of Boss Rush Alpha's base mod and must not collide with anything
/// the base mod uses.
///
/// Single point of definition shared by:
///   * <see cref="TierClearEventBuilder"/> — emits the per-tier events.
///   * <see cref="TierClearEventSplicer"/> — wires the trigger into 90009931..939.
///   * The Step 7 regulation.bin patcher — must allocate ItemLot rows in the
///     <c>ShardAwardItemLotBase + tier</c> range and a Goods row for
///     <c>AmberShardGoodsId</c>.
///
/// Cross-references:
///   * <c>common_func.emevd.dcx.js</c> defines the per-tier "find next undefeated
///     boss" events 90009931..940 and the end-of-run handler 90009921 that
///     warps the player back to Roundtable.
///   * <c>step5-generator</c> writes <c>tier_rewards.json</c> with
///     <c>shop_visibility_flag</c>, <c>shard_award_event_flag</c>, etc. — those
///     flag IDs come from <see cref="Generation.ShopRollGenerator"/> and are
///     re-derived here from the same bases for splice-time consistency checks.
/// </summary>
public static class TierClearConstants
{
    /// <summary>1..9 — the locked spec is exactly nine tiers.</summary>
    public const int FirstTier = 1;
    public const int LastTier  = 9;

    /// <summary>Existing per-tier "find next undefeated boss" events in the mod.
    /// Tier N event ID = <see cref="ExistingTierEventBase"/> + N
    /// (so 90009931..90009939 for tiers 1..9). The splicer hooks into the
    /// "no undefeated bosses left" else-branch of each.
    ///
    /// <para>
    /// <b>Note:</b> the source mod also defines tier-detector events at
    /// 90009940..90009946 (tier 10, tier 11, DLC tiers 1..5) which we
    /// deliberately ignore — BossRush is a 9-tier-only spec. Those IDs
    /// are <i>not</i> safe for our own events; see <see cref="OnTierClearEventBase"/>.
    /// </para></summary>
    public const int ExistingTierEventBase = 90009930;

    /// <summary>Base ID for the mod's Boss Rush / all-bosses dispatcher events
    /// (90009951..90009959 for tiers 1..9). These are the "refight everything"
    /// counterparts to the undefeated dispatchers at 90009931..90009939 and use
    /// the same <c>InitializeCommonEvent(0, 90009921)</c> warp anchor in their
    /// "no bosses left" else-branch. The splicer treats these as <b>optional</b>
    /// parents: if a 90009951+tier event is present, the OnTierClear trigger
    /// is also spliced into it so Boss Rush mode awards Amber Shards + progresses
    /// the shop the same way Undefeated mode does. If the Boss Rush parent is
    /// absent (e.g. unit-test fakes that only populate the undefeated range),
    /// the splicer silently skips rather than throwing.</summary>
    public const int BossRushTierEventBase = 90009950;

    /// <summary>The mod's existing "warp back to Roundtable" handler. We use
    /// its <c>InitializeCommonEvent(0, 90009921)</c> call inside each per-tier
    /// event as the splice anchor (it appears exactly once per tier event,
    /// inside the all-defeated else-branch).</summary>
    public const uint EndOfTierAnchorEventId = 90009921;

    /// <summary>New per-tier OnTierClear events emitted by the patcher.
    /// Tier N's event ID = <see cref="OnTierClearEventBase"/> + N
    /// (so 90009991..90009999 for tiers 1..9).
    ///
    /// <para>
    /// <b>Why 90009990 and not 90009940?</b> The Boss Rush source mod's
    /// <c>common_func.emevd.dcx</c> already defines events at
    /// <c>90009940..90009946</c> (tier 10 + tier 11 + DLC tiers 1..5
    /// boss-detector events). Picking <c>OnTierClearEventBase = 90009940</c>
    /// would cause six of nine OnTierClear IDs to collide with those existing
    /// detectors, which would be catastrophic in two ways: the splicer would
    /// silently skip our new events (and the trigger we insert into 90009931's
    /// else-branch would re-fire the DLC tier 11 boss spawner instead of our
    /// reward handler). The <c>90009991..90009999</c> range is the only
    /// contiguous 9-slot gap the source mod leaves free in the
    /// <c>9000_99xx</c> block — base = 90009990 itself is occupied by one
    /// existing event but we never insert at base+0; only base+1..base+9.
    /// </para>
    /// </summary>
    public const int OnTierClearEventBase = 90009990;

    /// <summary>Inside the OnTierClear body we forward zero parameters to no
    /// other event, so we always pass slot=0 to InitializeCommonEvent. Hoisted
    /// to a constant so the splicer and tests reference the same value.</summary>
    public const int InitializeSlotZero = 0;

    // ------------------------------------------------------------------
    // Flag bases — must match Generation.ShopRollGenerator's private bases.
    // ------------------------------------------------------------------
    // Re-stating the bases here (rather than reaching into ShopRollGenerator's
    // internals) is intentional: ShopRollGenerator owns the JSON contract;
    // the patcher owns the EMEVD contract; both happen to reference the same
    // numeric ranges. A future refactor could collapse them into a shared
    // <c>FlagPlanConstants</c> module — for now the duplication is in service
    // of layer separation.
    public const int TierFlagBase            = 1049308300; // tier_flag        = base + tier
    public const int ShopVisibilityFlagBase  = 1049308400; // shop_visibility  = base + tier
    // ShardAward one-shot guard MUST live OUTSIDE EVERY BatchSetEventFlags
    // reset window in the mod AND must not collide with any flag the mod uses
    // as a first-class signal. Picking a "safe" slot is harder than it looks —
    // the mod has multiple reset windows and uses individual flags throughout
    // the 1049308xxx plateau for its own bookkeeping. History of wrong picks:
    //
    //   * 1049308500..509 (inside 1049308400..999, wiped by init event 10010001
    //     on every save/area load) — observed 10 shards per tier clear (guard
    //     never held, 2 fires × 5).
    //   * 1049308200..209 (inside 1049308000..219, wiped by event 90009800 on
    //     EVERY boss warp) — AND, worse, 1049308200 / 1049308201 are themselves
    //     "current boss is X" flags the mod toggles as bookkeeping in 90009800
    //     (see common_func.emevd lines 4989, 5029, 5814, 5816, 6669). Observed
    //     75 shards per tier clear (guard state was random noise driven by the
    //     mod; 15 fires × 5 landed OFF).
    //
    // 1049308220..229 is the first clean 10-slot gap: it sits BETWEEN the two
    // 1049308xxx batch resets (1049308000..219 and 1049308250..275), is NOT
    // itself batch-reset, and grep across common_func.emevd.dcx.js returns
    // zero hits anywhere. If you ever need to move this again, re-grep both
    // common_func AND every BatchSetEventFlags range before committing.
    public const int ShardAwardEventFlagBase = 1049308220; // shard_award_one_shot = base + tier

    /// <summary>
    /// Mod-owned "tier N cleared" flag base. The Boss Rush source mod's
    /// m11_10 (Roundtable Hold) EMEVD contains per-tier completion events
    /// 11107716 / 11107737..11107744 (see <see cref="TierCompletionEventIds"/>)
    /// that latch these flags OFF→ON <b>exactly once</b> per genuine tier-N
    /// clear. Flag(N) = <see cref="TierClearedFlagBase"/> + N, so
    /// 1049300006..1049300014 for tiers 1..9.
    ///
    /// <para>
    /// The patcher doesn't write these flags itself — the mod's own
    /// completion event does, gated by an <c>EndIf(EventFlag(flag) &amp;&amp; ...)</c>
    /// latch at the top of each. We piggy-back on that one-shot by splicing
    /// an <c>InitializeCommonEvent(0, 90009990+N)</c> immediately AFTER the
    /// <c>SetEventFlagID(flag(N), ON)</c> call, so our OnTierClear body
    /// runs exactly once per tier-N clear and needs no tier-exclusive gate
    /// of its own.
    /// </para>
    ///
    /// <para>
    /// This replaces the earlier seal-flag workaround (1049308230..239),
    /// which we owned end-to-end because we were hooking into 90009921 —
    /// a shared warp-back handler that fires ~20× per warp sequence and
    /// from many non-tier-clear paths. The Roundtable completion events
    /// fire exactly once per genuine clear and are the natural hook.
    /// </para>
    /// </summary>
    public const int TierClearedFlagBase = 1049300005; // flag = base + tier

    /// <summary>
    /// Source-mod event IDs of the per-tier "check if tier N is done"
    /// completion events defined in <c>m11_10_00_00.emevd.dcx</c>. These
    /// are Roundtable Hold (map 11_10) events, NOT <c>common_func</c>.
    ///
    /// <para>
    /// Each event has the shape:
    /// <code>
    /// $Event(id, Default, function() {
    ///   EndIf(!EventFlag(1049300057));              // progression-mode gate
    ///   EndIf(EventFlag(clearedFlag) &amp;&amp; EventFlag(...)); // one-shot latch
    ///   if (EventFlag(m1...) &amp;&amp; EventFlag(m2...) ...) {
    ///       SetEventFlagID(clearedFlag, ON);        // ← splice after this
    ///   }
    ///   if (...) { SetEventFlagID(otherFlag, ON); }
    /// });
    /// </code>
    /// <see cref="TierCompletionTriggerSplicer"/> inserts
    /// <c>InitializeCommonEvent(0, OnTierClearEventBase + N)</c> immediately
    /// after the tier's <c>SetEventFlagID(clearedFlag, ON)</c>.
    /// </para>
    ///
    /// <para>
    /// IDs are not a simple base+N sequence: tier 1 is 11107716 (followed
    /// by 11107717 which handles something unrelated), then tiers 2..9 run
    /// contiguously at 11107737..11107744. Dictionary is read-only and
    /// frozen at load.
    /// </para>
    /// </summary>
    public static readonly System.Collections.Generic.IReadOnlyDictionary<int, long>
        TierCompletionEventIds = new System.Collections.Generic.Dictionary<int, long>
        {
            [1] = 11107716,
            [2] = 11107737,
            [3] = 11107738,
            [4] = 11107739,
            [5] = 11107740,
            [6] = 11107741,
            [7] = 11107742,
            [8] = 11107743,
            [9] = 11107744,
        };

    /// <summary>
    /// Base for the source mod's per-tier "unlock banner" latch flags. Each
    /// unlock event in <see cref="TierUnlockEventIds"/> (11107705..11107711,
    /// 11107701 — one per tier 2..9) guards its body with
    /// <c>EndIf(EventFlag(latch))</c> and ends with <c>SetEventFlagID(latch, ON)</c>.
    /// latch(N) = <see cref="TierUnlockLatchFlagBase"/> + N for N in 2..9,
    /// so 1049304315..1049304322.
    ///
    /// <para>
    /// <see cref="TierUnlockVisibilitySplicer"/> piggy-backs on that one-shot
    /// by splicing a shop-visibility flip (<c>vis(N-1) OFF</c>, <c>vis(N) ON</c>)
    /// immediately after each unlock event's <c>SetEventFlagID(latch, ON)</c>.
    /// Because the unlock event has a single-boss-marker gate ("last boss of
    /// prior tier killed") plus its own one-shot latch, the flip fires exactly
    /// once per tier transition and Kalé's menu shows only the currently-active
    /// tier's row — no cascade.
    /// </para>
    /// </summary>
    public const int TierUnlockLatchFlagBase = 1049304313; // latch(N) = base + N for N in 2..9

    /// <summary>
    /// Source-mod event IDs of the per-tier unlock-banner events in
    /// <c>m11_10_00_00.emevd.dcx</c>. Each event fires when the "last boss
    /// of the prior tier" marker flag flips ON, displays a blinking
    /// "Tier N Unlocked" banner, and latches itself so it never re-fires.
    ///
    /// <para>
    /// Tier 1 has no entry — it's the starting tier and is made visible at
    /// game start via <see cref="Tier1VisibilityFlag"/> /
    /// <see cref="T:BossRush.Core.Patching.Tier1VisibilityBootstrapSplicer"/>.
    /// Tier 9's unlock event is 11107701 (out-of-sequence with the
    /// 11107705..11107711 block for tiers 2..8).
    /// </para>
    /// </summary>
    public static readonly System.Collections.Generic.IReadOnlyDictionary<int, long>
        TierUnlockEventIds = new System.Collections.Generic.Dictionary<int, long>
        {
            [2] = 11107705,
            [3] = 11107706,
            [4] = 11107707,
            [5] = 11107708,
            [6] = 11107709,
            [7] = 11107710,
            [8] = 11107711,
            [9] = 11107701,
        };

    // ------------------------------------------------------------------
    // Tier-1 visibility bootstrap (Tier1VisibilityBootstrapSplicer)
    // ------------------------------------------------------------------
    /// <summary>The mod's once-per-load init event, found at line ~5969 of
    /// <c>common_func.emevd.dcx.js</c>. Guarded by
    /// <c>EndIf(EventFlag(1049300000))</c> at its top — runs exactly once per
    /// game-load. Hosts the <c>BatchSetEventFlags(1049308400, 1049308999, OFF)</c>
    /// reset that wipes every shop visibility flag we own. To make tier 1's
    /// shop visible from game start (rather than waiting for the OnTierClear[0]
    /// handler that doesn't exist), the bootstrap splicer inserts a
    /// <c>SetEventFlagID(1049308401, ON)</c> immediately after that batch reset.
    /// </summary>
    public const long ModInitEventId = 10010001;

    /// <summary>The exact <c>(start, end)</c> range used by the source mod's
    /// shop-visibility-clearing BatchSetEventFlags call. The bootstrap splicer
    /// matches both endpoints to guarantee it's anchoring on the right batch
    /// (the init event has several batch resets — wipes for 1049304400.. and
    /// 1049309000.. among others — and we must NOT splice after the wrong one).
    /// </summary>
    public const uint BatchResetStart = 1049308400;
    public const uint BatchResetEnd   = 1049308999;

    /// <summary>The visibility flag for tier 1's shop slots (ShopVisibilityFlagBase + 1).
    /// The bootstrap splicer flips this ON at game start so the player can buy
    /// tier-1 wares from Merchant Kalé before clearing any tier — solving the
    /// "no menu after killing the last tier-1 boss because tier 1 was never
    /// the unlocked tier" UX bug.</summary>
    public const uint Tier1VisibilityFlag = ShopVisibilityFlagBase + 1; // 1049308401

    /// <summary>EquipParamGoods row ID for the shop's currency. We use the
    /// vanilla DLC <b>Starlight Shards</b> goods row (id <c>1290</c>), the
    /// same currency Athena Randomizer's Starlight Shards shop uses.
    ///
    /// <para>
    /// <b>Why not a custom goods row?</b> A previous iteration cloned Amber
    /// Starlight (row 8142) into a new row at 2300100 and named it
    /// "Amber Shard". In theory that works — ShopLineupParam's <c>mtrlId</c>
    /// can point at any goods row and be used as a barter cost — but the
    /// end-to-end path (event grants lot → lot grants custom goods →
    /// inventory stack → UI icon/sort) requires getting every field on the
    /// cloned row exactly right, and any single misconfigured cell makes
    /// the awarded item invisible in inventory. Starlight Shards is a
    /// fully-configured vanilla goods row already wired into the game
    /// engine's currency system (<c>ShopLineupParam.costType = 2</c>
    /// deducts from it natively), so using it is far more robust.
    /// </para>
    ///
    /// <para>
    /// The constant is still named <c>AmberShardGoodsId</c> throughout our
    /// code because the user-facing "Amber Shard" branding is the locked
    /// spec; in-game the item will read "Starlight Shards" unless an FMG
    /// edit renames row 1290.
    /// </para></summary>
    public const int AmberShardGoodsId = 1290;

    /// <summary>ItemLotParam row IDs for the per-tier shard awards. Tier N's
    /// lot = <see cref="ShardAwardItemLotBase"/> + N (so 9000001..9000009).
    /// Each lot is configured by the regulation patcher to grant exactly
    /// <see cref="Generation.ShopRollGenerator.ShardAwardPerTier"/> Amber Shards.</summary>
    public const int ShardAwardItemLotBase = 9000000;

    /// <summary>
    /// Per-tier "boss progress marker" flag IDs. These are the exact flags
    /// the source mod's tier dispatchers (90009931..90009939) use in their
    /// else-if chain — <c>if (!EventFlag(marker))</c> = "this boss in the
    /// tier hasn't been stamped yet, stamp and exit". When all 5 markers
    /// for tier N are ON, 90009931+N falls through its else-if chain into
    /// the else branch that calls <see cref="EndOfTierAnchorEventId"/>
    /// (90009921). That's the definitional moment of "tier N cleared", and
    /// it's the condition each OnTierClear[N] body self-gates on to decide
    /// whether the 90009921 invocation that just woke it represents an
    /// actual tier clear vs. a different boss-rush-mode sequence end.
    ///
    /// <para>
    /// Source of truth: <c>mod/event/common_func.emevd.dcx.js</c> events
    /// 90009931..90009939. The marker flag order inside each row below
    /// matches the source's else-if chain order, but only the SET of flags
    /// matters (detection is AND over all 5).
    /// </para>
    /// </summary>
    public static readonly System.Collections.Generic.IReadOnlyDictionary<int, uint[]>
        TierBossMarkerFlags = new System.Collections.Generic.Dictionary<int, uint[]>
        {
            [1] = new uint[] { 1049304100, 1049304105, 1049304110, 1049304114, 1049304120 },
            [2] = new uint[] { 1049304124, 1049304125, 1049304129, 1049304131, 1049304136 },
            [3] = new uint[] { 1049304147, 1049304138, 1049304143, 1049304154, 1049304155 },
            [4] = new uint[] { 1049304150, 1049304149, 1049304161, 1049304214, 1049304188 },
            [5] = new uint[] { 1049304180, 1049304184, 1049304218, 1049304216, 1049304217 },
            [6] = new uint[] { 1049304208, 1049304205, 1049304222, 1049304223, 1049304231 },
            [7] = new uint[] { 1049304227, 1049304225, 1049304234, 1049304238, 1049304248 },
            [8] = new uint[] { 1049304247, 1049304239, 1049304244, 1049304242, 1049304249 },
            [9] = new uint[] { 1049304253, 1049304262, 1049304264, 1049304261, 1049304263 },
        };
}
