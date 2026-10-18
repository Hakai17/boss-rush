// SPDX-License-Identifier: GPL-3.0-only
using System;
using BossRush.Core.Pipeline;

namespace BossRush.Cli.Commands;

internal static class RunCommand
{
    private const string Usage = """
bossrush run — full pipeline: shop roll + regulation patch + boss-reward strip + Kalé menu + bundle.

  --source-mod      <path>   mod/ folder (must contain event/ subdir and regulation.bin)
  --shop-pool       <path>   shop_pool.json (drives the deterministic shop roll + regulation patch)
  --out-dir         <path>   output workspace (created; will contain generator/,
                             patched_mod/, competition_bundle/ subdirs)
  --seed            <hex>    optional user-supplied shop seed (auto-minted if omitted).
  --vanilla-regulation <path>  optional 1.17.1 game regulation.bin (auto-detected)
  --zero-boss-drops          optional flag. When set, zero the ItemLotParam_enemy
                             boss-drop rows and strip the InitializeCommonEvent
                             dispatch calls from common_func.emevd.dcx. Kills
                             the per-boss "ENEMY FELLED" loadout toast.
""";

    public static int Execute(string[] args)
    {
        var p = new ArgParser(
            knownOptions: new[] { "--source-mod", "--shop-pool", "--out-dir", "--seed", "--vanilla-regulation" },
            knownFlags: new[] { "--help", "--zero-boss-drops" });
        p.Parse(args);
        if (p.HasFlag("--help"))
        {
            Console.WriteLine(Usage);
            return 0;
        }

        string? seedArg = p.Optional("--seed");

        var opts = new PipelineOptions
        {
            SourceModDir    = p.Required("--source-mod"),
            ShopPoolPath    = p.Required("--shop-pool"),
            WorkDir         = p.Required("--out-dir"),
            Seed            = seedArg ?? "",
            SeedOrigin      = seedArg is null
                ? "auto-minted (128-bit)" : "user-supplied",
            ZeroBossDrops   = p.HasFlag("--zero-boss-drops"),
            VanillaRegulationPath = p.Optional("--vanilla-regulation"),
        };

        var runner = new PipelineRunner(opts);
        var progress = new Progress<string>(Console.WriteLine);
        var result = runner.Run(progress);

        Console.WriteLine();
        Console.WriteLine("=== SUCCESS ===");
        Console.WriteLine($"Seed               : {result.Seed} ({result.SeedOrigin})");
        Console.WriteLine($"Changed bundled fs : {result.ChangedFileCount}");
        Console.WriteLine();
        Console.WriteLine($"artifact_tree      : {result.ArtifactTree}");
        Console.WriteLine($"bundle_root        : {result.BundleRoot}    <-- pre-commit this");
        Console.WriteLine();
        Console.WriteLine($"Patched mod folder : {result.PatchedModDir}");
        Console.WriteLine($"Competition bundle : {result.BundleDir}");
        Console.WriteLine();
        Console.WriteLine($"tier_rewards.json  : {result.TierRewardsPath}");
        Console.WriteLine($"tier_rewards FP    : {result.TierRewardsFingerprint}");
        Console.WriteLine($"shop tiers/slots   : {result.ShopTierCount} / {result.ShopSlotCount}");
        Console.WriteLine($"Patched regulation : {result.PatchedRegulationPath}");
        Console.WriteLine($"Regulation rows    : {result.RegulationRowsWritten}");
        if (result.BossDropLotsZeroed > 0)
            Console.WriteLine($"Boss-drop lots     : {result.BossDropLotsZeroed} rows zeroed in ItemLotParam_enemy");
        if (result.BossRewardCallsStripped is int stripped && stripped > 0)
            Console.WriteLine($"Boss-reward calls  : {stripped} InitializeCommonEvent calls stripped from hub events");
        if (result.AwardItemLotsZeroed is int lotZeroed && lotZeroed > 0)
            Console.WriteLine($"AwardItemLot zeroed: {lotZeroed} (stones, tools, rune arcs)");
        if (result.CraftingDispatchersZeroed is int craftZeroed && craftZeroed > 0)
            Console.WriteLine($"Crafting dispatch   : {craftZeroed} InitializeCommonEvent(0, 90001003) zeroed");
        if (result.ReceiveAllLotsZeroed is int raZeroed && raZeroed > 0)
            Console.WriteLine($"Receive-all strip  : {raZeroed} AwardItemLot calls zeroed across "
                + $"{result.ReceiveAllEventsPatched} events in m11_10_00_00.emevd.dcx");
        Console.WriteLine(
            "Kale tier menu     : "
            + (result.KaleMenuEntriesInserted is int n
                ? $"inserted {n} tier entries into t600001110.esd"
                : result.KaleMenuAlreadyPresent == true
                    ? "already-present (idempotent re-patch)"
                    : "skipped"));

        Console.WriteLine();
        Console.WriteLine(RandomizeCommand.ManualMerge);
        Console.WriteLine($"patched_mod        : {result.PatchedModDir}");
        return 0;
    }
}
