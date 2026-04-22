// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using System.IO;
using IgniteBossRush.Core.Bundle;
using IgniteBossRush.Core.Generation;
using IgniteBossRush.Core.Io;
using IgniteBossRush.Core.Models;
using IgniteBossRush.Core.Patching;
using SoulsFormats;

namespace IgniteBossRush.Core.Pipeline;

/// <summary>
/// End-to-end orchestrator for the C# Seeded Competition Tool. Drives the
/// library stages in order:
///
///   1. Copy source mod         — verbatim copy of the mod tree
///   2. Shop roll               — deterministic tier_rewards.json from seed + pool
///   3. Regulation patch        — patched_mod/regulation.bin (shop rows + zero boss drops)
///   4. Boss reward strip       — strips InitializeCommonEvent dispatch calls from
///                                common_func.emevd.dcx (kills per-boss item awards)
///   5. Receive-all strip       — zeros AwardItemLot calls in 20 "receive all items
///                                at shop" events in m11_10_00_00.emevd.dcx
///   6. Kalé menu splice        — inserts 9 tier-gated shop entries into t600001110.esd
///   7. Bundle builder          — competition bundle with integrity manifest
///
/// Inputs: source mod folder + shop_pool.json (+ optional seed).
///
/// The runner exists so the CLI and the WPF GUI can both hit one entry point
/// with a single <see cref="PipelineOptions"/> blob, and receive a structured
/// <see cref="PipelineResult"/> rather than having each front-end re-wire the
/// sub-components by hand.
///
/// Progress reporting is push-based (<see cref="IProgress{T}"/>) so the GUI can
/// stream status lines to its log panel without blocking on stdout.
/// </summary>
public sealed class PipelineRunner
{
    public PipelineOptions Options { get; }

    public PipelineRunner(PipelineOptions options)
    {
        Options = options ?? throw new ArgumentNullException(nameof(options));
    }

    public PipelineResult Run(IProgress<string>? progress = null)
    {
        const int totalSteps = 7;
        string Hdr(int n) => $"[{n:D2}/{totalSteps:D2}]";

        progress?.Report($"{Hdr(1)} Preparing workspace: {Options.WorkDir}");
        Directory.CreateDirectory(Options.WorkDir);

        string seed = Options.Seed;
        string seedOrigin = Options.SeedOrigin;
        if (string.IsNullOrWhiteSpace(seed))
        {
            seed = DropGeneratorOptions.MintRandomSeed();
            seedOrigin = "auto-minted (128-bit)";
            progress?.Report($"        Auto-minted seed: {seed}");
        }
        else
        {
            progress?.Report($"        Seed (user-supplied): {seed}");
        }

        // --- 1. copy source mod ---
        progress?.Report($"{Hdr(1)} Copying source mod folder");
        string patchedModDir = Path.Combine(Options.WorkDir, "patched_mod");
        if (Directory.Exists(patchedModDir))
            Directory.Delete(patchedModDir, recursive: true);
        CopyDirectory(Options.SourceModDir, patchedModDir);

        string patchedEventDir = Path.Combine(patchedModDir, "event");
        string sourceEventDir = Path.Combine(Options.SourceModDir, "event");

        // --- 2. shop roll ---
        progress?.Report($"{Hdr(2)} Rolling deterministic shop tier_rewards.json");
        string shopOutDir = Path.Combine(Options.WorkDir, "generator");
        Directory.CreateDirectory(shopOutDir);
        var shopOpts = new ShopRollGeneratorOptions
        {
            Seed = seed,
            ShopPoolPath = Options.ShopPoolPath,
        };
        var shopResult = new ShopRollGenerator(shopOpts).Generate(shopOutDir);
        progress?.Report($"        tier_rewards.json = {shopResult.Fingerprint}");
        progress?.Report($"        tiers={shopResult.TierCount}, slots={shopResult.SlotCount}");

        var pool = JsonLoader.LoadFile<ShopPoolFile>(Options.ShopPoolPath);
        TierRewardsPlan plan = ShopRollGenerator.BuildPlan(seed, pool);

        // --- 3. regulation patch ---
        progress?.Report($"{Hdr(3)} Patching regulation.bin (shop rows{(Options.ZeroBossDrops ? " + zero boss drops" : "")})");
        string sourceRegulation = Path.Combine(Options.SourceModDir, "regulation.bin");
        string patchedRegulationPath = Path.Combine(patchedModDir, "regulation.bin");
        var regOpts = new RegulationPatcherOptions
        {
            SourceRegulationPath = sourceRegulation,
            OutputRegulationPath = patchedRegulationPath,
            Plan = plan,
            Force = true,
            ZeroBossDrops = Options.ZeroBossDrops,
        };
        var regulationResult = new RegulationPatcher(regOpts).Apply();
        progress?.Report($"        rows written: {regulationResult.RowsWritten} "
                         + $"(goods={regulationResult.EquipParamGoodsRowsWritten}, "
                         + $"itemLot={regulationResult.ItemLotParamMapRowsWritten}, "
                         + $"shop={regulationResult.ShopLineupParamRowsWritten})");
        if (Options.ZeroBossDrops)
            progress?.Report($"        boss-drop ItemLotParam_enemy rows zeroed: "
                             + $"{regulationResult.BossDropLotsZeroed}");

        // --- 3b. menu FMG patch (per-tier shop window titles) ---
        // Paired with step 3: regulation rows written above reference message
        // IDs 508001..508009 via menuTitleMsgId. Those IDs must exist in the
        // menu_dlc02.msgbnd.dcx bundle's GR_MenuText.fmg, or the game renders
        // the title as the placeholder "?MenuText?". English-only today —
        // non-English players fall back to the default "Purchase Item"
        // chrome (vanilla behaviour; no regression).
        string sourceMenuMsgBnd = Path.Combine(Options.SourceModDir, "msg", "engus",
                                                RegulationConstants.MenuMsgBndBaseName);
        string patchedMenuMsgBnd = Path.Combine(patchedModDir, "msg", "engus",
                                                 RegulationConstants.MenuMsgBndBaseName);
        if (File.Exists(sourceMenuMsgBnd))
        {
            var titleEntries = new Dictionary<int, string>();
            for (int tier = 1; tier <= 9; tier++)
            {
                titleEntries[RegulationConstants.BossRushShopTitleMsgId(tier)] =
                    string.Format(System.Globalization.CultureInfo.InvariantCulture,
                                  RegulationConstants.BossRushShopTitleFormat, tier);
            }
            var fmgResult = FmgPatcher.Apply(
                sourceMsgBndPath: sourceMenuMsgBnd,
                outputPath: patchedMenuMsgBnd,
                targetFmgName: RegulationConstants.BossRushShopTitleFmgName,
                entries: titleEntries);
            progress?.Report($"        menu FMG patched: +{fmgResult.EntriesAdded} "
                             + $"added, ~{fmgResult.EntriesReplaced} replaced "
                             + $"(target={fmgResult.TargetFmgName}, "
                             + $"total entries now={fmgResult.TotalEntriesInFmg})");
        }
        else
        {
            progress?.Report($"        menu FMG patch SKIPPED: source {sourceMenuMsgBnd} not found "
                             + "(shop title will show '?MenuText?' placeholder in-game)");
        }

        // --- 4. boss reward strip ---
        BossRewardStripResult? bossRewardStripResult = null;
        if (Options.ZeroBossDrops)
        {
            progress?.Report($"{Hdr(4)} Stripping boss-reward dispatch calls from common_func.emevd.dcx");
            string patchedCommonFunc = Path.Combine(patchedEventDir, "common_func.emevd.dcx");
            if (File.Exists(patchedCommonFunc))
            {
                byte[] bytes = File.ReadAllBytes(patchedCommonFunc);
                EMEVD emevd = EMEVD.Read(bytes);
                bossRewardStripResult = BossRewardStripSplicer.Apply(emevd);
                int totalChanges = bossRewardStripResult.InstructionsStripped
                    + bossRewardStripResult.AwardItemLotsZeroed
                    + bossRewardStripResult.InitCommonEventsZeroed;
                if (totalChanges > 0)
                {
                    File.WriteAllBytes(patchedCommonFunc, emevd.Write());
                    progress?.Report($"        Removed {bossRewardStripResult.InstructionsStripped} "
                                     + $"tail InitializeCommonEvent calls (item dispatch)");
                    progress?.Report($"        Zeroed {bossRewardStripResult.AwardItemLotsZeroed} "
                                     + $"AwardItemLot calls (stones, tools, rune arcs)");
                    progress?.Report($"        Zeroed {bossRewardStripResult.InitCommonEventsZeroed} "
                                     + $"mid-event InitializeCommonEvent calls (crafting mats)");
                    progress?.Report($"        Stripped {bossRewardStripResult.ParametersStripped} "
                                     + $"EMEVD Parameter entries (prevents runtime substitution)");
                }
                else
                {
                    progress?.Report($"        No matching reward instructions found (already stripped?)");
                }
            }
        }
        else
        {
            progress?.Report($"{Hdr(4)} Boss-reward strip: skipped (ZeroBossDrops=off)");
        }

        // --- 5. receive-all strip ---
        ReceiveAllStripResult? receiveAllStripResult = null;
        if (Options.ZeroBossDrops)
        {
            progress?.Report($"{Hdr(5)} Stripping \"receive all items at shop\" events from m11_10_00_00.emevd.dcx");
            string patchedMapEmevd = Path.Combine(patchedEventDir, "m11_10_00_00.emevd.dcx");
            if (File.Exists(patchedMapEmevd))
            {
                byte[] mapBytes = File.ReadAllBytes(patchedMapEmevd);
                EMEVD mapEmevd = EMEVD.Read(mapBytes);
                receiveAllStripResult = ReceiveAllStripSplicer.Apply(mapEmevd);
                if (receiveAllStripResult.AwardItemLotsZeroed > 0)
                {
                    File.WriteAllBytes(patchedMapEmevd, mapEmevd.Write());
                    progress?.Report($"        Zeroed {receiveAllStripResult.AwardItemLotsZeroed} "
                                     + $"AwardItemLot calls across {receiveAllStripResult.EventsPatched} events");
                }
                else
                {
                    progress?.Report($"        No matching AwardItemLot instructions found (already stripped?)");
                }
            }
            else
            {
                progress?.Report($"        m11_10_00_00.emevd.dcx not found in patched mod — skipped");
            }
        }
        else
        {
            progress?.Report($"{Hdr(5)} Receive-all strip: skipped (ZeroBossDrops=off)");
        }

        // --- 6. Kalé menu splice ---
        progress?.Report($"{Hdr(6)} Splicing Merchant Kalé tier menu into t600001110.esd");
        string kaleBndPath = Path.Combine(
            patchedModDir, "script", "talk", "m11_10_00_00.talkesdbnd.dcx");
        if (!File.Exists(kaleBndPath))
        {
            throw new FileNotFoundException(
                $"Kalé talkesdbnd not found at {kaleBndPath}; the mod copy stage did not produce it.");
        }
        var kaleSpliceResult = SpliceKaleMenu(kaleBndPath);
        progress?.Report(kaleSpliceResult.AlreadyPresent
            ? "        Kalé menu entries: already-present (idempotent re-patch)"
            : $"        Kalé menu entries: inserted {kaleSpliceResult.TierEntries.Count} tier entries "
              + $"(indices {KaleShopMenuSplicer.MenuIndexBase}..{KaleShopMenuSplicer.MenuIndexBase + 8})");

        // --- 7. bundle builder ---
        progress?.Report($"{Hdr(7)} Building competition bundle (integrity manifest + fingerprints)");
        string bundleDir = Path.Combine(Options.WorkDir, "competition_bundle");
        var bundleOpts = new BundleBuilderOptions
        {
            TierRewardsJsonPath = shopResult.TierRewardsPath,
            PatchedEventJsDir = Path.Combine(Options.WorkDir, "empty_js_placeholder"),
            PatchedEventBinDir = patchedEventDir,
            SourceEventDir = sourceEventDir,
            BundleDir = bundleDir,
            Force = true,
            Seed = seed,
        };
        Directory.CreateDirectory(bundleOpts.PatchedEventJsDir);
        var bundleBuilder = new BundleBuilder(bundleOpts);
        var bundleResult = bundleBuilder.Build();
        try { Directory.Delete(bundleOpts.PatchedEventJsDir, recursive: true); } catch { /* best-effort */ }

        progress?.Report($"        bundle_root = {bundleResult.BundleRoot}");
        progress?.Report($"        artifact_tree = {bundleResult.ArtifactTree}");
        progress?.Report($"        changed files = {bundleResult.ChangedFileCount}");

        return new PipelineResult(
            Seed: seed,
            SeedOrigin: seedOrigin,
            WorkDir: Options.WorkDir,
            PatchedModDir: patchedModDir,
            BundleDir: bundleResult.BundleDir,
            ArtifactTree: bundleResult.ArtifactTree,
            BundleRoot: bundleResult.BundleRoot,
            ChangedFileCount: bundleResult.ChangedFileCount,
            TierRewardsPath: shopResult.TierRewardsPath,
            TierRewardsFingerprint: shopResult.Fingerprint,
            ShopTierCount: shopResult.TierCount,
            ShopSlotCount: shopResult.SlotCount,
            PatchedRegulationPath: patchedRegulationPath,
            RegulationRowsWritten: regulationResult.RowsWritten,
            BossDropLotsZeroed: regulationResult.BossDropLotsZeroed,
            BossRewardCallsStripped: bossRewardStripResult?.InstructionsStripped,
            AwardItemLotsZeroed: bossRewardStripResult?.AwardItemLotsZeroed,
            CraftingDispatchersZeroed: bossRewardStripResult?.InitCommonEventsZeroed,
            ReceiveAllLotsZeroed: receiveAllStripResult?.AwardItemLotsZeroed,
            ReceiveAllEventsPatched: receiveAllStripResult?.EventsPatched,
            KaleMenuEntriesInserted: kaleSpliceResult is { AlreadyPresent: false } ? kaleSpliceResult.TierEntries.Count : (int?)null,
            KaleMenuAlreadyPresent: kaleSpliceResult.AlreadyPresent);
    }

    /// <summary>Load the Kalé talkesdbnd, mutate <c>t314001110.esd</c> in
    /// place, and write the BND back. Other entries in the container are
    /// preserved byte-for-byte by <see cref="EsdIo"/>.</summary>
    private static KaleShopMenuSpliceResult SpliceKaleMenu(string bndPath)
    {
        var loaded = EsdIo.LoadFromBnd(bndPath, "t314001110.esd");
        var result = KaleShopMenuSplicer.Apply(loaded.Esd);
        if (result.Inserted)
            EsdIo.SaveToBnd(loaded, bndPath);
        return result;
    }

    private static void CopyDirectory(string source, string dest)
    {
        if (!Directory.Exists(source))
            throw new DirectoryNotFoundException($"Source mod folder not found: {source}");
        foreach (var dirPath in Directory.EnumerateDirectories(source, "*", SearchOption.AllDirectories))
        {
            Directory.CreateDirectory(dirPath.Replace(source, dest));
        }
        foreach (var filePath in Directory.EnumerateFiles(source, "*", SearchOption.AllDirectories))
        {
            string target = filePath.Replace(source, dest);
            Directory.CreateDirectory(Path.GetDirectoryName(target)!);
            File.Copy(filePath, target, overwrite: true);
        }
    }
}

public sealed class PipelineOptions
{
    public required string SourceModDir { get; init; }
    public required string WorkDir { get; init; }

    /// <summary>
    /// Path to <c>shop_pool.json</c>. Required — drives the shop roll,
    /// regulation patch, and tier-rewards generation.
    /// </summary>
    public required string ShopPoolPath { get; init; }

    /// <summary>User-supplied seed, or empty to auto-mint.</summary>
    public string Seed { get; init; } = "";
    public string SeedOrigin { get; init; } = "user-supplied";

    /// <summary>
    /// When true, zero the boss-drop bundle rows in
    /// <c>ItemLotParam_enemy</c> and strip boss-reward dispatch calls
    /// from <c>common_func.emevd.dcx</c>. Kills the per-boss
    /// "ENEMY FELLED" loadout toast.
    /// </summary>
    public bool ZeroBossDrops { get; init; } = true;
}

public sealed record PipelineResult(
    string Seed,
    string SeedOrigin,
    string WorkDir,
    string PatchedModDir,
    string BundleDir,
    string ArtifactTree,
    string BundleRoot,
    int ChangedFileCount,
    // Shop / regulation (always populated — shop pool is required):
    string TierRewardsPath,
    string TierRewardsFingerprint,
    int ShopTierCount,
    int ShopSlotCount,
    string PatchedRegulationPath,
    int RegulationRowsWritten,
    // Boss-drop zeroing + EMEVD strip:
    int BossDropLotsZeroed,
    int? BossRewardCallsStripped,
    int? AwardItemLotsZeroed,
    int? CraftingDispatchersZeroed,
    // Receive-all strip (m11_10_00_00.emevd.dcx):
    int? ReceiveAllLotsZeroed,
    int? ReceiveAllEventsPatched,
    // Kalé tier-shop menu splice:
    int? KaleMenuEntriesInserted = null,
    bool? KaleMenuAlreadyPresent = null);
