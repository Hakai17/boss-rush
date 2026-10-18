// SPDX-License-Identifier: GPL-3.0-only
using System;

namespace BossRush.Cli.Commands;

internal static class RandomizeCommand
{
    internal const string ManualMerge = """
Enemy and starting-class randomization is a manual step in the official
Elden Ring Item and Enemy Randomizer (thefifthmatt). This tool does not
launch it.

  1. Generate a patched mod with `bossrush run`.
  2. Open EldenRingRandomizer.exe yourself.
  3. Use Merge other mod and select the patched_mod folder.
  4. Optional: import data/boss-rush.randomizeopt for the usual options
     (tarnished + changestats, no item randomizer).

SoulsRandomizers does not allow another distributed program to start or
drive the randomizer. Do not bundle EldenRingRandomizer.exe with Boss Rush.
""";

    public static int Execute(string[] args)
    {
        var p = new ArgParser(
            knownOptions: Array.Empty<string>(),
            knownFlags: new[] { "--help" });
        p.Parse(args);
        Console.WriteLine(ManualMerge);
        return p.HasFlag("--help") ? 0 : 2;
    }
}
