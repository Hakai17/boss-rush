// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;

namespace IgniteBossRush.Core.Patching;

/// <summary>
/// Names and IDs referenced by the regulation.bin patcher.
///
/// Values are drawn from (a) the Elden Ring PARAM layout as documented in
/// community references (Paramdex, Smithbox's stripped row-name files under
/// <c>.smithbox/Project/Stripped Row Names/</c>) and (b) the locked Boss Rush
/// shop spec. They're surfaced here as <c>const</c>s so a future change (e.g.
/// FromSoftware rearranges PARAM paths in a patch, or the spec moves the
/// ShopLineupParam row range) touches exactly one file.
/// </summary>
public static class RegulationConstants
{
    // ---- PARAM file paths inside the regulation.bin BND4 ---------------
    // Elden Ring stores its PARAMs under "param/GameParam/" with a ".param"
    // extension. The paths use backslashes in the binder — SoulsFormatsNEXT
    // returns them verbatim from the binder file headers.
    public const string EquipParamGoodsPath = @"N:\GR\data\Param\param\GameParam\EquipParamGoods.param";
    public const string ItemLotParamMapPath = @"N:\GR\data\Param\param\GameParam\ItemLotParam_map.param";
    public const string ItemLotParamEnemyPath = @"N:\GR\data\Param\param\GameParam\ItemLotParam_enemy.param";
    public const string ShopLineupParamPath = @"N:\GR\data\Param\param\GameParam\ShopLineupParam.param";
    // EquipMtrlSetParam path is kept as a constant for diagnostic tooling
    // (inspect-regulation can dump its rows to help future research into
    // the "for N runes" UI-label bug), but the patcher itself no longer
    // mutates this table — see ShopCostTypeStarlightShards below.
    public const string EquipMtrlSetParamPath = @"N:\GR\data\Param\param\GameParam\EquipMtrlSetParam.param";

    /// <summary>
    /// Short basenames (no path, no extension) of the PARAM files this patcher
    /// touches. Used for filename-suffix matching so we're resilient to binder
    /// path prefix changes across game versions / regional releases.
    /// </summary>
    public static readonly IReadOnlyList<string> RequiredParamBaseNames = new[]
    {
        "EquipParamGoods",
        "ItemLotParam_map",
        "ShopLineupParam",
    };

    // ---- Shop currency (EquipParamGoods) -------------------------------
    /// <summary>Goods row id used as the shop's currency.
    /// Points at the vanilla DLC <b>Starlight Shards</b> row (1290) — see
    /// <see cref="TierClearConstants.AmberShardGoodsId"/> for the full
    /// rationale. The regulation patcher no longer mutates EquipParamGoods;
    /// this id is referenced by (a) the tier-clear EMEVD for RemoveItem /
    /// AwardItemLot targeting, and (b) by ItemLotParam_map slot granting
    /// five copies per tier clear.</summary>
    public const int AmberShardGoodsId = TierClearConstants.AmberShardGoodsId; // 1290 (vanilla Starlight Shards)

    // ---- Per-tier ItemLot (ItemLotParam_map) ---------------------------
    /// <summary>First row id for the 9 shard-award lots
    /// (<c>ShardAwardItemLotBase + tier</c>, tiers 1..9 → 9000001..9000009).
    /// Pulled through from <see cref="TierClearConstants"/> so the EMEVD
    /// AwardItemLot opcodes and the regulation rows agree by construction.</summary>
    public const int ShardAwardItemLotBase = TierClearConstants.ShardAwardItemLotBase; // 9000000

    /// <summary>Each tier-clear awards 5 Amber Shards (locked spec: 45 total over
    /// a full 9-tier run = 5 × 9).</summary>
    public const int ShardsPerTierClear = 5;

    /// <summary>ItemLot category byte for <i>Goods</i>. Elden Ring's
    /// lotItemCategory uses a wider encoding than EMEVD's ItemType byte: 1 =
    /// Goods, 2 = Weapon, 3 = Protector (armor), 4 = Accessory (talisman),
    /// 5 = Gem (Ash of War). Cross-check: Paramdex/ItemLotParam.xml.</summary>
    public const int ItemLotCategoryGoods = 1;
    public const int ItemLotCategoryWeapon = 2;
    public const int ItemLotCategoryAccessory = 4;
    public const int ItemLotCategoryGem = 5;

    // ---- Shop rows (ShopLineupParam) -----------------------------------
    /// <summary>
    /// Row-id formula: <c>ShopLineupRowBase + tier*100 + slotIndex</c>.
    /// Example: tier 1 slot 0 = 8000100, tier 9 slot 10 = 8000910. The +100
    /// stride per tier gives 89 spare IDs between tiers for future additions
    /// without renumbering.
    /// </summary>
    public const int ShopLineupRowBase = 8000000;

    /// <summary>Per-tier stride in the ShopLineupParam row id layout. See
    /// <see cref="ShopLineupRowBase"/>.</summary>
    public const int ShopLineupTierStride = 100;

    /// <summary>7 slots per tier: 2 weapons + 2 talismans + 2 AoW + 1 tear.
    /// Matches <see cref="Models.TierPlan.Slots"/>.Count invariant.</summary>
    public const int ShopSlotsPerTier = 7;

    /// <summary>ShopType byte value for Kalé's goods/wares entries. Vanilla ER
    /// uses 0 for "standard merchant goods". Gems (Ashes of War) and weapons
    /// sold in the shop share this value; the distinguishing field is
    /// <c>equipType</c>.</summary>
    public const byte ShopTypeMerchant = 0;

    /// <summary>
    /// <c>costType</c> enum value (SHOP_LINEUP_COSTTYPE) for
    /// <b>Starlight Shards</b>. Setting <c>costType=2</c> makes the engine
    /// deduct Starlight Shards (<see cref="AmberShardGoodsId"/> = 1290)
    /// on purchase in lieu of runes. Athena Randomizer's
    /// <c>RandomizerServiceDlc.cs</c> uses the same value
    /// (<c>starlightShardCostType = 2</c>).
    ///
    /// <para>
    /// <b>Known cosmetic bug — engine limitation.</b> The purchase
    /// dialog always reads "for N runes" even when shards are actually
    /// being deducted. Investigation trail:
    /// <list type="bullet">
    ///   <item><b>mtrlId barter</b> — wiring each row's <c>mtrlId</c>
    ///     to an EquipMtrlSetParam row consuming 1× Starlight Shards
    ///     made the label read "for 0 runes" (OpenRegularShop ignores
    ///     <c>mtrlId</c>). Barter UI appears only for a different
    ///     shop-invocation opcode.</item>
    ///   <item><b>menuTitleMsgId = 508000</b> — discovered in Athena
    ///     Randomizer's Moonwalk Starlight Shop rows. Sets the shop's
    ///     MENU TITLE (not the cost label). Without Athena's
    ///     custom-shipped menu FMG entry, our title renders as
    ///     "?MenuText?" placeholder. Even with the FMG entry, only the
    ///     title changes — the "for N runes" dialog is unaffected.
    ///     Athena has the same label text in-game; they just
    ///     customized the title.</item>
    ///   <item><b>FMG string override</b> — the "for %d runes" message
    ///     could be globally replaced with "for %d Starlight Shards",
    ///     but that affects every shop in the game. Requires
    ///     FMG-patching infrastructure not currently in the pipeline.</item>
    /// </list>
    /// Status: pinned. Shard deduction works; only the label is wrong.
    /// </para>
    /// </summary>
    public const byte ShopCostTypeStarlightShards = 2;

    /// <summary>EquipType byte inside a ShopLineupParam row. Matches
    /// <see cref="ItemLotCategoryWeapon"/> semantics but uses the shop param's
    /// narrower enum: 0 = Weapon, 1 = Protector, 2 = Accessory, 3 = Goods,
    /// 4 = Gem.</summary>
    public const byte ShopEquipTypeWeapon = 0;
    public const byte ShopEquipTypeProtector = 1; // armor (head/body/arms/legs)
    public const byte ShopEquipTypeAccessory = 2; // talisman
    public const byte ShopEquipTypeGoods = 3;     // crystal tear
    public const byte ShopEquipTypeGem = 4;       // ash of war

    /// <summary>Cost currency id for the Boss Rush shop slots: vanilla
    /// Starlight Shards (<see cref="AmberShardGoodsId"/> = 1290). Retained
    /// as a named alias because callers (ItemLot mutation, EMEVD
    /// RemoveItemFromPlayer) read "currency id" as the concept they want,
    /// independent of which vanilla row backs it.</summary>
    public const int ShopCurrencyGoodsId = AmberShardGoodsId;

    /// <summary>Per-spec cost: one Starlight Shard per shop slot. The
    /// shop row's <c>value</c> field is set to this when
    /// <c>costType = 2</c> (Starlight Shards). Phase B refuses to patch
    /// when any <see cref="Models.ShopSlot.CostAmberShards"/> disagrees —
    /// fail loud rather than silently mis-charge. Multi-shard costs are
    /// now trivially supported (just set <c>value</c> to the desired
    /// count), but the locked spec is 1; loosening the validator is a
    /// one-line change when/if the spec changes.</summary>
    public const int ShopCostPerSlotAmberShards = 1;

    // ---- EquipMtrlSetParam (diagnostic / future barter work) ----------
    /// <summary>Paramdef XML filename for <c>EquipMtrlSetParam.param</c>.
    /// The patcher does NOT mutate this table today — the constant is
    /// exposed so the <c>inspect-regulation</c> CLI can dump barter rows.
    /// Kept as a future-research hook.</summary>
    public const string EquipMtrlSetParamDefXml = "EquipMtrlSetParam.xml";

    // ---- Boss Rush per-row stock-tracking flags -----------------------
    /// <summary>
    /// Base event flag for per-row "has been purchased" state tracking on
    /// the Boss Rush shop rows. Each shop row's <c>eventFlag_forStock</c>
    /// field is set to <c>Base + (tier-1)*100 + slotIndex*10</c>, giving
    /// each of the 63 base slots + 9 Great Rune slots a unique flag with
    /// a stride of 10 between adjacent slots:
    /// <code>
    /// tier 1 slot 0 = 1049308500    tier 9 slot 7 = 1049309370
    /// </code>
    ///
    /// <para>
    /// <b>Why the stride-10 layout.</b> Empirically, OpenPuppetShop's
    /// "row purchased" write doesn't just flip the row's own
    /// <c>eventFlag_forStock</c> — it affects a <i>range</i> of flags
    /// around that value. With stride-1 spacing (our previous layout,
    /// 500/501/502/…), buying slot N made slot N±1 read as sold-out too,
    /// because the blast radius of the purchase write overlapped the
    /// neighbouring row's stock flag. Athena Randomizer's Moonwalk
    /// Starlight Shop rows solve this by spacing stock flags by 10 —
    /// e.g. Moonveil at 1056457000, next weapon at 1056457010, next at
    /// 1056457020 — and we mirror that pattern here.
    /// </para>
    ///
    /// <para>
    /// <b>Why needed at all.</b> OpenPuppetShop (bank=1 id=144 — Athena's
    /// Moonwalk Starlight Shop opcode) evaluates each row's
    /// <c>eventFlag_forStock</c> to decide if the row is available. When
    /// the flag is ON the row reads as "already purchased" and is hidden.
    /// If the field is left at <c>0</c> the engine probes flag 0 (a
    /// system flag typically ON at runtime), so every row reads as
    /// sold-out and the shop menu silently refuses to open. Athena works
    /// around this by pointing each row at an existing vanilla
    /// "received this item" flag; we allocate a fresh Ignite-Rush range
    /// (flags start OFF → rows are available).
    /// </para>
    ///
    /// <para>
    /// <b>Range-safety.</b> The allocated window is 1049308500..1049309370.
    /// The first 500 flags (1049308500..1049308999) sit inside the mod's
    /// init-event wipe <c>BatchSetEventFlags(1049308400, 1049308999, OFF)</c>
    /// and auto-reset on game-load. The overflow window
    /// (1049309000..1049309370, used by tiers 6..9) requires the mod's
    /// init wipe to be extended upstream — this is an EMEVD edit the
    /// project owner applies manually; if the wipe is not extended, rows
    /// in the overflow window keep their sold-out state across runs.
    /// </para>
    ///
    /// <para>
    /// <b>Side effect.</b> Once a slot is purchased, its flag flips ON
    /// and the row becomes sold-out for the rest of the run — consistent
    /// with the rest of Kalé's one-shot shop categories and with vanilla
    /// Starlight Shop rows in Athena's setup.
    /// </para>
    /// </summary>
    public const int BossRushShopStockFlagBase = 1049308500;

    /// <summary>
    /// Per-slot stock-tracking flag: <c>BossRushShopStockFlagBase +
    /// (tier-1)*100 + slotIndex*10</c>. Tier in [1..9], slotIndex in
    /// [0..<see cref="ShopSlotsPerTier"/>] inclusive (index 7 covers the
    /// optional Great Rune bonus slot). Stride-10 between adjacent slots
    /// keeps each row's purchase-write blast radius disjoint; see the
    /// <see cref="BossRushShopStockFlagBase"/> remarks for the full
    /// rationale.
    /// </summary>
    public static uint BossRushShopStockFlag(int tier, int slotIndex)
    {
        if (tier < TierClearConstants.FirstTier || tier > TierClearConstants.LastTier)
            throw new ArgumentOutOfRangeException(nameof(tier));
        if (slotIndex < 0 || slotIndex > ShopSlotsPerTier)
            throw new ArgumentOutOfRangeException(nameof(slotIndex));
        return (uint)(BossRushShopStockFlagBase + (tier - 1) * 100 + slotIndex * 10);
    }

    // ---- Boss Rush shop window title (menu FMG) -----------------------
    /// <summary>
    /// Per-tier menu title base. Tier N's shop window title uses
    /// <c>BossRushShopTitleMsgIdBase + N</c> (508001..508009), pointing
    /// at FMG entries added to <c>GR_MenuText.fmg</c> inside
    /// <c>menu_dlc02.msgbnd.dcx</c> by
    /// <see cref="FmgPatcher"/>. Numeric range 508001..508009 was
    /// picked adjacent to Athena Randomizer's 508000 ("Starlight
    /// Shop") so a side-by-side mod wouldn't collide.
    /// </summary>
    public const int BossRushShopTitleMsgIdBase = 508000;

    /// <summary>Name of the FMG file INSIDE <c>menu_dlc02.msgbnd.dcx</c>
    /// that holds generic menu-title text. Athena uses this file for
    /// its "Starlight Shop" entry; we add the "Boss Rush - Tier N"
    /// entries alongside.</summary>
    public const string BossRushShopTitleFmgName = "GR_MenuText";

    /// <summary>Filename (basename) of the msgbnd.dcx bundle the
    /// <see cref="FmgPatcher"/> mutates. Shipped per-language under
    /// <c>source_mod/mod/msg/&lt;lang&gt;/</c>; we patch only the
    /// English (<c>engus</c>) variant today — non-English players
    /// will see the default "Purchase Item" chrome.</summary>
    public const string MenuMsgBndBaseName = "menu_dlc02.msgbnd.dcx";

    /// <summary>Per-tier menu title text template. Runs
    /// <c>string.Format(..., N)</c> with the 1-indexed tier number.</summary>
    public const string BossRushShopTitleFormat = "Boss Rush - Tier {0}";

    /// <summary>
    /// Tier's shop window title message ID. Written into every
    /// ShopLineupParam row for that tier's <c>menuTitleMsgId</c>,
    /// corresponding 1:1 to a GR_MenuText.fmg entry the
    /// <see cref="FmgPatcher"/> adds.
    /// </summary>
    public static int BossRushShopTitleMsgId(int tier) =>
        BossRushShopTitleMsgIdBase + tier;

    /// <summary>Name of the FMG inside <c>menu_dlc02.msgbnd.dcx</c> that
    /// holds the long starting-class blurbs (paired with the short names
    /// in <see cref="BossRushShopTitleFmgName"/>).</summary>
    public const string MenuLineHelpFmgName = "GR_LineHelp";

    // ---- 1.17.1 Tarnished Pack starting classes (menu FMG) ------------
    /// <summary>
    /// <c>GR_MenuText</c> IDs for vanilla starting-class names.
    /// 288100–288109 are Vagabond…Wretch (already in the 1.16.1
    /// <c>menu_dlc02</c>). 1.17.1 added Idus Knight (288110) and Heavy
    /// Knight (288111). The shipped source_mod menu is still 1.16.1, so
    /// those IDs are missing and character-create renders
    /// <c>?text_name?</c> until <see cref="MenuDlc02Patcher"/> injects
    /// them. 297140/297141 are the parallel name slots next to
    /// 297130–297139.
    /// </summary>
    public const int IdusKnightMenuTextId = 288110;
    public const int HeavyKnightMenuTextId = 288111;
    public const int IdusKnightMenuTextIdAlt = 297140;
    public const int HeavyKnightMenuTextIdAlt = 297141;

    public const string IdusKnightName = "Idus Knight";
    public const string HeavyKnightName = "Heavy Knight";

    /// <summary>Official Bandai EN blurb for Idus Knight (1.17.1).</summary>
    public const string IdusKnightDescription =
        "A knight of the land of Idus, famed for their lightweight attire and weaponry, which they wield with ample dexterity.";

    /// <summary>Official Bandai EN blurb for Heavy Knight (1.17.1).</summary>
    public const string HeavyKnightDescription =
        "A knight in bulky steel armor capable of mowing through foes with a substantively-sized scimitar.";

    // ---- PARAMDEF embedded-resource filenames ---------------------------
    /// <summary>Filename (no path) of the Paramdex XML we ship as an embedded
    /// resource for <c>EquipParamGoods.param</c>. The Core project embeds
    /// <c>Patching/Paramdefs/*.xml</c>; <see cref="ParamdefLoader"/> looks
    /// up the resource by suffix-matching on this basename.</summary>
    public const string EquipParamGoodsDefXml = "EquipParamGoods.xml";

    /// <summary>Paramdex XML filename for <c>ItemLotParam_map.param</c>.
    /// Paramdex ships one <c>ItemLotParam.xml</c> that is valid for both
    /// <c>ItemLotParam_map</c> and <c>ItemLotParam_enemy</c> — they share
    /// the same row layout.</summary>
    public const string ItemLotParamDefXml = "ItemLotParam.xml";

    /// <summary>Paramdex XML filename for <c>ShopLineupParam.param</c>.</summary>
    public const string ShopLineupParamDefXml = "ShopLineupParam.xml";

    // ---- ShopLineupParam field internal names ---------------------------
    // These are the exact InternalName strings in Paramdex's ShopLineupParam.xml
    // (FormatVersion 203 / DataVersion 3). Hoisted to named constants so a
    // Paramdex schema rename would surface as a single compile-time break
    // rather than a silent miss inside the cell-lookup loop.
    public const string ShopLineupField_EquipId           = "equipId";
    public const string ShopLineupField_EquipType         = "equipType";
    public const string ShopLineupField_Value             = "value";
    public const string ShopLineupField_MtrlId            = "mtrlId";
    public const string ShopLineupField_SellQuantity      = "sellQuantity";
    public const string ShopLineupField_EventFlagForStock = "eventFlag_forStock";
    // "販売解禁イベントフラグ" — the sales-unlock gate. When this flag is ON the
    // row appears in the merchant's menu; when OFF it's hidden. DISTINCT from
    // eventFlag_forStock, which stores the sold-count bit and (when pointed
    // at a set flag) immediately reads as "1 sold", silently driving the row
    // to out-of-stock the moment the flag flips ON. Pointing the visibility
    // flag at _forRelease instead of _forStock is the fix for the "Kalé's
    // shop is always out of stock" bug.
    public const string ShopLineupField_EventFlagForRelease = "eventFlag_forRelease";
    public const string ShopLineupField_SetNum            = "setNum";
    public const string ShopLineupField_CostType          = "costType";
    // Menu-display override fields. Paramdef defaults are -1 (= don't override),
    // but we initialize these explicitly on freshly-created rows so a
    // SoulsFormats.PARAM.Row constructor that silently zero-fills cells can't
    // leave iconId=0/nameMsgId=0 — which the game interprets as "override
    // icon with #0 / name with message #0" and renders as "ICON" + "?WeaponName?"
    // in the shop UI even though EquipParamWeapon stats resolve normally.
    public const string ShopLineupField_IconId            = "iconId";
    public const string ShopLineupField_NameMsgId         = "nameMsgId";
    public const string ShopLineupField_MenuTitleMsgId    = "menuTitleMsgId";
    public const string ShopLineupField_MenuIconId        = "menuIconId";
    public const string ShopLineupField_ValueMagnification = "value_Magnification";

    // ---- ItemLotParam field internal names (slot 01 only) ---------------
    public const string ItemLotField_LotItemId01       = "lotItemId01";
    public const string ItemLotField_LotItemCategory01 = "lotItemCategory01";
    public const string ItemLotField_LotItemBasePoint01 = "lotItemBasePoint01";
    public const string ItemLotField_LotItemNum01      = "lotItemNum01";

    /// <summary>Row-level "acquired flag" on ItemLotParam. ItemLotParam.xml
    /// description: "取得済みフラグとザクザク枠兼用(0:フラグ無効)" —
    /// "Acquired flag dual-use (0: flag disabled)". The engine checks this
    /// flag atomically at award time: if OFF, it awards the lot's items and
    /// then sets the flag ON; if already ON, the award is a silent no-op.
    ///
    /// <para>
    /// We exploit this for engine-level atomic idempotency on the per-tier
    /// Amber Shard drop. Before this was introduced the OnTierClear EMEVD
    /// body did its own check-then-set with a SkipIfEventFlag / SetEventFlag
    /// pair, but event 90009921 (the shared warp-back handler we splice
    /// into) fires ~20 times during a single tier-clear warp sequence —
    /// each fire spawns 9 concurrent OnTierClear coroutines, and EMEVD
    /// instructions interleave at tick boundaries, so the check-then-set
    /// was NOT atomic. All copies saw the guard OFF at the same tick and
    /// all awarded 5 shards, producing the observed 10/75/100-shard
    /// regressions. Pushing the idempotency into the regulation param row
    /// lets the engine serialise the whole award at the native layer.
    /// </para></summary>
    public const string ItemLotField_GetItemFlagId = "getItemFlagId";

    /// <summary>100% lot weight in slot 01. ItemLotParam sums base-points
    /// across all 8 lot slots to compute probabilities; putting 100 on slot 01
    /// and 0 on every other slot makes slot 01 the sole winner every roll.</summary>
    public const int ItemLotFullWeightSlot01 = 100;

    // ---- Validation helpers ---------------------------------------------
    // ---- Boss NPC drop zero-out (ItemLotParam_enemy) -------------------
    /// <summary>
    /// First row id in the boss-drop bundle range that the source mod
    /// populates in <c>ItemLotParam_enemy</c>. The Ignite Rush Alpha mod
    /// uses the same id range in both <c>ItemLotParam_map</c> (awarded by
    /// event 11107822's bulk "receive all shop items" grant) and
    /// <c>ItemLotParam_enemy</c> (the NPC-death auto-drop the engine
    /// resolves from <c>NpcParam.itemLotId_1..6</c>). Because the two
    /// params are separate, we can zero the <c>_enemy</c> rows to kill the
    /// post-boss-kill "ENEMY FELLED" loadout toast while leaving the
    /// <c>_map</c> rows intact for event 11107822.
    /// </summary>
    public const int BossDropLotRangeBegin = 1049301000;

    /// <summary>Inclusive last row id in the boss-drop bundle range.
    /// Matches the highest <c>AwardItemLot</c> id in event 11107822
    /// (<c>1049301370</c>). See <see cref="BossDropLotRangeBegin"/>.</summary>
    public const int BossDropLotRangeEnd = 1049301370;

    /// <summary>Stride between successive boss-drop bundle row ids. The
    /// source mod uses a stride of 10 (1049301000, 1049301010, ...,
    /// 1049301370 = 38 rows). A row that exists in the range but isn't on
    /// this stride is left untouched — we only zero rows we know are
    /// bundle lots.</summary>
    public const int BossDropLotRangeStride = 10;

    /// <summary>Count of boss-drop bundle rows we expect to zero on a
    /// clean run: <c>(End - Begin) / Stride + 1</c> = 38. Used as an
    /// invariant assertion in the patcher so a future range-drift bug
    /// fails loud rather than silently zeroing fewer rows.</summary>
    public const int BossDropLotExpectedRowCount = 38;

    /// <summary>
    /// ItemLot row slot count. Elden Ring's ItemLotParam stores 8 reward
    /// slots per row (slots 01..08), each with its own id/category/weight/
    /// count quadruple. Zeroing a row means zeroing all 8 slot quadruples
    /// plus the row-level <c>getItemFlagId</c>.
    /// </summary>
    public const int ItemLotSlotCount = 8;

    /// <summary>ItemLotParam per-slot field name prefixes. Each prefix is
    /// suffixed with a 2-digit 1-based slot index (<c>01</c>..<c>08</c>) to
    /// form the full <c>InternalName</c>. The patcher loops these across
    /// all 8 slots when zeroing a row.</summary>
    public static readonly IReadOnlyList<string> ItemLotSlotFieldPrefixes = new[]
    {
        "lotItemId",
        "lotItemCategory",
        "lotItemBasePoint",
        "lotItemNum",
    };

    /// <summary>
    /// Deterministic ShopLineupParam row id for a given tier + slot index.
    /// Accepts <c>slotIndex</c> in <c>[0, ShopSlotsPerTier]</c> inclusive —
    /// the extra +1 slot is the optional Great Rune bonus slot appended by
    /// <see cref="Generation.ShopRollGenerator"/> when a tier wins its
    /// per-tier 15% roll. The 100-ID per-tier window leaves 89 unused IDs
    /// above the bonus slot, so the range never collides across tiers.
    /// </summary>
    public static int ShopLineupRowId(int tier, int slotIndex)
    {
        if (tier < TierClearConstants.FirstTier || tier > TierClearConstants.LastTier)
            throw new ArgumentOutOfRangeException(nameof(tier),
                $"tier must be in [{TierClearConstants.FirstTier}, {TierClearConstants.LastTier}], got {tier}");
        if (slotIndex < 0 || slotIndex > ShopSlotsPerTier)
            throw new ArgumentOutOfRangeException(nameof(slotIndex),
                $"slotIndex must be in [0, {ShopSlotsPerTier}] (inclusive — index {ShopSlotsPerTier} is the optional Great Rune slot), got {slotIndex}");
        return ShopLineupRowBase + tier * ShopLineupTierStride + slotIndex;
    }

    /// <summary>
    /// Deterministic ItemLotParam_map row id for a given tier.
    /// </summary>
    public static int ShardAwardLotId(int tier)
    {
        if (tier < TierClearConstants.FirstTier || tier > TierClearConstants.LastTier)
            throw new ArgumentOutOfRangeException(nameof(tier),
                $"tier must be in [{TierClearConstants.FirstTier}, {TierClearConstants.LastTier}], got {tier}");
        return ShardAwardItemLotBase + tier;
    }
}
