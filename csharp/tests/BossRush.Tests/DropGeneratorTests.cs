// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using BossRush.Core.Generation;
using Xunit;

namespace BossRush.Tests;

/// <summary>
/// End-to-end smoke + determinism tests for <see cref="DropGenerator"/>
/// driven by synthetic fixtures rather than the full mod data. Keeps the
/// tests hermetic (no dependency on step2-flag-pool/step3-exclusions output
/// being present), while still exercising pool construction, boss dedupe,
/// canonical hashing and drops.json emission.
/// </summary>
public class DropGeneratorTests
{
    [Fact]
    public void Generate_SameSeed_TwiceProducesIdenticalBytes()
    {
        using var fx = new TempFixture();
        fx.WriteMinimalInputs();

        string outA = Path.Combine(fx.Root, "runA");
        string outB = Path.Combine(fx.Root, "runB");
        var opts = new DropGeneratorOptions
        {
            Seed = "deterministic-test-seed",
            FlagPoolPath = fx.FlagPoolPath,
            ExclusionsPath = fx.ExclusionsPath,
            BossCatalogPath = fx.BossCatalogPath,
            FixedTimestampUtc = "2026-01-01T00:00:00.000000+00:00",
        };
        var r1 = new DropGenerator(opts).Generate(outA);
        var r2 = new DropGenerator(opts).Generate(outB);

        Assert.Equal(r1.Fingerprint, r2.Fingerprint);
        byte[] a = File.ReadAllBytes(r1.DropsPath);
        byte[] b = File.ReadAllBytes(r2.DropsPath);
        Assert.Equal(a, b); // byte-identical drops.json
    }

    [Fact]
    public void Generate_DifferentSeeds_ProduceDifferentFingerprints()
    {
        using var fx = new TempFixture();
        fx.WriteMinimalInputs();

        string outA = Path.Combine(fx.Root, "a");
        string outB = Path.Combine(fx.Root, "b");
        var optsA = Opts(fx, "seed-alpha");
        var optsB = Opts(fx, "seed-beta");

        var r1 = new DropGenerator(optsA).Generate(outA);
        var r2 = new DropGenerator(optsB).Generate(outB);
        Assert.NotEqual(r1.Fingerprint, r2.Fingerprint);
    }

    [Fact]
    public void Generate_DropsJson_HasMetaAndPerBossCategories()
    {
        using var fx = new TempFixture();
        fx.WriteMinimalInputs();
        string outDir = Path.Combine(fx.Root, "run");
        var r = new DropGenerator(Opts(fx, "seed-x")).Generate(outDir);

        using var doc = JsonDocument.Parse(File.ReadAllBytes(r.DropsPath));
        var root = doc.RootElement;
        Assert.Equal(JsonValueKind.Object, root.GetProperty("meta").ValueKind);
        Assert.Equal(JsonValueKind.Object, root.GetProperty("drops").ValueKind);
        Assert.Equal(r.Fingerprint, root.GetProperty("meta").GetProperty("fingerprint_sha256").GetString());

        // Two bosses in fixture → two entries in drops, each with all 6 categories.
        int bossCount = 0;
        foreach (var boss in root.GetProperty("drops").EnumerateObject())
        {
            bossCount++;
            foreach (var cat in new[] { "weapon", "armor", "talisman", "spell", "aow_tool", "ashes_tear" })
                Assert.True(boss.Value.TryGetProperty(cat, out _), $"boss {boss.Name} missing {cat}");
        }
        Assert.Equal(2, bossCount);
    }

    [Fact]
    public void Generate_ExcludesCraftAndPureStones_FromPools()
    {
        using var fx = new TempFixture();
        // Build inputs where half the lots are excluded; the fingerprint still
        // has to be stable across re-runs, and excluded_counts should be
        // populated accordingly.
        fx.WriteMinimalInputs();
        var r = new DropGenerator(Opts(fx, "seed-exclude")).Generate(Path.Combine(fx.Root, "r"));

        Assert.True(r.ExcludedCounts["craft"] >= 1);
        Assert.True(r.ExcludedCounts["stone"] >= 1);
    }

    private static DropGeneratorOptions Opts(TempFixture fx, string seed) => new()
    {
        Seed = seed,
        FlagPoolPath = fx.FlagPoolPath,
        ExclusionsPath = fx.ExclusionsPath,
        BossCatalogPath = fx.BossCatalogPath,
        FixedTimestampUtc = "2026-01-01T00:00:00.000000+00:00",
    };

    // ------------------------------------------------------------------
    // Fixture helper: writes synthetic flag_pool/exclusions/boss_catalog
    // inside a temp dir that auto-cleans on disposal.
    // ------------------------------------------------------------------
    private sealed class TempFixture : IDisposable
    {
        public string Root { get; }
        public string FlagPoolPath => Path.Combine(Root, "flag_pool.json");
        public string ExclusionsPath => Path.Combine(Root, "exclusions.json");
        public string BossCatalogPath => Path.Combine(Root, "boss_catalog.json");

        public TempFixture()
        {
            Root = Path.Combine(Path.GetTempPath(),
                "bossrush-tests-" + Guid.NewGuid().ToString("N"));
            Directory.CreateDirectory(Root);
        }

        public void WriteMinimalInputs()
        {
            // Flag pool: each category gets 3 lots with distinct ids; lot 9001
            // is marked as a crafting material (excluded), lot 9002 is a pure
            // stone (excluded). Non-ASCII category "junk" is present once to
            // exercise the unknown_cat skip path.
            var flagPool = new
            {
                award_flag_to_itemlot = new Dictionary<string, object>
                {
                    ["1001"] = new { mod_category = "weapon",   itemlots = Lots(1000, 1001, 1002, 9001) },
                    ["1002"] = new { mod_category = "armor",    itemlots = Lots(2000, 2001, 2002, 9002) },
                    ["1003"] = new { mod_category = "talisman", itemlots = Lots(3000, 3001, 3002) },
                    ["1004"] = new { mod_category = "spell",    itemlots = Lots(4000, 4001, 4002) },
                    ["1005"] = new { mod_category = "aow_tool", itemlots = Lots(5000, 5001, 5002) },
                    ["1006"] = new { mod_category = "ashes_tear", itemlots = Lots(6000, 6001, 6002) },
                    ["1099"] = new { mod_category = "junk",     itemlots = Lots(8000) },
                }
            };
            File.WriteAllText(FlagPoolPath, JsonSerializer.Serialize(flagPool));

            var exclusions = new
            {
                crafting_materials = new { itemlot_ids = new[] { 9001 } },
                smithing_stones = new
                {
                    lot_classification = new Dictionary<string, object>
                    {
                        ["9002"] = new { verdict = "pure_stone" },
                        ["2001"] = new { verdict = "upgrade_set" }, // not excluded
                    }
                }
            };
            File.WriteAllText(ExclusionsPath, JsonSerializer.Serialize(exclusions));

            var bossCatalog = new
            {
                bosses = new object[]
                {
                    new { boss_flag = 42, reward_event = 90001032, file = "m10_00.js", line = 10, raw_args = new[] { 42, 1, 2, 3, 4, 5, 6 } },
                    new { boss_flag = 7,  reward_event = 90001033, file = "m10_00.js", line = 20, raw_args = new[] { 7, 1, 2, 3, 4, 5, 6 } },
                    // Duplicate of boss 42 from a later file; must be deduped.
                    new { boss_flag = 42, reward_event = 90001032, file = "m20_00.js", line = 5,  raw_args = new[] { 42, 1, 2, 3, 4, 5, 6 } },
                }
            };
            File.WriteAllText(BossCatalogPath, JsonSerializer.Serialize(bossCatalog));
        }

        private static object[] Lots(params int[] ids)
        {
            var arr = new object[ids.Length];
            for (int i = 0; i < ids.Length; i++) arr[i] = new { lot_id = ids[i] };
            return arr;
        }

        public void Dispose()
        {
            try { if (Directory.Exists(Root)) Directory.Delete(Root, recursive: true); }
            catch { /* best effort */ }
        }
    }
}
