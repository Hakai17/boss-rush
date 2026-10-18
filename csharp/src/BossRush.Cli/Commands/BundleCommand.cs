// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.IO;
using BossRush.Core.Bundle;

namespace BossRush.Cli.Commands;

internal static class BundleCommand
{
    private const string Usage = """
bossrush bundle — build competition bundle from existing patched output.

  --tier-rewards     <path>  tier_rewards.json (optional; included in bundle)
  --patched-event-bin<path>  patched event/ folder (.emevd.dcx)
  --patched-event-js <path>  optional patched .js folder (omit to skip)
  --source-event     <path>  original event/ folder (for diff filtering)
  --out-dir          <path>  output bundle dir (created/overwritten)
  --seed             <hex>   seed string (for SEED_INFO.txt)
  --force                    overwrite existing --out-dir
""";

    public static int Execute(string[] args)
    {
        var p = new ArgParser(
            knownOptions: new[] { "--tier-rewards", "--patched-event-bin", "--patched-event-js",
                                  "--source-event", "--out-dir", "--seed" },
            knownFlags: new[] { "--help", "--force" });
        p.Parse(args);
        if (p.HasFlag("--help")) { Console.WriteLine(Usage); return 0; }

        string? jsDir = p.Optional("--patched-event-js");
        string placeholder = jsDir ?? Path.Combine(Path.GetTempPath(),
            "bossrush-empty-js-" + Guid.NewGuid().ToString("N"));
        if (jsDir is null) Directory.CreateDirectory(placeholder);

        try
        {
            var opts = new BundleBuilderOptions
            {
                TierRewardsJsonPath = p.Optional("--tier-rewards"),
                PatchedEventJsDir   = placeholder,
                PatchedEventBinDir  = p.Required("--patched-event-bin"),
                SourceEventDir      = p.Required("--source-event"),
                BundleDir           = p.Required("--out-dir"),
                Force               = p.HasFlag("--force"),
                Seed                = p.Optional("--seed") ?? "",
            };
            var result = new BundleBuilder(opts).Build();
            Console.WriteLine($"bundle              : {result.BundleDir}");
            Console.WriteLine($"seed                : {result.Seed}");
            Console.WriteLine($"artifact_tree       : {result.ArtifactTree}");
            Console.WriteLine($"bundle_root         : {result.BundleRoot}");
            Console.WriteLine($"changed files       : {result.ChangedFileCount}");
            return 0;
        }
        finally
        {
            if (jsDir is null && Directory.Exists(placeholder))
            {
                try { Directory.Delete(placeholder, recursive: true); } catch { }
            }
        }
    }
}
