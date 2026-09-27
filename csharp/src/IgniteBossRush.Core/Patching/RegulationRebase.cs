// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using SoulsFormats;

namespace IgniteBossRush.Core.Patching;

/// <summary>
/// Rebuilds the mod <c>regulation.bin</c> on top of a vanilla Elden Ring
/// 1.17.1 regulation so new patch rows (Idus Knight / Heavy Knight in
/// <c>CharaInitParam</c> 3010/3011, plus any other 1.17-only params) exist
/// for the game and for the Item/Enemy Randomizer starting-class pass.
///
/// <para>
/// Vanilla is the base. Every PARAM table that also exists in the 1.16.1
/// Boss Arena / Ignite regulation is overlaid by row id when the raw row
/// size matches — that keeps arena NpcParam / shop / lot edits. Tables
/// that grew in 1.17 stay vanilla (we cannot splice a smaller row into a
/// larger layout). <c>CharaInitParam</c> is never overlaid: the 1.17.1
/// starting-class rows must win.
/// </para>
/// </summary>
public static class RegulationRebase
{
    public const string ToolName = "IgniteRush-RegulationRebase";

    /// <summary>
    /// PARAM tables taken 100% from the vanilla 1.17.1 regulation. Overlaying
    /// the 1.16.1 copies would drop Idus Knight (3010) and Heavy Knight (3011)
    /// and their character-creation display clones.
    /// </summary>
    public static readonly IReadOnlySet<string> VanillaOnlyParamBaseNames =
        new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "CharaInitParam",
        };

    public static readonly IReadOnlyList<string> DefaultVanillaSearchPaths = new[]
    {
        @"D:\Program Files (x86)\Steam\steamapps\common\ELDEN RING\Game\regulation.bin",
        @"C:\Program Files (x86)\Steam\steamapps\common\ELDEN RING\Game\regulation.bin",
        @"C:\Program Files\Steam\steamapps\common\ELDEN RING\Game\regulation.bin",
    };

    public static string? FindDefaultVanillaRegulation()
    {
        string? env = Environment.GetEnvironmentVariable("ELDENRING_REGULATION");
        if (!string.IsNullOrWhiteSpace(env) && File.Exists(env))
            return env;

        foreach (string candidate in DefaultVanillaSearchPaths)
        {
            if (File.Exists(candidate))
                return candidate;
        }

        return null;
    }

    public static RegulationRebaseResult Apply(string vanillaRegulationPath, string modRegulationPath)
    {
        if (!File.Exists(vanillaRegulationPath))
            throw new FileNotFoundException(
                $"Vanilla 1.17.1 regulation.bin not found: {vanillaRegulationPath}",
                vanillaRegulationPath);
        if (!File.Exists(modRegulationPath))
            throw new FileNotFoundException(
                $"Mod regulation.bin not found: {modRegulationPath}",
                modRegulationPath);

        BND4 vanilla = RegulationIo.LoadEldenRing(vanillaRegulationPath);
        BND4 mod = RegulationIo.LoadEldenRing(modRegulationPath);

        Dictionary<string, BinderFile> vanillaByName = IndexByBasename(vanilla);
        Dictionary<string, BinderFile> modByName = IndexByBasename(mod);

        int tablesOverlaid = 0;
        int rowsAdded = 0;
        int rowsReplaced = 0;
        int tablesSkippedSize = 0;
        int tablesCopiedWhole = 0;
        int vanillaOnlyKept = 0;

        foreach ((string baseName, BinderFile modFile) in modByName)
        {
            if (VanillaOnlyParamBaseNames.Contains(StripParamSuffix(baseName)))
            {
                vanillaOnlyKept++;
                continue;
            }

            if (!vanillaByName.TryGetValue(baseName, out BinderFile? vanillaFile))
            {
                vanilla.Files.Add(CloneBinderFile(modFile));
                vanillaByName[baseName] = vanilla.Files[^1];
                tablesCopiedWhole++;
                continue;
            }

            if (!baseName.EndsWith(".param", StringComparison.OrdinalIgnoreCase)
                && !LooksLikeParam(modFile, vanillaFile))
            {
                vanillaFile.Bytes = (byte[])modFile.Bytes.Clone();
                tablesCopiedWhole++;
                continue;
            }

            PARAM vanillaParam = PARAM.Read(vanillaFile.Bytes);
            PARAM modParam = PARAM.Read(modFile.Bytes);
            if (vanillaParam.DetectedSize <= 0
                || vanillaParam.DetectedSize != modParam.DetectedSize)
            {
                tablesSkippedSize++;
                continue;
            }

            PARAMDEF def = MakeRawRowDef(vanillaParam);
            vanillaParam.ApplyParamdef(def);
            modParam.ApplyParamdef(MakeRawRowDef(modParam));

            var vanillaRows = new Dictionary<int, PARAM.Row>();
            foreach (PARAM.Row row in vanillaParam.Rows)
                vanillaRows[row.ID] = row;
            int added = 0;
            int replaced = 0;
            foreach (PARAM.Row modRow in modParam.Rows)
            {
                byte[] raw = CloneRaw(modRow);
                if (vanillaRows.TryGetValue(modRow.ID, out PARAM.Row? existing))
                {
                    existing.Cells[0].Value = raw;
                    if (!string.IsNullOrEmpty(modRow.Name))
                        existing.Name = modRow.Name;
                    replaced++;
                }
                else
                {
                    var copy = new PARAM.Row(modRow.ID, modRow.Name, def);
                    copy.Cells[0].Value = raw;
                    vanillaParam.Rows.Add(copy);
                    vanillaRows[modRow.ID] = copy;
                    added++;
                }
            }

            vanillaParam.Rows = vanillaParam.Rows
                .GroupBy(r => r.ID)
                .Select(g => g.Last())
                .OrderBy(r => r.ID)
                .ToList();
            vanillaFile.Bytes = vanillaParam.Write();
            tablesOverlaid++;
            rowsAdded += added;
            rowsReplaced += replaced;
        }

        return new RegulationRebaseResult(
            Binder: vanilla,
            VanillaPath: vanillaRegulationPath,
            ModPath: modRegulationPath,
            TablesOverlaid: tablesOverlaid,
            RowsAdded: rowsAdded,
            RowsReplaced: rowsReplaced,
            TablesSkippedSizeMismatch: tablesSkippedSize,
            TablesCopiedWhole: tablesCopiedWhole,
            VanillaOnlyTablesKept: vanillaOnlyKept);
    }

    internal static bool HasStartingClasses(BND4 bnd, params int[] requiredIds)
    {
        BinderFile? file = bnd.Files.FirstOrDefault(f =>
            string.Equals(ParamBasename(f.Name), "CharaInitParam.param", StringComparison.OrdinalIgnoreCase));
        if (file is null)
            return false;

        PARAM param = PARAM.Read(file.Bytes);
        HashSet<int> ids = param.Rows.Select(r => r.ID).ToHashSet();
        return requiredIds.All(ids.Contains);
    }

    private static Dictionary<string, BinderFile> IndexByBasename(BND4 bnd)
    {
        var map = new Dictionary<string, BinderFile>(StringComparer.OrdinalIgnoreCase);
        foreach (BinderFile file in bnd.Files)
        {
            string key = ParamBasename(file.Name);
            if (!map.ContainsKey(key))
                map[key] = file;
        }
        return map;
    }

    private static string ParamBasename(string? name)
    {
        if (string.IsNullOrEmpty(name))
            return "";
        int slash = Math.Max(name.LastIndexOf('\\'), name.LastIndexOf('/'));
        return slash < 0 ? name : name[(slash + 1)..];
    }

    private static string StripParamSuffix(string name)
    {
        const string ext = ".param";
        return name.EndsWith(ext, StringComparison.OrdinalIgnoreCase)
            ? name[..^ext.Length]
            : name;
    }

    private static bool LooksLikeParam(BinderFile a, BinderFile b)
        => (a.Name?.EndsWith(".param", StringComparison.OrdinalIgnoreCase) ?? false)
           || (b.Name?.EndsWith(".param", StringComparison.OrdinalIgnoreCase) ?? false);

    private static BinderFile CloneBinderFile(BinderFile src)
        => new(src.Flags, src.ID, src.Name, (byte[])src.Bytes.Clone());

    private static PARAMDEF MakeRawRowDef(PARAM param)
    {
        var def = new PARAMDEF
        {
            ParamType = param.ParamType ?? "",
            DataVersion = param.ParamdefDataVersion,
            FormatVersion = 203,
            Unicode = true,
            BigEndian = false,
        };
        var field = new PARAMDEF.Field(def, PARAMDEF.DefType.dummy8, "raw")
        {
            ArrayLength = checked((int)param.DetectedSize),
        };
        def.Fields.Add(field);
        return def;
    }

    private static byte[] CloneRaw(PARAM.Row row)
    {
        byte[] raw = (byte[])row.Cells[0].Value;
        var copy = new byte[raw.Length];
        Buffer.BlockCopy(raw, 0, copy, 0, raw.Length);
        return copy;
    }
}

public sealed record RegulationRebaseResult(
    BND4 Binder,
    string VanillaPath,
    string ModPath,
    int TablesOverlaid,
    int RowsAdded,
    int RowsReplaced,
    int TablesSkippedSizeMismatch,
    int TablesCopiedWhole,
    int VanillaOnlyTablesKept);
