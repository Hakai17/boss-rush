// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.IO;
using IgniteBossRush.Core.Generation;
using IgniteBossRush.Core.Io;
using IgniteBossRush.Core.Models;
using IgniteBossRush.Core.Patching;

namespace IgniteBossRush.Cli.Commands;

/// <summary>
/// Standalone "Step 7" entry point: roll the shop tier_rewards.json and patch
/// regulation.bin against it. Mirrors the shop+regulation half of
/// <see cref="RunCommand"/> but skips drops/EMEVD/bundle work entirely so an
/// organiser can iterate on regulation patches without re-emitting the
/// patched event/ tree (which already takes the lion's share of pipeline
/// runtime). Determinism is identical: same seed + same shop_pool.json bytes
/// → byte-identical tier_rewards.json and the same 109 PARAM-row mutations.
/// </summary>
internal static class RegulateCommand
{
    private const string Usage = """
igniterush regulate — roll tier_rewards.json + patch regulation.bin (Step 7).

  --shop-pool          <path>   shop_pool.json (curated equipId pools per category)
  --seed               <hex>    seed (auto-minted if omitted)
  --source-regulation  <path>   source regulation.bin (e.g. mod/regulation.bin)
  --out-regulation     <path>   destination regulation.bin (parent dir created)
  --out-rewards-dir    <path>   directory to write tier_rewards.json into
                                (created; co-locates with the rewards fingerprint)
  --source-menu-msgbnd <path>   (optional) source menu_dlc02.msgbnd.dcx. When
                                provided alongside --out-menu-msgbnd, the
                                command patches the menu FMG to add per-tier
                                "Boss Rush - Tier N" titles so the shop window
                                doesn't render "?MenuText?" in-game.
  --out-menu-msgbnd    <path>   (optional) destination menu_dlc02.msgbnd.dcx.
  --force                       overwrite --out-regulation if it already exists
  --zero-boss-drops             also zero the ItemLotParam_enemy rows in the
                                boss-drop bundle range (1049301000..1049301370
                                step 10) so the per-boss "ENEMY FELLED" drop
                                toast awards nothing. Does not touch
                                ItemLotParam_map (event 11107822 still works).
""";

    public static int Execute(string[] args)
    {
        var p = new ArgParser(
            knownOptions: new[] { "--shop-pool", "--seed", "--source-regulation",
                                  "--out-regulation", "--out-rewards-dir",
                                  "--source-menu-msgbnd", "--out-menu-msgbnd" },
            knownFlags: new[] { "--help", "--force", "--zero-boss-drops" });
        p.Parse(args);
        if (p.HasFlag("--help")) { Console.WriteLine(Usage); return 0; }

        string shopPoolPath  = p.Required("--shop-pool");
        string srcRegulation = p.Required("--source-regulation");
        string outRegulation = p.Required("--out-regulation");
        string outRewardsDir = p.Required("--out-rewards-dir");
        string? sourceMenuMsgBnd = p.Optional("--source-menu-msgbnd");
        string? outMenuMsgBnd    = p.Optional("--out-menu-msgbnd");

        string? seed = p.Optional("--seed");
        string seedOrigin = seed is null ? "auto-minted (128-bit)" : "user-supplied";
        if (seed is null) seed = DropGeneratorOptions.MintRandomSeed();

        Console.WriteLine($"Seed              : {seed} ({seedOrigin})");
        Console.WriteLine($"shop_pool         : {shopPoolPath}");
        Console.WriteLine($"source regulation : {srcRegulation}");

        // --- 1. roll tier_rewards.json ---
        Directory.CreateDirectory(outRewardsDir);
        var shopOpts = new ShopRollGeneratorOptions
        {
            Seed         = seed,
            ShopPoolPath = shopPoolPath,
        };
        var shopResult = new ShopRollGenerator(shopOpts).Generate(outRewardsDir);
        Console.WriteLine($"tier_rewards.json : {shopResult.TierRewardsPath}");
        Console.WriteLine($"  fingerprint     : {shopResult.Fingerprint}");
        Console.WriteLine($"  tiers / slots   : {shopResult.TierCount} / {shopResult.SlotCount}");

        // Re-build the in-memory plan rather than re-parsing the JSON we just
        // wrote — keeps the source of truth (BuildPlan) in one place and saves
        // a round trip.
        var pool = JsonLoader.LoadFile<ShopPoolFile>(shopPoolPath);
        TierRewardsPlan plan = ShopRollGenerator.BuildPlan(seed, pool);

        // --- 2. patch regulation.bin ---
        var regOpts = new RegulationPatcherOptions
        {
            SourceRegulationPath = srcRegulation,
            OutputRegulationPath = outRegulation,
            Plan                 = plan,
            Force                = p.HasFlag("--force"),
            ZeroBossDrops        = p.HasFlag("--zero-boss-drops"),
        };
        var regResult = new RegulationPatcher(regOpts).Apply();

        Console.WriteLine($"patched regulation: {regResult.OutputPath}");
        Console.WriteLine($"  binder files    : {regResult.TotalBinderFiles}");
        Console.WriteLine($"  rows written    : {regResult.RowsWritten} "
                          + $"(goods={regResult.EquipParamGoodsRowsWritten}, "
                          + $"itemLot={regResult.ItemLotParamMapRowsWritten}, "
                          + $"shop={regResult.ShopLineupParamRowsWritten})");
        if (regResult.BossDropLotsZeroed > 0)
            Console.WriteLine($"  boss drops zero : {regResult.BossDropLotsZeroed} rows in ItemLotParam_enemy");

        // --- 3. menu FMG patch (optional) ---
        // Paired with regulation patching: shop rows reference message IDs
        // 508001..508009 for their per-tier window titles. Without this step,
        // the game renders "?MenuText?" in place of the title.
        if (sourceMenuMsgBnd is not null && outMenuMsgBnd is not null)
        {
            var titleEntries = new System.Collections.Generic.Dictionary<int, string>();
            for (int tier = 1; tier <= 9; tier++)
            {
                titleEntries[RegulationConstants.BossRushShopTitleMsgId(tier)] =
                    string.Format(System.Globalization.CultureInfo.InvariantCulture,
                                  RegulationConstants.BossRushShopTitleFormat, tier);
            }
            var fmgRes = FmgPatcher.Apply(
                sourceMsgBndPath: sourceMenuMsgBnd,
                outputPath: outMenuMsgBnd,
                targetFmgName: RegulationConstants.BossRushShopTitleFmgName,
                entries: titleEntries);
            Console.WriteLine($"patched menu FMG  : {fmgRes.OutputPath}");
            Console.WriteLine($"  DCX compression : {fmgRes.DcxCompressionType}");
            Console.WriteLine($"  target FMG      : {fmgRes.TargetFmgName}");
            Console.WriteLine($"  entries added   : {fmgRes.EntriesAdded}, replaced: {fmgRes.EntriesReplaced}");
            Console.WriteLine($"  total entries   : {fmgRes.TotalEntriesInFmg}");
        }
        else if (sourceMenuMsgBnd is not null || outMenuMsgBnd is not null)
        {
            Console.Error.WriteLine(
                "warning: --source-menu-msgbnd and --out-menu-msgbnd must be provided "
                + "together; skipping menu FMG patch (shop titles will render as '?MenuText?')");
        }

        return 0;
    }
}
