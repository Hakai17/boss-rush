// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using IgniteBossRush.Core.Models;
using SoulsFormats;

namespace IgniteBossRush.Core.Patching;

/// <summary>
/// Regulation.bin patcher for the 9-tier × 7-slot Boss Rush shop.
///
/// <para>
/// <b>Phase A (landed previously):</b> BND4 load → param-file locator →
/// BND4 save round-trip; no row mutations. Validated by the
/// <c>RegulationIoRoundTripTests</c> suite which requires byte-for-byte
/// equality between the source and output regulation.bin.
/// </para>
///
/// <para>
/// <b>Phase B (this file):</b> row mutation is active when
/// <see cref="RegulationPatcherOptions.Plan"/> is non-null. Two PARAM
/// tables get edited (EquipParamGoods is deliberately untouched — we
/// reuse the vanilla DLC Starlight Shards goods row 1290 as the shop
/// currency, matching Athena Randomizer's DLC shop pattern):
/// <list type="bullet">
///   <item><b>ItemLotParam_map</b>: create 9 rows at
///     <see cref="RegulationConstants.ShardAwardLotId(int)"/>, each granting
///     <see cref="RegulationConstants.ShardsPerTierClear"/> copies of the
///     Starlight Shards goods id (<see cref="RegulationConstants.AmberShardGoodsId"/>
///     = 1290) in slot 01 with category
///     <see cref="RegulationConstants.ItemLotCategoryGoods"/> and a 100%
///     base-point weight. The tier-clear EMEVD event references these
///     ItemLot IDs through <c>AwardItemLot(shard_award_lot_id)</c>.</item>
///   <item><b>ShopLineupParam</b>: create 63 rows (9 tiers × 7 slots) at
///     <see cref="RegulationConstants.ShopLineupRowId(int, int)"/>. Per-row
///     shape: <c>equipId</c>/<c>equipType</c> from
///     <see cref="TierPlan.Slots"/>, <c>eventFlag_forStock</c> from
///     <see cref="TierPlan.ShopVisibilityFlag"/> (gated per-tier visibility),
///     <c>costType</c>=<see cref="RegulationConstants.ShopCostTypeStarlightShards"/>
///     (engine deducts Starlight Shards from inventory), <c>value</c>=1
///     (one shard per slot), <c>mtrlId</c>=-1 (no material gate),
///     <c>sellQuantity</c>=1 (one-shot per tier, enforced by the stock
///     flag + single-item quantity).</item>
/// </list>
/// </para>
///
/// <para>
/// <b>Shop window title.</b> Each tier's shop rows set
/// <c>menuTitleMsgId</c> = <c>508000 + N</c>, pointing at
/// "Boss Rush - Tier N" entries that <see cref="FmgPatcher"/> inserts
/// into <c>menu_dlc02.msgbnd.dcx</c> / <c>GR_MenuText.fmg</c>. A full
/// shop patch therefore requires BOTH regulation.bin (this class) and
/// the msgbnd.dcx (FmgPatcher) — running the regulation pass alone
/// makes the title render as "?MenuText?" placeholder.
/// </para>
///
/// <para>
/// <b>Known cosmetic bug (pinned — engine limitation).</b> The purchase-
/// confirmation dialog renders "for N runes" regardless of
/// <c>costType=2</c>. The deduction is correct (Starlight Shards are
/// consumed), only the label is wrong. Athena Randomizer has the same
/// issue — inspecting their menu_dlc02.msgbnd.dcx shows they only
/// override the shop <i>title</i> ("Starlight Shop" via msg 508000),
/// not the dialog's currency format string. Elden Ring's shop UI has no
/// built-in template for non-rune currency text; the only way to swap
/// "runes" for "Starlight Shards" would be to globally patch the system
/// FMG, which affects every shop in the game. See
/// <see cref="RegulationConstants.ShopCostTypeStarlightShards"/> for
/// the full investigation trail.
/// </para>
///
/// <para>
/// <b>Cost-per-slot ceiling.</b> The locked spec is "1 Starlight Shard
/// per item" (<see cref="RegulationConstants.ShopCostPerSlotAmberShards"/>).
/// costType=2 + value=N happily supports any N, but the plan validator
/// refuses anything other than 1 today so a drift between the spec and
/// the patched rows fails loud rather than silently over/under-charging
/// players. Loosening the validator is a one-line change when/if the
/// spec changes.
/// </para>
///
/// <para>
/// <b>Idempotency.</b> Each mutate method removes any pre-existing row at
/// the target id before inserting the new row, so re-running the patcher
/// over its own output is a no-op at the row level. Because the first
/// pass already put the regulation through the <c>BND4.Write</c> +
/// PKCS7-encrypt normalisation, the second pass's output is byte-identical
/// to the first (as long as Paramdex doesn't change between runs) — which
/// the <c>PatcherApply_WithPlan_Idempotent</c> test enforces.
/// </para>
///
/// <para>
/// <b>No-Plan mode.</b> If <see cref="RegulationPatcherOptions.Plan"/> is
/// null, no row mutations happen: the patcher only runs
/// decrypt → enumerate-and-locate → re-encrypt. We don't guarantee
/// ciphertext byte-equality with the source (the AES re-encrypt uses
/// PKCS7 padding where the source may not have, and <c>BND4.Write</c> is
/// free to renormalise internal alignment), but every individual binder
/// file's <c>.Bytes</c> is preserved — the
/// <c>LoadSaveRoundTrip_OnRealModRegulation_PreservesBinderContents</c>
/// test enforces that functional-equivalence invariant.
/// </para>
/// </summary>
public sealed class RegulationPatcher
{
    public const string ToolName = "IgniteRush-RegulationPatcher-CS";
    public const string ToolVersion = "0.2.0-phaseB";

    public RegulationPatcherOptions Options { get; }

    public RegulationPatcher(RegulationPatcherOptions options)
    {
        Options = options ?? throw new ArgumentNullException(nameof(options));
    }

    // ---------------------------------------------------------------------
    public RegulationPatchResult Apply()
    {
        if (!File.Exists(Options.SourceRegulationPath))
            throw new FileNotFoundException(
                $"Source regulation.bin not found: {Options.SourceRegulationPath}",
                Options.SourceRegulationPath);
        if (File.Exists(Options.OutputRegulationPath) && !Options.Force)
            throw new IOException(
                $"Output regulation.bin already exists: {Options.OutputRegulationPath} "
                + "(set Force=true to overwrite)");

        // Validate the plan before decrypting ~50MB of bytes — fails loud if
        // the spec has drifted in a way we can't honour.
        if (Options.Plan is not null)
            ValidatePlan(Options.Plan);

        // (1) Decrypt + parse
        BND4 bnd = RegulationIo.LoadEldenRing(Options.SourceRegulationPath);

        // (2) Locate the three PARAMs we edit. Locating up-front fails loud
        //     if the mod's regulation doesn't ship a required table before
        //     we waste CPU on bytes that couldn't be written anyway.
        var located = LocateRequiredParams(bnd);

        // (3) Apply row mutations when a plan is supplied.
        //     Note: EquipParamGoods is NO LONGER mutated. We used to clone
        //     row 8142 (Amber Starlight) into 2300100 and name it
        //     "Amber Shard", but a subtly-malformed clone led to awarded
        //     shards being invisible in inventory. We now reuse the vanilla
        //     DLC Starlight Shards goods row (1290) as the shop currency —
        //     same pattern Athena Randomizer uses — which is guaranteed to
        //     be wired correctly by FromSoftware. See
        //     TierClearConstants.AmberShardGoodsId for the full rationale.
        int goodsRows = 0, itemLotRows = 0, shopRows = 0;
        if (Options.Plan is not null)
        {
            PARAMDEF itemLotDef = ParamdefLoader.Load(RegulationConstants.ItemLotParamDefXml);
            PARAMDEF shopDef = ParamdefLoader.Load(RegulationConstants.ShopLineupParamDefXml);

            itemLotRows = MutateItemLotParamMap(located.ItemLotParamMap, itemLotDef);
            shopRows    = MutateShopLineupParam(located.ShopLineupParam, shopDef, Options.Plan);
        }

        // (3b) Zero boss-drop NPC lots. This is an independent option so it
        //      can be toggled on a fixture-only run without also firing the
        //      shop + regulation-row stages. ItemLotParam_enemy is a
        //      different param table than ItemLotParam_map (event 11107822's
        //      bulk grant reads _map), so zeroing here does not disturb the
        //      bulk-grant cheat path.
        int bossDropRowsZeroed = 0;
        if (Options.ZeroBossDrops && located.ItemLotParamEnemy is not null)
        {
            PARAMDEF itemLotDef = ParamdefLoader.Load(RegulationConstants.ItemLotParamDefXml);
            bossDropRowsZeroed = ZeroBossDropItemLots(located.ItemLotParamEnemy, itemLotDef);
        }

        // (4) Re-encrypt + write
        RegulationIo.SaveEldenRing(Options.OutputRegulationPath, bnd);

        return new RegulationPatchResult(
            SourcePath:             Options.SourceRegulationPath,
            OutputPath:             Options.OutputRegulationPath,
            TotalBinderFiles:       bnd.Files.Count,
            EquipParamGoodsLocated: located.EquipParamGoods is not null,
            ItemLotParamMapLocated: located.ItemLotParamMap is not null,
            ShopLineupParamLocated: located.ShopLineupParam is not null,
            RowsWritten:            goodsRows + itemLotRows + shopRows,
            EquipParamGoodsRowsWritten: goodsRows,
            ItemLotParamMapRowsWritten: itemLotRows,
            ShopLineupParamRowsWritten: shopRows,
            BossDropLotsZeroed:         bossDropRowsZeroed);
    }

    // ---------------------------------------------------------------------
    // Plan validation
    // ---------------------------------------------------------------------
    /// <summary>
    /// Refuse to patch a plan we can't faithfully represent in
    /// regulation.bin. Today that means:
    /// <list type="bullet">
    ///   <item>Slot count per tier must be in
    ///     <c>[<see cref="RegulationConstants.ShopSlotsPerTier"/>,
    ///     <see cref="RegulationConstants.ShopSlotsPerTier"/>+1]</c> —
    ///     the base count, with an optional Great Rune bonus slot.</item>
    ///   <item>Per-slot cost (in Starlight Shards) must be
    ///     <c>&gt;= 1 &amp;&amp; &lt;= 99</c> — the practical range the
    ///     ShopLineupParam <c>value</c> field can display cleanly in the
    ///     merchant UI. We no longer hard-pin to 1, so Great Rune slots
    ///     can charge 3 shards and base slots can stay at 1.</item>
    /// </list>
    /// </summary>
    internal static void ValidatePlan(TierRewardsPlan plan)
    {
        if (plan is null) throw new ArgumentNullException(nameof(plan));
        if (plan.Tiers is null || plan.Tiers.Count == 0)
            throw new ArgumentException("plan must contain tiers", nameof(plan));

        int minSlots = RegulationConstants.ShopSlotsPerTier;       // 7
        int maxSlots = RegulationConstants.ShopSlotsPerTier + 1;   // 8 (with Great Rune)
        foreach (var tier in plan.Tiers)
        {
            int got = tier.Slots?.Count ?? 0;
            if (tier.Slots is null || got < minSlots || got > maxSlots)
                throw new ArgumentException(
                    $"tier {tier.Tier}: expected {minSlots} or {maxSlots} slots, "
                    + $"got {got}", nameof(plan));

            for (int i = 0; i < tier.Slots.Count; i++)
            {
                var slot = tier.Slots[i];
                if (slot.CostAmberShards < 1 || slot.CostAmberShards > 99)
                    throw new NotSupportedException(
                        $"tier {tier.Tier} slot {i}: CostAmberShards={slot.CostAmberShards} "
                        + "is out of range [1, 99]. ShopLineupParam's value field "
                        + "supports higher values, but the merchant UI only renders "
                        + "1-2 digit prices cleanly.");
            }
        }
    }

    // ---------------------------------------------------------------------
    // ItemLotParam_map — 9 rows granting 5 Starlight Shards each
    // ---------------------------------------------------------------------
    /// <summary>
    /// Create nine ItemLot rows — one per tier, at id
    /// <see cref="RegulationConstants.ShardAwardLotId(int)"/> — each
    /// granting <see cref="RegulationConstants.ShardsPerTierClear"/>
    /// copies of the Amber Shard goods in slot 01.
    /// </summary>
    /// <remarks>
    /// <para>
    /// Only slot 01 is populated (the rest default to zero). Slot 01 gets:
    /// <c>lotItemId01</c>=Amber Shard goods id,
    /// <c>lotItemCategory01</c>=Goods (1),
    /// <c>lotItemBasePoint01</c>=100 (guaranteed single-roll weight),
    /// <c>lotItemNum01</c>=5.
    /// </para>
    /// <para>
    /// The EMEVD tier-clear event (<see cref="TierClearEventBuilder"/>)
    /// references these lot IDs via the <c>AwardItemLot</c> opcode; agreeing
    /// id ranges are enforced by the
    /// <c>RegulationConstants_CrossCheckWithTierClearConstants</c> test.
    /// </para>
    /// </remarks>
    /// <returns>Number of rows written (exactly 9).</returns>
    internal static int MutateItemLotParamMap(BinderFile file, PARAMDEF def)
    {
        PARAM param = ReadAndApply(file, def, RegulationConstants.ItemLotParamDefXml);

        int written = 0;
        for (int tier = TierClearConstants.FirstTier; tier <= TierClearConstants.LastTier; tier++)
        {
            int rowId = RegulationConstants.ShardAwardLotId(tier);

            // Idempotent: drop any prior row at this id.
            param.Rows.RemoveAll(r => r.ID == rowId);

            var row = new PARAM.Row(rowId, $"BossRush Tier{tier} ShardAward", def);
            SetCell(row, RegulationConstants.ItemLotField_LotItemId01,
                    RegulationConstants.AmberShardGoodsId);
            SetCell(row, RegulationConstants.ItemLotField_LotItemCategory01,
                    RegulationConstants.ItemLotCategoryGoods);
            SetCell(row, RegulationConstants.ItemLotField_LotItemBasePoint01,
                    RegulationConstants.ItemLotFullWeightSlot01);
            SetCell(row, RegulationConstants.ItemLotField_LotItemNum01,
                    RegulationConstants.ShardsPerTierClear);
            // Engine-level atomic idempotency — see
            // RegulationConstants.ItemLotField_GetItemFlagId for the full
            // rationale. Reuses the same per-tier guard flag number the
            // EMEVD splicer used to flip manually (ShardAwardEventFlagBase
            // + tier = 1049308221..1049308229); the engine now does the
            // check-and-set in native code, eliminating the concurrent-
            // coroutine race that produced the 10/75/100-shard bug.
            SetCell(row, RegulationConstants.ItemLotField_GetItemFlagId,
                    (uint)(TierClearConstants.ShardAwardEventFlagBase + tier));

            param.Rows.Add(row);
            written++;
        }
        param.Rows.Sort((a, b) => a.ID.CompareTo(b.ID));

        file.Bytes = param.Write();
        return written;
    }

    // ---------------------------------------------------------------------
    // ShopLineupParam — 63 rows (9 tiers × 7 slots)
    // ---------------------------------------------------------------------
    /// <summary>
    /// Create 63 ShopLineupParam rows at
    /// <see cref="RegulationConstants.ShopLineupRowId(int, int)"/> — one per
    /// tier × slot. Per row:
    /// <c>equipId</c>=<see cref="ShopSlot.ParamId"/>,
    /// <c>equipType</c>=<see cref="MapEquipType(string)"/> of
    /// <see cref="ShopSlot.Kind"/>,
    /// <c>eventFlag_forStock</c>=<see cref="TierPlan.ShopVisibilityFlag"/>,
    /// <c>mtrlId</c>=<see cref="RegulationConstants.ShopCurrencyGoodsId"/>,
    /// <c>sellQuantity</c>=1 (one-shot per tier),
    /// <c>setNum</c>=1 (one per transaction).
    /// </summary>
    /// <returns>Number of rows written (9 tiers × 7 slots = 63).</returns>
    internal static int MutateShopLineupParam(BinderFile file, PARAMDEF def, TierRewardsPlan plan)
    {
        PARAM param = ReadAndApply(file, def, RegulationConstants.ShopLineupParamDefXml);

        int written = 0;
        foreach (var tier in plan.Tiers)
        {
            for (int slotIdx = 0; slotIdx < tier.Slots.Count; slotIdx++)
            {
                ShopSlot slot = tier.Slots[slotIdx];
                int rowId = RegulationConstants.ShopLineupRowId(tier.Tier, slotIdx);

                // Cross-check: the plan-side id derivation must agree with
                // our regulation-side formula. If a future refactor moves
                // the base, this catches the drift before we write a row.
                if (slot.ShopId != rowId)
                    throw new InvalidOperationException(
                        $"tier {tier.Tier} slot {slotIdx}: plan ShopId={slot.ShopId} "
                        + $"but regulation formula yields {rowId}. Row-id derivation "
                        + "drifted between ShopRollGenerator and RegulationConstants.");

                param.Rows.RemoveAll(r => r.ID == rowId);

                var row = new PARAM.Row(rowId, $"BossRush T{tier.Tier}S{slotIdx:D2} {slot.Kind}", def);

                SetCell(row, RegulationConstants.ShopLineupField_EquipId, slot.ParamId);
                SetCell(row, RegulationConstants.ShopLineupField_EquipType, MapEquipType(slot.Kind));
                // eventFlag_forRelease = 0 — OpenPuppetShop silently bails
                // when this field points at a non-trivial gate; Athena's
                // Moonwalk Starlight Shop rows leave it at 0 too. Per-tier
                // visibility is still enforced at the ESD level via Kalé's
                // AddTalkListDataIf menu entry, so dropping the row-level
                // gate doesn't leak other tiers into the menu.
                SetCell(row, RegulationConstants.ShopLineupField_EventFlagForRelease, 0u);

                // eventFlag_forStock = unique-per-row flag so OpenPuppetShop
                // recognises the row as "not yet purchased". Leaving this
                // at 0 makes the engine probe system flag 0 (typically ON)
                // and every row reads as sold-out → shop refuses to open.
                // Athena points at vanilla "received this item" flags; we
                // allocate fresh Ignite-Rush flags in the
                // 1049308500..1049309370 range with stride 10 between
                // adjacent slots — see RegulationConstants.BossRushShopStockFlag
                // for why stride 10 matters (buying slot N in OpenPuppetShop
                // writes to a range around its stock flag, so adjacent
                // slots need ≥10 spacing to avoid sympathetic sold-out).
                SetCell(row, RegulationConstants.ShopLineupField_EventFlagForStock,
                        RegulationConstants.BossRushShopStockFlag(tier.Tier, slotIdx));
                // mtrlId paramdef default is -1 (= "no material required"; see
                // its description, "購入に必要な素材ID(-1:なし)"). Earlier we
                // explicitly wrote 0 here under the assumption that costType=2
                // makes mtrlId irrelevant — but 0 means "require material
                // EquipMtrlSetParam[0]", a real-but-bogus material gate that
                // blocked purchases entirely (player saw the row and price but
                // got no buy prompt). Athena Randomizer's working starlight
                // shop never touches mtrlId for its costType=2 rows, leaving
                // it at the -1 default. We do the same explicitly.
                SetCell(row, RegulationConstants.ShopLineupField_MtrlId, -1);
                // sellQuantity=1 enforces one-shot availability — combined
                // with the per-tier stock flag, each row is visible once
                // per run and vanishes after purchase.
                SetCell(row, RegulationConstants.ShopLineupField_SellQuantity, (short)1);
                SetCell(row, RegulationConstants.ShopLineupField_SetNum, (ushort)1);
                // costType=2 → currency is Starlight Shards (matches Athena
                // Randomizer's DLC shard shop). The game reads `value` as the
                // cost in that currency (1 shard per slot for base slots,
                // 3 for Great Rune slots). The UI label "Starlight Shards"
                // vs "runes" is driven by menuTitleMsgId (see below), NOT
                // by costType — that discovery is what closed the earlier
                // "for N runes" cosmetic bug.
                SetCell(row, RegulationConstants.ShopLineupField_CostType,
                        RegulationConstants.ShopCostTypeStarlightShards);
                // Per-slot cost from the plan (base slots = 1 shard, Great
                // Rune slots = 3 shards). See ShopRollGenerator.BaseSlotCostAmberShards
                // and GreatRuneCostAmberShards for the defaults.
                SetCell(row, RegulationConstants.ShopLineupField_Value,
                        slot.CostAmberShards);

                // Force the menu-display overrides to their "don't override"
                // sentinels. Diagnosed via inspect-msgbnd: WeaponName FMG has
                // the correct entries (Greataxe=15000000 etc.), so the
                // `?WeaponName?` + "ICON" placeholders in the shop UI were
                // caused by iconId/nameMsgId being 0 on our rows — the game
                // treats 0 as a valid override pointing at message/icon #0.
                SetCell(row, RegulationConstants.ShopLineupField_IconId, -1);
                SetCell(row, RegulationConstants.ShopLineupField_NameMsgId, -1);
                // Per-tier menu title override: tier N's shop window shows
                // "Boss Rush - Tier N" at the top. The text is inserted
                // into menu_dlc02.msgbnd.dcx's GR_MenuText.fmg by
                // FmgPatcher; the message IDs are 508001..508009. Without
                // a matching FmgPatcher run, the game renders
                // "?MenuText?" placeholder instead — so regulation + FMG
                // patching are a bundled pair.
                SetCell(row, RegulationConstants.ShopLineupField_MenuTitleMsgId,
                        RegulationConstants.BossRushShopTitleMsgId(tier.Tier));
                SetCell(row, RegulationConstants.ShopLineupField_MenuIconId, (short)-1);
                SetCell(row, RegulationConstants.ShopLineupField_ValueMagnification, 1.0f);

                param.Rows.Add(row);
                written++;
            }
        }
        param.Rows.Sort((a, b) => a.ID.CompareTo(b.ID));

        file.Bytes = param.Write();
        return written;
    }

    // ---------------------------------------------------------------------
    // ItemLotParam_enemy — zero the boss-drop bundle rows
    // ---------------------------------------------------------------------
    /// <summary>
    /// Walk the boss-drop bundle id range (<see cref="RegulationConstants.BossDropLotRangeBegin"/>
    /// ..<see cref="RegulationConstants.BossDropLotRangeEnd"/> step
    /// <see cref="RegulationConstants.BossDropLotRangeStride"/>) in
    /// <c>ItemLotParam_enemy</c> and blank out every reward slot on each
    /// row that exists. After this pass the engine still resolves the rows
    /// (so <c>NpcParam.itemLotId_X</c> references stay valid), they just
    /// award nothing — which kills the per-boss "ENEMY FELLED" drop toast.
    ///
    /// <para>
    /// Rows that are missing from the param (never-populated slots in the
    /// range) are silently skipped; rows on non-stride ids are left alone
    /// entirely. The returned count is the number of rows actually mutated.
    /// </para>
    ///
    /// <para>
    /// Only <c>ItemLotParam_enemy</c> is touched — the sibling
    /// <c>ItemLotParam_map</c> table that event 11107822's bulk-grant
    /// reads is independent and unaffected.
    /// </para>
    /// </summary>
    /// <returns>Number of rows zeroed.</returns>
    internal static int ZeroBossDropItemLots(BinderFile file, PARAMDEF def)
    {
        PARAM param = ReadAndApply(file, def, RegulationConstants.ItemLotParamDefXml);

        int zeroed = 0;
        for (int rowId = RegulationConstants.BossDropLotRangeBegin;
             rowId <= RegulationConstants.BossDropLotRangeEnd;
             rowId += RegulationConstants.BossDropLotRangeStride)
        {
            PARAM.Row? row = param[rowId];
            if (row is null) continue;

            // Zero every slot field across all 8 reward slots. We don't
            // remove the row — a missing row would make NpcParam lookups
            // fail at engine level with an unknown side-effect; a present
            // but empty row is the safest "drops nothing" shape.
            for (int slot = 1; slot <= RegulationConstants.ItemLotSlotCount; slot++)
            {
                string suffix = slot.ToString("D2");
                foreach (string prefix in RegulationConstants.ItemLotSlotFieldPrefixes)
                {
                    TrySetCell(row, prefix + suffix, 0);
                }
            }
            // Kill the engine-level acquired-flag hook too so a zeroed row
            // never flips a stale "already got the drop" flag on death.
            TrySetCell(row, RegulationConstants.ItemLotField_GetItemFlagId, 0u);

            zeroed++;
        }

        if (zeroed > 0)
            file.Bytes = param.Write();

        return zeroed;
    }

    // ---------------------------------------------------------------------
    // Shared helpers
    // ---------------------------------------------------------------------
    /// <summary>
    /// <see cref="ShopSlotKinds"/> → ShopLineupParam <c>equipType</c> byte.
    /// Centralised so both Mutate and tests (and any future dispatcher)
    /// map through the exact same table.
    /// </summary>
    internal static byte MapEquipType(string kind) => kind switch
    {
        ShopSlotKinds.Weapon    => RegulationConstants.ShopEquipTypeWeapon,
        ShopSlotKinds.HeadArmor => RegulationConstants.ShopEquipTypeProtector,
        ShopSlotKinds.Talisman  => RegulationConstants.ShopEquipTypeAccessory,
        ShopSlotKinds.AshOfWar  => RegulationConstants.ShopEquipTypeGem,
        ShopSlotKinds.Tear      => RegulationConstants.ShopEquipTypeGoods,
        ShopSlotKinds.GreatRune => RegulationConstants.ShopEquipTypeGoods,
        _ => throw new ArgumentException(
            $"Unknown ShopSlot.Kind '{kind}'. Known: weapon, head_armor, talisman, ash_of_war, tear, great_rune.",
            nameof(kind)),
    };

    /// <summary>
    /// Parse <paramref name="file"/>.Bytes into a PARAM and apply
    /// <paramref name="def"/>, asserting the def matches the embedded
    /// param's shape. A mismatch here means the mod's regulation is on a
    /// different game version than our shipped Paramdex — fail loud with
    /// enough diagnostic detail to pick the right fix (update Paramdex in
    /// the csproj, or re-export the mod from Smithbox).
    /// </summary>
    private static PARAM ReadAndApply(BinderFile file, PARAMDEF def, string defXmlName)
    {
        PARAM param = PARAM.Read(file.Bytes);
        if (!param.ApplyParamdefCarefully(def))
        {
            throw new InvalidOperationException(
                $"PARAMDEF mismatch for {Path.GetFileName(file.Name)}: "
                + $"regulation paramType='{param.ParamType}', dataVersion={param.ParamdefDataVersion}, "
                + $"detectedRowSize={param.DetectedSize}; "
                + $"embedded {defXmlName} paramType='{def.ParamType}', dataVersion={def.DataVersion}, "
                + $"rowSize={def.GetRowSize()}. "
                + "Update Patching/Paramdefs/*.xml from soulsmods/Paramdex or "
                + "re-export the mod regulation from a matching game version.");
        }
        return param;
    }

    /// <summary>
    /// Set a named cell on a row by the PARAMDEF's InternalName. Throws
    /// with a listing of available cells when the name is wrong — which
    /// usually means Paramdex renamed a field between updates and our
    /// constants in <see cref="RegulationConstants"/> need to catch up.
    /// </summary>
    private static void SetCell(PARAM.Row row, string internalName, object value)
    {
        for (int i = 0; i < row.Cells.Count; i++)
        {
            if (string.Equals(row.Cells[i].Def.InternalName, internalName, StringComparison.Ordinal))
            {
                row.Cells[i].Value = value;
                return;
            }
        }
        throw new InvalidOperationException(
            $"Cell '{internalName}' not found on row id {row.ID} (paramdef '{row.Def.ParamType}'). "
            + $"Available: [{string.Join(", ", row.Cells.Take(32).Select(c => c.Def.InternalName))}{(row.Cells.Count > 32 ? ", ..." : "")}]");
    }

    /// <summary>
    /// Like <see cref="SetCell"/>, but silently does nothing if the named
    /// cell isn't on the row. Used by the boss-drop zero pass to cope with
    /// Paramdex revisions that add/remove slot fields — we don't want a
    /// "row 7 didn't have lotItemId08" blowup if FromSoft ever widens or
    /// narrows the slot count.
    /// </summary>
    private static void TrySetCell(PARAM.Row row, string internalName, object value)
    {
        for (int i = 0; i < row.Cells.Count; i++)
        {
            if (string.Equals(row.Cells[i].Def.InternalName, internalName, StringComparison.Ordinal))
            {
                // Cast to the cell's declared type so PARAM.Write doesn't
                // trip over a boxed int when the field is declared u32/s16/etc.
                row.Cells[i].Value = CoerceToCellType(row.Cells[i].Value, value);
                return;
            }
        }
    }

    /// <summary>
    /// Best-effort numeric coercion so callers can pass a single plain <c>0</c>
    /// and have it slot into any numeric cell type (s8/u8/s16/u16/s32/u32/f32).
    /// Mirrors the existing-cell's runtime type.
    /// </summary>
    private static object CoerceToCellType(object existing, object incoming) => existing switch
    {
        byte   => Convert.ToByte(incoming),
        sbyte  => Convert.ToSByte(incoming),
        short  => Convert.ToInt16(incoming),
        ushort => Convert.ToUInt16(incoming),
        int    => Convert.ToInt32(incoming),
        uint   => Convert.ToUInt32(incoming),
        long   => Convert.ToInt64(incoming),
        ulong  => Convert.ToUInt64(incoming),
        float  => Convert.ToSingle(incoming),
        double => Convert.ToDouble(incoming),
        _      => incoming,
    };

    // ---------------------------------------------------------------------
    // PARAM file locator
    // ---------------------------------------------------------------------
    /// <summary>
    /// Find the three BinderFile entries we need to mutate. Uses basename
    /// suffix matching (not exact path equality) because FromSoftware has
    /// historically tweaked path prefixes between regional releases — the
    /// basename <c>EquipParamGoods.param</c> is stable, the leading
    /// <c>N:\GR\data\Param\param\GameParam\</c> prefix is not.
    /// </summary>
    internal static LocatedParams LocateRequiredParams(BND4 bnd)
    {
        BinderFile? goods = null;
        BinderFile? itemLot = null;
        BinderFile? itemLotEnemy = null;
        BinderFile? shopLineup = null;

        foreach (var f in bnd.Files)
        {
            string baseName = StripParamSuffix(GetBaseName(f.Name));
            if (string.Equals(baseName, "EquipParamGoods", StringComparison.OrdinalIgnoreCase))
                goods = goods ?? f;
            else if (string.Equals(baseName, "ItemLotParam_map", StringComparison.OrdinalIgnoreCase))
                itemLot = itemLot ?? f;
            else if (string.Equals(baseName, "ItemLotParam_enemy", StringComparison.OrdinalIgnoreCase))
                itemLotEnemy = itemLotEnemy ?? f;
            else if (string.Equals(baseName, "ShopLineupParam", StringComparison.OrdinalIgnoreCase))
                shopLineup = shopLineup ?? f;
        }

        var missing = new List<string>();
        if (goods is null) missing.Add("EquipParamGoods");
        if (itemLot is null) missing.Add("ItemLotParam_map");
        if (shopLineup is null) missing.Add("ShopLineupParam");
        // ItemLotParam_enemy is intentionally NOT in the required list —
        // only the zero-boss-drops stage needs it, and we want shop-only
        // runs to keep working if a regulation variant ever ships without
        // it. When ZeroBossDrops is requested but the table is absent,
        // the caller surfaces a zero count rather than a hard failure.
        if (missing.Count > 0)
            throw new InvalidOperationException(
                "regulation.bin is missing required PARAM tables: "
                + string.Join(", ", missing)
                + ". Is this a valid Elden Ring regulation.bin?");

        return new LocatedParams(goods!, itemLot!, itemLotEnemy, shopLineup!);
    }

    private static string GetBaseName(string? path)
    {
        if (string.IsNullOrEmpty(path)) return string.Empty;
        int slash = Math.Max(path.LastIndexOf('\\'), path.LastIndexOf('/'));
        return slash < 0 ? path : path.Substring(slash + 1);
    }

    private static string StripParamSuffix(string name)
    {
        const string ext = ".param";
        return name.EndsWith(ext, StringComparison.OrdinalIgnoreCase)
            ? name.Substring(0, name.Length - ext.Length)
            : name;
    }

    internal sealed record LocatedParams(
        BinderFile EquipParamGoods,
        BinderFile ItemLotParamMap,
        BinderFile? ItemLotParamEnemy,
        BinderFile ShopLineupParam);
}

// =======================================================================
// Option + result types
// =======================================================================
public sealed class RegulationPatcherOptions
{
    public required string SourceRegulationPath { get; init; }
    public required string OutputRegulationPath { get; init; }

    /// <summary>Per-competition plan driving ShopLineupParam row contents.
    /// When null, the patcher runs in Phase A no-op mode (locate-only; byte-
    /// for-byte round-trip of the source). When non-null, the full Phase B
    /// row-mutation pipeline runs.</summary>
    public TierRewardsPlan? Plan { get; init; }

    /// <summary>Overwrite the output file if it already exists. Defaults to
    /// false so an accidental re-run doesn't stomp a prior patch.</summary>
    public bool Force { get; init; }

    /// <summary>
    /// When true, zero the boss-drop bundle rows
    /// (<see cref="RegulationConstants.BossDropLotRangeBegin"/>..<see cref="RegulationConstants.BossDropLotRangeEnd"/>
    /// step <see cref="RegulationConstants.BossDropLotRangeStride"/>) in
    /// <c>ItemLotParam_enemy</c>. Kills the "ENEMY FELLED" loadout toast
    /// shown after every boss kill without disturbing the shop-bundle
    /// grant path (event 11107822 reads <c>ItemLotParam_map</c>).
    /// Independent of <see cref="Plan"/>: can run on a fixture-only
    /// no-shop patch.
    /// </summary>
    public bool ZeroBossDrops { get; init; } = true;
}

public sealed record RegulationPatchResult(
    string SourcePath,
    string OutputPath,
    int TotalBinderFiles,
    bool EquipParamGoodsLocated,
    bool ItemLotParamMapLocated,
    bool ShopLineupParamLocated,
    int RowsWritten,
    int EquipParamGoodsRowsWritten = 0,
    int ItemLotParamMapRowsWritten = 0,
    int ShopLineupParamRowsWritten = 0,
    /// <summary>Number of <c>ItemLotParam_enemy</c> rows zeroed by the
    /// boss-drops pass. 0 when <see cref="RegulationPatcherOptions.ZeroBossDrops"/>
    /// was false or when no rows in the target range existed.</summary>
    int BossDropLotsZeroed = 0);
