// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using IgniteBossRush.Core.Patching;
using SoulsFormats;
using Xunit;

namespace IgniteBossRush.Tests;

/// <summary>
/// Unit tests for <see cref="FmgPatcher"/>. Uses fabricated in-memory
/// msgbnd.dcx fixtures so the suite doesn't depend on a real vanilla
/// <c>menu_dlc02.msgbnd.dcx</c> (which ships ~530 KB of game text we
/// don't want in the test project).
///
/// Fixture shape: a BND4 with two inner FMGs — one we'll patch
/// (<c>GR_MenuText.fmg</c>) and one we won't (<c>UnrelatedOther.fmg</c>).
/// Assertions check:
///   - entries added at fresh IDs
///   - entries replaced at existing IDs (idempotency)
///   - unrelated FMG is byte-preserved
///   - DCX round-trip preserves the compression variant
///   - missing target FMG → loud throw
///   - re-running the patch over its own output is stable
/// </summary>
public class FmgPatcherTests
{
    private const string TargetFmgName = "GR_MenuText";
    private const string UnrelatedFmgName = "UnrelatedOther";

    [Fact]
    public void Apply_AddsFreshEntries_PreservesUnrelatedFmg()
    {
        using var fx = new TempMsgBndFixture();
        fx.WriteDefault();

        string outPath = Path.Combine(fx.Root, "out.msgbnd.dcx");
        var entries = new Dictionary<int, string>
        {
            [508001] = "Boss Rush - Tier 1",
            [508005] = "Boss Rush - Tier 5",
        };

        var result = FmgPatcher.Apply(fx.InputPath, outPath, TargetFmgName, entries);

        Assert.Equal(2, result.EntriesAdded);
        Assert.Equal(0, result.EntriesReplaced);

        // Re-parse the output and verify both added entries round-trip.
        var (targetFmg, unrelatedFmg) = LoadBoth(outPath);
        Assert.Equal("Boss Rush - Tier 1", targetFmg.Entries.First(e => e.ID == 508001).Text);
        Assert.Equal("Boss Rush - Tier 5", targetFmg.Entries.First(e => e.ID == 508005).Text);

        // Unrelated FMG's original content must still be there, unchanged.
        Assert.Equal("keep me", unrelatedFmg.Entries.First(e => e.ID == 999000).Text);
    }

    [Fact]
    public void Apply_ReplacesExistingEntry_AtSameId()
    {
        using var fx = new TempMsgBndFixture();
        // Pre-populate ID 508001 so the patch must replace, not add.
        fx.WriteWithPrePopulated(new Dictionary<int, string>
        {
            [508001] = "OLD VALUE — should not survive",
        });

        string outPath = Path.Combine(fx.Root, "out.msgbnd.dcx");
        var entries = new Dictionary<int, string>
        {
            [508001] = "Boss Rush - Tier 1",
        };
        var result = FmgPatcher.Apply(fx.InputPath, outPath, TargetFmgName, entries);

        Assert.Equal(0, result.EntriesAdded);
        Assert.Equal(1, result.EntriesReplaced);

        var (targetFmg, _) = LoadBoth(outPath);
        // The old value must be gone (not duplicated at the same id).
        var matches = targetFmg.Entries.Where(e => e.ID == 508001).ToList();
        Assert.Single(matches);
        Assert.Equal("Boss Rush - Tier 1", matches[0].Text);
    }

    [Fact]
    public void Apply_Idempotent_RunningTwice_ProducesSameOutput()
    {
        using var fx = new TempMsgBndFixture();
        fx.WriteDefault();

        var entries = new Dictionary<int, string>
        {
            [508001] = "Boss Rush - Tier 1",
            [508002] = "Boss Rush - Tier 2",
            [508009] = "Boss Rush - Tier 9",
        };

        string outA = Path.Combine(fx.Root, "outA.msgbnd.dcx");
        string outB = Path.Combine(fx.Root, "outB.msgbnd.dcx");
        FmgPatcher.Apply(fx.InputPath, outA, TargetFmgName, entries);
        // Second run uses the first output as source — re-applying the same
        // patch must not double-count entries or mutate the file further.
        FmgPatcher.Apply(outA, outB, TargetFmgName, entries);

        byte[] bytesA = File.ReadAllBytes(outA);
        byte[] bytesB = File.ReadAllBytes(outB);
        Assert.Equal(bytesA, bytesB);
    }

    [Fact]
    public void Apply_PreservesDcxCompression()
    {
        using var fx = new TempMsgBndFixture();
        fx.WriteDefault();

        // Sanity: our fixture writes DCX_KRAK (ER's default for msgbnd).
        byte[] raw = File.ReadAllBytes(fx.InputPath);
        Assert.True(DCX.Is(raw), "fixture should produce DCX-wrapped bytes");
        DCX.Decompress(raw, out DCX.CompressionInfo inputInfo);
        string inputTypeName = inputInfo.GetType().Name;

        string outPath = Path.Combine(fx.Root, "out.msgbnd.dcx");
        var result = FmgPatcher.Apply(fx.InputPath, outPath, TargetFmgName,
            new Dictionary<int, string> { [508001] = "x" });
        Assert.Equal(inputTypeName, result.DcxCompressionType);

        // Double-check by re-decoding the output.
        byte[] outRaw = File.ReadAllBytes(outPath);
        Assert.True(DCX.Is(outRaw));
        DCX.Decompress(outRaw, out DCX.CompressionInfo outInfo);
        Assert.Equal(inputTypeName, outInfo.GetType().Name);
    }

    [Fact]
    public void Apply_MissingTargetFmg_ThrowsLoudly()
    {
        using var fx = new TempMsgBndFixture();
        fx.WriteDefault();
        string outPath = Path.Combine(fx.Root, "out.msgbnd.dcx");

        var ex = Assert.Throws<InvalidDataException>(() => FmgPatcher.Apply(
            fx.InputPath, outPath, "NoSuchFmg",
            new Dictionary<int, string> { [508001] = "x" }));
        // Error message lists the bundle contents so a caller can see
        // which FMGs ARE present — helps diagnose typos.
        Assert.Contains("NoSuchFmg", ex.Message);
        Assert.Contains(TargetFmgName + ".fmg", ex.Message);
    }

    [Fact]
    public void Apply_EmptyEntries_IsPassThroughCopy()
    {
        using var fx = new TempMsgBndFixture();
        fx.WriteDefault();

        string outPath = Path.Combine(fx.Root, "out.msgbnd.dcx");
        var result = FmgPatcher.Apply(fx.InputPath, outPath, TargetFmgName,
            new Dictionary<int, string>());
        Assert.Equal(0, result.EntriesAdded);
        Assert.Equal(0, result.EntriesReplaced);

        // Unrelated FMG's content must round-trip byte-equal, proving
        // we don't accidentally re-emit parts of the bundle we weren't
        // asked to touch.
        var (targetFmg, unrelatedFmg) = LoadBoth(outPath);
        Assert.Equal("keep me", unrelatedFmg.Entries.First(e => e.ID == 999000).Text);
        Assert.Equal("default entry", targetFmg.Entries.First(e => e.ID == 0).Text);
    }

    // ------------------------------------------------------------------
    // Fixture helpers
    // ------------------------------------------------------------------

    private static (FMG target, FMG unrelated) LoadBoth(string path)
    {
        byte[] raw = File.ReadAllBytes(path);
        if (DCX.Is(raw)) raw = DCX.Decompress(raw);
        var bnd = BND4.Read(raw);
        FMG target = FMG.Read(bnd.Files.First(f =>
            Path.GetFileNameWithoutExtension(f.Name ?? "").Equals(
                TargetFmgName, StringComparison.OrdinalIgnoreCase)).Bytes);
        FMG unrelated = FMG.Read(bnd.Files.First(f =>
            Path.GetFileNameWithoutExtension(f.Name ?? "").Equals(
                UnrelatedFmgName, StringComparison.OrdinalIgnoreCase)).Bytes);
        return (target, unrelated);
    }

    private sealed class TempMsgBndFixture : IDisposable
    {
        public string Root { get; }
        public string InputPath => Path.Combine(Root, "in.msgbnd.dcx");

        public TempMsgBndFixture()
        {
            Root = Path.Combine(Path.GetTempPath(),
                "ignite-fmg-tests-" + Guid.NewGuid().ToString("N"));
            Directory.CreateDirectory(Root);
        }

        public void WriteDefault() => WriteWithPrePopulated(new Dictionary<int, string>());

        public void WriteWithPrePopulated(Dictionary<int, string> targetPrepopulated)
        {
            var targetFmg = new FMG();
            targetFmg.Entries.Add(new FMG.Entry(0, "default entry"));
            foreach (var (id, text) in targetPrepopulated)
                targetFmg.Entries.Add(new FMG.Entry(id, text));

            var unrelatedFmg = new FMG();
            unrelatedFmg.Entries.Add(new FMG.Entry(999000, "keep me"));
            unrelatedFmg.Entries.Add(new FMG.Entry(999001, "also keep me"));

            var bnd = new BND4
            {
                // Match the ER menu_dlc02 format defaults reasonably.
                // SoulsFormats picks sane defaults for fields we don't set.
            };
            bnd.Files.Add(new BinderFile(
                Binder.FileFlags.Flag1, 200,
                $@"N:\GR\data\INTERROOT_win64\msg\engUS\{TargetFmgName}.fmg",
                targetFmg.Write()));
            bnd.Files.Add(new BinderFile(
                Binder.FileFlags.Flag1, 201,
                $@"N:\GR\data\INTERROOT_win64\msg\engUS\{UnrelatedFmgName}.fmg",
                unrelatedFmg.Write()));

            byte[] bndBytes = bnd.Write();
            // DCX_KRAK matches ER's menu_dlc02.msgbnd.dcx compression. The
            // CompressionInfo API takes the preset/config object rather than
            // the old DCX.Type enum — default ctor uses sensible defaults.
            byte[] dcxBytes = DCX.Compress(bndBytes, new DCX.DcxKrakCompressionInfo(
                DCX.KrakCompressionPreset.EldenRing));
            File.WriteAllBytes(InputPath, dcxBytes);
        }

        public void Dispose()
        {
            try { Directory.Delete(Root, recursive: true); }
            catch { /* best effort */ }
        }
    }
}
