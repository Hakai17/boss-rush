// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using BossRush.Core.Io;
using SoulsFormats;

namespace BossRush.Cli.Commands;

/// <summary>
/// <c>bossrush inspect-esd</c> — dump the structure of a TalkESD file
/// (state groups, states, entry/exit/while command calls, and per-condition
/// evaluator bytecode as hex) to stdout. This is the reverse-engineering aid
/// that lets us decode the ESDLang bytecode patterns Kalé's menu uses before
/// we write a splicer that mutates them.
///
/// <para>
/// The ESD can be passed either as a bare <c>.esd</c> on disk OR (more commonly)
/// as <c>--bnd &lt;talkesdbnd.dcx&gt; --name &lt;t600001110.esd&gt;</c> pointing
/// at the BND4 container the mod ships with. The BND mode is the production
/// path — bare .esd dumps are useful only if someone manually extracted one
/// from the BND with Yabber.
/// </para>
/// </summary>
internal static class InspectEsdCommand
{
    private const string Usage = """
bossrush inspect-esd — dump a TalkESD's state/condition/command structure.

  --bnd   <path>    talkesdbnd.dcx container (e.g. mod/script/talk/m11_10_00_00.talkesdbnd.dcx)
  --name  <file>    name of the .esd entry inside the BND (e.g. t600001110.esd)
  --esd   <path>    OR: path to a bare .esd file (mutually exclusive with --bnd/--name)
  --max-eval-bytes  <n>  truncate per-evaluator hex dumps at n bytes (default 128)
  --max-arg-bytes   <n>  truncate per-argument hex dumps at n bytes (default 48)
""";

    public static int Execute(string[] args)
    {
        var p = new ArgParser(
            knownOptions: new[] { "--bnd", "--name", "--esd", "--max-eval-bytes", "--max-arg-bytes" },
            knownFlags: new[] { "--help" });
        p.Parse(args);
        if (p.HasFlag("--help")) { Console.WriteLine(Usage); return 0; }

        string? bndPath = p.Optional("--bnd");
        string? entryName = p.Optional("--name");
        string? esdPath = p.Optional("--esd");
        int maxEval = int.TryParse(p.Optional("--max-eval-bytes"), out var me) ? me : 128;
        int maxArg  = int.TryParse(p.Optional("--max-arg-bytes"),  out var ma) ? ma : 48;

        ESD esd;
        string sourceLabel;
        if (esdPath is not null)
        {
            if (bndPath is not null || entryName is not null)
                throw new CliUsageException("--esd is mutually exclusive with --bnd/--name.");
            esd = ESD.Read(esdPath);
            sourceLabel = esdPath;
        }
        else
        {
            if (bndPath is null || entryName is null)
                throw new CliUsageException("Pass either --esd <path> OR --bnd <path> --name <file>.");
            var loaded = EsdIo.LoadFromBnd(bndPath, entryName);
            esd = loaded.Esd;
            sourceLabel = $"{bndPath}::{entryName}";
        }

        DumpEsd(esd, sourceLabel, maxEval, maxArg, Console.Out);
        return 0;
    }

    // ------------------------------------------------------------------
    private static void DumpEsd(ESD esd, string source, int maxEval, int maxArg, TextWriter w)
    {
        w.WriteLine($"# ESD inspect: {source}");
        w.WriteLine($"#   LongFormat={esd.LongFormat}  DarkSoulsCount={esd.DarkSoulsCount}  Name={esd.Name ?? "<null>"}");
        w.WriteLine($"#   Unk70={esd.Unk70:X8} Unk74={esd.Unk74:X8} Unk78={esd.Unk78:X8} Unk7C={esd.Unk7C:X8}");
        w.WriteLine($"#   StateGroups: {esd.StateGroups.Count}");
        w.WriteLine();

        foreach (var groupId in esd.StateGroups.Keys.OrderBy(k => k))
        {
            var group = esd.StateGroups[groupId];
            w.WriteLine($"=== StateGroup {groupId}  ({group.Count} states) ===");

            foreach (var stateId in group.Keys.OrderBy(k => k))
            {
                var state = group[stateId];
                w.WriteLine($"  -- State {stateId} --");
                DumpCommandList(w, "Entry", state.EntryCommands, maxArg);
                DumpCommandList(w, "Exit",  state.ExitCommands,  maxArg);
                DumpCommandList(w, "While", state.WhileCommands, maxArg);

                if (state.Conditions.Count == 0)
                {
                    w.WriteLine("    Conditions: (none)");
                }
                else
                {
                    for (int i = 0; i < state.Conditions.Count; i++)
                        DumpCondition(w, state.Conditions[i], depth: 2, index: i, maxEval, maxArg);
                }
                w.WriteLine();
            }
        }
    }

    private static void DumpCommandList(TextWriter w, string label, List<ESD.CommandCall> cmds, int maxArg)
    {
        if (cmds.Count == 0)
        {
            w.WriteLine($"    {label}Commands: (none)");
            return;
        }
        w.WriteLine($"    {label}Commands ({cmds.Count}):");
        for (int i = 0; i < cmds.Count; i++)
        {
            var c = cmds[i];
            w.WriteLine($"      [{i}] bank={c.CommandBank} id={c.CommandID} args={c.Arguments.Count}");
            for (int a = 0; a < c.Arguments.Count; a++)
            {
                var bytes = c.Arguments[a] ?? Array.Empty<byte>();
                w.WriteLine($"          arg[{a}] ({bytes.Length}B): {Hex(bytes, maxArg)}");
            }
        }
    }

    private static void DumpCondition(
        TextWriter w, ESD.Condition cond, int depth, int index, int maxEval, int maxArg)
    {
        string indent = new string(' ', depth * 2);
        string target = cond.TargetState.HasValue
            ? cond.TargetState.Value.ToString()
            : "<null — has Subconditions>";
        var eval = cond.Evaluator ?? Array.Empty<byte>();
        w.WriteLine($"{indent}Condition[{index}] target={target} evaluatorLen={eval.Length}");
        w.WriteLine($"{indent}  eval: {Hex(eval, maxEval)}");
        if (cond.PassCommands.Count > 0)
        {
            w.WriteLine($"{indent}  PassCommands ({cond.PassCommands.Count}):");
            for (int i = 0; i < cond.PassCommands.Count; i++)
            {
                var c = cond.PassCommands[i];
                w.WriteLine($"{indent}    [{i}] bank={c.CommandBank} id={c.CommandID} args={c.Arguments.Count}");
                for (int a = 0; a < c.Arguments.Count; a++)
                {
                    var bytes = c.Arguments[a] ?? Array.Empty<byte>();
                    w.WriteLine($"{indent}        arg[{a}] ({bytes.Length}B): {Hex(bytes, maxArg)}");
                }
            }
        }
        if (cond.Subconditions.Count > 0)
        {
            w.WriteLine($"{indent}  Subconditions ({cond.Subconditions.Count}):");
            for (int i = 0; i < cond.Subconditions.Count; i++)
                DumpCondition(w, cond.Subconditions[i], depth + 2, i, maxEval, maxArg);
        }
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
