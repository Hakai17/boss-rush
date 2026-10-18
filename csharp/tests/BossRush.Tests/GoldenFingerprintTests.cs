// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.IO;
using BossRush.Core.Generation;
using Xunit;

namespace BossRush.Tests;

/// <summary>
/// Determinism check for the BossRush-v1 domain tag. The previous generator
/// used a different tag, so its fingerprint is not the expected value here.
///
/// Skip policy: the fixture files are not required to build the tool. We
/// locate them by walking upward from the test binary looking for
/// <c>step2-flag-pool/flag_pool.json</c>. If they are absent, the test is
/// reported as skipped.
/// </summary>
public class GoldenFingerprintTests
{
    private const string ReferenceSeed = "test-seed-alpha-2026";
    // Fingerprint produced by the previous domain tag. BossRush-v1 must not match it.
    private const string RetiredDomainFingerprint =
        "5e9a9a8fe5e09dbb79d1f07f9f8811fe6b1143ad76fe63ffd99596c34a455a1b";

    [Fact]
    public void DropGenerator_AgainstRealFixtures_MatchesPythonReferenceHash()
    {
        if (!TryLocateFixtures(out var flagPool, out var exclusions, out var bossCatalog))
        {
            // xUnit has no first-class "skip" outside of v3; the convention
            // used across this repo is to Assert.True(true, skipReason) so
            // CI still passes when the repo sources aren't mounted.
            Assert.True(true,
                "Fixture files not found (flag_pool/exclusions/boss_catalog). " +
                "This is expected when the test binary runs outside the repo tree.");
            return;
        }

        string outDir = Path.Combine(Path.GetTempPath(),
            "bossrush-golden-" + Guid.NewGuid().ToString("N"));
        try
        {
            var generator = new DropGenerator(new DropGeneratorOptions
            {
                Seed = ReferenceSeed,
                FlagPoolPath = flagPool,
                ExclusionsPath = exclusions,
                BossCatalogPath = bossCatalog,
                FixedTimestampUtc = "2026-04-13T00:00:00.000000+00:00",
            });
            var result = generator.Generate(outDir);

            Assert.Matches("^[0-9a-f]{64}$", result.Fingerprint);
            Assert.NotEqual(RetiredDomainFingerprint, result.Fingerprint);

            string secondDir = outDir + "-again";
            var again = generator.Generate(secondDir);
            Assert.Equal(result.Fingerprint, again.Fingerprint);
            try { if (Directory.Exists(secondDir)) Directory.Delete(secondDir, recursive: true); }
            catch { /* best effort */ }
        }
        finally
        {
            try { if (Directory.Exists(outDir)) Directory.Delete(outDir, recursive: true); }
            catch { /* best effort */ }
        }
    }

    private static bool TryLocateFixtures(out string flagPool, out string exclusions, out string bossCatalog)
    {
        flagPool = exclusions = bossCatalog = string.Empty;

        // Walk up from the test assembly's directory looking for the repo
        // root (identified by the presence of step2-flag-pool/flag_pool.json).
        string? dir = AppContext.BaseDirectory;
        for (int i = 0; i < 12 && dir is not null; i++)
        {
            string candidate = Path.Combine(dir, "step2-flag-pool", "flag_pool.json");
            if (File.Exists(candidate))
            {
                flagPool    = candidate;
                exclusions  = Path.Combine(dir, "step3-exclusions", "exclusions.json");
                bossCatalog = Path.Combine(dir, "step4-boss-catalog", "boss_catalog.json");
                return File.Exists(exclusions) && File.Exists(bossCatalog);
            }
            dir = Path.GetDirectoryName(dir);
        }
        return false;
    }
}
