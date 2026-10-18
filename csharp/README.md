# Boss Rush (C# tool)

.NET 8 GUI and CLI that roll a seeded Kalé shop, patch the Boss Rush mod,
and write a playable `patched_mod` folder. The RNG domain tag is
`BossRush-v1`, so seeds from the previous generator do not match.

License: GPL-3.0-only. See [LICENSE.md](../LICENSE.md).

---

## 1. Layout

```
csharp/
├── BossRush.sln                 dotnet sln (CLI + GUI + Core + Tests)
├── Directory.Build.props              shared TargetFramework + LangVersion
├── src/
│   ├── BossRush.Core/           pure library — RNG, canonical JSON,
│   │                                   drop generator, EMEVD binary patcher,
│   │                                   bundle builder, pipeline orchestrator
│   ├── BossRush.Cli/            console front-end (`bossrush.exe`)
│   └── BossRush.Gui/            WPF shell (`BossRush.exe`)
└── tests/
    └── BossRush.Tests/          xUnit — PRNG vectors, canonical
                                         serialization, EMEVD byte layouts,
                                         generator determinism + gold-master
```

SoulsFormatsNEXT is consumed via the project reference at
`Phase0_RoundTripTest/vendor/SoulsFormatsNEXT/SoulsFormats/` that's already
round-trip-verified against this mod's EMEVDs. The same binary reader/writer
drives every stage of the pipeline.

---

## 2. Requirements

- .NET SDK **8.0.100 or newer** (https://dot.net)
- Windows 10/11 for the WPF GUI build (`net8.0-windows`). The CLI and Core
  library are plain `net8.0` and run on Linux / macOS too.
- No external tooling needed at runtime — all native dependencies (including
  `oo2core_6_win64.dll` used for Oodle inside DCX) are consumed by
  SoulsFormatsNEXT the same way the Phase 0 round-trip harness does.

---

## 3. Build

From the `csharp/` directory:

```
dotnet restore
dotnet build -c Release
dotnet test  -c Release
```

The tests cover PRNG determinism, canonical serialization, and EMEVD byte
layouts. `GoldenFingerprintTests` runs only when `step2-flag-pool/`,
`step3-exclusions/`, and `step4-boss-catalog/` are present. It checks that
seed `test-seed-alpha-2026` is stable under the `BossRush-v1` domain tag
and that the fingerprint is not the retired previous-generator hash.

---

## 4. Publish a single-file GUI executable

To produce `BossRush.exe` for organizers to hand to non-developers:

```
dotnet publish src/BossRush.Gui/BossRush.Gui.csproj ^
    -c Release ^
    -r win-x64 ^
    --self-contained true ^
    /p:PublishSingleFile=true ^
    /p:IncludeNativeLibrariesForSelfExtract=true ^
    -o publish/gui
```

Output: `publish/gui/BossRush.exe` (~70 MB self-extracting bundle).
No .NET runtime install required on the target machine.

For the CLI (smaller — no WPF dependencies):

```
dotnet publish src/BossRush.Cli/BossRush.Cli.csproj ^
    -c Release ^
    -r win-x64 ^
    --self-contained true ^
    /p:PublishSingleFile=true ^
    -o publish/cli
```

Output: `publish/cli/bossrush.exe`. Same behavior as the GUI, but suitable
for scripting / CI.

---

## 5. Use

### 5.1 GUI

Double-click `BossRush.exe`. The window reads a `data/` folder next to the executable:

1. `data/mod/` — source mod (`event/` and `regulation.bin`).
2. `data/shop_pool.json` — shop roll input.
3. **Shop seed** — hex string, or **Mint**. Leave it blank to mint one on generate.
4. **Zero boss-drop loot** — optional. Clears the per-boss "ENEMY FELLED" toast.

Click **Generate Bundle**. Output lands in `data/output/`. The log prints the `patched_mod` path to merge by hand in the official item and enemy randomizer.

The practice overlay ships beside the executable as `dll/BossRush.dll` (with `config.toml` and `dll/data/<language>/bosses.json`). Merge other mod does not load it. In the randomizer, use **Add dll mod**, select `dll/BossRush.dll`, then **Launch Elden Ring**.

### 5.2 CLI

```
bossrush run ^
    --seed         <hex>                    (omit to auto-mint)
    --source-mod   "<path>\mod" ^
    --shop-pool    "<path>\shop_pool.json" ^
    --out-dir      "<workspace>"
```

`bossrush help` lists the other commands. `bossrush randomize` only prints the manual merge steps.

---

## 6. Output layout

After a successful run:

```
<workspace>/
├── generator/
│   ├── drops.json
│   ├── SEED_INFO.txt
│   └── integrity.sha256
├── patched_mod/              ← full mod tree with modified *.emevd.dcx
│   └── event/…
├── patch_report.json         ← stats from the EMEVD patcher
└── competition_bundle/
    ├── drops.json
    ├── patched_event_bin/    ← only *.emevd.dcx that differ from source
    ├── integrity.sha256
    ├── SEED_INFO.txt
    └── README.txt
```

`patched_mod/` is the folder you merge yourself in the official Elden Ring
Item and Enemy Randomizer (Merge other mod). This tool does not launch
that program. `competition_bundle/` is the tamper-evident artifact.

---

## 7. Item and enemy randomizer

Enemy placements and starting classes stay in the official Elden Ring Item
and Enemy Randomizer. After `bossrush run`, open that program and merge
`patched_mod/`. `data/boss-rush.randomizeopt` is an exported options file
you can import there. Do not redistribute the randomizer with this tool.
