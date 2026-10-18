// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Buffers.Binary;
using System.IO;
using System.Linq;
using BossRush.Core.Patching;
using SoulsFormats;

namespace BossRush.Cli.Commands;

/// <summary>
/// <c>bossrush find-initialize</c> — scan every <c>.emevd(.dcx)</c> in a
/// directory for <c>InitializeEvent</c> / <c>InitializeCommonEvent</c> calls
/// that reference a target event ID. This is the "is event N actually
/// invoked?" diagnostic: if the target event exists but no one calls it,
/// it's dead code and anything we splice into it will never run at load.
/// </summary>
internal static class FindInitializeCommand
{
    private const string Usage = """
bossrush find-initialize — find InitializeEvent/InitializeCommonEvent calls referencing a target event.

  --dir    <path>    Directory containing .emevd(.dcx) files to scan (recursive).
  --event  <id>      Target event ID (decimal). Reports every call-site referencing it.
""";

    public static int Execute(string[] args)
    {
        var p = new ArgParser(
            knownOptions: new[] { "--dir", "--event" },
            knownFlags: new[] { "--help" });
        p.Parse(args);
        if (p.HasFlag("--help")) { Console.WriteLine(Usage); return 0; }

        string dir = p.Required("--dir");
        string evStr = p.Required("--event");
        if (!Directory.Exists(dir))
            throw new CliUsageException($"Directory not found: {dir}");
        if (!uint.TryParse(evStr, out uint target))
            throw new CliUsageException($"--event must be a decimal uint: {evStr}");

        var files = Directory.EnumerateFiles(dir, "*.emevd*", SearchOption.AllDirectories)
            .Where(f => f.EndsWith(".emevd", StringComparison.OrdinalIgnoreCase)
                     || f.EndsWith(".emevd.dcx", StringComparison.OrdinalIgnoreCase))
            .OrderBy(f => f)
            .ToList();

        Console.WriteLine($"# Scanning {files.Count} EMEVD files under {dir} for Initialize*({target})");
        int totalHits = 0;
        foreach (var path in files)
        {
            EMEVD emevd;
            try { emevd = EMEVD.Read(path); }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"  (skip) {Path.GetFileName(path)}: {ex.GetType().Name}: {ex.Message}");
                continue;
            }
            foreach (var ev in emevd.Events)
            {
                for (int i = 0; i < ev.Instructions.Count; i++)
                {
                    var ins = ev.Instructions[i];
                    if (ins.Bank != PatchConstants.BankSystem) continue;
                    if (ins.ID != PatchConstants.IdInitializeEvent
                        && ins.ID != PatchConstants.IdInitializeCommonEvent) continue;
                    var ad = ins.ArgData;
                    if (ad is null || ad.Length < 8) continue;

                    uint referenced = BinaryPrimitives.ReadUInt32LittleEndian(ad.AsSpan(4, 4));
                    if (referenced != target) continue;

                    int slot = BinaryPrimitives.ReadInt32LittleEndian(ad.AsSpan(0, 4));
                    string kind = ins.ID == PatchConstants.IdInitializeEvent
                        ? "InitializeEvent"
                        : "InitializeCommonEvent";
                    Console.WriteLine(
                        $"  {Path.GetFileName(path)}  event {ev.ID}  ins[{i}]  {kind}(slot={slot}, event={target})");
                    totalHits++;
                }
            }
        }
        Console.WriteLine();
        Console.WriteLine($"# Total call-sites referencing event {target}: {totalHits}");
        return totalHits > 0 ? 0 : 4;
    }
}
