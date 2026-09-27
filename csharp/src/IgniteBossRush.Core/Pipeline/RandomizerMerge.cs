// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using IgniteBossRush.Core.Patching;

namespace IgniteBossRush.Core.Pipeline;

/// <summary>
/// Launches <c>merge-randomizer.ps1</c> (Matt's Item/Enemy Randomizer GUI
/// automation) and streams its log lines. Shared by the CLI and the WPF GUI.
/// </summary>
public static class RandomizerMerge
{
    public const string DefaultRandomizerDir = @"D:\Games\mods\elden\randomizer";
    public const string ScriptFileName = "merge-randomizer.ps1";

    public static string? FindScript()
    {
        string nextToExe = Path.Combine(AppContext.BaseDirectory, ScriptFileName);
        if (File.Exists(nextToExe))
            return nextToExe;

        string? dir = AppContext.BaseDirectory;
        for (int i = 0; i < 14 && dir is not null; i++)
        {
            string candidate = Path.Combine(dir, "csharp", "tools", ScriptFileName);
            if (File.Exists(candidate))
                return candidate;
            candidate = Path.Combine(dir, "tools", ScriptFileName);
            if (File.Exists(candidate))
                return candidate;
            dir = Path.GetDirectoryName(dir);
        }

        return null;
    }

    public static bool RandomizerLooksInstalled(string? randomizerDir = null)
    {
        string dir = string.IsNullOrWhiteSpace(randomizerDir)
            ? DefaultRandomizerDir
            : randomizerDir;
        return File.Exists(Path.Combine(dir, "EldenRingRandomizer.exe"));
    }

    public static int Run(RandomizerMergeOptions options, IProgress<string>? progress = null)
    {
        ArgumentNullException.ThrowIfNull(options);

        string? script = FindScript();
        if (script is null)
            throw new FileNotFoundException(
                $"{ScriptFileName} was not found next to the executable or under csharp/tools.");

        if (!Directory.Exists(options.PatchedModDir))
            throw new DirectoryNotFoundException($"Patched mod not found: {options.PatchedModDir}");

        var psi = new ProcessStartInfo
        {
            FileName = "powershell.exe",
            WorkingDirectory = Path.GetDirectoryName(script)!,
            UseShellExecute = false,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            CreateNoWindow = true,
            StandardOutputEncoding = Encoding.UTF8,
            StandardErrorEncoding = Encoding.UTF8,
        };
        psi.ArgumentList.Add("-NoProfile");
        psi.ArgumentList.Add("-ExecutionPolicy");
        psi.ArgumentList.Add("Bypass");
        psi.ArgumentList.Add("-File");
        psi.ArgumentList.Add(script);
        psi.ArgumentList.Add("-PatchedMod");
        psi.ArgumentList.Add(Path.GetFullPath(options.PatchedModDir));
        psi.ArgumentList.Add("-OutDir");
        psi.ArgumentList.Add(Path.GetFullPath(options.OutDir));
        if (!string.IsNullOrWhiteSpace(options.RandomizerDir))
        {
            psi.ArgumentList.Add("-RandomizerDir");
            psi.ArgumentList.Add(Path.GetFullPath(options.RandomizerDir));
        }
        if (!string.IsNullOrWhiteSpace(options.OptionsOpt))
        {
            psi.ArgumentList.Add("-OptionsOpt");
            psi.ArgumentList.Add(Path.GetFullPath(options.OptionsOpt));
        }
        if (!string.IsNullOrWhiteSpace(options.ShopPool))
        {
            psi.ArgumentList.Add("-ShopPool");
            psi.ArgumentList.Add(Path.GetFullPath(options.ShopPool));
        }
        if (!string.IsNullOrWhiteSpace(options.SourceRegulation))
        {
            psi.ArgumentList.Add("-SourceRegulation");
            psi.ArgumentList.Add(Path.GetFullPath(options.SourceRegulation));
        }
        if (!string.IsNullOrWhiteSpace(options.ShopSeed))
        {
            psi.ArgumentList.Add("-ShopSeedIn");
            psi.ArgumentList.Add(options.ShopSeed);
        }
        if (options.KeepShop)
            psi.ArgumentList.Add("-KeepShop");

        progress?.Report($"Launching {ScriptFileName}");
        using var proc = Process.Start(psi)
            ?? throw new InvalidOperationException("Failed to start powershell.");

        proc.OutputDataReceived += (_, e) =>
        {
            if (!string.IsNullOrEmpty(e.Data))
                progress?.Report(e.Data);
        };
        proc.ErrorDataReceived += (_, e) =>
        {
            if (!string.IsNullOrEmpty(e.Data))
                progress?.Report(e.Data);
        };
        proc.BeginOutputReadLine();
        proc.BeginErrorReadLine();

        if (!proc.WaitForExit(TimeSpan.FromMinutes(30)))
        {
            try { proc.Kill(entireProcessTree: true); } catch { /* best-effort */ }
            throw new TimeoutException("Randomizer merge exceeded 30 minutes.");
        }

        proc.WaitForExit();
        if (proc.ExitCode == 0)
        {
            // The 1.16.1 menu_dlc02 in patched_mod wins over the randomizer
            // layer in Mod Engine, so 1.17.1 class names must live here —
            // otherwise Idus/Heavy Knight render as "?text_name?".
            string playableMod = Path.Combine(Path.GetFullPath(options.OutDir), "patched_mod");
            if (Directory.Exists(playableMod))
            {
                MenuDlc02PatchSummary fmg = MenuDlc02Patcher.ApplyAllLanguages(playableMod, playableMod);
                if (fmg.Applied)
                    progress?.Report($"Playable menu FMG: Idus/Heavy Knight names in {fmg.LanguagesPatched} languages");
            }
        }

        return proc.ExitCode;
    }

    public static RandomizerSeedInfo? ReadSeedInfo(string playableDir)
    {
        string path = Path.Combine(playableDir, "RANDOMIZER_SEED.txt");
        if (!File.Exists(path))
            return null;

        string? enemy = null;
        string? shop = null;
        foreach (string line in File.ReadAllLines(path))
        {
            if (line.StartsWith("Enemy randomizer seed:", StringComparison.OrdinalIgnoreCase))
                enemy = line["Enemy randomizer seed:".Length..].Trim();
            else if (line.StartsWith("Kalé shop seed:", StringComparison.OrdinalIgnoreCase)
                     || line.StartsWith("Kale shop seed:", StringComparison.OrdinalIgnoreCase))
                shop = line[(line.IndexOf(':') + 1)..].Trim();
        }

        return new RandomizerSeedInfo(enemy ?? "", shop ?? "");
    }
}

public sealed class RandomizerMergeOptions
{
    public required string PatchedModDir { get; init; }
    public required string OutDir { get; init; }
    public string? RandomizerDir { get; init; }
    public string? OptionsOpt { get; init; }
    public string? ShopPool { get; init; }
    public string? SourceRegulation { get; init; }
    public string? ShopSeed { get; init; }
    public bool KeepShop { get; init; }
}

public sealed record RandomizerSeedInfo(string EnemySeed, string ShopSeed);
