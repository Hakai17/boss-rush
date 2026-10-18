// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using System.IO;

namespace BossRush.Core.Patching;

/// <summary>
/// Applies every menu-text mutation the pipeline owns onto each
/// language's <c>menu_dlc02.msgbnd.dcx</c>:
/// <list type="bullet">
///   <item>Kalé shop window titles 508001–508009 in <c>GR_MenuText</c></item>
///   <item>1.17.1 Idus Knight / Heavy Knight names in <c>GR_MenuText</c>
///         (288110/288111 and the 297140/297141 aliases)</item>
///   <item>Those classes' official blurbs in <c>GR_LineHelp</c>
///         (297140/297141)</item>
/// </list>
/// The shipped source_mod menus are still 1.16.1, so the two new
/// class IDs are missing and the character-create screen renders
/// <c>?text_name?</c> until this patcher runs. Every language folder
/// gets the same English strings — better than a placeholder, and
/// shop titles were already English-only.
/// </summary>
public static class MenuDlc02Patcher
{
    /// <summary>Shop titles + both 1.17.1 class-name slots.</summary>
    public static Dictionary<int, string> MenuTextEntries()
    {
        var entries = new Dictionary<int, string>();
        for (int tier = 1; tier <= 9; tier++)
        {
            entries[RegulationConstants.BossRushShopTitleMsgId(tier)] =
                string.Format(System.Globalization.CultureInfo.InvariantCulture,
                              RegulationConstants.BossRushShopTitleFormat, tier);
        }

        entries[RegulationConstants.IdusKnightMenuTextId] = RegulationConstants.IdusKnightName;
        entries[RegulationConstants.HeavyKnightMenuTextId] = RegulationConstants.HeavyKnightName;
        entries[RegulationConstants.IdusKnightMenuTextIdAlt] = RegulationConstants.IdusKnightName;
        entries[RegulationConstants.HeavyKnightMenuTextIdAlt] = RegulationConstants.HeavyKnightName;
        return entries;
    }

    /// <summary>Official 1.17.1 class blurbs (GR_LineHelp 297140/297141).</summary>
    public static Dictionary<int, string> LineHelpEntries() => new()
    {
        [RegulationConstants.IdusKnightMenuTextIdAlt] = RegulationConstants.IdusKnightDescription,
        [RegulationConstants.HeavyKnightMenuTextIdAlt] = RegulationConstants.HeavyKnightDescription,
    };

    /// <summary>
    /// Patch every <c>msg/&lt;lang&gt;/menu_dlc02.msgbnd.dcx</c> under
    /// <paramref name="sourceModDir"/> into the matching path under
    /// <paramref name="patchedModDir"/>. When the two roots are the
    /// same, the write is in-place.
    /// </summary>
    public static MenuDlc02PatchSummary ApplyAllLanguages(
        string sourceModDir,
        string patchedModDir)
    {
        ArgumentNullException.ThrowIfNull(sourceModDir);
        ArgumentNullException.ThrowIfNull(patchedModDir);

        string sourceMsgRoot = Path.Combine(sourceModDir, "msg");
        if (!Directory.Exists(sourceMsgRoot))
            return MenuDlc02PatchSummary.Empty;

        var menuEntries = MenuTextEntries();
        var lineHelpEntries = LineHelpEntries();
        int languages = 0;
        int menuAdded = 0, menuReplaced = 0;
        int helpAdded = 0, helpReplaced = 0;

        foreach (string langDir in Directory.GetDirectories(sourceMsgRoot))
        {
            string src = Path.Combine(langDir, RegulationConstants.MenuMsgBndBaseName);
            if (!File.Exists(src))
                continue;

            string lang = Path.GetFileName(langDir);
            string destDir = Path.Combine(patchedModDir, "msg", lang);
            Directory.CreateDirectory(destDir);
            string dest = Path.Combine(destDir, RegulationConstants.MenuMsgBndBaseName);

            FmgPatchResult[] patched = FmgPatcher.ApplyAll(src, dest, new Dictionary<string, IReadOnlyDictionary<int, string>>
            {
                [RegulationConstants.BossRushShopTitleFmgName] = menuEntries,
                [RegulationConstants.MenuLineHelpFmgName] = lineHelpEntries,
            });
            FmgPatchResult menu = FindPatch(patched, RegulationConstants.BossRushShopTitleFmgName);
            FmgPatchResult help = FindPatch(patched, RegulationConstants.MenuLineHelpFmgName);

            languages++;
            menuAdded += menu.EntriesAdded;
            menuReplaced += menu.EntriesReplaced;
            helpAdded += help.EntriesAdded;
            helpReplaced += help.EntriesReplaced;
        }

        return new MenuDlc02PatchSummary(
            LanguagesPatched: languages,
            MenuTextAdded: menuAdded,
            MenuTextReplaced: menuReplaced,
            LineHelpAdded: helpAdded,
            LineHelpReplaced: helpReplaced);
    }

    private static FmgPatchResult FindPatch(FmgPatchResult[] patched, string fmgName)
    {
        foreach (FmgPatchResult result in patched)
        {
            if (string.Equals(result.TargetFmgName, fmgName, StringComparison.OrdinalIgnoreCase))
                return result;
        }

        throw new InvalidOperationException($"FMG patch result missing for '{fmgName}'.");
    }
}

public sealed record MenuDlc02PatchSummary(
    int LanguagesPatched,
    int MenuTextAdded,
    int MenuTextReplaced,
    int LineHelpAdded,
    int LineHelpReplaced)
{
    public static MenuDlc02PatchSummary Empty { get; } = new(0, 0, 0, 0, 0);

    public bool Applied => LanguagesPatched > 0;
}
