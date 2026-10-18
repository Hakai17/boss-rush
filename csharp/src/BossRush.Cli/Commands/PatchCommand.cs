// SPDX-License-Identifier: GPL-3.0-only
using System;
using BossRush.Core.Patching;

namespace BossRush.Cli.Commands;

internal static class PatchCommand
{
    private const string Usage = """
bossrush patch — binary-patch event/*.emevd.dcx from existing drops.json.

  --drops           <path>   drops.json (from `bossrush generate`)
  --flag-pool       <path>
  --exclusions      <path>
  --boss-catalog    <path>
  --source-event    <path>   source mod's event/ folder (read-only)
  --out-event       <path>   destination event/ folder (created/overwritten)
  --force                    overwrite existing --out-event without prompting
""";

    public static int Execute(string[] args)
    {
        var p = new ArgParser(
            knownOptions: new[] { "--drops", "--flag-pool", "--exclusions",
                                  "--boss-catalog", "--source-event", "--out-event" },
            knownFlags: new[] { "--help", "--force" });
        p.Parse(args);
        if (p.HasFlag("--help")) { Console.WriteLine(Usage); return 0; }

        var opts = new EmevdPatcherOptions
        {
            DropsJsonPath   = p.Required("--drops"),
            FlagPoolPath    = p.Required("--flag-pool"),
            ExclusionsPath  = p.Required("--exclusions"),
            BossCatalogPath = p.Required("--boss-catalog"),
            SourceEventDir  = p.Required("--source-event"),
            OutputEventDir  = p.Required("--out-event"),
            Force           = p.HasFlag("--force"),
        };

        var result = new EmevdPatcher(opts).Patch();
        Console.WriteLine($"files modified         : {result.FilesModified}");
        Console.WriteLine($"reward events rebuilt  : {result.RewardEventsRebuilt}");
        Console.WriteLine($"dispatch branches      : {result.DispatchBranchesTotal}");
        Console.WriteLine($"crafting dispatcher    : {(result.CraftingDispatcherNeutered ? "neutered" : "untouched")}");
        Console.WriteLine($"caller sites edited    : {result.CallerSitesEdited}");
        Console.WriteLine($"stone args nulled      : {result.IndividualStoneArgsNulled}");
        Console.WriteLine($"output                 : {result.OutputEventDir}");
        return 0;
    }
}
