// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.IO;
using IgniteBossRush.Core.Pipeline;
using SoulsFormats.Exceptions;
using Xunit;

namespace IgniteBossRush.Tests;

/// <summary>
/// End-to-end gating test for <see cref="PipelineRunner"/>. The simplified
/// pipeline always requires a shop pool — there is no longer a "legacy" path
/// without one. This test verifies that the runner produces all expected
/// outputs: tier_rewards.json, patched regulation.bin, patched common_func,
/// Kalé menu splice, and the competition bundle.
/// </summary>
public class PipelineRunnerTests
{
    private const string TestSeed = "pipeline-runner-gate-test";

    [Fact]
    public void Run_ProducesAllExpectedOutputs()
    {
        if (!TryLocateRepoFixtures(out var fx))
        {
            Assert.True(true, fx.SkipReason ?? "Fixtures not found.");
            return;
        }
        if (fx.ShopPoolPath is null)
        {
            Assert.True(true,
                "csharp/data/shop_pool.json not found. Skipped — required for the " +
                "pipeline test.");
            return;
        }

        string workDir = Path.Combine(Path.GetTempPath(),
            "ignite-pipeline-" + Guid.NewGuid().ToString("N"));
        try
        {
            var opts = new PipelineOptions
            {
                SourceModDir    = fx.SourceModDir,
                ShopPoolPath    = fx.ShopPoolPath,
                WorkDir         = workDir,
                Seed            = TestSeed,
                SeedOrigin      = "user-supplied",
            };
            PipelineResult result;
            try
            {
                result = new PipelineRunner(opts).Run();
            }
            catch (NoOodleFoundException ex)
            {
                Assert.True(true,
                    "Oodle native (oo2core_6_win64.dll) not loadable. Skipped — "
                    + "place the DLL next to the test assembly. Inner: " + ex.Message);
                return;
            }

            // Core outputs exist on disk.
            Assert.True(Directory.Exists(result.PatchedModDir),
                $"patched_mod missing at {result.PatchedModDir}");
            Assert.True(Directory.Exists(result.BundleDir),
                $"competition_bundle missing at {result.BundleDir}");

            // Shop + regulation stages activated.
            Assert.True(File.Exists(result.TierRewardsPath),
                $"tier_rewards.json missing at {result.TierRewardsPath}");
            Assert.False(string.IsNullOrEmpty(result.TierRewardsFingerprint));
            Assert.Equal(9, result.ShopTierCount);
            // Slot count is 63 base + lucky-tier bonus for Great Runes
            // (seed-dependent, 0-9 lucky tiers at 15% each). We assert the
            // invariant range rather than an exact count so the test isn't
            // tied to a specific seed's RNG output.
            Assert.InRange(result.ShopSlotCount, 63, 63 + 9);

            Assert.True(File.Exists(result.PatchedRegulationPath),
                $"patched regulation.bin missing at {result.PatchedRegulationPath}");
            // 0 goods + 9 itemlot + {63..72} shop = 72..81 total. We reuse
            // vanilla Starlight Shards (goods 1290) as currency rather than
            // cloning a custom goods row, so the goods count is 0. The shop
            // row count is variable because of the Great Rune bonus slot.
            Assert.InRange(result.RegulationRowsWritten, 72, 81);
            // Cross-check: shop slot count == regulation rows - itemlot rows.
            Assert.Equal(result.ShopSlotCount, result.RegulationRowsWritten - 9);

            // Boss-reward strip should have fired (ZeroBossDrops defaults to true).
            Assert.NotNull(result.BossRewardCallsStripped);
            Assert.True(result.BossRewardCallsStripped > 0,
                "Expected boss-reward dispatch calls to be stripped");
            Assert.NotNull(result.AwardItemLotsZeroed);
            Assert.True(result.AwardItemLotsZeroed > 0,
                "Expected AwardItemLot calls to be zeroed (stones, tools, rune arcs)");
            Assert.NotNull(result.CraftingDispatchersZeroed);
            Assert.True(result.CraftingDispatchersZeroed > 0,
                "Expected crafting material dispatcher calls to be zeroed");

            // Patched common_func.emevd.dcx should exist.
            string patchedCommonFunc =
                Path.Combine(result.PatchedModDir, "event", "common_func.emevd.dcx");
            Assert.True(File.Exists(patchedCommonFunc),
                $"patched common_func.emevd.dcx missing at {patchedCommonFunc}");

            // Receive-all strip should have fired (same ZeroBossDrops gate).
            Assert.NotNull(result.ReceiveAllLotsZeroed);
            Assert.True(result.ReceiveAllLotsZeroed > 0,
                "Expected AwardItemLot calls in receive-all events to be zeroed");
            Assert.NotNull(result.ReceiveAllEventsPatched);
            Assert.True(result.ReceiveAllEventsPatched > 0,
                "Expected at least one receive-all event to be patched");

            // Patched m11_10_00_00.emevd.dcx should exist.
            string patchedMapEmevd =
                Path.Combine(result.PatchedModDir, "event", "m11_10_00_00.emevd.dcx");
            Assert.True(File.Exists(patchedMapEmevd),
                $"patched m11_10_00_00.emevd.dcx missing at {patchedMapEmevd}");

            // The patched regulation.bin must live inside patched_mod.
            string expectedRegulation =
                Path.Combine(result.PatchedModDir, "regulation.bin");
            Assert.Equal(
                Path.GetFullPath(expectedRegulation),
                Path.GetFullPath(result.PatchedRegulationPath));

            // Bundle fingerprints are populated.
            Assert.False(string.IsNullOrEmpty(result.ArtifactTree));
            Assert.False(string.IsNullOrEmpty(result.BundleRoot));
        }
        finally
        {
            TryDelete(workDir);
        }
    }

    // ------------------------------------------------------------------
    // Fixture discovery + cleanup
    // ------------------------------------------------------------------
    private sealed class RepoFixtures
    {
        public string SourceModDir { get; init; } = "";
        public string? ShopPoolPath { get; init; }
        public string? SkipReason { get; init; }
    }

    private static bool TryLocateRepoFixtures(out RepoFixtures fx)
    {
        string? dir = AppContext.BaseDirectory;
        for (int i = 0; i < 16 && dir is not null; i++)
        {
            string mod      = Path.Combine(dir, "mod");
            string shopPool = Path.Combine(dir, "Seeded Competition Tool",
                              "csharp", "data", "shop_pool.json");

            bool modOk = Directory.Exists(Path.Combine(mod, "event"))
                      && File.Exists(Path.Combine(mod, "regulation.bin"));

            if (modOk)
            {
                fx = new RepoFixtures
                {
                    SourceModDir = mod,
                    ShopPoolPath = File.Exists(shopPool) ? shopPool : null,
                };
                return true;
            }
            dir = Path.GetDirectoryName(dir);
        }

        fx = new RepoFixtures
        {
            SkipReason = "mod/ tree not found. Skipped — " +
                         "this is expected when the test binary runs outside the repo tree.",
        };
        return false;
    }

    private static void TryDelete(string dir)
    {
        try { if (Directory.Exists(dir)) Directory.Delete(dir, recursive: true); }
        catch { /* best effort */ }
    }
}
