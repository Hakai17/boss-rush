// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using IgniteBossRush.Core.Io;
using IgniteBossRush.Core.Models;
using IgniteBossRush.Core.Prng;

namespace IgniteBossRush.Core.Generation;

/// <summary>
/// Deterministic generator for the Boss Rush shop. Given a competition seed
/// and a curated <see cref="ShopPoolFile"/>, produces a
/// <see cref="TierRewardsPlan"/> that enumerates every per-tier shop slot
/// (63 base + up to 9 bonus Great Rune slots), then serialises it to
/// <c>tier_rewards.json</c> alongside the existing <c>drops.json</c>.
///
/// Determinism contract:
///   - Same seed + same shop_pool.json bytes → byte-identical tier_rewards.json.
///   - Domain tag is per-category: <c>"{base_tag}_weapons"</c>,
///     <c>"{base_tag}_talismans"</c>, <c>"{base_tag}_ash_of_war"</c>,
///     <c>"{base_tag}_crystal_tears"</c>, <c>"{base_tag}_great_runes"</c>
///     (shuffle), and <c>"{base_tag}_great_runes_roll_N"</c> (per-tier 15%
///     roll). Each stream is independent so curating one pool does NOT
///     shift another's picks.
///   - Inside a tier, the 7 base slots are emitted in fixed order: two
///     weapons, two talismans, two AoW, one tear. Reordering this loop
///     changes every output, so it's part of the determinism contract.
///   - Sampling is **without replacement globally across all tiers** per
///     category: once Wild Strikes rolls into tier 2's AoW slot, it cannot
///     appear in any later tier's shop. Implementation: one Fisher–Yates
///     shuffle per category over the entire post-exclusion pool, then slice
///     into per-tier chunks (tier N gets the Nth contiguous slice). This
///     also guarantees within-tier uniqueness for free.
///   - <b>Great Runes (bonus 8th slot):</b> each tier independently rolls
///     <c>RandBelow(100) &lt; <see cref="GreatRuneChancePercent"/></c>. If
///     the roll wins AND the great-runes shuffle still has unclaimed entries,
///     an 8th slot with kind <see cref="ShopSlotKinds.GreatRune"/> is
///     appended to that tier. Same global-uniqueness rule: no rune appears
///     in two tiers in the same run. Per-tier slot count is therefore 7 or
///     8, and total run slot count is 63 + luckyTierCount ∈ [63, 72].
///     Cost = <see cref="GreatRuneCostAmberShards"/> Starlight Shards
///     (base slots cost <see cref="BaseSlotCostAmberShards"/>).
///
/// Fisher–Yates is driven by <see cref="ShakeDeterministicRng.RandBelow"/>.
/// We must NOT use <c>OrderBy(rng.Next())</c>-style sorts: those would consume
/// an indeterminate number of PRNG draws (depending on .NET's sort comparator)
/// and break Python parity if we ever port this.
/// </summary>
public sealed class ShopRollGenerator
{
    public const string ToolName = "IgniteRush-ShopRoll";
    public const string ToolVersion = "0.1.0";

    /// <summary>9 tiers × 7 base slots/tier = 63 base shop slots. Lucky
    /// tiers get a bonus Great Rune 8th slot — total slot count is
    /// 63 + (number of tiers that win the <see cref="GreatRuneChancePercent"/>%
    /// roll).</summary>
    public const int TierCount = 9;
    public const int WeaponsPerTier = 2;
    public const int TalismansPerTier = 2;
    public const int AshOfWarPerTier = 2;
    public const int TearsPerTier = 1;
    public const int BaseSlotsPerTier =
        WeaponsPerTier + TalismansPerTier + AshOfWarPerTier + TearsPerTier; // = 7

    /// <summary>Legacy alias kept for downstream code that treated per-tier
    /// slot count as an invariant. With Great Runes enabled, per-tier count
    /// is variable (7 or 8) — callers that need the strict base count
    /// should use <see cref="BaseSlotsPerTier"/>; callers that need the
    /// upper bound should use <see cref="BaseSlotsPerTier"/> + 1.</summary>
    public const int SlotsPerTier = BaseSlotsPerTier;

    /// <summary>Percent chance each tier wins a bonus Great Rune 8th slot.
    /// The roll is a seeded per-tier <c>RandBelow(100) &lt; N</c> draw,
    /// deterministic for a fixed seed. 15% over 9 tiers ≈ 1.35 runes per
    /// run on average — rare enough to feel like a reward, common enough
    /// that most runs see at least one.</summary>
    public const int GreatRuneChancePercent = 15;

    /// <summary>Cost (in Starlight Shards) of one Great Rune slot. Higher
    /// than the base 1-shard slots to reflect scarcity.</summary>
    public const int GreatRuneCostAmberShards = 3;

    /// <summary>Base cost (in Starlight Shards) for every non-Great-Rune
    /// slot. Written to ShopLineupParam's <c>value</c> field.</summary>
    public const int BaseSlotCostAmberShards = 1;

    /// <summary>Tier visibility / award flags — owned by IgniteBossRush, NOT
    /// part of the base Ignite Rush mod's flag scheme. Documented in
    /// patcher_summary.md (TODO: add once patcher lands).</summary>
    private const int TierFlagBase = 1049308300;          // tier_flag        = base + tier
    private const int ShopVisibilityFlagBase = 1049308400;// shop_visibility  = base + tier
    // Placed in the only clean 10-slot gap in the 1049308xxx plateau — between
    // the two BatchSetEventFlags reset windows 1049308000..219 (wiped in event
    // 90009800, `warp to boss`) and 1049308250..275 (wiped in the init event).
    // Earlier picks 1049308500 and 1049308200 both failed — see the detailed
    // history in TierClearConstants.ShardAwardEventFlagBase. Must stay in sync
    // with that constant.
    private const int ShardAwardEventFlagBase = 1049308220;// shard_award_one_shot = base + tier

    public const int ShardAwardPerTier = 5;

    public ShopRollGeneratorOptions Options { get; }

    public ShopRollGenerator(ShopRollGeneratorOptions options)
    {
        Options = options ?? throw new ArgumentNullException(nameof(options));
    }

    /// <summary>
    /// Build the in-memory plan and write it to <paramref name="outDir"/>
    /// as <c>tier_rewards.json</c>. Returns the result with the on-disk path
    /// and a SHA-256 fingerprint of the canonical bytes (for inclusion in
    /// SEED_INFO.txt — same fingerprinting story as <see cref="DropGenerator"/>).
    /// </summary>
    public ShopRollResult Generate(string outDir)
    {
        Directory.CreateDirectory(outDir);

        var pool = JsonLoader.LoadFile<ShopPoolFile>(Options.ShopPoolPath);
        ValidatePool(pool);

        TierRewardsPlan plan = BuildPlan(Options.Seed, pool);

        // Serialise canonically so re-runs are byte-identical and so a future
        // Python port (parity with generate.py) is straightforward.
        Dictionary<string, object> rootDict = ToCanonicalDict(plan);
        byte[] bytes = CanonicalJsonWriter.Serialize(rootDict);

        string outPath = Path.Combine(outDir, "tier_rewards.json");
        File.WriteAllBytes(outPath, bytes);

        string fingerprint = ToHexLower(SHA256.HashData(bytes));
        return new ShopRollResult(
            TierRewardsPath: outPath,
            Fingerprint: fingerprint,
            TierCount: plan.Tiers.Count,
            SlotCount: plan.Tiers.Sum(t => t.Slots.Count));
    }

    // ----------------------------------------------------------------------
    // In-memory plan construction (no I/O — unit-testable in isolation)
    // ----------------------------------------------------------------------
    public static TierRewardsPlan BuildPlan(string seed, ShopPoolFile pool)
    {
        if (string.IsNullOrEmpty(seed))
            throw new ArgumentException("seed must not be empty", nameof(seed));

        // Apply exclusions once up-front so each tier draws from the same
        // post-exclusion pool. Order of survivors is preserved from the
        // source list, which is part of the determinism contract.
        var weapons = pool.Pools.Weapons
            .Where(w => !pool.Exclusions.Weapons.Contains(w.ParamId)).ToList();
        var talismans = pool.Pools.Talismans
            .Where(t => !pool.Exclusions.Talismans.Contains(t.ParamId)).ToList();
        var aow = pool.Pools.AshOfWar
            .Where(a => !pool.Exclusions.AshOfWar.Contains(a.ParamId)).ToList();
        var tears = pool.Pools.CrystalTears
            .Where(t => !pool.Exclusions.CrystalTears.Contains(t.ParamId)).ToList();
        var greatRunes = pool.Pools.GreatRunes
            .Where(r => !pool.Exclusions.GreatRunes.Contains(r.ParamId)).ToList();
        var headArmor = pool.Pools.HeadArmor
            .Where(h => !pool.Exclusions.HeadArmor.Contains(h.ParamId)).ToList();

        // Floor is now the total-run demand (perTier * TierCount) because
        // sampling is without-replacement across all tiers per category.
        // A pool that meets the old per-tier floor but not the global one
        // would run out partway through the slice loop.
        RequireMinSize(weapons.Count,   WeaponsPerTier   * TierCount, "weapons");
        RequireMinSize(talismans.Count, TalismansPerTier * TierCount, "talismans");
        RequireMinSize(aow.Count,       AshOfWarPerTier  * TierCount, "ash_of_war");
        RequireMinSize(tears.Count,     TearsPerTier     * TierCount, "crystal_tears");
        // great_runes has no minimum — the pool can be empty (no runes at all)
        // or small (fewer unique runes than max possible lucky tiers). The
        // tier-roll loop below clamps lucky tiers to the available rune count.

        // One full shuffle per category using a category-specific domain.
        // `SampleWithoutReplacement` with k == source.Count is a complete
        // Fisher–Yates shuffle (exactly source.Count-1 RandBelow draws — the
        // last draw is trivially 0). We only need the first perTier*TierCount
        // entries, but reify the full prefix so slicing stays O(1).
        var weaponsShuffled   = SampleWithoutReplacement(
            new ShakeDeterministicRng(seed, $"{pool.DomainTag}_weapons"),
            weapons, weapons.Count).ToList();
        var talismansShuffled = SampleWithoutReplacement(
            new ShakeDeterministicRng(seed, $"{pool.DomainTag}_talismans"),
            talismans, talismans.Count).ToList();
        var aowShuffled       = SampleWithoutReplacement(
            new ShakeDeterministicRng(seed, $"{pool.DomainTag}_ash_of_war"),
            aow, aow.Count).ToList();
        var tearsShuffled     = SampleWithoutReplacement(
            new ShakeDeterministicRng(seed, $"{pool.DomainTag}_crystal_tears"),
            tears, tears.Count).ToList();
        // Great Rune shuffle uses its own domain so curating the rune pool
        // doesn't shift other categories' rolls. Global-unique across tiers:
        // lucky tiers consume runes in shuffle order, so a rune can't repeat.
        var greatRunesShuffled = greatRunes.Count > 0
            ? SampleWithoutReplacement(
                new ShakeDeterministicRng(seed, $"{pool.DomainTag}_great_runes"),
                greatRunes, greatRunes.Count).ToList()
            : new List<Models.GreatRunePoolEntry>();
        // Head armor shuffle. Independent domain ⇒ curating armor doesn't
        // shift the talisman/weapon/AoW/tear streams. Global-unique across
        // tiers via the same shuffle-and-cursor pattern as great runes.
        var headArmorShuffled = headArmor.Count > 0
            ? SampleWithoutReplacement(
                new ShakeDeterministicRng(seed, $"{pool.DomainTag}_head_armor"),
                headArmor, headArmor.Count).ToList()
            : new List<Models.HeadArmorPoolEntry>();

        // Per-slot category coins for the talisman positions: one independent
        // 50/50 draw per (tier, slot) pair, 18 total. Stored up-front so the
        // tier loop is a pure consumer; this keeps the determinism contract
        // simple (one coin = one RandBelow(2) call, in tier-major slot-minor
        // order). Coin draws happen ONLY when head armor is enabled — empty
        // armor pool ⇒ no coin RNG instantiation, no stream consumption,
        // talisman behavior is byte-identical to the pre-feature version.
        bool[] coinIsArmor = new bool[TalismansPerTier * TierCount];
        if (headArmorShuffled.Count > 0)
        {
            var coinRng = new ShakeDeterministicRng(
                seed, $"{pool.DomainTag}_talisman_or_head_armor_choice");
            for (int i = 0; i < coinIsArmor.Length; i++)
            {
                // RandBelow(2) is a uniform 0/1 draw consuming one u64 of RNG
                // output. 1 ⇒ this slot is armor; 0 ⇒ talisman.
                coinIsArmor[i] = coinRng.RandBelow(2) == 1;
            }
        }

        // Per-tier probabilistic roll: independent stream per tier from a
        // dedicated domain, so changing GreatRuneChancePercent doesn't shift
        // other RNG streams. Deterministic for a fixed seed.
        var luckyTiers = new bool[TierCount + 1]; // 1-indexed for readability
        int luckyCount = 0;
        for (int tierIdx = 1; tierIdx <= TierCount; tierIdx++)
        {
            var rng = new ShakeDeterministicRng(
                seed, $"{pool.DomainTag}_great_runes_roll_{tierIdx}");
            bool wins = rng.RandBelow(100) < GreatRuneChancePercent;
            // Clamp: can't hand out more runes than the pool has (global
            // uniqueness guarantee). Later lucky tiers get skipped if the
            // rune pool is exhausted.
            if (wins && luckyCount < greatRunesShuffled.Count)
            {
                luckyTiers[tierIdx] = true;
                luckyCount++;
            }
        }

        var tiers = new List<TierPlan>(TierCount);
        // Running indices for streams that don't advance by a fixed per-tier
        // delta any more.
        //   • Great Rune cursor: advances only on lucky-tier rolls.
        //   • Talisman cursor: advances 0/1/2 per tier depending on coin flips.
        //   • Head Armor cursor: advances 0/1/2 per tier (the inverse of talisman).
        // Slot-emit order WITHIN a tier remains fixed (W,W, T-or-A,T-or-A, AoW,AoW, Tear).
        int greatRuneCursor = 0;
        int talismanCursor = 0;
        int headArmorCursor = 0;
        for (int tierIdx = 1; tierIdx <= TierCount; tierIdx++)
        {
            // Slice offsets for streams that DO advance by a fixed per-tier
            // delta (weapons, AoW, tears). Talisman + head_armor cursors
            // advance dynamically — they're counted via running cursors above.
            int wOffset    = (tierIdx - 1) * WeaponsPerTier;
            int aOffset    = (tierIdx - 1) * AshOfWarPerTier;
            int tearOffset = (tierIdx - 1) * TearsPerTier;

            // Slot-emit order is load-bearing: weapons → talismans → AoW →
            // tears → (optional great rune). Reordering changes every seed's
            // output — part of the determinism contract.
            var picks = new List<ShopSlot>(BaseSlotsPerTier + 1);
            int shopBase = 8000000 + tierIdx * 100;
            int slotIdx = 0;

            for (int i = 0; i < WeaponsPerTier; i++)
                picks.Add(new ShopSlot
                {
                    ShopId = shopBase + slotIdx++,
                    Kind = ShopSlotKinds.Weapon,
                    ParamId = weaponsShuffled[wOffset + i].ParamId,
                    CostAmberShards = BaseSlotCostAmberShards,
                });
            // Talisman-or-armor slots: per-slot 50/50 coin (pre-rolled above)
            // routes each slot to either the talisman shuffle or the head_armor
            // shuffle. Both pools advance independently and are global-unique
            // across tiers (consumed in shuffled order). When the armor pool
            // is exhausted but a coin still says "armor", we throw — the
            // user can re-seed (~5% of seeds at 50/50 with a 12-item pool).
            for (int i = 0; i < TalismansPerTier; i++)
            {
                int coinIdx = (tierIdx - 1) * TalismansPerTier + i;
                bool wantsArmor = coinIsArmor[coinIdx];

                if (wantsArmor)
                {
                    if (headArmorCursor >= headArmorShuffled.Count)
                    {
                        throw new InvalidDataException(
                            $"shop_pool.json 'head_armor' pool exhausted at tier {tierIdx} "
                            + $"slot index {i} (coin index {coinIdx}). "
                            + $"Used {headArmorCursor} of {headArmorShuffled.Count} entries; "
                            + "the seed rolled more 'armor' coins than the pool can satisfy "
                            + "without replacement. Either widen the pool or re-seed.");
                    }
                    picks.Add(new ShopSlot
                    {
                        ShopId = shopBase + slotIdx++,
                        Kind = ShopSlotKinds.HeadArmor,
                        ParamId = headArmorShuffled[headArmorCursor++].ParamId,
                        CostAmberShards = BaseSlotCostAmberShards,
                    });
                }
                else
                {
                    if (talismanCursor >= talismansShuffled.Count)
                    {
                        throw new InvalidDataException(
                            $"shop_pool.json 'talismans' pool exhausted at tier {tierIdx} "
                            + $"slot index {i} (coin index {coinIdx}). "
                            + $"Used {talismanCursor} of {talismansShuffled.Count} entries.");
                    }
                    picks.Add(new ShopSlot
                    {
                        ShopId = shopBase + slotIdx++,
                        Kind = ShopSlotKinds.Talisman,
                        ParamId = talismansShuffled[talismanCursor++].ParamId,
                        CostAmberShards = BaseSlotCostAmberShards,
                    });
                }
            }
            for (int i = 0; i < AshOfWarPerTier; i++)
                picks.Add(new ShopSlot
                {
                    ShopId = shopBase + slotIdx++,
                    Kind = ShopSlotKinds.AshOfWar,
                    ParamId = aowShuffled[aOffset + i].ParamId,
                    CostAmberShards = BaseSlotCostAmberShards,
                });
            for (int i = 0; i < TearsPerTier; i++)
                picks.Add(new ShopSlot
                {
                    ShopId = shopBase + slotIdx++,
                    Kind = ShopSlotKinds.Tear,
                    ParamId = tearsShuffled[tearOffset + i].ParamId,
                    CostAmberShards = BaseSlotCostAmberShards,
                });

            // Bonus 8th slot: appended only if this tier won the 15% roll AND
            // the shuffled rune pool still has unclaimed entries. Shop ID
            // always lands at slot index 7 (the next 100-ID window slot),
            // leaving slots 0..6 fixed across every tier.
            if (luckyTiers[tierIdx])
            {
                var rune = greatRunesShuffled[greatRuneCursor++];
                picks.Add(new ShopSlot
                {
                    ShopId = shopBase + slotIdx++,
                    Kind = ShopSlotKinds.GreatRune,
                    ParamId = rune.ParamId,
                    CostAmberShards = GreatRuneCostAmberShards,
                });
            }

            tiers.Add(new TierPlan
            {
                Tier = tierIdx,
                TierFlag = TierFlagBase + tierIdx,
                ShopVisibilityFlag = ShopVisibilityFlagBase + tierIdx,
                ShardAwardCount = ShardAwardPerTier,
                ShardAwardEventFlag = ShardAwardEventFlagBase + tierIdx,
                Slots = picks,
            });
        }

        return new TierRewardsPlan
        {
            CompetitionSeed = seed,
            DomainTag = pool.DomainTag,
            Tiers = tiers,
        };
    }

    // ----------------------------------------------------------------------
    // Sampling: deterministic, RandBelow-only.
    // ----------------------------------------------------------------------
    /// <summary>
    /// Fisher–Yates partial shuffle over a defensive copy: pick k distinct
    /// items from <paramref name="source"/> without replacement, in pick-order.
    /// Issues exactly k <see cref="ShakeDeterministicRng.RandBelow"/> calls.
    /// Equivalent to Python's <c>random.sample(seq, k)</c> when driven by the
    /// same RNG.
    /// </summary>
    internal static IEnumerable<T> SampleWithoutReplacement<T>(
        ShakeDeterministicRng rng, IReadOnlyList<T> source, int k)
    {
        if (k > source.Count)
            throw new ArgumentException(
                $"Cannot sample {k} items from a pool of {source.Count}");

        // Defensive copy so we can mutate without disturbing the caller.
        var pool = new T[source.Count];
        for (int i = 0; i < source.Count; i++) pool[i] = source[i];

        int remaining = pool.Length;
        for (int draw = 0; draw < k; draw++)
        {
            int pickIdx = rng.RandBelow(remaining);
            yield return pool[pickIdx];
            // Move the picked element out of the unpicked window by swapping
            // it with the last unpicked slot. Standard Fisher–Yates trick.
            pool[pickIdx] = pool[remaining - 1];
            remaining--;
        }
    }

    // ----------------------------------------------------------------------
    // JSON canonicalisation helpers
    // ----------------------------------------------------------------------
    /// <summary>
    /// Translate the strongly-typed plan into the loose dictionary shape that
    /// <see cref="CanonicalJsonWriter"/> understands. Field names here ARE
    /// the on-disk schema — keep in sync with the documented schema in
    /// patcher_summary.md.
    /// </summary>
    internal static Dictionary<string, object> ToCanonicalDict(TierRewardsPlan plan)
    {
        var tiersList = new List<object>(plan.Tiers.Count);
        foreach (var t in plan.Tiers)
        {
            var slotsList = new List<object>(t.Slots.Count);
            foreach (var s in t.Slots)
            {
                slotsList.Add(new Dictionary<string, object>
                {
                    ["shop_id"] = s.ShopId,
                    ["kind"] = s.Kind,
                    ["param_id"] = s.ParamId,
                    ["cost_amber_shards"] = s.CostAmberShards,
                });
            }
            tiersList.Add(new Dictionary<string, object>
            {
                ["tier"] = t.Tier,
                ["tier_flag"] = t.TierFlag,
                ["shop_visibility_flag"] = t.ShopVisibilityFlag,
                ["shard_award_count"] = t.ShardAwardCount,
                ["shard_award_event_flag"] = t.ShardAwardEventFlag,
                ["slots"] = slotsList,
            });
        }

        return new Dictionary<string, object>
        {
            ["schema_version"] = plan.SchemaVersion,
            ["competition_seed"] = plan.CompetitionSeed,
            ["domain_tag"] = plan.DomainTag,
            ["tiers"] = tiersList,
        };
    }

    // ----------------------------------------------------------------------
    // Validation
    // ----------------------------------------------------------------------
    private static void ValidatePool(ShopPoolFile pool)
    {
        if (pool.SchemaVersion != 1)
            throw new InvalidDataException(
                $"Unsupported shop_pool.json schema_version {pool.SchemaVersion} (expected 1)");
        if (string.IsNullOrEmpty(pool.DomainTag))
            throw new InvalidDataException("shop_pool.json domain_tag must not be empty");
    }

    private static void RequireMinSize(int actual, int min, string poolName)
    {
        if (actual < min)
            throw new InvalidDataException(
                $"shop_pool.json '{poolName}' has only {actual} entries after exclusions; "
                + $"need at least {min} (per-tier count × {TierCount} tiers) "
                + "because sampling is without-replacement across all tiers.");
    }

    private static string ToHexLower(byte[] data)
    {
        var sb = new StringBuilder(data.Length * 2);
        foreach (var b in data) sb.Append(b.ToString("x2", CultureInfo.InvariantCulture));
        return sb.ToString();
    }
}

public sealed record ShopRollResult(
    string TierRewardsPath,
    string Fingerprint,
    int TierCount,
    int SlotCount);

public sealed class ShopRollGeneratorOptions
{
    public required string Seed { get; init; }
    public required string ShopPoolPath { get; init; }
}
