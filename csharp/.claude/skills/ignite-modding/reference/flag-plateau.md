# Event flag plateau: 1049308xxx

The Ignite Boss Rush mod uses a single contiguous block of event flags
around `1049308000..1049309999` for all of its custom state tracking.
This is the mod's "flag plateau." Don't allocate new flags outside the
documented sub-ranges — there are **three known wipe windows** and
**four known tier-indexed ranges** that you can collide with silently.

## Sub-range carve-up

All ranges are inclusive. "Stride" refers to how far apart adjacent
allocations sit within the range (tier N's flag → tier N+1's flag).

| Range | Purpose | Stride | Owner / file | Status |
|---|---|---|---|---|
| `1049308000..219` | *(wiped)* — cleared OFF by event `90009800` on every boss warp | — | base Ignite Rush mod | **DO NOT ALLOCATE HERE** — cleared every warp |
| `1049308220..229` | Shard-award one-shot guard, base `+tier` (tier 1 = 220+1 = 221) | 1 | `TierClearConstants.ShardAwardEventFlagBase` | Stable, allocated |
| `1049308250..275` | *(wiped)* — cleared OFF by the init event (`10010001`) at game load | — | base Ignite Rush mod | **DO NOT ALLOCATE HERE** — cleared on every load |
| `1049308300..316` | Tier-clear latch, base `+tier` (tier 1 = 301, tier 9 = 309; rest reserved) | 1 | `TierClearConstants.TierFlagBase = 1049308300` | Stable, allocated |
| `1049308301..339` | *(wiped)* — cleared OFF by **six m11_10 events** (11107798, 11107802, 11107804, 11107805, 11107815, 11107816) every time the player engages a boss-mode selection. **DO NOT ALLOCATE HERE** — the wipe overlaps the documented tier-clear range above; the engine relies on the wipe + immediate re-set pattern in events like 11107815 (`SetEventFlagID(1049308301, ON)` after the wipe). | — | base Ignite Rush mod | **DO NOT ALLOCATE HERE** — wiped on every boss-mode select |
| `1049308340` | Roundtable care-package one-shot guard — ON ⇒ already given | — | `RoundtableCarePackageConstants.OneShotGuardFlag` | Stable, allocated |
| `1049308341..399` | Unallocated headroom **outside every wipe window** — use for new persistent one-shots | — | — | Free for future use |
| `1049308400..409` | Shop visibility, base `+tier` — controls whether Kalé shows tier N's entry | 1 | `TierClearConstants.ShopVisibilityFlagBase = 1049308400` | Stable, allocated |
| `1049308500..1049309370` | **BossRush shop stock flags**, `base + (tier-1)*100 + slot*10` — per-row "already purchased" | **10** | `RegulationConstants.BossRushShopStockFlagBase` | Stable, allocated (stride-10 required; see below) |
| `1049309371..999` | Unallocated headroom | — | — | Free for future use |

## Wipe windows — why they matter

Allocating a flag inside a wipe window means the flag gets reset to OFF
unexpectedly, which usually looks like "the shop mysteriously resets"
or "the tier-clear latch stops latching."

1. **`1049308000..219`** — wiped by `BatchSetEventFlags(1049308000, 1049308219, OFF)` inside
   event `90009800` (the common boss-warp event). Fires on every tier
   boss warp. Any one-shot state stored here survives only until the
   next warp.

2. **`1049308250..275`** — wiped by `BatchSetEventFlags(1049308250, 1049308275, OFF)` inside
   the init event `10010001` at game-load. Any state stored here
   resets every time the player loads their save.

3. **`1049308400..1049309999`** — wiped by `BatchSetEventFlags(1049308400, 1049309999, OFF)`
   inside the init event, followed by `SetEventFlagID(1049308401, ON)`
   to re-assert Tier-1 visibility. This is the **extended wipe range**
   that the user manually set to cover the stride-10 BossRushShopStockFlag
   overflow. If the user's EMEVD edit is reverted, the upper half of
   the stock-flag range (1049309000..370) will stop auto-resetting
   between runs.

   **Verification procedure:** read
   `data/source_mod/mod/event/common.emevd.dcx.js` for the init
   event body; the `BatchSetEventFlags(1049308400, <end>, OFF)` line
   should end in `1049309999` (not `1049308999`). If it still ends in
   `1049308999`, the extended wipe hasn't been applied on that source
   tree yet.

## Why stride-10 for BossRushShopStockFlag

OpenPuppetShop (bank=1 id=144) writes "row purchased" state to a range
of flags around the row's `eventFlag_forStock` value, not just that
single flag. With stride-1 spacing (our old layout — tier 1 slot 0 = 500,
tier 1 slot 1 = 501, ...), buying slot N made slot N±1 sympathetically
read as sold-out, because the blast radius of the purchase-write
overlapped the neighbouring row's stock flag.

Empirical minimum safe stride: **10**. This matches Athena Randomizer's
Moonwalk Starlight Shop pattern (Moonveil = flag 1056457000, next weapon
= 1056457010, etc.). We mirror the pattern explicitly:

```
BossRushShopStockFlag(tier, slot) = 1049308500 + (tier-1)*100 + slot*10
```

Full range: tier 1 slot 0 = `1049308500`, tier 9 slot 7 = `1049309370`.

**If you change the formula,** ensure (a) every pair of adjacent rows
stays ≥10 apart, and (b) the entire range fits inside the wipe window
(so purchased-state resets between runs). See
`src/IgniteBossRush.Core/Patching/RegulationConstants.cs` line ~200 for
the constant definition and a full comment block.

## Allocating new flags — procedure

1. **Check that your new range doesn't overlap any existing row in the
   table above.** Grep for the numeric values before committing:
   ```
   rg "10493083[0-9][0-9]|10493084[0-9][0-9]|...|10493099[0-9][0-9]"
   ```
2. **Decide whether the new flag needs to be wiped on load.** If yes,
   allocate inside `1049308400..1049309999` (currently wiped). If no,
   allocate outside any wipe window — `1049309371..999` is the current
   "safe" gap.
3. **Add a row to the table above** documenting the new range, its
   stride, and its owner before the code commit. This doc is the
   source of truth for allocation; drift is what causes collisions.
4. **Add a comment in the constant definition** cross-referencing this
   doc, so code readers find the plateau map.

## Known hazards when reading flag numbers in the wild

- Flag `1049302xxx` is **NOT** the same as `1049308xxx`. The `1049302xxx`
  range is a parallel "was previously selected this run" bookkeeping
  range used by some selector events (see the pairing at
  `common_func.emevd.dcx.js:5753` where `1049308167` being ON triggers
  `SetEventFlagID(1049302167, ON)`). When reading EMEVD, note which
  range a flag comes from before concluding anything — the two ranges
  carry different meanings even when the low 3 digits match.
- Flag `6951` (completely outside the plateau) is the "DLC installed"
  detection flag. Referenced but not owned by this mod.
- Flag `20000099` etc. in the `20000xxx` range are custom-arena Stake
  of Marika grace IDs, not event flags. Don't confuse the namespaces.
