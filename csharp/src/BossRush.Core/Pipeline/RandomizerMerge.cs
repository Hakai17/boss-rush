// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.IO;

namespace BossRush.Core.Pipeline;

/// <summary>
/// Reads seed notes left beside a playable folder the player built themselves.
/// This project does not launch Elden Ring Item and Enemy Randomizer.
/// </summary>
public static class RandomizerMerge
{
    public static RandomizerSeedInfo? ReadSeedInfo(string playableDir)
    {
        string path = Path.Combine(playableDir, "RANDOMIZER_SEED.txt");
        if (!File.Exists(path))
            return null;

        string? enemy = null;
        string? shop = null;
        foreach (string line in File.ReadAllLines(path))
        {
            if (line.StartsWith("Enemy randomizer seed:", StringComparison.OrdinalIgnoreCase))
                enemy = line["Enemy randomizer seed:".Length..].Trim();
            else if (line.StartsWith("Kalé shop seed:", StringComparison.OrdinalIgnoreCase)
                     || line.StartsWith("Kale shop seed:", StringComparison.OrdinalIgnoreCase))
                shop = line[(line.IndexOf(':') + 1)..].Trim();
        }

        return new RandomizerSeedInfo(enemy ?? "", shop ?? "");
    }
}

public sealed record RandomizerSeedInfo(string EnemySeed, string ShopSeed);
