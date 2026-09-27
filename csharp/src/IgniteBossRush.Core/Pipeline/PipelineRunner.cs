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
        string? vanillaRegulation = Options.VanillaRegulationPath;
        if (string.IsNullOrWhiteSpace(vanillaRegulation))
            vanillaRegulation = RegulationRebase.FindDefaultVanillaRegulation();
        var regOpts = new RegulationPatcherOptions
        {
            SourceRegulationPath = sourceRegulation,
            OutputRegulationPath = patchedRegulationPath,
            Plan = plan,
            Force = true,
            ZeroBossDrops = Options.ZeroBossDrops,
            VanillaRegulationPath = vanillaRegulation,
        };
        var regulationResult = new RegulationPatcher(regOpts).Apply();
        if (regulationResult.RebasedOnVanilla)
        {
            progress?.Report($"        rebased on 1.17.1 vanilla: overlaid {regulationResult.RebaseTablesOverlaid} tables "
                             + $"(+{regulationResult.RebaseRowsAdded} rows, ~{regulationResult.RebaseRowsReplaced} replaced); "
                             + "CharaInitParam kept from vanilla (Idus Knight / Heavy Knight)");
        }
        else
        {
            progress?.Report("        1.17.1 vanilla regulation.bin not found — shop patch applied to the 1.16.1 mod regulation "
                             + "(starting-class swap will fail until a 1.17.1 regulation is supplied)");
        }
        progress?.Report($"        rows written: {regulationResult.RowsWritten} "
                         + $"(goods={regulationResult.EquipParamGoodsRowsWritten}, "
                         + $"itemLot={regulationResult.ItemLotParamMapRowsWritten}, "
                         + $"shop={regulationResult.ShopLineupParamRowsWritten})");
        if (Options.ZeroBossDrops)
            progress?.Report($"        boss-drop ItemLotParam_enemy rows zeroed: "
                             + $"{regulationResult.BossDropLotsZeroed}");

        // --- 3b. menu FMG patch (shop titles + 1.17.1 class names) ---
        // ShopLineupParam.menuTitleMsgId 508001..508009 must exist in
        // GR_MenuText or the shop window renders "?MenuText?". The same
        // 1.16.1 menu_dlc02 is also missing Idus Knight / Heavy Knight
        // (288110/288111), which character-create shows as "?text_name?".
        // Patch every language folder — English strings beat a placeholder.
        var menuFmg = MenuDlc02Patcher.ApplyAllLanguages(Options.SourceModDir, patchedModDir);
        if (menuFmg.Applied)
        {
            progress?.Report($"        menu FMG patched in {menuFmg.LanguagesPatched} languages: "
                             + $"+{menuFmg.MenuTextAdded} MenuText added, "
                             + $"~{menuFmg.MenuTextReplaced} replaced; "
                             + $"+{menuFmg.LineHelpAdded} LineHelp added, "
                             + $"~{menuFmg.LineHelpReplaced} replaced "
                             + "(shop titles 508001-508009 + Idus/Heavy Knight)");
        }
        else
        {
            progress?.Report("        menu FMG patch SKIPPED: no msg/*/menu_dlc02.msgbnd.dcx under source "
                             + "(shop titles show '?MenuText?', Idus/Heavy show '?text_name?')");
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

        // --- 5b. Roundtable care-package splice ---
        // Inserts a new EMEVD event (11105800) into m11_10_00_00.emevd.dcx
        // that grants 20 seed-randomized armor pieces (5 head/chest/arms/
        // legs each) on the player's first Roundtable Hold load. One-shot
        // guard flag at 1049308317 (outside every wipe window in the
        // 1049308xxx plateau) makes the grant persist per-save.
        // See RoundtableCarePackageConstants for the full carve-up.
        RoundtableCarePackageSpliceResult? carePackageResult = null;
        IReadOnlyList<int>? carePackageItems = null;
        {
            string patchedMapEmevd = Path.Combine(patchedEventDir, RoundtableCarePackageConstants.MapFileBaseName);
            if (!File.Exists(patchedMapEmevd))
            {
                progress?.Report($"        Roundtable care-package SKIPPED: {patchedMapEmevd} not found");
            }
            else
            {
                string poolJsonPath = Path.Combine(
                    Options.SourceModDir, SmithboxArmorPoolSource.DefaultRelativePath);
                if (!File.Exists(poolJsonPath))
                {
                    progress?.Report($"        Roundtable care-package SKIPPED: armor pool JSON not found at {poolJsonPath}");
                }
                else
                {
                    progress?.Report($"        Rolling Roundtable care package (5 per slot, 4 slots)");
                    var armorPool = new SmithboxArmorPoolSource(poolJsonPath);
                    progress?.Report($"        Armor pool loaded: {armorPool.TotalIds} ids "
                                     + $"(head={armorPool.GetIds(ArmorSlot.Head).Count}, "
                                     + $"chest={armorPool.GetIds(ArmorSlot.Chest).Count}, "
                                     + $"arms={armorPool.GetIds(ArmorSlot.Arms).Count}, "
                                     + $"legs={armorPool.GetIds(ArmorSlot.Legs).Count})");
                    var roll = CarePackagePicker.Pick(armorPool, seed);

                    byte[] mapBytes = File.ReadAllBytes(patchedMapEmevd);
                    EMEVD mapEmevd = EMEVD.Read(mapBytes);
                    carePackageResult = RoundtableCarePackageSplicer.Apply(
                        mapEmevd,
                        roll,
                        new RoundtableCarePackageSplicerOptions { OverwriteExistingEvent = true });
                    File.WriteAllBytes(patchedMapEmevd, mapEmevd.Write());

                    var flat = new List<int>(RoundtableCarePackageConstants.TotalItems);
                    foreach (var (_, id) in roll.InGiveOrder()) flat.Add(id);
                    carePackageItems = flat;

                    progress?.Report($"        Care package event 11105800: "
                                     + $"event {(carePackageResult.EventInserted ? "inserted" : "already-present")}, "
                                     + $"trigger {(carePackageResult.TriggerInserted ? "inserted" : "already-present")}, "
                                     + $"items={carePackageResult.ItemsGranted}");
                    progress?.Report($"        Picked ids: head=[{string.Join(",", roll.Head)}], "
                                     + $"chest=[{string.Join(",", roll.Chest)}], "
                                     + $"arms=[{string.Join(",", roll.Arms)}], "
                                     + $"legs=[{string.Join(",", roll.Legs)}]");
                }
            }
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
            KaleMenuAlreadyPresent: kaleSpliceResult.AlreadyPresent,
            CarePackageEventInserted: carePackageResult?.EventInserted,
            CarePackageTriggerInserted: carePackageResult?.TriggerInserted,
            CarePackageItemsGranted: carePackageResult?.ItemsGranted,
            CarePackageItemIds: carePackageItems);
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

    /// <summary>
    /// Vanilla 1.17.1 <c>regulation.bin</c>. Empty means auto-detect the
    /// Steam install (or <c>ELDENRING_REGULATION</c>).
    /// </summary>
    public string? VanillaRegulationPath { get; init; }
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
    bool? KaleMenuAlreadyPresent = null,
    // Roundtable care-package splice (m11_10_00_00.emevd.dcx):
    bool? CarePackageEventInserted = null,
    bool? CarePackageTriggerInserted = null,
    int? CarePackageItemsGranted = null,
    System.Collections.Generic.IReadOnlyList<int>? CarePackageItemIds = null);
