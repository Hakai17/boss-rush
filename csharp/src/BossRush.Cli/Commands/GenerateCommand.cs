// SPDX-License-Identifier: GPL-3.0-only
using System;
using BossRush.Core.Generation;

namespace BossRush.Cli.Commands;

internal static class GenerateCommand
{
    private const string Usage = """
bossrush generate — roll deterministic drops.json (Step 5 equivalent).

  --seed            <hex>    seed (auto-minted if omitted)
  --flag-pool       <path>
  --exclusions      <path>
  --boss-catalog    <path>
  --out-dir         <path>   destination dir (drops.json / SEED_INFO.txt / integrity.sha256)
""";

    public static int Execute(string[] args)
    {
        var p = new ArgParser(
            knownOptions: new[] { "--seed", "--flag-pool", "--exclusions",
                                  "--boss-catalog", "--out-dir" },
            knownFlags: new[] { "--help" });
        p.Parse(args);
        if (p.HasFlag("--help")) { Console.WriteLine(Usage); return 0; }

        string? seed = p.Optional("--seed");
        string origin = seed is null ? "auto-minted (128-bit)" : "user-supplied";
        if (seed is null) seed = DropGeneratorOptions.MintRandomSeed();

        var opts = new DropGeneratorOptions
        {
            Seed            = seed,
            FlagPoolPath    = p.Required("--flag-pool"),
            ExclusionsPath  = p.Required("--exclusions"),
            BossCatalogPath = p.Required("--boss-catalog"),
            SeedOrigin      = origin,
        };
        string outDir = p.Required("--out-dir");

        var result = new DropGenerator(opts).Generate(outDir);
        Console.WriteLine($"Seed              : {seed} ({origin})");
        Console.WriteLine($"Bosses            : {result.BossCount}");
        Console.WriteLine($"drops.canonical   : {result.Fingerprint}");
        Console.WriteLine($"drops.json        : {result.DropsPath}");
        return 0;
    }
}
