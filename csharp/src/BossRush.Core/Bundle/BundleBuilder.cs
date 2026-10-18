// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace BossRush.Core.Bundle;

/// <summary>
/// Produces the tamper-evident competition bundle that organizers pre-commit
/// before a run.
///
/// Output layout:
///   &lt;bundleDir&gt;/
///     tier_rewards.json          (copied from shop-roll output, when provided)
///     patched_event_js/          (only files whose bytes differ from source)
///     patched_event_bin/         (only files whose bytes differ from source,
///                                  mirroring the .js tree with .dcx binaries)
///     integrity.sha256           (SHA-256 hashes compatible with sha256sum)
///     SEED_INFO.txt              (seed + fingerprints)
///     README.txt
///
/// Hashing:
///   per-file hashes = SHA-256 of each file's raw bytes
///   artifact_tree   = SHA-256 of ("&lt;hash&gt;  &lt;relpath&gt;\n" lines sorted by path)
///   bundle_root     = SHA-256("artifact_tree=&lt;hash&gt;\n")
/// </summary>
public sealed class BundleBuilder
{
    public const string ToolName = "BossRush-BundleBuilder";
    public const string ToolVersion = "1.0.0"; // simplified pipeline (no drops.json)

    public BundleBuilderOptions Options { get; }

    public BundleBuilder(BundleBuilderOptions options)
    {
        Options = options ?? throw new ArgumentNullException(nameof(options));
    }

    public BundleResult Build()
    {
        if (Directory.Exists(Options.BundleDir))
        {
            if (!Options.Force)
                throw new IOException($"Bundle dir {Options.BundleDir} already exists; set Force=true to overwrite");
            Directory.Delete(Options.BundleDir, recursive: true);
        }
        Directory.CreateDirectory(Options.BundleDir);

        var fileHashes = new List<(string RelPath, string Hash)>();

        // --- tier_rewards.json (replaces drops.json as the seeded artifact) ---
        if (!string.IsNullOrEmpty(Options.TierRewardsJsonPath))
        {
            string tierOut = Path.Combine(Options.BundleDir, "tier_rewards.json");
            File.Copy(Options.TierRewardsJsonPath!, tierOut);
            fileHashes.Add(("tier_rewards.json", Sha256File(tierOut)));
        }

        // --- copy changed files from patched dirs (.js and .dcx) ---
        var changedFiles = new List<(string RelPath, string AbsPath)>();
        CopyDiffedTree(
            subdirName: "patched_event_js",
            patchedDir: Options.PatchedEventJsDir,
            sourceDir: Options.SourceEventDir,
            searchPattern: "*.emevd.dcx.js",
            changedFiles: changedFiles);
        if (Options.PatchedEventBinDir is not null)
        {
            CopyDiffedTree(
                subdirName: "patched_event_bin",
                patchedDir: Options.PatchedEventBinDir,
                sourceDir: Options.SourceEventDir,
                searchPattern: "*.emevd.dcx",
                changedFiles: changedFiles);
        }

        // --- per-file hashes ---
        foreach (var (relPath, absPath) in changedFiles)
            fileHashes.Add((relPath, Sha256File(absPath)));
        fileHashes.Sort((a, b) => StringComparer.Ordinal.Compare(a.RelPath, b.RelPath));

        // --- artifact tree ---
        var treeSb = new StringBuilder();
        foreach (var (relPath, hash) in fileHashes)
            treeSb.Append(hash).Append("  ").Append(relPath).Append('\n');
        string artifactTree = Sha256Hex(Encoding.UTF8.GetBytes(treeSb.ToString()));

        // --- bundle root ---
        string bundleRootPreimage = "artifact_tree=" + artifactTree + "\n";
        string bundleRoot = Sha256Hex(Encoding.UTF8.GetBytes(bundleRootPreimage));

        // --- integrity manifest ---
        var manifestSb = new StringBuilder();
        manifestSb.Append("# BossRush Seeded Competition Bundle - Integrity Manifest\n");
        manifestSb.Append("# Tool: ").Append(ToolName).Append(" v").Append(ToolVersion).Append('\n');
        manifestSb.Append("# Generated: ").Append(DateTime.UtcNow.ToString("O", CultureInfo.InvariantCulture)).Append('\n');
        manifestSb.Append("#\n");
        manifestSb.Append("# Per-file SHA-256 (standard `sha256sum -c` compatible):\n");
        foreach (var (relPath, hash) in fileHashes)
            manifestSb.Append(hash).Append("  ").Append(relPath).Append('\n');
        manifestSb.Append('\n');
        manifestSb.Append("# Aggregate hashes (not sha256sum-compatible; info only):\n");
        manifestSb.Append("artifact_tree:     ").Append(artifactTree).Append('\n');
        manifestSb.Append("bundle_root:       ").Append(bundleRoot).Append("\n\n");
        File.WriteAllBytes(
            Path.Combine(Options.BundleDir, "integrity.sha256"),
            Encoding.UTF8.GetBytes(manifestSb.ToString()));

        // --- SEED_INFO.txt ---
        WriteSeedInfo(artifactTree, bundleRoot, changedFiles);

        // --- README.txt ---
        WriteReadme();

        return new BundleResult(
            BundleDir: Options.BundleDir,
            Seed: Options.Seed,
            ArtifactTree: artifactTree,
            BundleRoot: bundleRoot,
            ChangedFileCount: changedFiles.Count);
    }

    // ----------------------------------------------------------------------
    private void CopyDiffedTree(
        string subdirName, string patchedDir, string sourceDir,
        string searchPattern, List<(string RelPath, string AbsPath)> changedFiles)
    {
        if (!Directory.Exists(patchedDir))
            return;

        string outSubdir = Path.Combine(Options.BundleDir, subdirName);
        Directory.CreateDirectory(outSubdir);

        foreach (var path in Directory.EnumerateFiles(patchedDir, searchPattern)
            .OrderBy(p => Path.GetFileName(p), StringComparer.Ordinal))
        {
            string name = Path.GetFileName(path);
            string srcCandidate = Path.Combine(sourceDir, name);
            bool include;
            if (!File.Exists(srcCandidate))
            {
                include = true; // patched-only file — include
            }
            else
            {
                include = !FilesEqual(srcCandidate, path);
            }
            if (include)
            {
                string dest = Path.Combine(outSubdir, name);
                File.Copy(path, dest);
                changedFiles.Add(($"{subdirName}/{name}", dest));
            }
        }
    }

    private static bool FilesEqual(string a, string b)
    {
        var fa = new FileInfo(a);
        var fb = new FileInfo(b);
        if (fa.Length != fb.Length) return false;
        const int BufSize = 64 * 1024;
        using var sa = File.OpenRead(a);
        using var sb = File.OpenRead(b);
        Span<byte> ba = stackalloc byte[BufSize];
        Span<byte> bb = stackalloc byte[BufSize];
        int n;
        while ((n = sa.Read(ba)) > 0)
        {
            int m = sb.Read(bb.Slice(0, n));
            if (m != n) return false;
            if (!ba.Slice(0, n).SequenceEqual(bb.Slice(0, n))) return false;
        }
        return true;
    }

    private void WriteSeedInfo(
        string artifactTree, string bundleRoot,
        List<(string RelPath, string AbsPath)> changedFiles)
    {
        var sb = new StringBuilder(4096);
        sb.Append("Boss Rush Alpha Version - Seeded Competition Bundle\n");
        sb.Append(new string('=', 60)).Append('\n').Append('\n');
        sb.Append("Seed               : ").Append(Options.Seed).Append('\n');
        sb.Append("Bundle builder     : ").Append(ToolName).Append(" v").Append(ToolVersion).Append('\n');
        sb.Append("Bundle built       : ")
            .Append(DateTime.UtcNow.ToString("O", CultureInfo.InvariantCulture)).Append('\n');
        sb.Append('\n');
        sb.Append("Artifact set:\n");
        sb.Append("  tier_rewards.json             - deterministic shop roll\n");
        sb.Append("  patched_event_bin/            - modified .emevd.dcx binaries\n");
        sb.Append("  integrity.sha256              - per-file SHA-256 manifest\n");
        sb.Append("  SEED_INFO.txt                 - this file\n");
        sb.Append("  README.txt                    - usage notes\n\n");
        sb.Append("Changed event artifacts:\n");
        int shown = 0;
        foreach (var (rel, _) in changedFiles.OrderBy(t => t.RelPath, StringComparer.Ordinal))
        {
            sb.Append("  ").Append(rel).Append('\n');
            if (++shown >= 30)
            {
                int more = changedFiles.Count - shown;
                if (more > 0)
                    sb.Append("  ... and ").Append(more).Append(" more (see integrity.sha256)\n");
                break;
            }
        }
        sb.Append('\n');
        sb.Append("Fingerprints (pre-commit any ONE of these):\n");
        sb.Append("  artifact_tree     : ").Append(artifactTree).Append('\n');
        sb.Append("  bundle_root       : ").Append(bundleRoot).Append("    <-- recommended pre-commit\n\n");
        sb.Append("Verification:\n");
        sb.Append("  `sha256sum -c integrity.sha256` inside the bundle dir\n");
        sb.Append("  to check every file; then recompute bundle_root from the\n");
        sb.Append("  reference implementation.\n\n");
        File.WriteAllBytes(
            Path.Combine(Options.BundleDir, "SEED_INFO.txt"),
            Encoding.UTF8.GetBytes(sb.ToString()));
    }

    private void WriteReadme()
    {
        var sb = new StringBuilder(2048);
        sb.Append("Boss Rush Alpha Version - Seeded Competition Bundle\n\n");
        sb.Append("Contents:\n");
        sb.Append("  tier_rewards.json      Deterministic shop roll for all tiers.\n");
        sb.Append("  patched_event_bin/     Modified .emevd.dcx binaries (the game reads these).\n");
        sb.Append("  integrity.sha256       sha256sum -c compatible manifest + aggregate hashes.\n");
        sb.Append("  SEED_INFO.txt          Seed, fingerprints.\n\n");
        sb.Append("To verify this bundle:\n");
        sb.Append("  1. cd into this directory.\n");
        sb.Append("  2. sha256sum -c integrity.sha256 (checks every individual file)\n");
        sb.Append("  3. Regenerate tier_rewards.json from the seed in SEED_INFO.txt and\n");
        sb.Append("     compare the bundle_root hash.\n\n");
        sb.Append("To use in a competition run:\n");
        sb.Append("  1. Use the patched_mod/ folder produced alongside this bundle.\n");
        sb.Append("  2. Feed that mod folder to Matt's Randomizer via --merge.\n");
        sb.Append("  3. Boot via Mod Engine. The shop tiers and boss rewards are now\n");
        sb.Append("     deterministic for this seed.\n\n");
        sb.Append("Reporting competition results:\n");
        sb.Append("  Include the bundle_root hash from SEED_INFO.txt. That single\n");
        sb.Append("  64-char digest ties a recorded run to a specific seed+patch.\n");
        File.WriteAllBytes(
            Path.Combine(Options.BundleDir, "README.txt"),
            Encoding.UTF8.GetBytes(sb.ToString()));
    }

    // ----------------------------------------------------------------------
    private static string Sha256Hex(byte[] data)
    {
        byte[] digest = SHA256.HashData(data);
        var sb = new StringBuilder(digest.Length * 2);
        foreach (var b in digest) sb.Append(b.ToString("x2", CultureInfo.InvariantCulture));
        return sb.ToString();
    }

    private static string Sha256File(string path)
    {
        using var fs = File.OpenRead(path);
        byte[] digest = SHA256.HashData(fs);
        var sb = new StringBuilder(digest.Length * 2);
        foreach (var b in digest) sb.Append(b.ToString("x2", CultureInfo.InvariantCulture));
        return sb.ToString();
    }
}

public sealed class BundleBuilderOptions
{
    /// <summary>Path to tier_rewards.json to include in the bundle. Optional —
    /// when null the bundle contains only event-file diffs.</summary>
    public string? TierRewardsJsonPath { get; init; }

    /// <summary>Patched .js output (from step6 or the C# patcher's --js side).</summary>
    public required string PatchedEventJsDir { get; init; }

    /// <summary>Patched .dcx binary output; set null to bundle only .js.</summary>
    public string? PatchedEventBinDir { get; init; }

    /// <summary>Original mod/event/ for diff filtering (only include changed files).</summary>
    public required string SourceEventDir { get; init; }

    public required string BundleDir { get; init; }

    public bool Force { get; init; }

    /// <summary>Seed string for SEED_INFO.txt.</summary>
    public string Seed { get; init; } = "";
}

public sealed record BundleResult(
    string BundleDir,
    string Seed,
    string ArtifactTree,
    string BundleRoot,
    int ChangedFileCount);
