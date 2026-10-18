// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Buffers.Binary;
using System.IO;
using System.Linq;
using System.Text;
using BossRush.Core.Patching;
using SoulsFormats;

namespace BossRush.Cli.Commands;

/// <summary>
/// <c>bossrush inspect-emevd</c> — dump the instruction list of a single
/// event inside an EMEVD/EMEVD.DCX, or list all events in the file. Each
/// instruction prints as <c>[idx] bank=X id=Y args=N  &lt;hex&gt;</c>. Used to
/// confirm that splicers (Tier1VisibilityBootstrapSplicer, TierClearEventSplicer)
/// physically landed the bytes they claim to have written.
/// </summary>
internal static class InspectEmevdCommand
{
    private const string Usage = """
bossrush inspect-emevd — dump an EMEVD event's instruction list.

  --file   <path>    .emevd or .emevd.dcx
  --event  <id>      Event ID to dump (decimal). Omit to list all events.
  --max-arg-bytes <n>  Truncate each instruction's arg-data hex at n bytes (default 64).
""";

    public static int Execute(string[] args)
    {
        var p = new ArgParser(
            knownOptions: new[] { "--file", "--event", "--max-arg-bytes" },
            knownFlags: new[] { "--help" });
        p.Parse(args);
        if (p.HasFlag("--help")) { Console.WriteLine(Usage); return 0; }

        string filePath = p.Required("--file");
        string? eventIdStr = p.Optional("--event");
        int maxArg = int.TryParse(p.Optional("--max-arg-bytes"), out var ma) ? ma : 64;

        if (!File.Exists(filePath))
            throw new CliUsageException($"File not found: {filePath}");

        var emevd = EMEVD.Read(filePath);
        Console.WriteLine($"# EMEVD inspect: {filePath}");
        Console.WriteLine($"#   Events: {emevd.Events.Count}");

        if (eventIdStr is null)
        {
            // List mode
            foreach (var ev in emevd.Events.OrderBy(e => e.ID))
            {
                Console.WriteLine($"  event {ev.ID,-10}  instructions={ev.Instructions.Count,-4}  params={ev.Parameters.Count}  rest={ev.RestBehavior}");
            }
            return 0;
        }

        if (!long.TryParse(eventIdStr, out long targetId))
            throw new CliUsageException($"--event must be a decimal integer: {eventIdStr}");

        var target = emevd.Events.FirstOrDefault(e => e.ID == targetId);
        if (target is null)
        {
            Console.Error.WriteLine($"Event {targetId} not found in {filePath}.");
            return 3;
        }

        Console.WriteLine($"=== Event {target.ID}  ({target.Instructions.Count} instructions, {target.Parameters.Count} params, rest={target.RestBehavior}) ===");
        for (int i = 0; i < target.Instructions.Count; i++)
        {
            var ins = target.Instructions[i];
            var ad = ins.ArgData ?? Array.Empty<byte>();
            string annot = AnnotateInstruction(ins);
            Console.WriteLine(
                $"  [{i,3}] bank={ins.Bank,-4} id={ins.ID,-4} argLen={ad.Length,-3}  {annot}");
            Console.WriteLine($"         hex: {Hex(ad, maxArg)}");
        }
        if (target.Parameters.Count > 0)
        {
            Console.WriteLine();
            Console.WriteLine($"  -- Parameters ({target.Parameters.Count}) --  (field layout omitted; not needed for diagnostics)");
        }
        return 0;
    }

    /// <summary>Best-effort human annotation for recognised (bank,id) pairs — just
    /// enough to spot bootstrap / batch-reset / InitializeEvent rows without
    /// cross-referencing EMEDF.</summary>
    private static string AnnotateInstruction(EMEVD.Instruction ins)
    {
        var ad = ins.ArgData ?? Array.Empty<byte>();
        if (ins.Bank == PatchConstants.BankEvent && ins.ID == PatchConstants.IdSetEventFlag && ad.Length >= 9)
        {
            byte type  = ad[0];
            uint flag  = BinaryPrimitives.ReadUInt32LittleEndian(ad.AsSpan(4, 4));
            byte state = ad[8];
            return $"SetEventFlag(type={type}, flag={flag}, state={(state == 1 ? "ON" : state == 0 ? "OFF" : state.ToString())})";
        }
        if (ins.Bank == PatchConstants.BankEvent && ins.ID == PatchConstants.IdBatchSetEventFlags && ad.Length >= 9)
        {
            uint start = BinaryPrimitives.ReadUInt32LittleEndian(ad.AsSpan(0, 4));
            uint end   = BinaryPrimitives.ReadUInt32LittleEndian(ad.AsSpan(4, 4));
            byte state = ad[8];
            return $"BatchSetEventFlags({start}, {end}, {(state == 1 ? "ON" : "OFF")})";
        }
        if (ins.Bank == PatchConstants.BankSystem
            && (ins.ID == PatchConstants.IdInitializeEvent || ins.ID == PatchConstants.IdInitializeCommonEvent)
            && ad.Length >= 8)
        {
            int  slot     = BinaryPrimitives.ReadInt32LittleEndian(ad.AsSpan(0, 4));
            uint targetId = BinaryPrimitives.ReadUInt32LittleEndian(ad.AsSpan(4, 4));
            string name = ins.ID == PatchConstants.IdInitializeEvent
                ? "InitializeEvent"
                : "InitializeCommonEvent";
            return $"{name}(slot={slot}, event={targetId})";
        }
        return "";
    }

    private static string Hex(byte[] bytes, int max)
    {
        if (bytes.Length == 0) return "(empty)";
        int take = Math.Min(bytes.Length, max);
        var sb = new StringBuilder(take * 3);
        for (int i = 0; i < take; i++)
        {
            if (i > 0) sb.Append(' ');
            sb.Append(bytes[i].ToString("x2"));
        }
        if (take < bytes.Length) sb.Append($" …(+{bytes.Length - take}B)");
        return sb.ToString();
    }
}
