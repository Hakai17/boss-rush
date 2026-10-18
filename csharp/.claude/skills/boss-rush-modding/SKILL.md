---
name: boss-rush-modding
description: |
  Use when working with the Boss Rush Elden Ring mod codebase —
  editing, inspecting, or explaining EMEVD (event scripts, `.emevd.dcx`),
  ESD (NPC talk scripts, `.esd` inside `.talkesdbnd.dcx`), PARAM tables
  (inside `regulation.bin` — ShopLineupParam, ItemLotParam, NpcParam,
  SpEffectParam, etc.), MSB maps, or FMG message strings (inside
  `.msgbnd.dcx`). Also triggers on mentions of:
    - any `mXX_XX_XX_XX` map ID, any `cXXXX` character ID, any `tXXXXXXXXX.esd`
    - event flags in the `1049308xxx` plateau
    - specific bosses + "tier" / "arena" / "warp"
    - the CLI tool `bossrush.exe` or its `inspect-*` subcommands
    - splicer classes (`KaleShopMenuSplicer`, `TierClearEventSplicer`, etc.)
    - "Starlight Shard", "Boss Rush", "Kalé shop", "tier clear"
  Do NOT use for unrelated C# / .NET work — this skill is specifically
  about the mod's domain conventions, not generic code editing.
---

# Boss Rush modding skill

Domain knowledge for the Boss Rush Elden Ring mod codebase at
`csharp/csharp/` (a C# .NET 8 pipeline tool plus the mod's source data).
This skill captures the conventions, flag allocations, file layouts,
and patterns that took many sessions to derive — so they don't need to
be re-derived each session.

## Before you do anything, orient yourself

Three files tell you what the project is doing:
- `src/BossRush.Core/Pipeline/PipelineRunner.cs` — the top-level
  pipeline that mutates the mod's data on every run. Start here if
  you're asked "how does X get into the output."
- `src/BossRush.Core/Patching/` — one splicer/patcher per
  responsibility. `KaleShopMenuSplicer.cs` is the reference template
  for "write a new splicer."
- `data/source_mod/mod/` — the unpatched mod data (EMEVD, MSB, params,
  FMG). This is the INPUT the pipeline reads. The OUTPUT goes to
  `src/BossRush.Gui/bin/Debug/net8.0-windows/data/output/patched_mod/`
  when the GUI runs.

## The CLI is your first tool

`src/BossRush.Cli/bin/Debug/net8.0/bossrush.exe` already exposes
inspection commands built on SoulsFormatsNEXT. Use them before reading
binaries manually:

| Command | Purpose |
|---|---|
| `inspect-regulation --bnd <regulation.bin> --table <ParamName> --row <id>` | Dump a single PARAM row's cells |
| `inspect-regulation --bnd <regulation.bin> --table <ParamName> --list-ids` | List every row id in a param |
| `inspect-regulation --bnd <regulation.bin> --table <ParamName> --where <cell=value>` | Find rows matching a cell value |
| `inspect-esd --bnd <talkesdbnd.dcx> --name <entry.esd>` | Full dump of ESD states, conditions, commands, evaluator bytes |
| `inspect-emevd --bnd <emevd.dcx> --event-id <N>` | Decompile a single EMEVD event |
| `inspect-msgbnd --bnd <msgbnd.dcx> --probe-ids <csv>` | Look up FMG entry text by id across every FMG in a container |

**If the user asks "what does event X do" or "what string is at id Y",
your first move is one of the above — not reading the binary directly,
not guessing.**

## Hard rules specific to this project

1. **Never write EMEVD edits yourself.** The user has explicitly stated
   they handle all EMEVD edits personally. You can *propose* exact
   changes (show the line, show the new line, explain the semantics)
   but do not use `Edit` or `Write` on any `.emevd.dcx.js` or
   `.emevd.dcx` file. ESD editing via splicer classes is fine — that's
   a different tool chain (C# splicers writing through SoulsFormatsNEXT).

2. **Never mutate `.emevd.dcx` binaries directly.** Always go through
   a C# splicer class that uses SoulsFormatsNEXT. Arbitrary binary
   mutations are how you silently corrupt the mod.

3. **Every new splicer must be idempotent and tested.** Follow the
   `KaleShopMenuSplicer` template: check for already-applied state and
   bail cleanly, write a round-trip test under
   `tests/BossRush.Tests/`. See
   `reference/splicer-pattern.md` for the checklist.

4. **Determinism matters.** Seed-driven generation (`ShopRollGenerator`,
   anywhere under `src/BossRush.Core/Generation/`) must produce
   byte-identical output for the same seed + inputs. Never use
   `OrderBy(rng.Next())`-style shuffles — use Fisher–Yates via
   `ShakeDeterministicRng.RandBelow`.

5. **Don't invent param ids, flag ids, or map coords.** If you need a
   number, either (a) find it in the codebase via grep, (b) find it
   via the inspect CLI commands, or (c) mark it `UNKNOWN — needs
   Smithbox lookup`. Do not guess.

## Reference docs

Only the docs marked **WRITTEN** exist on disk — read them before
claiming knowledge in their area. Docs marked **TODO** are planned but
not yet written; for those topics, derive the answer from the codebase
via `grep` / `inspect-*` CLI commands and cite your source. Do not
fabricate content under a TODO filename.

- **WRITTEN** — `reference/flag-plateau.md` — the `1049308xxx`
  event-flag range carve-up (tier, visibility, stock, shard-award,
  wipes). Read this for any question involving flags in that range.
- **WRITTEN** — `reference/esd-opcodes.md` — verified ESDLang
  `CommandBank` / `CommandID` mappings, evaluator bytecode primitives,
  argument encodings, composite evaluator recipes, state-composition
  patterns, and `EsdBytecode.cs` helper inventory. Read this before
  writing any ESD splicer.
- **TODO** — `reference/shop-lineup-layout.md` — ShopLineupParam row-id
  formula, per-field meanings (equipType values, costType=2 =
  Starlight Shards, stride-10 `eventFlag_forStock` requirement). Until
  written, derive from `src/BossRush.Core/Patching/RegulationPatcher.cs`
  (the `MutateShopLineupParam` method) and `RegulationConstants.cs`.
- **TODO** — `reference/custom-arenas.md` — the `m20_XX_XX_XX` custom
  map pattern. Until written, derive from grepping
  `common_func.emevd.dcx.js` for `$InitializeCommonEvent(0, 90009800,`
  calls.
- **TODO** — `reference/boss-to-arena-map.md` — enumeration procedure
  for the current boss→arena warp table. Until written, use the grep
  recipe in the previous item.

## Workflows

All **TODO** — don't read files by these names, they don't exist yet.
Until written, use the existing codebase as your template:

- `workflows/add-splicer.md` — use `KaleShopMenuSplicer.cs` +
  `KaleShopMenuSplicerTests.cs` as the reference pair.
- `workflows/add-fmg-string.md` — use `FmgPatcher.cs` +
  `FmgPatcherTests.cs` as the reference pair.
- `workflows/swap-boss-arena.md` — the user prefers to handle EMEVD
  edits themselves (see hard rule #1). Propose the exact line change,
  don't apply it.
- `workflows/edit-shop-row.md` — extend `RegulationPatcher.MutateShopLineupParam`.
- `workflows/run-tests.md` — `dotnet test tests/BossRush.Tests/BossRush.Tests.csproj --nologo`.
  Three pre-existing failures in `KaleShopMenuSplicerTests` are
  known-bad baseline — see the anti-patterns section below.

## Anti-patterns to avoid

- **Suggesting `sed`/`awk` edits on binaries** — they'll corrupt DCX
  compression and BND4 offsets. Always round-trip through the library.
- **Claiming a param name without verifying** — run
  `inspect-regulation --list-ids` first; ER has ~1700 ShopLineupParam
  rows alone and naming is not always what you'd expect.
- **Ignoring the 3 pre-existing test failures** in
  `KaleShopMenuSplicerTests` (`Apply_Appends_NineAddTalkListDataIf_…`,
  `Apply_HonorsCustomMenuTextId`, `Apply_DefaultsTo_PlaceholderMenuTextId_20000009`).
  They were failing before the current work started and are unrelated
  to shop/scaling/arena changes. Treat them as known-bad baseline, not
  regressions.
- **Committing `publish/`, `*.zip`, `*.bak`, `*.prev` files.** See
  `.gitignore` and the staging recipe in `workflows/commit-changes.md`.
- **Guessing at SoulsFormatsNEXT APIs.** Cite a use site in the
  codebase (e.g. `RegulationIo.LoadEldenRing`, `PARAM.Read`,
  `ESD.Condition`) — don't invent API shapes. The library's
  `dependencies/SoulsFormatsNEXT/` source is available if you need to
  look up signatures.

## Known user preferences

- User wants to be shown the exact proposed edit (old line / new line)
  before code is changed — especially for EMEVD, but also preferred
  for any non-trivial splicer work.
- User prefers stride-10 flag spacing over stride-1 (see flag-plateau
  doc for why).
- User uses the GUI (`BossRush.exe`) to run the pipeline, not the
  CLI. Output lands in
  `src/BossRush.Gui/bin/Debug/net8.0-windows/data/output/patched_mod/`.
  Then a separate "Matt's merge" step copies into
  `C:/Users/harvs/Documents/Elden Ring Randomizer/.../randomizer/`.
  When verifying a change landed in-game, check the Matt's-merge path,
  not the GUI output path — those can disagree if the merge step was
  skipped.

## When you're stuck

Say so explicitly. Write `UNKNOWN — would need X` rather than
guessing. The cost of a guess that turns into a wasted playtest cycle
is much higher than the cost of asking the user to open Smithbox for
30 seconds.
