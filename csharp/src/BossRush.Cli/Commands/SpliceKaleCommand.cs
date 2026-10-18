// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.IO;
using BossRush.Core.Io;
using BossRush.Core.Patching;

namespace BossRush.Cli.Commands;

/// <summary>
/// <c>bossrush splice-kale</c> — run ONLY the KaleShopMenuSplicer against a
/// talkesdbnd.dcx, skipping the rest of the pipeline. Diagnostic tool used to
/// validate the ESD splice independently when other pipeline stages (EMEVD
/// dispatch rewiring, regulation patch, etc.) are failing or unavailable.
///
/// <para>Copies <c>--in</c> to <c>--out</c> (creating parent dirs as needed),
/// mutates <c>t314001110.esd</c> inside the copy via
/// <see cref="KaleShopMenuSplicer"/>, then reports per-tier statistics.</para>
/// </summary>
internal static class SpliceKaleCommand
{
    private const string Usage = """
bossrush splice-kale — run ONLY the Kalé shop-menu splicer on a talkesdbnd.dcx.

  --in   <path>    Source talkesdbnd.dcx (read-only; not modified).
  --out  <path>    Destination talkesdbnd.dcx (created/overwritten).
  --force          Overwrite --out if it already exists.
""";

    public static int Execute(string[] args)
    {
        var p = new ArgParser(
            knownOptions: new[] { "--in", "--out" },
            knownFlags: new[] { "--help", "--force" });
        p.Parse(args);
        if (p.HasFlag("--help")) { Console.WriteLine(Usage); return 0; }

        string inPath  = p.Required("--in");
        string outPath = p.Required("--out");
        bool force = p.HasFlag("--force");

        if (!File.Exists(inPath))
            throw new CliUsageException($"--in file not found: {inPath}");
        if (File.Exists(outPath) && !force)
            throw new CliUsageException($"--out already exists (pass --force to overwrite): {outPath}");

        Directory.CreateDirectory(Path.GetDirectoryName(Path.GetFullPath(outPath))!);
        File.Copy(inPath, outPath, overwrite: true);
        Console.WriteLine($"Copied {inPath} → {outPath}");

        var loaded = EsdIo.LoadFromBnd(outPath, "t314001110.esd");
        var result = KaleShopMenuSplicer.Apply(loaded.Esd);
        if (result.AlreadyPresent)
        {
            Console.WriteLine("Kalé menu splice: already present (idempotent no-op).");
            return 0;
        }
        EsdIo.SaveToBnd(loaded, outPath);

        Console.WriteLine($"Kalé menu splice: inserted {result.TierEntries.Count} tier entries into group {KaleShopMenuSplicer.KaleMainMenuGroupId}.");
        foreach (var e in result.TierEntries)
        {
            Console.WriteLine(
                $"  tier {e.Tier}: menuIndex={e.MenuIndex} newStateId={e.NewStateId} " +
                $"visibilityFlag={e.VisibilityFlag} shopRows={e.ShopStartRow}..{e.ShopEndRow}");
        }
        return 0;
    }
}
