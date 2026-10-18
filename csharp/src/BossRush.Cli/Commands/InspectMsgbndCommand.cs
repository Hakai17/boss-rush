// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using SoulsFormats;

namespace BossRush.Cli.Commands;

/// <summary>
/// <c>bossrush inspect-msgbnd</c> — diagnostic for message bundles.
///
/// Unpacks a .msgbnd.dcx (DCX-wrapped BND4 of .fmg files), prints every inner
/// file (BinderFile.ID, Name, byte size), and for FMG-typed files dumps the
/// first and last entries plus an optional probe lookup (<c>--probe-id</c>) so
/// we can confirm whether, e.g., WeaponName[15000000] actually resolves in the
/// bundle the game is loading.
///
/// Built to diagnose the `?WeaponName?` / missing-icon failure in Boss Rush
/// shop rows: if the FMG file inside the mod's item_dlc02.msgbnd.dcx is named
/// or indexed wrongly, the game falls back to the "?CategoryName?" placeholder
/// even though the raw entries parse fine with permissive readers.
/// </summary>
internal static class InspectMsgbndCommand
{
    private const string Usage = """
bossrush inspect-msgbnd — dump contents of a .msgbnd.dcx (FMG bundle).

  --bnd       <path>   path to item*.msgbnd.dcx or menu*.msgbnd.dcx
  --probe-ids <csv>    comma-separated FMG entry IDs to probe (e.g. 15000000,2040000)
  --show-entries <n>   show first/last N entries per FMG (default 3)
""";

    public static int Execute(string[] args)
    {
        var p = new ArgParser(
            knownOptions: new[] { "--bnd", "--show-entries", "--probe-ids" },
            knownFlags: new[] { "--help" });
        p.Parse(args);
        if (p.HasFlag("--help")) { Console.WriteLine(Usage); return 0; }

        string bnd = p.Required("--bnd");
        int show = int.TryParse(p.Optional("--show-entries"), out var s) ? s : 3;
        var probeIds = (p.Optional("--probe-ids") ?? "")
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(x => int.Parse(x, System.Globalization.CultureInfo.InvariantCulture))
            .ToList();

        Console.WriteLine($"# msgbnd inspect: {bnd}");
        byte[] bytes = File.ReadAllBytes(bnd);
        if (DCX.Is(bytes))
        {
            bytes = DCX.Decompress(bytes);
            Console.WriteLine($"#   DCX decompressed -> {bytes.Length} bytes");
        }

        if (!BND4.Is(bytes))
            throw new InvalidDataException("Decompressed payload is not a BND4.");
        BND4 container = BND4.Read(bytes);

        Console.WriteLine($"#   BND4 Files: {container.Files.Count}  Format={container.Format}  Version={container.Version}");
        Console.WriteLine();

        foreach (var f in container.Files.OrderBy(f => f.ID))
        {
            string baseName = Path.GetFileName(f.Name ?? "<null>");
            Console.WriteLine($"[{f.ID,5}] {f.Name}  ({f.Bytes?.Length ?? 0} bytes)");

            bool looksFmg = baseName.EndsWith(".fmg", StringComparison.OrdinalIgnoreCase);
            if (!looksFmg) continue;

            FMG fmg;
            try { fmg = FMG.Read(f.Bytes); }
            catch (Exception ex) { Console.WriteLine($"    FMG.Read FAILED: {ex.GetType().Name}: {ex.Message}"); continue; }

            Console.WriteLine($"    FMG Version={fmg.Version}  BigEndian={fmg.BigEndian}  Unicode={fmg.Unicode}  Entries={fmg.Entries.Count}");

            if (fmg.Entries.Count > 0)
            {
                var ordered = fmg.Entries.OrderBy(e => e.ID).ToList();
                foreach (var e in ordered.Take(show))
                    Console.WriteLine($"    first [{e.ID}] = {Render(e.Text)}");
                if (ordered.Count > show * 2)
                    Console.WriteLine("    ...");
                foreach (var e in ordered.Skip(Math.Max(0, ordered.Count - show)))
                    Console.WriteLine($"    last  [{e.ID}] = {Render(e.Text)}");
            }

            foreach (var pid in probeIds)
            {
                var hit = fmg.Entries.FirstOrDefault(e => e.ID == pid);
                if (hit is null)
                    Console.WriteLine($"    probe [{pid}]: <MISS>");
                else
                    Console.WriteLine($"    probe [{pid}] = {Render(hit.Text)}");
            }
        }

        return 0;
    }

    private static string Render(string? t)
    {
        if (t is null) return "<null>";
        if (t.Length > 80) t = t.Substring(0, 80) + "…";
        return "\"" + t.Replace("\n", "\\n").Replace("\r", "\\r") + "\"";
    }
}
