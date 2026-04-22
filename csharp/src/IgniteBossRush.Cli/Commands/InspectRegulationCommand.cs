// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.IO;
using System.Linq;
using SoulsFormats;
using IgniteBossRush.Core.Patching;

namespace IgniteBossRush.Cli.Commands;

/// <summary>
/// Diagnostic dump for a single row in a regulation.bin param table.
///   igniterush inspect-regulation --bnd &lt;path&gt; --table ItemLotParam_map --row 1036490011
/// </summary>
internal static class InspectRegulationCommand
{
    public static int Execute(string[] args)
    {
        var p = new ArgParser(
            knownOptions: new[] { "--bnd", "--table", "--row", "--where" },
            knownFlags: new[] { "--list-ids" });
        p.Parse(args);

        string bnd = p.Required("--bnd");
        string table = p.Required("--table");
        string? rowArg = p.Optional("--row");
        string? whereArg = p.Optional("--where");
        bool listIds = p.HasFlag("--list-ids");

        if (rowArg is null && whereArg is null && !listIds)
            throw new CliUsageException("specify --row <id>, --where <cell=value>, or --list-ids");

        BND4 container = RegulationIo.LoadEldenRing(bnd);

        var file = container.Files.FirstOrDefault(f =>
            Path.GetFileNameWithoutExtension(f.Name ?? "").Equals(table, StringComparison.OrdinalIgnoreCase));
        if (file is null)
        {
            Console.Error.WriteLine($"no '{table}' found in {bnd}");
            return 1;
        }

        string defResourceName = table switch
        {
            "ItemLotParam_map" => RegulationConstants.ItemLotParamDefXml,
            "ItemLotParam_enemy" => RegulationConstants.ItemLotParamDefXml,
            "EquipParamGoods" => RegulationConstants.EquipParamGoodsDefXml,
            "ShopLineupParam" => RegulationConstants.ShopLineupParamDefXml,
            "EquipMtrlSetParam" => RegulationConstants.EquipMtrlSetParamDefXml,
            _ => throw new ArgumentException($"unknown table: {table}"),
        };
        PARAMDEF def = ParamdefLoader.Load(defResourceName);
        PARAM param = PARAM.Read(file.Bytes);
        param.ApplyParamdef(def);

        // --list-ids: dump all row IDs one per line, no cell details.
        // Useful for diff'ing which rows exist in regulation A vs B.
        if (listIds)
        {
            foreach (var r in param.Rows.OrderBy(r => r.ID))
                Console.WriteLine(r.ID);
            Console.Error.WriteLine($"({param.Rows.Count} rows total in {table})");
            return 0;
        }

        // --where mode: filter rows by a cell equaling a value
        if (whereArg is not null)
        {
            var parts = whereArg.Split('=', 2);
            if (parts.Length != 2)
                throw new CliUsageException("--where expects 'cellName=value' (e.g. --where equipId=190)");
            string cellName = parts[0].Trim();
            string wantedStr = parts[1].Trim();
            if (!long.TryParse(wantedStr, out long wanted))
                throw new CliUsageException($"--where value '{wantedStr}' must be an integer");

            int matches = 0;
            foreach (var r in param.Rows)
            {
                var cell = r.Cells.FirstOrDefault(c =>
                    string.Equals(c.Def.InternalName, cellName, StringComparison.OrdinalIgnoreCase));
                if (cell is null) continue;
                try
                {
                    long asLong = Convert.ToInt64(cell.Value);
                    if (asLong == wanted)
                    {
                        Console.WriteLine($"row {r.ID} = \"{r.Name}\" ({cellName}={asLong})");
                        matches++;
                    }
                }
                catch { /* skip non-numeric cells */ }
            }
            Console.WriteLine($"({matches} match{(matches == 1 ? "" : "es")} in {param.Rows.Count} rows)");
            return 0;
        }

        // --row mode: dump single row's cells
        int rowId = int.Parse(rowArg!);
        var row = param.Rows.FirstOrDefault(r => r.ID == rowId);
        if (row is null)
        {
            Console.WriteLine($"row {rowId} NOT FOUND in {table} ({param.Rows.Count} rows total)");
            return 1;
        }

        Console.WriteLine($"row {rowId} = \"{row.Name}\" (in {table})");
        foreach (var cell in row.Cells)
        {
            var val = cell.Value;
            if (val is IConvertible && !(val is string))
            {
                long asLong = Convert.ToInt64(val);
                // Print all non-zero cells, plus always print key shop/item
                // identifier fields even when zero (equipId=0, materialId=0,
                // costType=0 are all real information — prior version hid them
                // and made diagnostic output misleading).
                bool alwaysPrint =
                    cell.Def.InternalName.StartsWith("lotItem") ||
                    cell.Def.InternalName.Contains("FlagId") ||
                    cell.Def.InternalName.Contains("Category") ||
                    cell.Def.InternalName == "equipId" ||
                    cell.Def.InternalName == "equipType" ||
                    cell.Def.InternalName == "costType" ||
                    cell.Def.InternalName == "mtrlId" ||
                    cell.Def.InternalName == "value" ||
                    cell.Def.InternalName.StartsWith("materialId");
                if (asLong != 0 || alwaysPrint)
                {
                    Console.WriteLine($"  {cell.Def.InternalName} = {val}");
                }
            }
            else
            {
                Console.WriteLine($"  {cell.Def.InternalName} = {val}");
            }
        }
        return 0;
    }
}
