// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Threading;
using IgniteBossRush.Core.Generation;
using IgniteBossRush.Core.Pipeline;
using IgniteBossRush.Gui.Models;
using IgniteBossRush.Gui.Relay;
using Microsoft.Win32;

namespace IgniteBossRush.Gui.ViewModels;

/// <summary>
/// All GUI state lives here. The window code-behind is a thin shell that just
/// binds this VM.
///
/// Paths are resolved automatically from a <c>data/</c> folder alongside the
/// executable — no user-facing file pickers needed.
/// </summary>
public sealed class MainViewModel : ObservableObject
{
    // ---- stage definitions ------------------------------------------------
    private static readonly (string Name, string Desc)[] PipelineStageDefs =
    [
        ("Prepare workspace",    "Copies the source mod to the output workspace"),
        ("Roll shop tiers",      "Generates deterministic tier rewards from the seed"),
        ("Patch regulation",     "Writes shop rows and zeroes boss-drop lots"),
        ("Strip boss rewards",   "Removes boss-reward dispatch calls from EMEVD"),
        ("Strip receive-all",    "Zeroes AwardItemLot calls in arena EMEVD"),
        ("Splice Kale menu",     "Inserts tier-gated shop entries into ESD bytecode"),
        ("Build bundle",         "Creates integrity manifest with SHA-256 fingerprints"),
    ];

    private const string RandomizerStageName = "Randomize enemies";
    private const string RandomizerStageDesc =
        "Merges the patched mod into Matt's Randomizer (starting classes + enemy placements)";

    // Regex to match "[NN/MM]" progress markers from PipelineRunner.
    private static readonly Regex StageMarkerRx = new(@"^\[(\d{2})/(\d{2})\]", RegexOptions.Compiled);

    // ---- resolved data paths ----------------------------------------------

    /// <summary>
    /// Root <c>data/</c> folder resolved relative to the running executable.
    /// </summary>
    private readonly string _dataRoot;
    private readonly string _sourceModDir;
    private readonly string _shopPoolPath;
    private readonly string _workDir;
    private readonly string _templateDir;

    /// <summary>Human-readable message when the data folder is misconfigured.</summary>
    private string _dataError = "";
    public string DataError
    {
        get => _dataError;
        private set => Set(ref _dataError, value);
    }

    /// <summary>True when mod/ and shop_pool.json both exist.</summary>
    private bool _dataReady;
    public bool DataReady
    {
        get => _dataReady;
        private set
        {
            if (Set(ref _dataReady, value))
            {
                Raise(nameof(DataNotReady));
                RaiseRunCanExecute();
            }
        }
    }

    public bool DataNotReady => !DataReady;

    // ---- user inputs ------------------------------------------------------
    private string _seed = "";
    public string Seed
    {
        get => _seed;
        set { if (Set(ref _seed, value)) RaiseRunCanExecute(); }
    }

    /// <summary>
    /// When checked, the regulation patch stage zeros the boss-drop bundle
    /// rows in <c>ItemLotParam_enemy</c> and strips the boss-reward dispatch
    /// calls from <c>common_func.emevd.dcx</c>. Kills the per-boss
    /// "ENEMY FELLED" loadout toast.
    /// </summary>
    private bool _zeroBossDrops = true;
    public bool ZeroBossDrops
    {
        get => _zeroBossDrops;
        set => Set(ref _zeroBossDrops, value);
    }

    /// <summary>
    /// When checked (default), mint a new shop seed and merge into Matt's
    /// Randomizer so enemies and starting-class loadouts change every run.
    /// </summary>
    private bool _includeRandomizer = true;
    public bool IncludeRandomizer
    {
        get => _includeRandomizer;
        set
        {
            if (Set(ref _includeRandomizer, value))
            {
                RebuildStages();
                ValidateDataFolder();
                Raise(nameof(PrimaryActionLabel));
            }
        }
    }

    private string _randomizerDir = RandomizerMerge.DefaultRandomizerDir;
    public string RandomizerDir
    {
        get => _randomizerDir;
        set
        {
            if (Set(ref _randomizerDir, value))
                ValidateDataFolder();
        }
    }

    public string PrimaryActionLabel =>
        IncludeRandomizer ? "Generate Playable Seed" : "Generate Bundle";

    public int StageCount => Stages.Count;

    // ---- pipeline progress ------------------------------------------------
    public ObservableCollection<PipelineStageProgress> Stages { get; } = new();

    private int _currentStageIndex;
    public int CurrentStageIndex
    {
        get => _currentStageIndex;
        private set => Set(ref _currentStageIndex, value);
    }

    private double _progressPercent;
    public double ProgressPercent
    {
        get => _progressPercent;
        private set => Set(ref _progressPercent, value);
    }

    private string _statusText = "Ready";
    public string StatusText
    {
        get => _statusText;
        private set => Set(ref _statusText, value);
    }

    // ---- output -----------------------------------------------------------
    private readonly StringBuilder _logBuf = new();
    public string LogText { get; private set; } = "";

    private string _artifactTree = "";
    public string ArtifactTree { get => _artifactTree; private set => Set(ref _artifactTree, value); }

    private string _bundleRoot = "";
    public string BundleRoot { get => _bundleRoot; private set => Set(ref _bundleRoot, value); }

    private string _patchedModPath = "";
    public string PatchedModPath { get => _patchedModPath; private set => Set(ref _patchedModPath, value); }

    private string _bundlePath = "";
    public string BundlePath { get => _bundlePath; private set => Set(ref _bundlePath, value); }

    private string _tierRewardsFingerprint = "";
    public string TierRewardsFingerprint
    {
        get => _tierRewardsFingerprint;
        private set => Set(ref _tierRewardsFingerprint, value);
    }

    private string _patchedRegulationPath = "";
    public string PatchedRegulationPath
    {
        get => _patchedRegulationPath;
        private set => Set(ref _patchedRegulationPath, value);
    }

    private string _regulationSummary = "";
    public string RegulationSummary
    {
        get => _regulationSummary;
        private set => Set(ref _regulationSummary, value);
    }

    private string _playablePath = "";
    public string PlayablePath
    {
        get => _playablePath;
        private set
        {
            if (Set(ref _playablePath, value))
                Raise(nameof(HasPlayable));
        }
    }

    public bool HasPlayable => !string.IsNullOrEmpty(PlayablePath) && Directory.Exists(PlayablePath);

    private string _enemySeed = "";
    public string EnemySeed
    {
        get => _enemySeed;
        private set => Set(ref _enemySeed, value);
    }

    private bool _isRunning;
    public bool IsRunning
    {
        get => _isRunning;
        private set
        {
            if (Set(ref _isRunning, value))
            {
                RaiseRunCanExecute();
                Raise(nameof(IsNotRunning));
            }
        }
    }

    public bool IsNotRunning => !IsRunning;

    private bool _pipelineSucceeded;
    public bool PipelineSucceeded
    {
        get => _pipelineSucceeded;
        private set => Set(ref _pipelineSucceeded, value);
    }

    // ---- elapsed timer ----------------------------------------------------
    private readonly Stopwatch _totalStopwatch = new();
    private readonly Stopwatch _stageStopwatch = new();
    private readonly DispatcherTimer _tickTimer;

    private string _totalElapsedText = "";
    public string TotalElapsedText
    {
        get => _totalElapsedText;
        private set => Set(ref _totalElapsedText, value);
    }

    // ---- commands ---------------------------------------------------------
    public RelayCommand RunCommand { get; }
    public RelayCommand MintSeedCommand { get; }
    public RelayCommand CopyBundleRootCommand { get; }
    public RelayCommand CopyAllFingerprintsCommand { get; }
    public RelayCommand OpenOutputFolderCommand { get; }
    public RelayCommand OpenPlayableFolderCommand { get; }
    public RelayCommand LaunchPlayableCommand { get; }
    public RelayCommand PackageZipCommand { get; }
    public RelayCommand RefreshDataCommand { get; }

    public MainViewModel()
    {
        // Resolve data paths from executable location.
        string exeDir = AppContext.BaseDirectory;
        _dataRoot     = Path.Combine(exeDir, "data");
        _sourceModDir = Path.Combine(_dataRoot, "mod");
        _shopPoolPath = Path.Combine(_dataRoot, "shop_pool.json");
        _workDir      = Path.Combine(_dataRoot, "output");
        _templateDir  = Path.Combine(_dataRoot, "template");

        // Commands.
        RunCommand                 = new RelayCommand(async () => await RunAsync(), CanRun);
        MintSeedCommand            = new RelayCommand(() => Seed = DropGeneratorOptions.MintRandomSeed());
        CopyBundleRootCommand      = new RelayCommand(CopyBundleRoot, () => !string.IsNullOrEmpty(BundleRoot));
        CopyAllFingerprintsCommand = new RelayCommand(CopyAllFingerprints, () => PipelineSucceeded);
        OpenOutputFolderCommand    = new RelayCommand(OpenOutputFolder);
        OpenPlayableFolderCommand  = new RelayCommand(OpenPlayableFolder, () => HasPlayable);
        LaunchPlayableCommand      = new RelayCommand(LaunchPlayable, () => HasPlayable);
        PackageZipCommand          = new RelayCommand(async () => await PackageZipAsync(), () => PipelineSucceeded && !IsRunning);
        RefreshDataCommand         = new RelayCommand(ValidateDataFolder);

        RebuildStages();

        // Tick timer for live elapsed display.
        _tickTimer = new DispatcherTimer { Interval = TimeSpan.FromMilliseconds(100) };
        _tickTimer.Tick += (_, _) => UpdateElapsedDisplays();

        // Check data folder on startup, then bring back the last seed so
        // closing the window does not force another generate.
        ValidateDataFolder();
        RestoreLastSession();
    }

    private string SessionPath => Path.Combine(_workDir, "session.json");

    /// <summary>Write the current seed and settings. Called when a run finishes
    /// and when the window closes.</summary>
    public void SaveSession()
    {
        try
        {
            Directory.CreateDirectory(_workDir);
            var saved = new SavedSession
            {
                Seed = Seed,
                EnemySeed = EnemySeed,
                IncludeRandomizer = IncludeRandomizer,
                ZeroBossDrops = ZeroBossDrops,
                RandomizerDir = RandomizerDir,
                PlayablePath = PlayablePath,
                PatchedModPath = PatchedModPath,
                BundlePath = BundlePath,
                BundleRoot = BundleRoot,
                TierRewardsFingerprint = TierRewardsFingerprint,
                PatchedRegulationPath = PatchedRegulationPath,
                RegulationSummary = RegulationSummary,
                ArtifactTree = ArtifactTree,
                StatusText = StatusText,
                LogText = LogText,
                PipelineSucceeded = PipelineSucceeded,
            };
            File.WriteAllText(SessionPath, JsonSerializer.Serialize(saved, SessionJson));
        }
        catch
        {
            // A failed save must not block closing the window.
        }
    }

    private void RestoreLastSession()
    {
        SavedSession? saved = null;
        if (File.Exists(SessionPath))
        {
            try
            {
                saved = JsonSerializer.Deserialize<SavedSession>(File.ReadAllText(SessionPath), SessionJson);
            }
            catch
            {
                saved = null;
            }
        }

        if (saved is not null)
        {
            if (!string.IsNullOrWhiteSpace(saved.RandomizerDir))
                RandomizerDir = saved.RandomizerDir;
            ZeroBossDrops = saved.ZeroBossDrops;
            if (saved.IncludeRandomizer != IncludeRandomizer)
                IncludeRandomizer = saved.IncludeRandomizer;
            if (!string.IsNullOrWhiteSpace(saved.Seed))
                Seed = saved.Seed;
            EnemySeed = saved.EnemySeed;
            PatchedModPath = saved.PatchedModPath;
            BundlePath = saved.BundlePath;
            BundleRoot = saved.BundleRoot;
            TierRewardsFingerprint = saved.TierRewardsFingerprint;
            PatchedRegulationPath = saved.PatchedRegulationPath;
            RegulationSummary = saved.RegulationSummary;
            ArtifactTree = saved.ArtifactTree;
        }

        string playable = saved?.PlayablePath ?? "";
        if (string.IsNullOrWhiteSpace(playable) || !Directory.Exists(playable))
            playable = Path.Combine(_workDir, "playable");

        bool playableOk = File.Exists(Path.Combine(playable, "launchmod_rando.bat"))
                          && Directory.Exists(Path.Combine(playable, "randomizer"));
        if (!playableOk)
        {
            RaiseRunCanExecute();
            return;
        }

        PlayablePath = playable;
        RandomizerSeedInfo? seeds = RandomizerMerge.ReadSeedInfo(playable);
        if (seeds is not null)
        {
            if (!string.IsNullOrWhiteSpace(seeds.EnemySeed))
                EnemySeed = seeds.EnemySeed;
            if (!string.IsNullOrWhiteSpace(seeds.ShopSeed)
                && !seeds.ShopSeed.StartsWith("(kept", StringComparison.OrdinalIgnoreCase))
                Seed = seeds.ShopSeed;
        }

        PipelineSucceeded = true;
        ProgressPercent = 100;
        CurrentStageIndex = Stages.Count;
        foreach (PipelineStageProgress stage in Stages)
        {
            stage.State = StageState.Completed;
            stage.Detail = "Restored";
        }

        if (!string.IsNullOrEmpty(saved?.LogText))
        {
            _logBuf.Clear();
            _logBuf.Append(saved.LogText);
            if (!_logBuf.ToString().EndsWith(Environment.NewLine, StringComparison.Ordinal))
                _logBuf.AppendLine();
            RaiseLog();
        }

        AppendLog("Restored the last playable seed. Launch or package it without generating again.");
        AppendLog($"Playable folder: {playable}");
        if (!string.IsNullOrEmpty(EnemySeed))
            AppendLog($"Enemy seed:      {EnemySeed}");
        if (!string.IsNullOrEmpty(Seed))
            AppendLog($"Shop seed:       {Seed}");
        StatusText = "Last playable seed restored";
        RaiseRunCanExecute();
    }

    private static readonly JsonSerializerOptions SessionJson = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
    };

    // ---- data folder validation -------------------------------------------

    private void ValidateDataFolder()
    {
        var missing = new System.Collections.Generic.List<string>();

        if (!Directory.Exists(_sourceModDir))
            missing.Add("data\\mod\\ folder (place your Boss Rush mod files here)");

        if (!File.Exists(_shopPoolPath))
            missing.Add("data\\shop_pool.json");

        if (IncludeRandomizer && !RandomizerMerge.RandomizerLooksInstalled(RandomizerDir))
            missing.Add($"EldenRingRandomizer.exe in {RandomizerDir}");

        if (IncludeRandomizer && RandomizerMerge.FindScript() is null)
            missing.Add("merge-randomizer.ps1 next to IgniteRush.exe");

        if (missing.Count > 0)
        {
            DataError = "Missing: " + string.Join("; ", missing);
            DataReady = false;
            StatusText = "Data folder incomplete";
        }
        else
        {
            DataError = "";
            DataReady = true;
            StatusText = "Ready";
        }
    }

    // ---------------------------------------------------------------------
    private void RaiseRunCanExecute()
    {
        RunCommand.RaiseCanExecuteChanged();
        CopyBundleRootCommand.RaiseCanExecuteChanged();
        CopyAllFingerprintsCommand.RaiseCanExecuteChanged();
        OpenOutputFolderCommand.RaiseCanExecuteChanged();
        PackageZipCommand.RaiseCanExecuteChanged();
        OpenPlayableFolderCommand.RaiseCanExecuteChanged();
        LaunchPlayableCommand.RaiseCanExecuteChanged();
    }

    private void RebuildStages()
    {
        Stages.Clear();
        foreach (var (name, desc) in PipelineStageDefs)
            Stages.Add(new PipelineStageProgress(Stages.Count + 1, name, desc));
        if (IncludeRandomizer)
            Stages.Add(new PipelineStageProgress(Stages.Count + 1, RandomizerStageName, RandomizerStageDesc));
        Raise(nameof(StageCount));
    }

    private bool CanRun() => !IsRunning && DataReady;

    private async Task RunAsync()
    {
        // Re-validate before run.
        ValidateDataFolder();
        if (!DataReady) return;

        // Ensure output directory exists.
        Directory.CreateDirectory(_workDir);

        // Reset all state.
        _logBuf.Clear();
        RaiseLog();
        ArtifactTree = BundleRoot = PatchedModPath = BundlePath = "";
        TierRewardsFingerprint = PatchedRegulationPath = RegulationSummary = "";
        PlayablePath = "";
        EnemySeed = "";
        PipelineSucceeded = false;
        CurrentStageIndex = 0;
        ProgressPercent = 0;
        StatusText = "Starting...";

        foreach (var stage in Stages) stage.Reset();

        IsRunning = true;
        _totalStopwatch.Restart();
        _stageStopwatch.Restart();
        _tickTimer.Start();

        try
        {
            bool autoMinted = false;
            string seed = Seed.Trim();
            if (IncludeRandomizer || string.IsNullOrEmpty(seed))
            {
                seed = DropGeneratorOptions.MintRandomSeed();
                Seed = seed;
                autoMinted = true;
            }
            string origin = autoMinted ? "auto-minted (128-bit)" : "user-supplied";

            var opts = new PipelineOptions
            {
                SourceModDir  = _sourceModDir,
                ShopPoolPath  = _shopPoolPath,
                WorkDir       = _workDir,
                Seed          = seed,
                SeedOrigin    = origin,
                ZeroBossDrops = ZeroBossDrops,
            };

            AppendLog($"Starting pipeline at {DateTime.Now:HH:mm:ss}");
            AppendLog($"  data root:    {_dataRoot}");
            AppendLog($"  source mod:   {_sourceModDir}");
            AppendLog($"  shop_pool:    {_shopPoolPath}");
            AppendLog($"  output:       {_workDir}");
            AppendLog("");

            var progress = new Progress<string>(OnProgressMessage);
            var runner = new PipelineRunner(opts);

            var result = await Task.Run(() => runner.Run(progress));

            // Finalize last stage.
            FinalizeCurrentStage();

            Seed = result.Seed;
            ArtifactTree   = result.ArtifactTree;
            BundleRoot     = result.BundleRoot;
            PatchedModPath = result.PatchedModDir;
            BundlePath     = result.BundleDir;

            TierRewardsFingerprint = result.TierRewardsFingerprint;
            PatchedRegulationPath  = result.PatchedRegulationPath;
            RegulationSummary      = $"{result.RegulationRowsWritten} rows "
                + "(goods + itemlot + shop)";

            AppendLog("");
            AppendLog("=== SUCCESS ===");
            AppendLog($"bundle_root (pre-commit this): {result.BundleRoot}");
            AppendLog($"tier_rewards.json:    {result.TierRewardsPath}");
            AppendLog($"  fingerprint:        {result.TierRewardsFingerprint}");
            AppendLog($"  tiers / slots:      {result.ShopTierCount} / {result.ShopSlotCount}");
            AppendLog($"patched regulation:   {result.PatchedRegulationPath}");
            AppendLog($"  rows written:       {result.RegulationRowsWritten}");
            if (result.BossDropLotsZeroed > 0)
                AppendLog($"  boss-drop lots:     {result.BossDropLotsZeroed} rows zeroed in ItemLotParam_enemy");
            if (result.BossRewardCallsStripped is int bs && bs > 0)
                AppendLog($"  boss-reward calls:  {bs} InitializeCommonEvent calls stripped");
            if (result.AwardItemLotsZeroed is int lz && lz > 0)
                AppendLog($"  AwardItemLot zeroed: {lz} (stones, tools, rune arcs)");
            if (result.CraftingDispatchersZeroed is int cz && cz > 0)
                AppendLog($"  crafting dispatch:   {cz} InitializeCommonEvent(0, 90001003) zeroed");
            if (result.ReceiveAllLotsZeroed is int rz && rz > 0)
                AppendLog($"  receive-all strip:   {rz} AwardItemLot calls zeroed across "
                    + $"{result.ReceiveAllEventsPatched} events in m11_10_00_00.emevd.dcx");
            AppendLog("Kale tier menu:       "
                + (result.KaleMenuEntriesInserted is int n
                    ? $"inserted {n} tier entries into t600001110.esd"
                    : result.KaleMenuAlreadyPresent == true
                        ? "already-present (idempotent re-patch)"
                        : "skipped"));

            if (IncludeRandomizer)
            {
                string playableDir = Path.Combine(_workDir, "playable");
                BeginRandomizerStage();
                AppendLog("");
                AppendLog("=== RANDOMIZER MERGE ===");
                var mergeOpts = new RandomizerMergeOptions
                {
                    PatchedModDir = result.PatchedModDir,
                    OutDir = playableDir,
                    RandomizerDir = RandomizerDir,
                    ShopSeed = result.Seed,
                    KeepShop = true,
                };
                int mergeCode = await Task.Run(() => RandomizerMerge.Run(mergeOpts, progress));
                if (mergeCode != 0)
                    throw new InvalidOperationException($"Randomizer merge failed (exit {mergeCode}). See the log.");

                FinalizeCurrentStage();
                PlayablePath = playableDir;
                RandomizerSeedInfo? seeds = RandomizerMerge.ReadSeedInfo(playableDir);
                if (seeds is not null)
                {
                    EnemySeed = seeds.EnemySeed;
                    if (!string.IsNullOrWhiteSpace(seeds.ShopSeed)
                        && !seeds.ShopSeed.StartsWith("(kept", StringComparison.OrdinalIgnoreCase))
                        Seed = seeds.ShopSeed;
                }
                AppendLog($"Playable folder: {playableDir}");
                if (!string.IsNullOrEmpty(EnemySeed))
                    AppendLog($"Enemy seed:      {EnemySeed}");
                StatusText = "Playable seed ready — launch from the Actions panel";
            }
            else
            {
                StatusText = "Bundle generated successfully";
            }

            PipelineSucceeded = true;
            ProgressPercent = 100;
            SaveSession();
        }
        catch (Exception ex)
        {
            // Mark current stage as failed.
            if (CurrentStageIndex > 0 && CurrentStageIndex <= Stages.Count)
                Stages[CurrentStageIndex - 1].State = StageState.Failed;

            AppendLog("");
            AppendLog($"ERROR: {ex.GetType().Name}: {ex.Message}");
            AppendLog(ex.StackTrace ?? "");
            StatusText = $"Failed: {ex.Message}";
            MessageBox.Show(ex.Message, "Pipeline failed", MessageBoxButton.OK, MessageBoxImage.Error);
        }
        finally
        {
            _totalStopwatch.Stop();
            _stageStopwatch.Stop();
            _tickTimer.Stop();
            TotalElapsedText = FormatElapsed(_totalStopwatch.Elapsed);
            IsRunning = false;
            RaiseRunCanExecute();
        }
    }

    // ---- progress parsing -------------------------------------------------

    private void OnProgressMessage(string line)
    {
        AppendLog(line);

        var m = StageMarkerRx.Match(line);
        if (!m.Success) return;

        int stageNum = int.Parse(m.Groups[1].Value);
        if (stageNum < 1 || stageNum > Stages.Count) return;

        // Finalize previous stage.
        FinalizeCurrentStage();

        // Activate new stage.
        CurrentStageIndex = stageNum;
        ProgressPercent = ((stageNum - 1.0) / Stages.Count) * 100;
        _stageStopwatch.Restart();

        var stage = Stages[stageNum - 1];
        stage.State = StageState.Active;
        stage.Detail = line[(m.Length + 1)..].Trim(); // text after "[NN/MM] "
        StatusText = stage.Name;
    }

    private void FinalizeCurrentStage()
    {
        if (CurrentStageIndex < 1 || CurrentStageIndex > Stages.Count) return;

        var prev = Stages[CurrentStageIndex - 1];
        if (prev.State == StageState.Active)
        {
            prev.State = StageState.Completed;
            prev.Elapsed = _stageStopwatch.Elapsed;
        }
    }

    private void UpdateElapsedDisplays()
    {
        TotalElapsedText = FormatElapsed(_totalStopwatch.Elapsed);

        if (CurrentStageIndex >= 1 && CurrentStageIndex <= Stages.Count)
        {
            var active = Stages[CurrentStageIndex - 1];
            if (active.State == StageState.Active)
                active.Elapsed = _stageStopwatch.Elapsed;
        }
    }

    private static string FormatElapsed(TimeSpan ts)
    {
        if (ts.TotalMinutes >= 1)
            return $"{(int)ts.TotalMinutes}m {ts.Seconds:D2}s";
        return $"{ts.TotalSeconds:F1}s";
    }

    // ---- log --------------------------------------------------------------

    private void AppendLog(string line)
    {
        _logBuf.AppendLine(line);
        RaiseLog();
    }

    private void RaiseLog()
    {
        LogText = _logBuf.ToString();
        Raise(nameof(LogText));
    }

    // ---- clipboard / folder helpers ---------------------------------------

    private void CopyBundleRoot()
    {
        if (!string.IsNullOrEmpty(BundleRoot))
            Clipboard.SetText(BundleRoot);
    }

    private void CopyAllFingerprints()
    {
        var sb = new StringBuilder();
        sb.AppendLine($"bundle_root:     {BundleRoot}");
        sb.AppendLine($"tier_rewards:    {TierRewardsFingerprint}");
        sb.AppendLine($"artifact_tree:   {ArtifactTree}");
        sb.AppendLine($"regulation rows: {RegulationSummary}");
        sb.AppendLine($"regulation.bin:  {PatchedRegulationPath}");
        Clipboard.SetText(sb.ToString());
    }

    private void OpenOutputFolder()
    {
        if (Directory.Exists(_workDir))
            Process.Start(new ProcessStartInfo { FileName = _workDir, UseShellExecute = true });
    }

    private void OpenPlayableFolder()
    {
        if (HasPlayable)
            Process.Start(new ProcessStartInfo { FileName = PlayablePath, UseShellExecute = true });
    }

    private void LaunchPlayable()
    {
        if (!HasPlayable) return;
        string bat = Path.Combine(PlayablePath, "launchmod_rando.bat");
        if (!File.Exists(bat))
        {
            MessageBox.Show($"launchmod_rando.bat not found in:\n{PlayablePath}",
                "Launch failed", MessageBoxButton.OK, MessageBoxImage.Warning);
            return;
        }
        Process.Start(new ProcessStartInfo
        {
            FileName = bat,
            WorkingDirectory = PlayablePath,
            UseShellExecute = true,
        });
    }

    private void BeginRandomizerStage()
    {
        FinalizeCurrentStage();
        if (Stages.Count < 1) return;
        CurrentStageIndex = Stages.Count;
        ProgressPercent = ((CurrentStageIndex - 1.0) / Stages.Count) * 100;
        _stageStopwatch.Restart();
        var stage = Stages[CurrentStageIndex - 1];
        stage.State = StageState.Active;
        stage.Detail = "Launching Elden Ring Randomizer";
        StatusText = stage.Name;
    }

    // ---- zip packaging ----------------------------------------------------

    private async Task PackageZipAsync()
    {
        if (!PipelineSucceeded) return;

        // A playable seed is the Seed 5 layout: randomizer/ (enemy + class
        // placements) loaded under patched_mod/, plus the Mod Engine launcher.
        // Prefer the folder from this run, then the last one already on disk,
        // so a reopen still packages randomized enemies instead of the
        // template + mod/ archive.
        string playableDir = HasPlayable ? PlayablePath : Path.Combine(_workDir, "playable");
        bool packagePlayable = File.Exists(Path.Combine(playableDir, "launchmod_rando.bat"))
                               && Directory.Exists(Path.Combine(playableDir, "randomizer"));
        string patchedModDir = PatchedModPath;
        if (HasPlayable && !packagePlayable)
        {
            MessageBox.Show(
                $"Playable folder is missing the randomizer layout:\n{playableDir}",
                "Package failed", MessageBoxButton.OK, MessageBoxImage.Warning);
            return;
        }
        else if (string.IsNullOrEmpty(patchedModDir) || !Directory.Exists(patchedModDir))
        {
            MessageBox.Show(
                $"Patched mod folder not found:\n{patchedModDir}",
                "Package failed", MessageBoxButton.OK, MessageBoxImage.Warning);
            return;
        }
        else if (!Directory.Exists(_templateDir))
        {
            MessageBox.Show(
                $"Template folder not found:\n{_templateDir}\n\nPlace your static files (Changelog.txt, README.txt, etc.) here.",
                "Package failed", MessageBoxButton.OK, MessageBoxImage.Warning);
            return;
        }

        string enemyTag = EnemySeed;
        if (packagePlayable && string.IsNullOrWhiteSpace(enemyTag))
            enemyTag = RandomizerMerge.ReadSeedInfo(playableDir)?.EnemySeed ?? "";
        string tag = packagePlayable && !string.IsNullOrWhiteSpace(enemyTag)
            ? enemyTag
            : (BundleRoot.Length >= 8 ? BundleRoot[..8] : BundleRoot);
        foreach (char c in Path.GetInvalidFileNameChars())
            tag = tag.Replace(c, '_');
        tag = tag.Trim();
        if (tag.Length == 0)
            tag = "seed";

        var dlg = new SaveFileDialog
        {
            Title = packagePlayable ? "Save playable seed" : "Save Boss Rush package",
            Filter = "Zip archive (*.zip)|*.zip",
            FileName = $"BossRushArena_{tag}.zip",
        };
        if (dlg.ShowDialog() != true) return;

        string zipPath = dlg.FileName;
        StatusText = packagePlayable ? "Packaging playable seed..." : "Packaging zip...";

        try
        {
            await Task.Run(() =>
            {
                if (File.Exists(zipPath))
                    File.Delete(zipPath);

                using var zip = ZipFile.Open(zipPath, ZipArchiveMode.Create);
                if (packagePlayable)
                {
                    AddDirectoryToZip(zip, playableDir, "");
                }
                else
                {
                    AddDirectoryToZip(zip, _templateDir, "");
                    AddDirectoryToZip(zip, patchedModDir, "mod");
                }
            });

            StatusText = "Zip packaged successfully";
            AppendLog("");
            AppendLog(packagePlayable
                ? "=== PLAYABLE ZIP PACKAGED (randomizer + patched_mod + launcher) ==="
                : "=== ZIP PACKAGED ===");
            AppendLog($"  {zipPath}");

            // Open the folder containing the zip.
            string? zipDir = Path.GetDirectoryName(zipPath);
            if (zipDir != null && Directory.Exists(zipDir))
                Process.Start(new ProcessStartInfo { FileName = zipDir, UseShellExecute = true });
        }
        catch (Exception ex)
        {
            StatusText = $"Zip failed: {ex.Message}";
            MessageBox.Show(ex.Message, "Package failed", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    /// <summary>
    /// Recursively adds all files from <paramref name="sourceDir"/> into the
    /// zip archive under <paramref name="entryPrefix"/>.
    /// </summary>
    private static void AddDirectoryToZip(ZipArchive zip, string sourceDir, string entryPrefix)
    {
        foreach (string filePath in Directory.EnumerateFiles(sourceDir, "*", SearchOption.AllDirectories))
        {
            // Build a relative path from sourceDir, then prefix it.
            string relative = Path.GetRelativePath(sourceDir, filePath);
            string entryName = string.IsNullOrEmpty(entryPrefix)
                ? relative
                : Path.Combine(entryPrefix, relative);

            // Normalize to forward slashes for zip compatibility.
            entryName = entryName.Replace('\\', '/');

            zip.CreateEntryFromFile(filePath, entryName, CompressionLevel.Optimal);
        }
    }
}

internal sealed class SavedSession
{
    public string Seed { get; set; } = "";
    public string EnemySeed { get; set; } = "";
    public bool IncludeRandomizer { get; set; } = true;
    public bool ZeroBossDrops { get; set; } = true;
    public string RandomizerDir { get; set; } = "";
    public string PlayablePath { get; set; } = "";
    public string PatchedModPath { get; set; } = "";
    public string BundlePath { get; set; } = "";
    public string BundleRoot { get; set; } = "";
    public string TierRewardsFingerprint { get; set; } = "";
    public string PatchedRegulationPath { get; set; } = "";
    public string RegulationSummary { get; set; } = "";
    public string ArtifactTree { get; set; } = "";
    public string StatusText { get; set; } = "";
    public string LogText { get; set; } = "";
    public bool PipelineSucceeded { get; set; }
}
