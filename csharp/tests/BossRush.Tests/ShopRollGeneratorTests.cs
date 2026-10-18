// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using BossRush.Core.Generation;
using BossRush.Core.Io;
using BossRush.Core.Models;
using Xunit;

namespace BossRush.Tests;

/// <summary>
/// Determinism + structural tests for <see cref="ShopRollGenerator"/>.
/// Mirrors the style of <see cref="DropGeneratorTests"/>: hermetic temp
/// fixtures, no dependency on shop_pool.json shipped under csharp/data, so
/// the suite stays insulated from pool curation churn.
///
/// Test inventory:
///   - Determinism: same seed → byte-identical tier_rewards.json.
///   - Variability: different seeds → different fingerprints AND different
///     observable slot contents (catches the hypothetical bug where the RNG
///     factory is wired to ignore the seed).
///   - Structure: 9 tiers × 7 slots in the locked W,W,T,T,A,A,Tear order.
///   - Within-tier uniqueness: no duplicate param_id within a single category
///     of a single tier (falls out of the global-shuffle contract).
///   - Global uniqueness across tiers per category: if Wild Strikes rolls
///     into tier 2 it never reappears in tiers 3..9.
///   - Pool sized below global-demand floor → loud failure (caught at
///     BuildPlan time — the floor is perTier × TierCount, not perTier).
/// </summary>
public class ShopRollGeneratorTests
{
    [Fact]
    public void Generate_SameSeed_TwiceProducesIdenticalBytes()
    {
        using var fx = new TempPoolFixture();
        fx.WriteDefaultPool();

        string outA = Path.Combine(fx.Root, "runA");
        string outB = Path.Combine(fx.Root, "runB");
        var opts = new ShopRollGeneratorOptions
        {
            Seed = "deterministic-shop-seed",
            ShopPoolPath = fx.PoolPath,
        };

        var r1 = new ShopRollGenerator(opts).Generate(outA);
        var r2 = new ShopRollGenerator(opts).Generate(outB);

        Assert.Equal(r1.Fingerprint, r2.Fingerprint);
        byte[] a = File.ReadAllBytes(r1.TierRewardsPath);
        byte[] b = File.ReadAllBytes(r2.TierRewardsPath);
        Assert.Equal(a, b); // byte-identical tier_rewards.json
    }

    [Fact]
    public void Generate_DifferentSeeds_ProduceDifferentFingerprintsAndContents()
    {
        using var fx = new TempPoolFixture();
        fx.WriteDefaultPool();
        // Seed pool large enough that distinct seeds will pick differently
        // with overwhelming probability (combinatorially many orderings).

        var optsA = new ShopRollGeneratorOptions { Seed = "seed-alpha", ShopPoolPath = fx.PoolPath };
        var optsB = new ShopRollGeneratorOptions { Seed = "seed-bravo", ShopPoolPath = fx.PoolPath };

        var r1 = new ShopRollGenerator(optsA).Generate(Path.Combine(fx.Root, "a"));
        var r2 = new ShopRollGenerator(optsB).Generate(Path.Combine(fx.Root, "b"));

        Assert.NotEqual(r1.Fingerprint, r2.Fingerprint);

        // Belt-and-braces: parse both files and assert at least one slot's
        // param_id differs. If both files were structurally identical despite
        // different fingerprints something has gone very wrong with hashing.
        var docA = JsonDocument.Parse(File.ReadAllBytes(r1.TierRewardsPath));
        var docB = JsonDocument.Parse(File.ReadAllBytes(r2.TierRewardsPath));
        bool foundDiff = false;
        var tiersA = docA.RootElement.GetProperty("tiers").EnumerateArray().ToList();
        var tiersB = docB.RootElement.GetProperty("tiers").EnumerateArray().ToList();
        for (int t = 0; t < tiersA.Count && !foundDiff; t++)
        {
            var slotsA = tiersA[t].GetProperty("slots").EnumerateArray().ToList();
            var slotsB = tiersB[t].GetProperty("slots").EnumerateArray().ToList();
            for (int s = 0; s < slotsA.Count && !foundDiff; s++)
            {
                if (slotsA[s].GetProperty("param_id").GetInt32()
                  != slotsB[s].GetProperty("param_id").GetInt32())
                    foundDiff = true;
            }
        }
        Assert.True(foundDiff,
            "expected at least one slot to differ between distinct seeds");
    }

    [Fact]
    public void Generate_StructureMatchesLockedSpec_9Tiers_7Slots_2W2T2A1Tear()
    {
        using var fx = new TempPoolFixture();
        fx.WriteDefaultPool();
        var r = new ShopRollGenerator(new ShopRollGeneratorOptions
        {
            Seed = "structure-check",
            ShopPoolPath = fx.PoolPath,
        }).Generate(Path.Combine(fx.Root, "out"));

        Assert.Equal(9, r.TierCount);
        Assert.Equal(63, r.SlotCount);

        using var doc = JsonDocument.Parse(File.ReadAllBytes(r.TierRewardsPath));
        var tiers = doc.RootElement.GetProperty("tiers").EnumerateArray().ToList();
        Assert.Equal(9, tiers.Count);

        for (int i = 0; i < 9; i++)
        {
            int tier = i + 1;
            var t = tiers[i];
            Assert.Equal(tier, t.GetProperty("tier").GetInt32());

            // Tier flag scheme reuses base mod's per-tier flags 1049308301..309.
            Assert.Equal(1049308300 + tier, t.GetProperty("tier_flag").GetInt32());
            // Visibility & shard-award flags are owned by BossRush.
            Assert.Equal(1049308400 + tier, t.GetProperty("shop_visibility_flag").GetInt32());
            // Shard-award guard moved to 1049308220..229 — the only clean gap
            // in the 1049308xxx plateau. Prior homes 1049308500 and 1049308200
            // both fell inside batch-reset windows the mod runs during tier
            // play, causing the guard to never hold (10 and 75 shards per
            // clear observed respectively). See the detailed history in
            // TierClearConstants.ShardAwardEventFlagBase.
            Assert.Equal(1049308220 + tier, t.GetProperty("shard_award_event_flag").GetInt32());
            Assert.Equal(5, t.GetProperty("shard_award_count").GetInt32());

            // 7 slots in fixed kind order. Cost always 1 amber shard.
            var slots = t.GetProperty("slots").EnumerateArray().ToList();
            Assert.Equal(7, slots.Count);
            string[] expectedKinds = {
                "weapon","weapon",
                "talisman","talisman",
                "ash_of_war","ash_of_war",
                "tear",
            };
            for (int s = 0; s < 7; s++)
            {
                Assert.Equal(expectedKinds[s], slots[s].GetProperty("kind").GetString());
                // shop_id encoding: 8000000 + tier*100 + slot
                Assert.Equal(8000000 + tier * 100 + s, slots[s].GetProperty("shop_id").GetInt32());
                Assert.Equal(1, slots[s].GetProperty("cost_amber_shards").GetInt32());
            }
        }
    }

    [Fact]
    public void Generate_NoItemRepeatsAcrossTiers_PerCategory()
    {
        // Global uniqueness contract: once an item rolls into any tier's shop,
        // it must never appear again in a later tier's shop for the same
        // category. Implementation is a single Fisher–Yates shuffle per
        // category sliced into contiguous per-tier chunks; this test is the
        // trip wire if that gets refactored back to per-tier sampling.
        using var fx = new TempPoolFixture();
        fx.WriteDefaultPool();
        var r = new ShopRollGenerator(new ShopRollGeneratorOptions
        {
            Seed = "global-uniqueness-check",
            ShopPoolPath = fx.PoolPath,
        }).Generate(Path.Combine(fx.Root, "g"));

        using var doc = JsonDocument.Parse(File.ReadAllBytes(r.TierRewardsPath));
        // Gather (kind, param_id) pairs across every tier/slot. Count per kind.
        var perKindSeen = new Dictionary<string, List<int>>();
        foreach (var tier in doc.RootElement.GetProperty("tiers").EnumerateArray())
        foreach (var slot in tier.GetProperty("slots").EnumerateArray())
        {
            string kind = slot.GetProperty("kind").GetString()!;
            int pid = slot.GetProperty("param_id").GetInt32();
            if (!perKindSeen.TryGetValue(kind, out var list))
                perKindSeen[kind] = list = new List<int>();
            list.Add(pid);
        }

        foreach (var (kind, ids) in perKindSeen)
            Assert.Equal(ids.Count, ids.Distinct().Count());
    }

    [Fact]
    public void Generate_WithGreatRunes_BonusSlotIsProbabilistic_CostIsThreeShards()
    {
        // Great Rune bonus slot invariants:
        //   (a) per-tier slot count ∈ {7, 8}
        //   (b) if 8th slot exists it's kind="great_rune" and cost=3
        //   (c) base 7 slots still cost 1 each (per-slot cost propagated)
        //   (d) no rune appears in two tiers (global uniqueness)
        //   (e) never more lucky tiers than runes in the pool (clamp rule)
        using var fx = new TempPoolFixture();
        // 5 runes in the pool matches production shop_pool.json. The 15%
        // roll is seeded so we don't need a specific expected lucky count;
        // we just check the invariants hold for whichever tiers won.
        fx.WritePool(weaponCount: 40, talismanCount: 30, aowCount: 30,
                     tearCount: 20, greatRuneCount: 5);

        var r = new ShopRollGenerator(new ShopRollGeneratorOptions
        {
            Seed = "great-rune-check",
            ShopPoolPath = fx.PoolPath,
        }).Generate(Path.Combine(fx.Root, "gr"));

        using var doc = JsonDocument.Parse(File.ReadAllBytes(r.TierRewardsPath));
        var tiers = doc.RootElement.GetProperty("tiers").EnumerateArray().ToList();
        Assert.Equal(9, tiers.Count);

        var runeIdsSeen = new List<int>();
        int luckyTierCount = 0;
        int totalSlots = 0;

        foreach (var tier in tiers)
        {
            int tierNum = tier.GetProperty("tier").GetInt32();
            var slots = tier.GetProperty("slots").EnumerateArray().ToList();

            // (a) per-tier count invariant
            Assert.InRange(slots.Count, 7, 8);

            // First 7 slots are always the base structure (same cost).
            for (int s = 0; s < 7; s++)
            {
                Assert.NotEqual("great_rune", slots[s].GetProperty("kind").GetString());
                // (c) base slots always cost 1 amber shard
                Assert.Equal(1, slots[s].GetProperty("cost_amber_shards").GetInt32());
            }

            if (slots.Count == 8)
            {
                var rune = slots[7];
                luckyTierCount++;
                // (b) kind and cost
                Assert.Equal("great_rune", rune.GetProperty("kind").GetString());
                Assert.Equal(3, rune.GetProperty("cost_amber_shards").GetInt32());
                // shop_id continues the 8000000 + tier*100 + slot scheme
                Assert.Equal(8000000 + tierNum * 100 + 7, rune.GetProperty("shop_id").GetInt32());
                runeIdsSeen.Add(rune.GetProperty("param_id").GetInt32());
            }

            totalSlots += slots.Count;
        }

        // (d) global uniqueness: all rune param_ids are distinct.
        Assert.Equal(runeIdsSeen.Count, runeIdsSeen.Distinct().Count());

        // (e) lucky count clamped to pool size (5 runes available).
        Assert.InRange(luckyTierCount, 0, 5);

        // Total slot count consistency: 63 base + lucky bonus.
        Assert.Equal(63 + luckyTierCount, totalSlots);
        Assert.Equal(totalSlots, r.SlotCount);
    }

    [Fact]
    public void Generate_WithGreatRunes_DeterministicAcrossRuns()
    {
        // Same seed + same pool (including runes) → byte-identical output.
        // Catches regression where the Great Rune RNG stream accidentally
        // pulls from a shared mutable buffer.
        using var fx = new TempPoolFixture();
        fx.WritePool(weaponCount: 40, talismanCount: 30, aowCount: 30,
                     tearCount: 20, greatRuneCount: 5);
        var opts = new ShopRollGeneratorOptions
        {
            Seed = "great-rune-determinism",
            ShopPoolPath = fx.PoolPath,
        };
        var r1 = new ShopRollGenerator(opts).Generate(Path.Combine(fx.Root, "a"));
        var r2 = new ShopRollGenerator(opts).Generate(Path.Combine(fx.Root, "b"));
        Assert.Equal(r1.Fingerprint, r2.Fingerprint);
        Assert.Equal(r1.SlotCount, r2.SlotCount);
    }

    [Fact]
    public void Generate_WithinTier_NoDuplicateItemsInSameCategory()
    {
        // Sample-without-replacement contract: a single tier never shows the
        // same weapon twice (etc.). Across tiers items may repeat — that's
        // intentional and not asserted here.
        using var fx = new TempPoolFixture();
        fx.WriteDefaultPool();
        var r = new ShopRollGenerator(new ShopRollGeneratorOptions
        {
            Seed = "uniqueness-check",
            ShopPoolPath = fx.PoolPath,
        }).Generate(Path.Combine(fx.Root, "u"));

        using var doc = JsonDocument.Parse(File.ReadAllBytes(r.TierRewardsPath));
        foreach (var tier in doc.RootElement.GetProperty("tiers").EnumerateArray())
        {
            var groups = tier.GetProperty("slots").EnumerateArray()
                .GroupBy(s => s.GetProperty("kind").GetString())
                .ToList();
            foreach (var g in groups)
            {
                var ids = g.Select(s => s.GetProperty("param_id").GetInt32()).ToList();
                Assert.Equal(ids.Count, ids.Distinct().Count());
            }
        }
    }

    [Fact]
    public void Generate_PoolBelowMinimumSize_ThrowsLoudly()
    {
        using var fx = new TempPoolFixture();
        // Only 17 weapons in pool but global-uniqueness floor is 2 * 9 = 18
        // → should fail at BuildPlan, not silently emit a malformed plan.
        fx.WritePool(weaponCount: 17, talismanCount: 18, aowCount: 18, tearCount: 9);

        var ex = Assert.Throws<InvalidDataException>(() =>
            new ShopRollGenerator(new ShopRollGeneratorOptions
            {
                Seed = "too-small",
                ShopPoolPath = fx.PoolPath,
            }).Generate(Path.Combine(fx.Root, "x")));

        Assert.Contains("weapons", ex.Message);
    }

    [Fact]
    public void BuildPlan_IsPureFunction_NoIO()
    {
        // Direct call into the in-memory builder — useful for downstream
        // callers (regulation patcher, EMEVD patcher) that want the plan
        // without touching disk. Same seed → identical canonical bytes.
        var pool = MakePool(weaponCount: 20, talismanCount: 20, aowCount: 20, tearCount: 10);
        var p1 = ShopRollGenerator.BuildPlan("pure-fn-seed", pool);
        var p2 = ShopRollGenerator.BuildPlan("pure-fn-seed", pool);

        byte[] b1 = CanonicalJsonWriter.Serialize(ShopRollGenerator.ToCanonicalDict(p1));
        byte[] b2 = CanonicalJsonWriter.Serialize(ShopRollGenerator.ToCanonicalDict(p2));
        Assert.Equal(b1, b2);
    }

    // ------------------------------------------------------------------
    // Fixture helpers
    // ------------------------------------------------------------------

    private static ShopPoolFile MakePool(
        int weaponCount, int talismanCount, int aowCount, int tearCount,
        int greatRuneCount = 0, int headArmorCount = 0)
    {
        return new ShopPoolFile
        {
            SchemaVersion = 1,
            DomainTag = "kale_shop_tier",
            Pools = new ShopPools
            {
                Weapons = Enumerable.Range(0, weaponCount)
                    .Select(i => new WeaponPoolEntry { ParamId = 2000000 + i * 1000, Name = $"W{i}" }).ToList(),
                Talismans = Enumerable.Range(0, talismanCount)
                    .Select(i => new TalismanPoolEntry { ParamId = 1000 + i, Name = $"T{i}" }).ToList(),
                AshOfWar = Enumerable.Range(0, aowCount)
                    .Select(i => new AshOfWarPoolEntry { ParamId = 10000 + i * 100, Name = $"A{i}" }).ToList(),
                CrystalTears = Enumerable.Range(0, tearCount)
                    .Select(i => new CrystalTearPoolEntry { ParamId = 10100 + i, Name = $"Tear{i}" }).ToList(),
                GreatRunes = Enumerable.Range(0, greatRuneCount)
                    .Select(i => new GreatRunePoolEntry { ParamId = 191 + i, Name = $"Rune{i}" }).ToList(),
                HeadArmor = Enumerable.Range(0, headArmorCount)
                    .Select(i => new HeadArmorPoolEntry { ParamId = 100000 + i * 1000, Name = $"H{i}" }).ToList(),
            },
            Exclusions = new ShopExclusions(),
        };
    }

    // =========================================================================
    // Head armor: per-talisman-slot 50/50 coin tests
    // =========================================================================

    [Fact]
    public void HeadArmor_EmptyPool_PreservesPreFeatureBehavior()
    {
        // Empty head_armor pool ⇒ no coin RNG instantiated, talisman cursor
        // advances 2 per tier exactly as before. Plans built with and without
        // the HeadArmor field present must be byte-identical.
        var poolNoArmor    = MakePool(20, 20, 20, 10);
        var poolEmptyArmor = MakePool(20, 20, 20, 10, headArmorCount: 0);
        var p1 = ShopRollGenerator.BuildPlan("hh-empty-seed", poolNoArmor);
        var p2 = ShopRollGenerator.BuildPlan("hh-empty-seed", poolEmptyArmor);

        byte[] b1 = CanonicalJsonWriter.Serialize(ShopRollGenerator.ToCanonicalDict(p1));
        byte[] b2 = CanonicalJsonWriter.Serialize(ShopRollGenerator.ToCanonicalDict(p2));
        Assert.Equal(b1, b2);

        // Sanity: every talisman slot in p1 is Kind=Talisman, never HeadArmor.
        foreach (var t in p1.Tiers)
        {
            int talismanSlots = t.Slots.Count(s => s.Kind == ShopSlotKinds.Talisman);
            int armorSlots = t.Slots.Count(s => s.Kind == ShopSlotKinds.HeadArmor);
            Assert.Equal(2, talismanSlots);
            Assert.Equal(0, armorSlots);
        }
    }

    [Fact]
    public void HeadArmor_NonEmptyPool_MixesArmorAndTalismansAcrossTiers()
    {
        // Pool sized to never exhaust at 50/50 + 18 slots even in worst case.
        var pool = MakePool(20, 20, 20, 10, headArmorCount: 18);
        var plan = ShopRollGenerator.BuildPlan("hh-mix-seed", pool);

        int talismanCount = 0, armorCount = 0;
        foreach (var t in plan.Tiers)
        {
            foreach (var s in t.Slots)
            {
                if (s.Kind == ShopSlotKinds.Talisman) talismanCount++;
                else if (s.Kind == ShopSlotKinds.HeadArmor) armorCount++;
            }
        }
        // 18 talisman-slot positions across tiers; expect ~9/9 split, but
        // any seed that lands fully one-sided would still satisfy
        // talismanCount + armorCount == 18.
        Assert.Equal(18, talismanCount + armorCount);
        // Reasonable variance band around expected 9 — the SHAKE-based RNG
        // is deterministic, so this seed should reliably land in [4, 14].
        Assert.InRange(armorCount, 1, 17);
    }

    [Fact]
    public void HeadArmor_Determinism_SameSeedSamePlan()
    {
        var pool = MakePool(20, 20, 20, 10, headArmorCount: 18);
        var p1 = ShopRollGenerator.BuildPlan("hh-determ-seed", pool);
        var p2 = ShopRollGenerator.BuildPlan("hh-determ-seed", pool);

        byte[] b1 = CanonicalJsonWriter.Serialize(ShopRollGenerator.ToCanonicalDict(p1));
        byte[] b2 = CanonicalJsonWriter.Serialize(ShopRollGenerator.ToCanonicalDict(p2));
        Assert.Equal(b1, b2);
    }

    [Fact]
    public void HeadArmor_DifferentSeeds_ProduceDifferentCategorySplits()
    {
        var pool = MakePool(20, 20, 20, 10, headArmorCount: 18);
        var pA = ShopRollGenerator.BuildPlan("hh-seed-A", pool);
        var pB = ShopRollGenerator.BuildPlan("hh-seed-B", pool);

        // Either the per-slot Kind sequence differs, or the param_id sequence
        // does. With 18 independent coin flips + two independent shuffles,
        // probability of byte-identical output across distinct seeds is ~0.
        bool anyDiff = false;
        for (int t = 0; t < pA.Tiers.Count && !anyDiff; t++)
        {
            for (int s = 0; s < pA.Tiers[t].Slots.Count && !anyDiff; s++)
            {
                var a = pA.Tiers[t].Slots[s];
                var b = pB.Tiers[t].Slots[s];
                if (a.Kind != b.Kind || a.ParamId != b.ParamId) anyDiff = true;
            }
        }
        Assert.True(anyDiff);
    }

    [Fact]
    public void HeadArmor_ArmorRowsMapToProtectorEquipType()
    {
        // Belt-and-braces against a regression in MapEquipType: a plan with
        // HeadArmor slots must round-trip through RegulationPatcher's
        // equipType mapping as 1 (Protector). We test the mapping directly
        // since the patcher itself needs a real regulation.bin — out of
        // scope for a unit test.
        var pool = MakePool(20, 20, 20, 10, headArmorCount: 18);
        var plan = ShopRollGenerator.BuildPlan("hh-equiptype-seed", pool);

        bool sawArmor = false;
        foreach (var t in plan.Tiers)
        {
            foreach (var s in t.Slots)
            {
                if (s.Kind == ShopSlotKinds.HeadArmor)
                {
                    Assert.Equal(
                        BossRush.Core.Patching.RegulationConstants.ShopEquipTypeProtector,
                        BossRush.Core.Patching.RegulationPatcher.MapEquipType(s.Kind));
                    sawArmor = true;
                }
            }
        }
        Assert.True(sawArmor, "Test seed produced 0 armor rolls — pick a different seed.");
    }

    [Fact]
    public void HeadArmor_PoolExhausted_ThrowsClearly()
    {
        // 1-entry head_armor pool with a seed that's almost guaranteed to
        // roll 'armor' more than once across 18 coin flips. Any seed that
        // lands ≥2 armor coins exhausts the pool → throw.
        var pool = MakePool(20, 20, 20, 10, headArmorCount: 1);
        // Try several seeds; the first one that actually exhausts is enough.
        // Worst case (all 18 talisman) is rare but possible — loop until
        // we confirm at least one seed exhausts.
        bool sawExhaustion = false;
        foreach (var seed in new[] { "ex-A", "ex-B", "ex-C", "ex-D", "ex-E" })
        {
            try
            {
                ShopRollGenerator.BuildPlan(seed, pool);
            }
            catch (InvalidDataException ex) when (ex.Message.Contains("'head_armor' pool exhausted"))
            {
                sawExhaustion = true;
                break;
            }
        }
        Assert.True(sawExhaustion, "No seed in 5 tries exhausted a 1-entry head_armor pool — extend the seed list or check the throw path.");
    }

    private sealed class TempPoolFixture : IDisposable
    {
        public string Root { get; }
        public string PoolPath => Path.Combine(Root, "shop_pool.json");

        public TempPoolFixture()
        {
            Root = Path.Combine(Path.GetTempPath(),
                "bossrush-shop-tests-" + Guid.NewGuid().ToString("N"));
            Directory.CreateDirectory(Root);
        }

        public void WriteDefaultPool() =>
            // Sized generously above the 18/18/18/9 global-uniqueness floor so
            // (a) floor-check passes, (b) two distinct seeds have combinatorially
            // many distinct orderings (the variability test needs this).
            // No great_runes by default — structure test asserts the
            // baseline 7-slots-per-tier shape, and the new-feature test
            // (Generate_WithGreatRunes_...) overrides this explicitly.
            WritePool(weaponCount: 40, talismanCount: 30, aowCount: 30, tearCount: 20);

        public void WritePool(
            int weaponCount, int talismanCount, int aowCount, int tearCount,
            int greatRuneCount = 0)
        {
            var pool = MakePool(weaponCount, talismanCount, aowCount, tearCount, greatRuneCount);
            // Use System.Text.Json for fixture writing — we don't need
            // canonical bytes for the input, only for the output we compare.
            var poolDict = new
            {
                schema_version = pool.SchemaVersion,
                domain_tag = pool.DomainTag,
                pools = new
                {
                    weapons = pool.Pools.Weapons.Select(w => new {
                        equipParamWeapon_id = w.ParamId, name = w.Name, default_upgrade = w.DefaultUpgrade
                    }).ToArray(),
                    talismans = pool.Pools.Talismans.Select(t => new {
                        equipParamAccessory_id = t.ParamId, name = t.Name
                    }).ToArray(),
                    ash_of_war = pool.Pools.AshOfWar.Select(a => new {
                        equipParamGem_id = a.ParamId, name = a.Name
                    }).ToArray(),
                    crystal_tears = pool.Pools.CrystalTears.Select(c => new {
                        equipParamGoods_id = c.ParamId, name = c.Name
                    }).ToArray(),
                    great_runes = pool.Pools.GreatRunes.Select(r => new {
                        equipParamGoods_id = r.ParamId, name = r.Name
                    }).ToArray(),
                },
                exclusions = new {
                    weapons = Array.Empty<int>(),
                    talismans = Array.Empty<int>(),
                    ash_of_war = Array.Empty<int>(),
                    crystal_tears = Array.Empty<int>(),
                    great_runes = Array.Empty<int>(),
                },
            };
            File.WriteAllText(PoolPath, JsonSerializer.Serialize(poolDict));
        }

        public void Dispose()
        {
            try { Directory.Delete(Root, recursive: true); }
            catch { /* best-effort cleanup */ }
        }
    }
}
