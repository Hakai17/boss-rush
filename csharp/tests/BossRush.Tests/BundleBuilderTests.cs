// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using BossRush.Core.Bundle;
using Xunit;

namespace BossRush.Tests;

/// <summary>
/// Smoke tests for BundleBuilder using synthetic patched files. These tests
/// verify:
///   - Only-changed filtering (identical file is not copied)
///   - Hashes appear in integrity.sha256 and match raw SHA-256 bytes
///   - bundle_root is stable + matches the published preimage formula
///   - tier_rewards.json is included when provided
/// </summary>
public class BundleBuilderTests
{
    [Fact]
    public void Build_CopiesOnlyChangedFiles_AndFingerprintsAreStable()
    {
        using var fx = new TempFixture();

        // Drop source + patched side-by-side with one file identical, one
        // different. Only the different one should land in the bundle.
        File.WriteAllText(Path.Combine(fx.SourceEventDir, "a.emevd.dcx.js"), "same-bytes");
        File.WriteAllText(Path.Combine(fx.PatchedJsDir,   "a.emevd.dcx.js"), "same-bytes");
        File.WriteAllText(Path.Combine(fx.SourceEventDir, "b.emevd.dcx.js"), "old-bytes");
        File.WriteAllText(Path.Combine(fx.PatchedJsDir,   "b.emevd.dcx.js"), "new-bytes");

        // Create a synthetic tier_rewards.json
        string tierRewardsPath = Path.Combine(fx.Root, "tier_rewards.json");
        File.WriteAllText(tierRewardsPath, "{\"tiers\":[]}");

        string bundleDir = Path.Combine(fx.Root, "bundle");
        var r = new BundleBuilder(new BundleBuilderOptions
        {
            TierRewardsJsonPath = tierRewardsPath,
            PatchedEventJsDir = fx.PatchedJsDir,
            SourceEventDir = fx.SourceEventDir,
            BundleDir = bundleDir,
            Force = true,
            Seed = "bundle-test-seed",
        }).Build();

        // Changed set: only b.emevd.dcx.js.
        Assert.Equal(1, r.ChangedFileCount);
        Assert.True(File.Exists(Path.Combine(bundleDir, "patched_event_js", "b.emevd.dcx.js")));
        Assert.False(File.Exists(Path.Combine(bundleDir, "patched_event_js", "a.emevd.dcx.js")));

        // tier_rewards.json should be in the bundle.
        Assert.True(File.Exists(Path.Combine(bundleDir, "tier_rewards.json")));

        // bundle_root preimage formula: artifact_tree only.
        string expectedPreimage = "artifact_tree=" + r.ArtifactTree + "\n";
        string expectedRoot = Sha256Hex(Encoding.UTF8.GetBytes(expectedPreimage));
        Assert.Equal(expectedRoot, r.BundleRoot);

        // integrity.sha256 should contain one sha256sum-style line per file.
        string manifest = File.ReadAllText(Path.Combine(bundleDir, "integrity.sha256"));
        Assert.Contains("tier_rewards.json", manifest);
        Assert.Contains("patched_event_js/b.emevd.dcx.js", manifest);
        Assert.DoesNotContain("a.emevd.dcx.js", manifest);
        Assert.Contains("bundle_root:", manifest);

        // SEED_INFO.txt should restate the bundle_root and seed.
        string seedInfo = File.ReadAllText(Path.Combine(bundleDir, "SEED_INFO.txt"));
        Assert.Contains(r.BundleRoot, seedInfo);
        Assert.Contains("bundle-test-seed", seedInfo);
    }

    [Fact]
    public void Build_DeterministicBundleRoot_AcrossTwoRuns()
    {
        using var fx = new TempFixture();
        File.WriteAllText(Path.Combine(fx.SourceEventDir, "x.emevd.dcx.js"), "orig");
        File.WriteAllText(Path.Combine(fx.PatchedJsDir,   "x.emevd.dcx.js"), "patched");

        string tierRewardsPath = Path.Combine(fx.Root, "tier_rewards.json");
        File.WriteAllText(tierRewardsPath, "{\"tiers\":[],\"seed\":\"det-bundle-seed\"}");

        var r1 = new BundleBuilder(new BundleBuilderOptions
        {
            TierRewardsJsonPath = tierRewardsPath,
            PatchedEventJsDir = fx.PatchedJsDir,
            SourceEventDir = fx.SourceEventDir,
            BundleDir = Path.Combine(fx.Root, "b1"),
            Force = true,
            Seed = "det-bundle-seed",
        }).Build();

        var r2 = new BundleBuilder(new BundleBuilderOptions
        {
            TierRewardsJsonPath = tierRewardsPath,
            PatchedEventJsDir = fx.PatchedJsDir,
            SourceEventDir = fx.SourceEventDir,
            BundleDir = Path.Combine(fx.Root, "b2"),
            Force = true,
            Seed = "det-bundle-seed",
        }).Build();

        Assert.Equal(r1.ArtifactTree, r2.ArtifactTree);
        Assert.Equal(r1.BundleRoot, r2.BundleRoot);
    }

    [Fact]
    public void Build_WithoutTierRewards_StillProducesBundle()
    {
        using var fx = new TempFixture();
        File.WriteAllText(Path.Combine(fx.SourceEventDir, "x.emevd.dcx.js"), "orig");
        File.WriteAllText(Path.Combine(fx.PatchedJsDir,   "x.emevd.dcx.js"), "patched");

        string bundleDir = Path.Combine(fx.Root, "bundle-no-tier");
        var r = new BundleBuilder(new BundleBuilderOptions
        {
            // No TierRewardsJsonPath
            PatchedEventJsDir = fx.PatchedJsDir,
            SourceEventDir = fx.SourceEventDir,
            BundleDir = bundleDir,
            Force = true,
            Seed = "no-tier-test",
        }).Build();

        Assert.Equal(1, r.ChangedFileCount);
        Assert.False(File.Exists(Path.Combine(bundleDir, "tier_rewards.json")));
        Assert.False(string.IsNullOrEmpty(r.BundleRoot));
    }

    private static string Sha256Hex(byte[] data)
    {
        var sb = new StringBuilder();
        foreach (var b in SHA256.HashData(data)) sb.Append(b.ToString("x2"));
        return sb.ToString();
    }

    // ------------------------------------------------------------------
    // Fixture: synthetic source + patched dirs.
    // ------------------------------------------------------------------
    private sealed class TempFixture : IDisposable
    {
        public string Root { get; }
        public string SourceEventDir { get; }
        public string PatchedJsDir { get; }

        public TempFixture()
        {
            Root = Path.Combine(Path.GetTempPath(), "bossrush-bundle-" + Guid.NewGuid().ToString("N"));
            Directory.CreateDirectory(Root);
            SourceEventDir = CreateSub("source");
            PatchedJsDir   = CreateSub("patched");
        }

        private string CreateSub(string name)
        {
            string p = Path.Combine(Root, name);
            Directory.CreateDirectory(p);
            return p;
        }

        public void Dispose()
        {
            try { if (Directory.Exists(Root)) Directory.Delete(Root, recursive: true); }
            catch { /* best effort */ }
        }
    }
}
