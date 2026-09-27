// SPDX-License-Identifier: GPL-3.0-only
using System.IO;
using System.Linq;
using IgniteBossRush.Core.Patching;
using SoulsFormats;
using Xunit;

namespace IgniteBossRush.Tests;

public class MenuDlc02PatcherTests
{
    [Fact]
    public void MenuTextEntries_IncludeShopTitlesAnd1171Classes()
    {
        var entries = MenuDlc02Patcher.MenuTextEntries();

        Assert.Equal("Boss Rush - Tier 1", entries[508001]);
        Assert.Equal("Boss Rush - Tier 9", entries[508009]);
        Assert.Equal(RegulationConstants.IdusKnightName, entries[288110]);
        Assert.Equal(RegulationConstants.HeavyKnightName, entries[288111]);
        Assert.Equal(RegulationConstants.IdusKnightName, entries[297140]);
        Assert.Equal(RegulationConstants.HeavyKnightName, entries[297141]);
    }

    [Fact]
    public void ApplyAllLanguages_WritesClassNamesAndBlurbs()
    {
        using var fx = new DualFmgLangFixture();
        fx.Write();

        var summary = MenuDlc02Patcher.ApplyAllLanguages(fx.SourceMod, fx.PatchedMod);

        Assert.Equal(1, summary.LanguagesPatched);
        Assert.True(summary.MenuTextAdded >= 4);
        Assert.True(summary.LineHelpAdded >= 2);

        string outPath = Path.Combine(fx.PatchedMod, "msg", "engus",
                                      RegulationConstants.MenuMsgBndBaseName);
        byte[] raw = File.ReadAllBytes(outPath);
        if (DCX.Is(raw)) raw = DCX.Decompress(raw);
        var bnd = BND4.Read(raw);

        FMG menu = FMG.Read(bnd.Files.First(f =>
            Path.GetFileNameWithoutExtension(f.Name).Equals(
                "GR_MenuText", System.StringComparison.OrdinalIgnoreCase)).Bytes);
        FMG help = FMG.Read(bnd.Files.First(f =>
            Path.GetFileNameWithoutExtension(f.Name).Equals(
                "GR_LineHelp", System.StringComparison.OrdinalIgnoreCase)).Bytes);

        Assert.Equal("Idus Knight", menu.Entries.First(e => e.ID == 288110).Text);
        Assert.Equal("Heavy Knight", menu.Entries.First(e => e.ID == 288111).Text);
        Assert.Equal(RegulationConstants.IdusKnightDescription,
                     help.Entries.First(e => e.ID == 297140).Text);
        Assert.Equal(RegulationConstants.HeavyKnightDescription,
                     help.Entries.First(e => e.ID == 297141).Text);
        Assert.Equal("Boss Rush - Tier 1", menu.Entries.First(e => e.ID == 508001).Text);
    }

    private sealed class DualFmgLangFixture : System.IDisposable
    {
        public string Root { get; }
        public string SourceMod => Path.Combine(Root, "source");
        public string PatchedMod => Path.Combine(Root, "patched");

        public DualFmgLangFixture()
        {
            Root = Path.Combine(Path.GetTempPath(),
                "ignite-menu-dlc02-" + System.Guid.NewGuid().ToString("N"));
            Directory.CreateDirectory(Root);
        }

        public void Write()
        {
            string langDir = Path.Combine(SourceMod, "msg", "engus");
            Directory.CreateDirectory(langDir);

            var menu = new FMG();
            menu.Entries.Add(new FMG.Entry(288100, "Vagabond"));
            var help = new FMG();
            help.Entries.Add(new FMG.Entry(297130, "A knight exiled from their homeland to wander."));

            var bnd = new BND4();
            bnd.Files.Add(new BinderFile(
                Binder.FileFlags.Flag1, 200,
                @"N:\GR\data\INTERROOT_win64\msg\engUS\GR_MenuText.fmg",
                menu.Write()));
            bnd.Files.Add(new BinderFile(
                Binder.FileFlags.Flag1, 201,
                @"N:\GR\data\INTERROOT_win64\msg\engUS\GR_LineHelp.fmg",
                help.Write()));

            byte[] dcx = DCX.Compress(bnd.Write(), new DCX.DcxKrakCompressionInfo(
                DCX.KrakCompressionPreset.EldenRing));
            File.WriteAllBytes(
                Path.Combine(langDir, RegulationConstants.MenuMsgBndBaseName), dcx);
        }

        public void Dispose()
        {
            try { Directory.Delete(Root, recursive: true); }
            catch { /* best effort */ }
        }
    }
}
