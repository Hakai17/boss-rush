// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using IgniteBossRush.Core.Models;
using IgniteBossRush.Core.Patching;
using SoulsFormats;
using Xunit;

namespace IgniteBossRush.Tests;

/// <summary>
/// Unit tests for <see cref="RegulationPatcher"/> that use fabricated BND4s
/// with stub PARAM payloads — so the locator + result-reporting logic is
/// covered even when the real mod regulation.bin isn't available.
///
/// Why fake payloads? The patcher's Phase A layer only inspects binder
/// file <i>names</i>; the bytes inside each PARAM are copied through
/// verbatim. Feeding a placeholder byte array for each required PARAM name
/// is enough to exercise LocateRequiredParams + the result record.
/// </summary>
public class RegulationPatcherTests
{
    // ===================================================================
    // LocateRequiredParams
    // ===================================================================

    [Fact]
    public void LocateRequiredParams_FindsAllThree_EvenWithPathPrefix()
    {
        var bnd = MakeBnd4WithFiles(new[]
        {
            (@"N:\GR\data\Param\param\GameParam\EquipParamGoods.param", new byte[] { 0 }),
            (@"N:\GR\data\Param\param\GameParam\ItemLotParam_map.param", new byte[] { 0 }),
            (@"N:\GR\data\Param\param\GameParam\ShopLineupParam.param", new byte[] { 0 }),
            (@"N:\GR\data\Param\param\GameParam\UnrelatedParam.param", new byte[] { 0 }),
        });

        var located = RegulationPatcher.LocateRequiredParams(bnd);
        Assert.NotNull(located.EquipParamGoods);
        Assert.NotNull(located.ItemLotParamMap);
        Assert.NotNull(located.ShopLineupParam);
        Assert.EndsWith("EquipParamGoods.param", located.EquipParamGoods.Name, StringComparison.Ordinal);
    }

    [Fact]
    public void LocateRequiredParams_MatchesBasenameEvenIfPrefixChanges()
    {
        // Simulate a regional release that moved the param folder. Only the
        // basename should matter.
        var bnd = MakeBnd4WithFiles(new[]
        {
            (@"ALT:\different\path\EquipParamGoods.param", new byte[] { 0 }),
            (@"ALT:\different\path\ItemLotParam_map.param", new byte[] { 0 }),
            (@"ALT:\different\path\ShopLineupParam.param", new byte[] { 0 }),
        });

        var located = RegulationPatcher.LocateRequiredParams(bnd);
        Assert.NotNull(located.EquipParamGoods);
        Assert.NotNull(located.ItemLotParamMap);
        Assert.NotNull(located.ShopLineupParam);
    }

    [Fact]
    public void LocateRequiredParams_MissingPARAM_ThrowsWithListOfMissing()
    {
        var bnd = MakeBnd4WithFiles(new[]
        {
            // EquipParamGoods intentionally omitted — the patcher must refuse
            // to run rather than silently skip the Amber Shard goods row.
            (@"N:\GameParam\ItemLotParam_map.param", new byte[] { 0 }),
            (@"N:\GameParam\ShopLineupParam.param", new byte[] { 0 }),
        });

        var ex = Assert.Throws<InvalidOperationException>(
            () => RegulationPatcher.LocateRequiredParams(bnd));
        Assert.Contains("EquipParamGoods", ex.Message);
    }

    [Fact]
    public void LocateRequiredParams_DuplicateParamFile_FirstWins()
    {
        var first = new byte[] { 0xAA };
        var second = new byte[] { 0xBB };
        var bnd = MakeBnd4WithFiles(new[]
        {
            (@"N:\GameParam\EquipParamGoods.param", first),
            (@"N:\GameParam\EquipParamGoods.param", second),
            (@"N:\GameParam\ItemLotParam_map.param", new byte[] { 0 }),
            (@"N:\GameParam\ShopLineupParam.param", new byte[] { 0 }),
        });

        var located = RegulationPatcher.LocateRequiredParams(bnd);
        // First-wins matches the Python reference + EmevdPatcher's
        // "first occurrence wins" duplicate semantics.
        Assert.Same(bnd.Files[0], located.EquipParamGoods);
        Assert.Equal(first, located.EquipParamGoods.Bytes);
    }

    // ===================================================================
    // RegulationConstants — row-id derivation
    // ===================================================================

    [Theory]
    [InlineData(1, 0, 8000100)]
    [InlineData(1, 6, 8000106)]
    [InlineData(5, 3, 8000503)]
    [InlineData(9, 0, 8000900)]
    [InlineData(9, 6, 8000906)]
    public void ShopLineupRowId_UsesBasePlusTierStridePlusSlotIndex(int tier, int slot, int expected)
    {
        Assert.Equal(expected, RegulationConstants.ShopLineupRowId(tier, slot));
    }

    [Theory]
    [InlineData(0, 0)]         // below FirstTier
    [InlineData(10, 0)]        // above LastTier
    [InlineData(1, -1)]        // slot below range
    [InlineData(1, 8)]         // slot above range (0..7 inclusive — index 7 is
                               // the Great Rune bonus slot, index 8 is out)
    public void ShopLineupRowId_OutOfRange_Throws(int tier, int slot)
    {
        Assert.Throws<ArgumentOutOfRangeException>(
            () => RegulationConstants.ShopLineupRowId(tier, slot));
    }

    [Theory]
    [InlineData(1, 9000001)]
    [InlineData(5, 9000005)]
    [InlineData(9, 9000009)]
    public void ShardAwardLotId_IsBasePlusTier(int tier, int expected)
    {
        Assert.Equal(expected, RegulationConstants.ShardAwardLotId(tier));
    }

    [Fact]
    public void RegulationConstants_CrossCheckWithTierClearConstants()
    {
        // Catch base-value drift: if TierClearConstants changes the Amber
        // Shard id or shard-lot base without updating this file, the EMEVD
        // and regulation layers disagree and shards are awarded into a
        // non-existent goods row. Keep this assertion in place as the trip
        // wire.
        Assert.Equal(TierClearConstants.AmberShardGoodsId, RegulationConstants.AmberShardGoodsId);
        Assert.Equal(TierClearConstants.ShardAwardItemLotBase, RegulationConstants.ShardAwardItemLotBase);
    }

    // ===================================================================
    // Apply — option & error plumbing
    // ===================================================================

    [Fact]
    public void Apply_MissingSourceFile_Throws()
    {
        string bogus = Path.Combine(Path.GetTempPath(), "does-not-exist-" + Guid.NewGuid().ToString("N") + ".bin");
        string outPath = Path.Combine(Path.GetTempPath(), "ignite-out-" + Guid.NewGuid().ToString("N") + ".bin");

        var patcher = new RegulationPatcher(new RegulationPatcherOptions
        {
            SourceRegulationPath = bogus,
            OutputRegulationPath = outPath,
        });
        Assert.Throws<FileNotFoundException>(() => patcher.Apply());
    }

    [Fact]
    public void Apply_OutputExistsWithoutForce_Throws()
    {
        // Use an existing file as both source (will fail at decrypt, but that's
        // after the exists-check we want to exercise) and output — we only
        // need the output path to exist to trigger the guard.
        string anyExistingFile = typeof(RegulationPatcherTests).Assembly.Location;
        var patcher = new RegulationPatcher(new RegulationPatcherOptions
        {
            SourceRegulationPath = anyExistingFile,
            OutputRegulationPath = anyExistingFile,
            Force = false,
        });
        Assert.Throws<IOException>(() => patcher.Apply());
    }

    // ===================================================================
    // Phase B — MapEquipType (pure function, shop kind → param byte)
    // ===================================================================

    [Theory]
    [InlineData("weapon",     RegulationConstants.ShopEquipTypeWeapon)]
    [InlineData("talisman",   RegulationConstants.ShopEquipTypeAccessory)]
    [InlineData("ash_of_war", RegulationConstants.ShopEquipTypeGem)]
    [InlineData("tear",       RegulationConstants.ShopEquipTypeGoods)]
    public void MapEquipType_MapsAllFourShopSlotKinds(string kind, byte expected)
    {
        Assert.Equal(expected, RegulationPatcher.MapEquipType(kind));
    }

    [Fact]
    public void MapEquipType_UnknownKind_Throws()
    {
        // Catches typo drift at the JSON boundary — if someone introduces a
        // new ShopSlotKind without updating the mapping, we fail loud
        // instead of silently writing a byte-0 (== Weapon) into every row.
        Assert.Throws<ArgumentException>(
            () => RegulationPatcher.MapEquipType("ring_of_goals"));
    }

    // ===================================================================
    // Phase B — ValidatePlan (gate against spec drift before mutating)
    // ===================================================================

    [Fact]
    public void ValidatePlan_AcceptsWellFormedPlan()
    {
        var plan = MakeMinimalPlan();
        RegulationPatcher.ValidatePlan(plan); // should not throw
    }

    [Theory]
    [InlineData(0)]    // below min — zero-cost slots would be free, a bug
    [InlineData(-1)]   // negative cost is nonsensical
    [InlineData(100)]  // above max — merchant UI can't render 3+ digit prices
    [InlineData(9999)] // well above max
    public void ValidatePlan_RejectsCostOutOfRange(int badCost)
    {
        // Accepted range is [1, 99]. Great Rune slots use 3, base slots
        // use 1, and that's the production usage. This test pins the
        // boundary so a future spec change (e.g. 500-shard runes) has to
        // update both the constants and this assertion.
        var plan = MakeMinimalPlan();
        plan.Tiers[0].Slots[0] = new ShopSlot
        {
            ShopId = plan.Tiers[0].Slots[0].ShopId,
            Kind = plan.Tiers[0].Slots[0].Kind,
            ParamId = plan.Tiers[0].Slots[0].ParamId,
            CostAmberShards = badCost,
        };
        Assert.Throws<NotSupportedException>(() => RegulationPatcher.ValidatePlan(plan));
    }

    [Theory]
    [InlineData(1)]   // baseline base-slot cost
    [InlineData(3)]   // Great Rune cost
    [InlineData(99)]  // upper bound
    public void ValidatePlan_AcceptsCostInRange(int goodCost)
    {
        var plan = MakeMinimalPlan();
        plan.Tiers[0].Slots[0] = new ShopSlot
        {
            ShopId = plan.Tiers[0].Slots[0].ShopId,
            Kind = plan.Tiers[0].Slots[0].Kind,
            ParamId = plan.Tiers[0].Slots[0].ParamId,
            CostAmberShards = goodCost,
        };
        RegulationPatcher.ValidatePlan(plan); // should not throw
    }

    [Fact]
    public void ValidatePlan_RejectsTierWithWrongSlotCount()
    {
        var plan = MakeMinimalPlan();
        plan.Tiers[0].Slots.RemoveAt(0); // 6 slots — below min (7), should reject
        var ex = Assert.Throws<ArgumentException>(() => RegulationPatcher.ValidatePlan(plan));
        Assert.Contains("tier 1", ex.Message);
        // Error message advertises both the baseline (7) and bonus (8) counts
        // so a reader knows why 6 is rejected AND why 8 is allowed.
        Assert.Contains("7", ex.Message);
        Assert.Contains("8", ex.Message);
    }

    [Fact]
    public void ValidatePlan_RejectsEmptyTierList()
    {
        var plan = new TierRewardsPlan
        {
            CompetitionSeed = "test",
            DomainTag = "test",
            Tiers = new List<TierPlan>(),
        };
        Assert.Throws<ArgumentException>(() => RegulationPatcher.ValidatePlan(plan));
    }

    // ===================================================================
    // Phase B — ParamdefLoader (embedded resource retrieval)
    // ===================================================================

    [Theory]
    [InlineData(RegulationConstants.EquipParamGoodsDefXml, "EQUIP_PARAM_GOODS_ST")]
    [InlineData(RegulationConstants.ItemLotParamDefXml,    "ITEMLOT_PARAM_ST")]
    [InlineData(RegulationConstants.ShopLineupParamDefXml, "SHOP_LINEUP_PARAM")]
    public void ParamdefLoader_LoadsEmbeddedXml(string xmlFile, string expectedParamType)
    {
        // Exercises that (a) the csproj correctly embeds the XMLs, (b) the
        // suffix-match lookup resolves the resource, (c) the XML parses
        // cleanly under strict field validation, and (d) the resulting
        // PARAMDEF is for the right param table.
        var def = ParamdefLoader.Load(xmlFile);
        Assert.Equal(expectedParamType, def.ParamType);
        Assert.NotNull(def.Fields);
        Assert.True(def.Fields.Count > 0, "PARAMDEF must have at least one field");
    }

    [Fact]
    public void ParamdefLoader_UnknownXml_ThrowsWithResourceListing()
    {
        var ex = Assert.Throws<InvalidOperationException>(
            () => ParamdefLoader.Load("NotAParamdef.xml"));
        // The diagnostic listing is what helps a future contributor fix
        // the csproj quickly if a file is dropped without an EmbeddedResource
        // entry — assert it's actually emitted.
        Assert.Contains("NotAParamdef.xml", ex.Message);
        Assert.Contains("Known resources", ex.Message);
    }

    [Fact]
    public void ParamdefLoader_Caches_SameInstance()
    {
        // The loader caches per-xml-name so back-to-back Apply() calls don't
        // re-parse the XML. Verify via reference equality: a second Load of
        // the same name must return the same PARAMDEF object.
        var a = ParamdefLoader.Load(RegulationConstants.ShopLineupParamDefXml);
        var b = ParamdefLoader.Load(RegulationConstants.ShopLineupParamDefXml);
        Assert.Same(a, b);
    }

    [Fact]
    public void ShopLineupParamdef_HasAllFieldsWePatch()
    {
        // Tripwire: if Paramdex renames a ShopLineupParam field in a future
        // refresh, this test catches it instead of the mutation silently
        // hitting SetCell's InvalidOperationException deep in a patch run.
        var def = ParamdefLoader.Load(RegulationConstants.ShopLineupParamDefXml);
        var names = new HashSet<string>(def.Fields.Select(f => f.InternalName), StringComparer.Ordinal);
        Assert.Contains(RegulationConstants.ShopLineupField_EquipId,           names);
        Assert.Contains(RegulationConstants.ShopLineupField_EquipType,         names);
        Assert.Contains(RegulationConstants.ShopLineupField_MtrlId,            names);
        Assert.Contains(RegulationConstants.ShopLineupField_EventFlagForStock,   names);
        Assert.Contains(RegulationConstants.ShopLineupField_EventFlagForRelease, names);
        Assert.Contains(RegulationConstants.ShopLineupField_SellQuantity,        names);
        Assert.Contains(RegulationConstants.ShopLineupField_SetNum,            names);
        Assert.Contains(RegulationConstants.ShopLineupField_CostType,          names);
        Assert.Contains(RegulationConstants.ShopLineupField_Value,             names);
    }

    [Fact]
    public void ItemLotParamdef_HasAllFieldsWePatch()
    {
        var def = ParamdefLoader.Load(RegulationConstants.ItemLotParamDefXml);
        var names = new HashSet<string>(def.Fields.Select(f => f.InternalName), StringComparer.Ordinal);
        Assert.Contains(RegulationConstants.ItemLotField_LotItemId01,        names);
        Assert.Contains(RegulationConstants.ItemLotField_LotItemCategory01,  names);
        Assert.Contains(RegulationConstants.ItemLotField_LotItemBasePoint01, names);
        Assert.Contains(RegulationConstants.ItemLotField_LotItemNum01,       names);
        Assert.Contains(RegulationConstants.ItemLotField_GetItemFlagId,      names);
    }

    // ===================================================================
    // Helpers
    // ===================================================================
    /// <summary>
    /// Fabricate an in-memory BND4 with the given (name, bytes) binder entries.
    /// This path bypasses the real regulation.bin AES layer so tests don't
    /// need the (~50 MB, not vendored) mod file.
    /// </summary>
    private static BND4 MakeBnd4WithFiles(IEnumerable<(string name, byte[] bytes)> entries)
    {
        var bnd = new BND4();
        int id = 0;
        foreach (var (name, bytes) in entries)
        {
            bnd.Files.Add(new BinderFile(Binder.FileFlags.Flag1, id++, name, bytes));
        }
        return bnd;
    }

    /// <summary>
    /// Builds a minimal valid 9-tier × 7-slot plan. Shop kinds match the
    /// locked layout (2 weapons, 2 talismans, 2 AoW, 1 tear), param ids
    /// are deterministic placeholders, flags follow the
    /// <see cref="TierClearConstants"/> base+tier scheme.
    /// </summary>
    internal static TierRewardsPlan MakeMinimalPlan()
    {
        var tiers = new List<TierPlan>();
        for (int t = TierClearConstants.FirstTier; t <= TierClearConstants.LastTier; t++)
        {
            var slots = new List<ShopSlot>();
            string[] kinds = new[]
            {
                "weapon", "weapon",
                "talisman", "talisman",
                "ash_of_war", "ash_of_war",
                "tear",
            };
            for (int s = 0; s < kinds.Length; s++)
            {
                slots.Add(new ShopSlot
                {
                    ShopId = RegulationConstants.ShopLineupRowId(t, s),
                    Kind = kinds[s],
                    // Placeholder param ids — unique per (tier, slot) so test
                    // assertions can disambiguate which row got which equipId.
                    ParamId = 1_000_000 + t * 100 + s,
                    CostAmberShards = 1,
                });
            }
            tiers.Add(new TierPlan
            {
                Tier = t,
                TierFlag            = TierClearConstants.TierFlagBase            + t,
                ShopVisibilityFlag  = TierClearConstants.ShopVisibilityFlagBase  + t,
                ShardAwardCount     = RegulationConstants.ShardsPerTierClear,
                ShardAwardEventFlag = TierClearConstants.ShardAwardEventFlagBase + t,
                Slots = slots,
            });
        }
        return new TierRewardsPlan
        {
            CompetitionSeed = "deadbeef",
            DomainTag = "Ignite Rush v3.6.4",
            Tiers = tiers,
        };
    }
}
