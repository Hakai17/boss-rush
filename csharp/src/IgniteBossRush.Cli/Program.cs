// SPDX-License-Identifier: GPL-3.0-only
using System;
using IgniteBossRush.Cli.Commands;

namespace IgniteBossRush.Cli;

/// <summary>
/// Thin subcommand dispatcher. Keeps each pipeline stage runnable in isolation
/// (generate / patch / bundle) plus the headline end-to-end command (run) that
/// the GUI calls behind the scenes. Intentionally no external argparse
/// dependency — the surface is tiny and each subcommand parses its own flags
/// so the single-file published .exe stays compact.
/// </summary>
internal static class Program
{
    private const string Usage = """
Usage: igniterush <command> [--options...]

Commands:
  run        End-to-end: generate drops + patch mod + build competition bundle.
             Pass --shop-pool to also roll tier_rewards.json + patch regulation.bin.
  generate   Just roll drops.json / SEED_INFO.txt / integrity.sha256.
  patch      Just binary-patch event/*.emevd.dcx given an existing drops.json.
  regulate   Just roll tier_rewards.json + patch regulation.bin (Step 7).
  bundle     Just assemble a competition bundle from existing drops + patches.
  inspect-esd  Dump a TalkESD's state/condition/command structure (diagnostic).
  inspect-emevd  Dump an EMEVD event's instruction list (diagnostic).
  inspect-msgbnd Dump FMG bundle contents (probe for specific IDs).
  find-initialize  Find InitializeEvent/InitializeCommonEvent call-sites for an event (diagnostic).
  help       Show this message.

Common flags:
  --help     Show per-command help.

Examples:
  igniterush run ^
    --source-mod "C:\path\to\Ignite Rush Alpha Version\mod" ^
    --flag-pool step4-flagpool/flag_pool.json ^
    --exclusions step3-exclusions/exclusions.json ^
    --boss-catalog step2-bosscatalog/boss_catalog.json ^
    --out-dir out/run1 ^
    [--seed abcdef0123456789]

  igniterush generate --seed 1234... --out-dir out/gen --flag-pool ... --exclusions ... --boss-catalog ...
""";

    public static int Main(string[] args)
    {
        if (args.Length == 0 || args[0] is "-h" or "--help" or "help")
        {
            Console.WriteLine(Usage);
            return 0;
        }

        string cmd = args[0];
        string[] rest = args[1..];

        try
        {
            return cmd switch
            {
                "run"      => RunCommand.Execute(rest),
                "generate" => GenerateCommand.Execute(rest),
                "patch"    => PatchCommand.Execute(rest),
                "regulate" => RegulateCommand.Execute(rest),
                "bundle"   => BundleCommand.Execute(rest),
                "inspect-esd" => InspectEsdCommand.Execute(rest),
                "inspect-emevd" => InspectEmevdCommand.Execute(rest),
                "inspect-msgbnd" => InspectMsgbndCommand.Execute(rest),
                "inspect-regulation" => InspectRegulationCommand.Execute(rest),
                "find-initialize" => FindInitializeCommand.Execute(rest),
                "splice-kale"  => SpliceKaleCommand.Execute(rest),
                _ => Fail($"Unknown command: {cmd}\n\n{Usage}"),
            };
        }
        catch (CliUsageException ex)
        {
            Console.Error.WriteLine("error: " + ex.Message);
            return 2;
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"fatal: {ex.GetType().Name}: {ex.Message}");
            Console.Error.WriteLine(ex.StackTrace);
            return 1;
        }
    }

    private static int Fail(string msg)
    {
        Console.Error.WriteLine(msg);
        return 2;
    }
}
