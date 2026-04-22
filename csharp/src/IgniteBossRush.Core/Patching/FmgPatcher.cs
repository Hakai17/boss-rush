// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using SoulsFormats;

namespace IgniteBossRush.Core.Patching;

/// <summary>
/// Patches a DCX-wrapped .msgbnd.dcx (BND4-of-FMGs) by inserting or
/// overriding a caller-specified set of FMG entries inside one of its
/// inner .fmg files.
///
/// <para>
/// <b>Current consumer.</b> Boss Rush needs per-tier menu titles
/// ("Boss Rush - Tier 1" .. "Boss Rush - Tier 9") to render in Kalé's
/// shop window — referenced by <c>ShopLineupParam.menuTitleMsgId</c>
/// via <see cref="RegulationConstants.BossRushShopTitleMsgId(int)"/>.
/// The regulation-side wiring is cheap (one-line change in
/// <c>RegulationPatcher.MutateShopLineupParam</c>), but the TEXT those
/// IDs resolve to must exist in <c>menu_dlc02.msgbnd.dcx</c>'s
/// <c>GR_MenuText.fmg</c> — otherwise the game renders the placeholder
/// <c>?MenuText?</c> (the bug this patcher closes).
/// </para>
///
/// <para>
/// <b>DCX preservation.</b> We preserve the source file's DCX
/// compression variant. Elden Ring ships <c>menu_dlc02.msgbnd.dcx</c>
/// as <c>DCX_KRAK</c>; writing back as a different variant would still
/// be parseable by the game but would bloat the file. SoulsFormats'
/// <c>DCX.Decompress(bytes, out CompressionInfo)</c> gives us the
/// opaque compression object to pass back to
/// <c>DCX.Compress(..., compressionInfo)</c>.
/// </para>
///
/// <para>
/// <b>Idempotency.</b> Re-running the patch over its own output is a
/// no-op at the semantic level: entries we add by ID are first
/// removed (if present) and re-added with the new text. Byte-equality
/// between two successive runs depends on the FMG writer's
/// determinism — SoulsFormats' FMG.Write emits entries sorted by ID,
/// so the output is stable.
/// </para>
///
/// <para>
/// <b>Scope.</b> This patcher only adds / overrides entries. It does
/// NOT delete unrelated entries from the target FMG, and does NOT
/// touch other FMGs in the bundle. Unrelated game text is preserved
/// verbatim. Matt's Randomizer merge layer then overlays the patched
/// msgbnd.dcx over its live install, same pattern as the regulation
/// and EMEVD patches.
/// </para>
/// </summary>
public static class FmgPatcher
{
    /// <summary>
    /// Add / override entries inside one FMG within a .msgbnd.dcx bundle,
    /// write to <paramref name="outputPath"/>. Other FMGs in the bundle
    /// are preserved byte-for-byte.
    /// </summary>
    /// <param name="sourceMsgBndPath">Input .msgbnd.dcx path (read-only).</param>
    /// <param name="outputPath">Output .msgbnd.dcx path. Created or overwritten.</param>
    /// <param name="targetFmgName">FMG basename without extension (e.g. "GR_MenuText").
    ///   Matched against <c>Path.GetFileNameWithoutExtension(file.Name)</c> inside
    ///   the BND4 — case-insensitive.</param>
    /// <param name="entries">ID → text pairs to add. Existing entries at the same
    ///   ID are replaced; missing IDs are inserted. Never null, may be empty
    ///   (a zero-entry patch is a pass-through).</param>
    /// <exception cref="FileNotFoundException">Source file missing.</exception>
    /// <exception cref="InvalidDataException">Source isn't a BND4, or the
    ///   target FMG isn't present in the bundle.</exception>
    public static FmgPatchResult Apply(
        string sourceMsgBndPath,
        string outputPath,
        string targetFmgName,
        IReadOnlyDictionary<int, string> entries)
    {
        if (sourceMsgBndPath is null) throw new ArgumentNullException(nameof(sourceMsgBndPath));
        if (outputPath is null) throw new ArgumentNullException(nameof(outputPath));
        if (targetFmgName is null) throw new ArgumentNullException(nameof(targetFmgName));
        if (entries is null) throw new ArgumentNullException(nameof(entries));
        if (!File.Exists(sourceMsgBndPath))
            throw new FileNotFoundException("Source msgbnd.dcx not found", sourceMsgBndPath);

        byte[] raw = File.ReadAllBytes(sourceMsgBndPath);
        bool wasDcxWrapped = DCX.Is(raw);
        DCX.CompressionInfo? compressionInfo = null;
        if (wasDcxWrapped)
        {
            raw = DCX.Decompress(raw, out var ci);
            compressionInfo = ci;
        }

        if (!BND4.Is(raw))
            throw new InvalidDataException(
                $"Decompressed payload of '{sourceMsgBndPath}' is not a BND4.");

        BND4 container = BND4.Read(raw);

        // Find the target FMG by basename. The file.Name inside the binder
        // uses FromSoft's Japanese internal path (e.g.
        // "N:\\GR\\data\\INTERROOT_win64\\msg\\engUS\\GR_MenuText.fmg"),
        // so we compare on the basename minus extension only.
        BinderFile? targetFile = container.Files.FirstOrDefault(f =>
            string.Equals(
                Path.GetFileNameWithoutExtension(f.Name ?? ""),
                targetFmgName,
                StringComparison.OrdinalIgnoreCase));
        if (targetFile is null)
            throw new InvalidDataException(
                $"FMG '{targetFmgName}' not found in bundle '{sourceMsgBndPath}'. "
                + $"Bundle contains: [{string.Join(", ", container.Files.Select(f => Path.GetFileName(f.Name ?? "<null>")))}].");

        FMG fmg = FMG.Read(targetFile.Bytes);

        int added = 0, replaced = 0;
        foreach (var (id, text) in entries)
        {
            // Idempotency: remove any existing entry at the same id first.
            int existingIdx = fmg.Entries.FindIndex(e => e.ID == id);
            if (existingIdx >= 0)
            {
                fmg.Entries.RemoveAt(existingIdx);
                replaced++;
            }
            else
            {
                added++;
            }
            fmg.Entries.Add(new FMG.Entry(id, text));
        }

        // FMG.Write emits entries in list order. Sort by ID so the on-disk
        // layout is deterministic across runs — matches what SoulsFormats'
        // read path produces for vanilla FMGs.
        fmg.Entries.Sort((a, b) => a.ID.CompareTo(b.ID));

        targetFile.Bytes = fmg.Write();

        byte[] outBytes = container.Write();
        if (compressionInfo is not null)
        {
            outBytes = DCX.Compress(outBytes, compressionInfo);
        }

        Directory.CreateDirectory(Path.GetDirectoryName(outputPath)
                                  ?? throw new InvalidOperationException(
                                      $"output path '{outputPath}' has no directory component"));
        File.WriteAllBytes(outputPath, outBytes);

        return new FmgPatchResult(
            SourcePath: sourceMsgBndPath,
            OutputPath: outputPath,
            TargetFmgName: targetFmgName,
            DcxCompressionType: compressionInfo?.GetType().Name ?? "(none)",
            EntriesAdded: added,
            EntriesReplaced: replaced,
            TotalEntriesInFmg: fmg.Entries.Count);
    }
}

public sealed record FmgPatchResult(
    string SourcePath,
    string OutputPath,
    string TargetFmgName,
    /// <summary>Runtime type name of the <see cref="SoulsFormats.DCX.CompressionInfo"/>
    /// subclass recovered from the source (e.g. <c>DcxKrakCompressionInfo</c>),
    /// or <c>"(none)"</c> if the source wasn't DCX-wrapped. Recorded for
    /// diagnostic output; the actual compression object is consumed
    /// internally to preserve the variant on write.</summary>
    string DcxCompressionType,
    int EntriesAdded,
    int EntriesReplaced,
    int TotalEntriesInFmg);
