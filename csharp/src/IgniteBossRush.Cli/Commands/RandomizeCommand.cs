// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.IO;
using IgniteBossRush.Core.Pipeline;

namespace IgniteBossRush.Cli.Commands;

internal static class RandomizeCommand
{
    private const string Usage = """
igniterush randomize — merge a boss-rush patched_mod into Elden Ring Item and Enemy Randomizer
and write a Seed-5 style Mod Engine 2 folder (randomizer/ + patched_mod/ + launchmod_rando.bat).

  --patched-mod   <path>   pipeline patched_mod directory (must contain regulation.bin)
  --out-dir       <path>   launch folder to create
  --randomizer    <path>   folder that contains EldenRingRandomizer.exe
                           (default: D:\Games\mods\elden\randomizer)
  --options-opt   <path>   .randomizeopt to copy options from
                           (default: boss rush.randomizeopt)
  --shop-pool     <path>   shop_pool.json used to re-roll the Kalé shop
  --source-regulation <path>  1.17.1-rebased source regulation.bin
  --shop-seed     <hex>    Kalé shop seed to record (with --keep-shop)
  --keep-shop              do not re-roll the shop (use the regulation already
                           in --patched-mod). run --randomize passes this after
                           minting a fresh shop seed.
""";

    public static int Execute(string[] args)
    {
        var p = new ArgParser(
            knownOptions: new[]
            {
                "--patched-mod", "--out-dir", "--randomizer",
                "--options-opt", "--shop-pool", "--source-regulation", "--shop-seed",
            },
            knownFlags: new[] { "--help", "--keep-shop" });
        p.Parse(args);
        if (p.HasFlag("--help"))
        {
            Console.WriteLine(Usage);
            return 0;
        }

        var opts = new RandomizerMergeOptions
        {
            PatchedModDir = Path.GetFullPath(p.Required("--patched-mod")),
            OutDir = Path.GetFullPath(p.Required("--out-dir")),
            RandomizerDir = p.Optional("--randomizer"),
            OptionsOpt = p.Optional("--options-opt"),
            ShopPool = p.Optional("--shop-pool"),
            SourceRegulation = p.Optional("--source-regulation"),
            ShopSeed = p.Optional("--shop-seed"),
            KeepShop = p.HasFlag("--keep-shop"),
        };

        var progress = new Progress<string>(Console.WriteLine);
        return RandomizerMerge.Run(opts, progress);
    }
}
