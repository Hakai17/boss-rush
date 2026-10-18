// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.IO;
using BossRush.Core.Patching;
using SoulsFormats;
using Xunit;

namespace BossRush.Tests;

public class RegulationRebaseTests
{
    [Fact]
    public void Apply_Keeps1171StartingClasses_AndOverlaysModRows()
    {
        if (!TryLocateInputs(out string vanilla, out string mod, out string? skip))
        {
            Assert.True(true, skip);
            return;
        }

        RegulationRebaseResult result = RegulationRebase.Apply(vanilla, mod);

        Assert.True(
            RegulationRebase.HasStartingClasses(result.Binder, 3000, 3009, 3010, 3011),
            "CharaInitParam must keep Vagabond..Wretch plus Idus Knight (3010) and Heavy Knight (3011).");
        Assert.True(result.TablesOverlaid > 0, "Expected at least one PARAM table to overlay by row id.");
        Assert.Equal(1, result.VanillaOnlyTablesKept);

        string scratchDir = Path.Combine(Path.GetTempPath(),
            "bossrush-rebase-" + Guid.NewGuid().ToString("N"));
        string scratch = Path.Combine(scratchDir, "regulation.bin");
        try
        {
            RegulationIo.SaveEldenRing(scratch, result.Binder);
            BND4 reloaded = RegulationIo.LoadEldenRing(scratch);
            Assert.True(RegulationRebase.HasStartingClasses(reloaded, 3010, 3011));
        }
        finally
        {
            try { if (Directory.Exists(scratchDir)) Directory.Delete(scratchDir, recursive: true); }
            catch { /* best-effort */ }
        }
    }

    private static bool TryLocateInputs(out string vanilla, out string mod, out string? skip)
    {
        vanilla = RegulationRebase.FindDefaultVanillaRegulation() ?? "";
        if (!File.Exists(vanilla))
        {
            skip = "Vanilla 1.17.1 regulation.bin not found. Skipped.";
            mod = "";
            return false;
        }

        string? dir = AppContext.BaseDirectory;
        for (int i = 0; i < 16 && dir is not null; i++)
        {
            string candidate = Path.Combine(dir, "csharp", "data", "source_mod", "mod", "regulation.bin");
            if (File.Exists(candidate))
            {
                mod = candidate;
                skip = null;
                return true;
            }
            candidate = Path.Combine(dir, "mod", "regulation.bin");
            if (File.Exists(candidate))
            {
                mod = candidate;
                skip = null;
                return true;
            }
            dir = Path.GetDirectoryName(dir);
        }

        mod = "";
        skip = "Mod regulation.bin not found. Skipped.";
        return false;
    }
}
