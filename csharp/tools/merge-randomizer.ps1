# Builds a Seed-5 style launch folder:
#   randomizer/   Item and Enemy Randomizer output, merged with the boss-rush mod
#   patched_mod/  boss-rush files Mod Engine still has to load underneath
#   dll/          Ignite overlay + RandomizerCrashFix + RandomizerHelper
#   modengine2 + launchmod_rando.bat + config_eldenringrandomizer.toml
#
# The randomizer exe has no headless CLI. This script points its saved "Merge other
# mod" path at the boss-rush folder, clicks Randomize, then copies the result out.
#
# Default options come from boss rush.randomizeopt (tarnished + changestats,
# no nostarting, no item rando). Each run mints a new enemy seed. Unless
# -KeepShop is set, the Kalé shop is also re-rolled so shop + enemies change
# together.

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$PatchedMod,
    [Parameter(Mandatory = $true)][string]$OutDir,
    [string]$RandomizerDir = "D:\Games\mods\elden\randomizer",
    [string]$OptionsOpt = "",
    [string]$ShopPool = "",
    [string]$SourceRegulation = "",
    [string]$IgniteRushExe = "",
    [string]$ShopSeedIn = "",
    [switch]$KeepShop,
    [string]$IgniteDll = "D:\Games\mods\elden\boss rush seeds\Boss Rush Seeds 21-05\Seed 5\dll\Ignite_Boss_Rush.dll",
    [string]$IgniteDllConfig = "D:\Games\mods\elden\boss rush seeds\Boss Rush Seeds 21-05\Seed 5\dll\config.toml",
    [string]$HelperIni = "D:\Games\mods\elden\boss rush seeds\Boss Rush Seeds 21-05\Seed 5\dll\RandomizerHelper_config.ini",
    [int]$TimeoutMinutes = 25
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes

function Write-Step([string]$Message) {
    $line = "[{0}] {1}" -f (Get-Date -Format "HH:mm:ss"), $Message
    Write-Output $line
}

function Find-Upward([string]$StartDir, [string]$RelativePath) {
    $dir = $StartDir
    for ($i = 0; $i -lt 14; $i++) {
        $candidate = Join-Path $dir $RelativePath
        if (Test-Path -LiteralPath $candidate) { return $candidate }
        $parent = Split-Path $dir -Parent
        if (-not $parent -or $parent -eq $dir) { break }
        $dir = $parent
    }
    return $null
}

function New-HexSeed([int]$ByteCount = 16) {
    $bytes = New-Object byte[] $ByteCount
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try { $rng.GetBytes($bytes) }
    finally { $rng.Dispose() }
    return -join ($bytes | ForEach-Object { $_.ToString("x2") })
}

function Resolve-OptionsOpt {
    $candidates = @()
    if ($OptionsOpt) { $candidates += $OptionsOpt }
    $candidates += @(
        "D:\Games\mods\elden\custom randomizer opt\boss rush.randomizeopt",
        (Find-Upward $PSScriptRoot "csharp\data\boss-rush.randomizeopt"),
        (Find-Upward $PSScriptRoot "data\boss-rush.randomizeopt")
    )
    foreach ($c in $candidates) {
        if ($c -and (Test-Path -LiteralPath $c)) { return $c }
    }
    return $null
}

$proc = $null
trap {
    if ($proc -and -not $proc.HasExited) {
        Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    }
}

if (-not (Test-Path -LiteralPath $PatchedMod)) { throw "Patched mod not found: $PatchedMod" }
$randoExe = Join-Path $RandomizerDir "EldenRingRandomizer.exe"
if (-not (Test-Path -LiteralPath $randoExe)) { throw "Randomizer exe not found: $randoExe" }

$mergeMod = Join-Path $OutDir "patched_mod"
$randoOut = Join-Path $OutDir "randomizer"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

Write-Step "Staging boss-rush mod (without Smithbox / decompile leftovers)"
if (Test-Path -LiteralPath $mergeMod) { Remove-Item -LiteralPath $mergeMod -Recurse -Force }
New-Item -ItemType Directory -Force -Path $mergeMod | Out-Null
& robocopy $PatchedMod $mergeMod /E /NFL /NDL /NJH /NJS /nc /ns /np `
    /XD ".smithbox" `
    /XF "*.emevd.dcx.js" "regulation.bin.prev" "project.json" | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy failed with exit $LASTEXITCODE" }
Get-ChildItem -LiteralPath $mergeMod -Filter "regulation.bin.preorig*" -File -ErrorAction SilentlyContinue |
    Remove-Item -Force

$shopSeed = $ShopSeedIn
if (-not $KeepShop) {
    if (-not $ShopPool) {
        $ShopPool = Find-Upward $PSScriptRoot "csharp\data\shop_pool.json"
        if (-not $ShopPool) { $ShopPool = Find-Upward $PSScriptRoot "data\shop_pool.json" }
    }
    if (-not $SourceRegulation) {
        $SourceRegulation = Find-Upward $PSScriptRoot "csharp\data\source_mod\mod\regulation.bin"
        if (-not $SourceRegulation) { $SourceRegulation = Find-Upward $PSScriptRoot "data\source_mod\mod\regulation.bin" }
    }
    if (-not $IgniteRushExe) {
        $nextToScript = Join-Path $PSScriptRoot "igniterush.exe"
        if (Test-Path -LiteralPath $nextToScript) { $IgniteRushExe = $nextToScript }
        else {
            $IgniteRushExe = Find-Upward $PSScriptRoot "csharp\src\IgniteBossRush.Cli\bin\Release\net8.0\igniterush.exe"
        }
    }
    if (-not $ShopPool -or -not (Test-Path -LiteralPath $ShopPool)) {
        throw "shop_pool.json not found. Pass -ShopPool so the Kalé shop can re-roll with this seed."
    }
    if (-not $SourceRegulation -or -not (Test-Path -LiteralPath $SourceRegulation)) {
        throw "source regulation.bin not found. Pass -SourceRegulation so the Kalé shop can re-roll with this seed."
    }
    if (-not $IgniteRushExe -or -not (Test-Path -LiteralPath $IgniteRushExe)) {
        throw "igniterush.exe not found. Build the CLI or pass -IgniteRushExe."
    }

    $shopSeed = New-HexSeed 16
    $rewardsDir = Join-Path $OutDir "generator"
    $outRegulation = Join-Path $mergeMod "regulation.bin"
    Write-Step "Re-rolling Kalé shop (seed $shopSeed) so it changes with the enemy seed"
    & $IgniteRushExe regulate `
        --shop-pool $ShopPool `
        --source-regulation $SourceRegulation `
        --out-regulation $outRegulation `
        --out-rewards-dir $rewardsDir `
        --seed $shopSeed `
        --force `
        --zero-boss-drops
    if ($LASTEXITCODE -ne 0) { throw "igniterush regulate failed with exit $LASTEXITCODE" }
}

# The Avalonia build stores settings under EldenRingRandomizer.Avalo, not the
# WinForms EldenRingRandomizer folder. Prefer that one when both mention this install.
$configs = Get-ChildItem -LiteralPath $env:LOCALAPPDATA -Directory -Filter "EldenRingRandomizer*" |
    ForEach-Object { Get-ChildItem -LiteralPath $_.FullName -Recurse -Filter "user.config" -ErrorAction SilentlyContinue }
$configHits = @()
foreach ($cfg in $configs) {
    $text = Get-Content -LiteralPath $cfg.FullName -Raw
    if ($text -match [regex]::Escape($RandomizerDir)) { $configHits += $cfg.FullName }
}
$targetCfg = $configHits | Where-Object { $_ -match "\.Avalo" } | Select-Object -First 1
if (-not $targetCfg) { $targetCfg = $configHits | Select-Object -First 1 }
if (-not $targetCfg) { throw "No EldenRingRandomizer user.config matches $RandomizerDir" }
Write-Step "Settings file: $targetCfg"

Write-Step "Pointing randomizer merge path at $mergeMod"
Copy-Item -LiteralPath $targetCfg -Destination "$targetCfg.ignitebak" -Force
[xml]$doc = Get-Content -LiteralPath $targetCfg
$settings = $doc.SelectSingleNode('//*[local-name()="RandomizerCommon.Properties.Settings"]')
if (-not $settings) { throw "Randomizer settings node missing in $targetCfg" }

function Set-Setting([string]$Name, [string]$Value) {
    $existing = @($settings.setting) | Where-Object { $_.name -eq $Name } | Select-Object -First 1
    if (-not $existing) {
        $el = $doc.CreateElement("setting")
        $el.SetAttribute("name", $Name) | Out-Null
        $el.SetAttribute("serializeAs", "String") | Out-Null
        $val = $doc.CreateElement("value")
        $val.InnerText = $Value
        [void]$el.AppendChild($val)
        [void]$settings.AppendChild($el)
    } else {
        $valueNode = $existing.SelectSingleNode("value")
        if (-not $valueNode) {
            $valueNode = $doc.CreateElement("value")
            [void]$existing.AppendChild($valueNode)
        }
        $valueNode.InnerText = $Value
    }
}

$optionsNode = @($settings.setting) | Where-Object { $_.name -eq "Options" } | Select-Object -First 1
if (-not $optionsNode) { throw "Randomizer Options setting missing" }

# Boss Arena Progression still rejects Item Randomizer (it deletes vanilla
# key-item locations). Starting-class rewrite is enabled: the 1.17.1 rebase
# keeps CharaInitParam 3010/3011 so tarnished + changestats can rewrite
# Idus Knight / Heavy Knight loadouts. Options come from boss rush.randomizeopt.
$fallbackOptions = "bossbgm changestats crashfix customenemy dlc editnames enemy nightday nohand phasehp scale swapboss tarnished v16 weaponreqs bias:0"
$resolvedOpt = Resolve-OptionsOpt
$baseOptions = $fallbackOptions
if ($resolvedOpt) {
    Write-Step "Randomizer opt: $resolvedOpt"
    $optText = Get-Content -LiteralPath $resolvedOpt -Raw
    $optLine = [regex]::Match($optText, '(?m)^Options:\s*(.+)$')
    if ($optLine.Success) { $baseOptions = $optLine.Groups[1].Value.Trim() }
    $baseOptions = [regex]::Replace($baseOptions, '\s*seed:\d+', '')
    $tokens = @($baseOptions -split '\s+' | Where-Object { $_ -and $_ -ne 'nostarting' -and $_ -ne 'item' })
    $baseOptions = [string]::Join(' ', $tokens)

    $presetMatch = [regex]::Match($optText, '(?s)EnemyPreset:\s*>\+?\s*\r?\n(.*?)(?=\r?\nItemPreset:)')
    if ($presetMatch.Success) {
        $presetBody = $presetMatch.Groups[1].Value -replace '(?m)^  ', ''
        $presetBody = $presetBody.TrimEnd() + "`n"
        $customEnemy = Join-Path $RandomizerDir "presets\CustomEnemy.txt"
        [System.IO.File]::WriteAllText($customEnemy, $presetBody)
        Write-Step "Wrote enemy preset to $customEnemy"
    }
} else {
    Write-Step "boss rush.randomizeopt not found; using built-in options"
}

$newSeed = Get-Random -Minimum 100000000 -Maximum 1900000000
$optionsText = "$baseOptions seed:$newSeed"
$optionsNode.SelectSingleNode("value").InnerText = $optionsText
Set-Setting "Mod" $mergeMod
$doc.Save($targetCfg)
if ($shopSeed) {
    Write-Step "Randomizer seed $newSeed (enemy + starting classes). Kalé shop seed $shopSeed"
} else {
    Write-Step "Randomizer seed $newSeed (enemy + starting classes). Kalé shop kept from patched_mod"
}

$spoilerDir = Join-Path $RandomizerDir "spoiler_logs"
$before = @{}
if (Test-Path $spoilerDir) {
    Get-ChildItem -LiteralPath $spoilerDir -Filter "*.txt" | ForEach-Object { $before[$_.FullName] = $true }
}

Write-Step "Launching Elden Ring Randomizer"
$proc = Start-Process -FilePath $randoExe -WorkingDirectory $RandomizerDir -PassThru

function Get-RandomizerWindow {
    $root = [System.Windows.Automation.AutomationElement]::RootElement
    $cond = New-Object System.Windows.Automation.PropertyCondition(
        [System.Windows.Automation.AutomationElement]::ProcessIdProperty, $proc.Id)
    return $root.FindFirst([System.Windows.Automation.TreeScope]::Children, $cond)
}

$window = $null
$deadline = (Get-Date).AddSeconds(60)
while ((Get-Date) -lt $deadline) {
    Start-Sleep -Seconds 1
    if ($proc.HasExited) { throw "Randomizer exited before the window appeared (code $($proc.ExitCode))" }
    $window = Get-RandomizerWindow
    if ($window) { break }
}
if (-not $window) { throw "Randomizer window did not appear" }
Write-Step ("Window: " + $window.Current.Name)

# Settings load with the window. Wait until the merge path is actually on screen
# before clicking, otherwise the run uses whatever was last saved.
$seenMod = $false
$deadline = (Get-Date).AddSeconds(30)
while ((Get-Date) -lt $deadline -and -not $seenMod) {
    $textCond = New-Object System.Windows.Automation.PropertyCondition(
        [System.Windows.Automation.AutomationElement]::ControlTypeProperty,
        [System.Windows.Automation.ControlType]::Edit)
    $edits = $window.FindAll([System.Windows.Automation.TreeScope]::Descendants, $textCond)
    foreach ($edit in $edits) {
        $name = $edit.Current.Name
        if ($name -like "*patched_mod*") { $seenMod = $true; break }
        try {
            $value = $edit.GetCurrentPattern([System.Windows.Automation.ValuePattern]::Pattern)
            if ($value.Current.Value -like "*patched_mod*") { $seenMod = $true; break }
        } catch { }
    }
    if (-not $seenMod) { Start-Sleep -Milliseconds 400 }
}
if (-not $seenMod) { throw "Merge path did not show up in the randomizer window. Settings file was $targetCfg" }

$buttonNames = @(
    "Run with set seed",
    "Randomize items and enemies",
    "Randomize items",
    "Randomize enemies",
    "Run"
)
$button = $null
$deadline = (Get-Date).AddSeconds(45)
while ((Get-Date) -lt $deadline -and -not $button) {
    $typeCond = New-Object System.Windows.Automation.PropertyCondition(
        [System.Windows.Automation.AutomationElement]::ControlTypeProperty,
        [System.Windows.Automation.ControlType]::Button)
    $buttons = $window.FindAll([System.Windows.Automation.TreeScope]::Descendants, $typeCond)
    foreach ($name in $buttonNames) {
        foreach ($candidate in $buttons) {
            if ($candidate.Current.Name -eq $name -and $candidate.Current.IsEnabled) {
                $button = $candidate
                break
            }
        }
        if ($button) { break }
    }
    if (-not $button) { Start-Sleep -Milliseconds 500 }
}

if (-not $button) {
    $typeCond = New-Object System.Windows.Automation.PropertyCondition(
        [System.Windows.Automation.AutomationElement]::ControlTypeProperty,
        [System.Windows.Automation.ControlType]::Button)
    $buttons = $window.FindAll([System.Windows.Automation.TreeScope]::Descendants, $typeCond)
    $names = @($buttons | ForEach-Object { $_.Current.Name }) -join " | "
    throw "Randomize button not found. Buttons: $names"
}

Write-Step ("Clicking '{0}'" -f $button.Current.Name)
$invoke = $button.GetCurrentPattern([System.Windows.Automation.InvokePattern]::Pattern)
$invoke.Invoke()

Write-Step "Waiting for the spoiler log (this is the actual randomization)"
$log = $null
$deadline = (Get-Date).AddMinutes($TimeoutMinutes)
while ((Get-Date) -lt $deadline) {
    Start-Sleep -Seconds 5
    if ($proc.HasExited) { throw "Randomizer exited during randomization (code $($proc.ExitCode))" }
    $fresh = Get-ChildItem -LiteralPath $spoilerDir -Filter "*.txt" -ErrorAction SilentlyContinue |
        Where-Object { -not $before.ContainsKey($_.FullName) } |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1
    if (-not $fresh) { continue }
    $log = $fresh.FullName
    $tail = Get-Content -LiteralPath $log -Tail 8 -ErrorAction SilentlyContinue
    $closed = $false
    try {
        $fs = [System.IO.File]::Open($log, "Open", "Read", "None")
        $fs.Close()
        $closed = $true
    } catch {
        $closed = $false
    }
    if ($closed) { break }
    Write-Step ("still writing {0}" -f $fresh.Name)
}
if (-not $log) { throw "Randomizer did not create a spoiler log within $TimeoutMinutes minutes" }

$logText = Get-Content -LiteralPath $log -Raw
if ($logText -notmatch [regex]::Escape($mergeMod)) {
    throw "Spoiler log does not mention the boss-rush merge path. Log: $log"
}
if ($logText -match "Exception|Error randomizing|Error merging mods") {
    throw "Randomizer reported an error. See $log"
}
if ($logText -notmatch "Writing .*regulation\.bin") {
    throw "Randomizer log never wrote regulation.bin. See $log"
}
Write-Step "Randomizer finished: $log"

Write-Step "Copying randomized files into the launch folder"
if (Test-Path -LiteralPath $randoOut) { Remove-Item -LiteralPath $randoOut -Recurse -Force }
New-Item -ItemType Directory -Force -Path $randoOut | Out-Null
foreach ($name in @("event", "map", "msg", "script", "sfx")) {
    $src = Join-Path $RandomizerDir $name
    if (-not (Test-Path -LiteralPath $src)) { throw "Randomizer output missing $src" }
    & robocopy $src (Join-Path $randoOut $name) /E /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
    if ($LASTEXITCODE -ge 8) { throw "robocopy $name failed with exit $LASTEXITCODE" }
}
Copy-Item -LiteralPath (Join-Path $RandomizerDir "regulation.bin") -Destination (Join-Path $randoOut "regulation.bin") -Force

$dllDir = Join-Path $OutDir "dll"
New-Item -ItemType Directory -Force -Path $dllDir | Out-Null
Copy-Item -LiteralPath (Join-Path $RandomizerDir "dll\RandomizerCrashFix.dll") -Destination $dllDir -Force
Copy-Item -LiteralPath (Join-Path $RandomizerDir "dll\RandomizerHelper.dll") -Destination $dllDir -Force
if (Test-Path -LiteralPath $IgniteDll) { Copy-Item -LiteralPath $IgniteDll -Destination $dllDir -Force }
if (Test-Path -LiteralPath $IgniteDllConfig) { Copy-Item -LiteralPath $IgniteDllConfig -Destination $dllDir -Force }
if (Test-Path -LiteralPath $HelperIni) { Copy-Item -LiteralPath $HelperIni -Destination $dllDir -Force }
# The overlay reads dll/data/<lang>/bosses.json for the BOSSES x/y counter.
# Without that folder it stays at "-/0".
$igniteData = Join-Path (Split-Path -Parent $IgniteDll) "data"
if (Test-Path -LiteralPath $igniteData) {
    Write-Step "Copying overlay boss list"
    & robocopy $igniteData (Join-Path $dllDir "data") /E /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
    if ($LASTEXITCODE -ge 8) { throw "robocopy overlay data failed with exit $LASTEXITCODE" }
} else {
    Write-Step "Overlay boss list not found next to Ignite_Boss_Rush.dll (counter will show -/0)"
}

$engineSrc = Join-Path $RandomizerDir "diste\ModEngine"
Copy-Item -LiteralPath (Join-Path $engineSrc "modengine2_launcher.exe") -Destination $OutDir -Force
& robocopy (Join-Path $engineSrc "modengine2") (Join-Path $OutDir "modengine2") /E /XD "logs" /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy modengine2 failed with exit $LASTEXITCODE" }

@"
[modengine]
debug = false
external_dlls = [
    "dll/Ignite_Boss_Rush.dll",
    "dll/RandomizerCrashFix.dll",
    "dll/RandomizerHelper.dll",
]
[extension.mod_loader]
enabled = true
loose_params = false
mods = [
    { enabled = true, name = "randomizer", path = "randomizer" },
    { enabled = true, name = "mod", path = "patched_mod" },
]
"@ | Set-Content -LiteralPath (Join-Path $OutDir "config_eldenringrandomizer.toml") -Encoding ascii

"@echo off`r`n.\modengine2_launcher.exe -t er -c .\config_eldenringrandomizer.toml`r`n" |
    Set-Content -LiteralPath (Join-Path $OutDir "launchmod_rando.bat") -Encoding ascii

Copy-Item -LiteralPath $log -Destination (Join-Path $OutDir "spoiler.txt") -Force
$shopLine = if ($shopSeed) { "Kalé shop seed: $shopSeed" } else { "Kalé shop seed: (kept from patched_mod)" }
Set-Content -LiteralPath (Join-Path $OutDir "RANDOMIZER_SEED.txt") -Encoding ascii -Value @"
Enemy randomizer seed: $newSeed
$shopLine
Options: $optionsText
Opt file: $resolvedOpt
Merged boss-rush mod: $mergeMod
Spoiler log: $log
Launch: launchmod_rando.bat (Mod Engine 2, same layout as Seed 5)
"@

if (-not $proc.HasExited) {
    Write-Step "Closing the randomizer window"
    $proc.CloseMainWindow() | Out-Null
    Start-Sleep -Seconds 2
    if (-not $proc.HasExited) { Stop-Process -Id $proc.Id -Force }
}

Write-Step "Playable seed folder: $OutDir"
exit 0
