// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Buffers.Binary;
using System.Collections.Generic;
using System.Linq;
using IgniteBossRush.Core.Patching;
using SoulsFormats;
using Xunit;

namespace IgniteBossRush.Tests;

/// <summary>
/// Unit tests for the Roundtable Hold care-package feature:
/// <see cref="CarePackagePicker"/>, <see cref="CarePackageEventBuilder"/>,
/// and <see cref="RoundtableCarePackageSplicer"/>.
///
/// Tests use synthetic in-memory EMEVDs so they don't depend on the
/// real source-mod fixture being present at any particular path.
/// </summary>
public class RoundtableCarePackageSplicerTests
{
    // ---- Test pool source: 50 ids per slot, in a known stable order ----
    private sealed class FakePool : IArmorPoolSource
    {
        private readonly Dictionary<ArmorSlot, IReadOnlyList<int>> _ids;
        public FakePool(int perSlot = 50)
        {
            _ids = new Dictionary<ArmorSlot, IReadOnlyList<int>>
            {
                [ArmorSlot.Head]  = Enumerable.Range(0, perSlot).Select(i => 100_000 + i).ToArray(),
                [ArmorSlot.Chest] = Enumerable.Range(0, perSlot).Select(i => 200_000 + i).ToArray(),
                [ArmorSlot.Arms]  = Enumerable.Range(0, perSlot).Select(i => 300_000 + i).ToArray(),
                [ArmorSlot.Legs]  = Enumerable.Range(0, perSlot).Select(i => 400_000 + i).ToArray(),
            };
        }
        public IReadOnlyList<int> GetIds(ArmorSlot slot) => _ids[slot];
    }

    // ===================================================================
    // CarePackagePicker
    // ===================================================================
    [Fact]
    public void Picker_Produces_FiveUniqueIdsPerSlot()
    {
        var pool = new FakePool();
        var roll = CarePackagePicker.Pick(pool, "test-seed");

        Assert.Equal(RoundtableCarePackageConstants.ItemsPerSlot, roll.Head.Count);
        Assert.Equal(RoundtableCarePackageConstants.ItemsPerSlot, roll.Chest.Count);
        Assert.Equal(RoundtableCarePackageConstants.ItemsPerSlot, roll.Arms.Count);
        Assert.Equal(RoundtableCarePackageConstants.ItemsPerSlot, roll.Legs.Count);

        Assert.Equal(roll.Head.Count, roll.Head.Distinct().Count());
        Assert.Equal(roll.Chest.Count, roll.Chest.Distinct().Count());
        Assert.Equal(roll.Arms.Count, roll.Arms.Distinct().Count());
        Assert.Equal(roll.Legs.Count, roll.Legs.Distinct().Count());
    }

    [Fact]
    public void Picker_PicksFromCorrectSlotPool()
    {
        var pool = new FakePool();
        var roll = CarePackagePicker.Pick(pool, "test-seed");

        Assert.All(roll.Head,  id => Assert.InRange(id, 100_000, 199_999));
        Assert.All(roll.Chest, id => Assert.InRange(id, 200_000, 299_999));
        Assert.All(roll.Arms,  id => Assert.InRange(id, 300_000, 399_999));
        Assert.All(roll.Legs,  id => Assert.InRange(id, 400_000, 499_999));
    }

    [Fact]
    public void Picker_IsDeterministic_AcrossRuns()
    {
        var pool = new FakePool();
        var rollA = CarePackagePicker.Pick(pool, "seed-deadbeef-cafef00d");
        var rollB = CarePackagePicker.Pick(pool, "seed-deadbeef-cafef00d");

        Assert.Equal(rollA.Head, rollB.Head);
        Assert.Equal(rollA.Chest, rollB.Chest);
        Assert.Equal(rollA.Arms, rollB.Arms);
        Assert.Equal(rollA.Legs, rollB.Legs);
    }

    [Fact]
    public void Picker_DifferentSeeds_ProduceDifferentRolls()
    {
        var pool = new FakePool();
        var rollA = CarePackagePicker.Pick(pool, "seed-A");
        var rollB = CarePackagePicker.Pick(pool, "seed-B");

        // Probability of byte-identical 20-element pick across two seeds is
        // negligible — if this fails, the seed isn't influencing the RNG.
        bool anyDiffer =
            !rollA.Head.SequenceEqual(rollB.Head) ||
            !rollA.Chest.SequenceEqual(rollB.Chest) ||
            !rollA.Arms.SequenceEqual(rollB.Arms) ||
            !rollA.Legs.SequenceEqual(rollB.Legs);
        Assert.True(anyDiffer);
    }

    [Fact]
    public void Picker_FailsLoud_WhenSlotPoolTooSmall()
    {
        var pool = new FakePool(perSlot: 3); // less than ItemsPerSlot=5
        Assert.Throws<InvalidOperationException>(
            () => CarePackagePicker.Pick(pool, "seed"));
    }

    // ===================================================================
    // CarePackageEventBuilder
    // ===================================================================
    [Fact]
    public void EventBuilder_Produces_Event11105800_WithExpectedShape()
    {
        var roll = CarePackagePicker.Pick(new FakePool(), "seed");
        EMEVD.Event ev = CarePackageEventBuilder.BuildEvent(roll);

        Assert.Equal(RoundtableCarePackageConstants.CarePackageEventId, (uint)ev.ID);
        Assert.Equal(EMEVD.Event.RestBehaviorType.Default, ev.RestBehavior);

        // [0] EndIfEventFlag(guard) + [1] Wait + [2] SetEventFlag(guard)
        // + [3..22] 20× DirectlyGivePlayerItem
        Assert.Equal(3 + RoundtableCarePackageConstants.TotalItems, ev.Instructions.Count);

        // [0] EndIf(EventFlag(OneShotGuardFlag))
        Assert.Equal(PatchConstants.BankControlFlowEvent, ev.Instructions[0].Bank);
        Assert.Equal(PatchConstants.IdEndIfEventFlag, ev.Instructions[0].ID);
        Assert.Equal(PatchConstants.FlagTypeEventFlag, ev.Instructions[0].ArgData[2]);
        uint guardFlagAtEndIf = BinaryPrimitives.ReadUInt32LittleEndian(
            ev.Instructions[0].ArgData.AsSpan(4, 4));
        Assert.Equal(RoundtableCarePackageConstants.OneShotGuardFlag, guardFlagAtEndIf);

        // [1] WaitFixedTimeSeconds
        Assert.Equal(PatchConstants.BankWait, ev.Instructions[1].Bank);
        Assert.Equal(PatchConstants.IdWaitFixedTimeSeconds, ev.Instructions[1].ID);

        // [2] SetEventFlag(OneShotGuardFlag, ON)
        Assert.Equal(PatchConstants.BankEvent, ev.Instructions[2].Bank);
        Assert.Equal(PatchConstants.IdSetEventFlag, ev.Instructions[2].ID);
        Assert.Equal(PatchConstants.FlagTypeEventFlag, ev.Instructions[2].ArgData[0]);
        uint guardFlagAtSet = BinaryPrimitives.ReadUInt32LittleEndian(
            ev.Instructions[2].ArgData.AsSpan(4, 4));
        Assert.Equal(RoundtableCarePackageConstants.OneShotGuardFlag, guardFlagAtSet);
        Assert.Equal(PatchConstants.FlagStateOn, ev.Instructions[2].ArgData[8]);

        // [3..22] 20× DirectlyGivePlayerItem
        for (int i = 0; i < RoundtableCarePackageConstants.TotalItems; i++)
        {
            var ins = ev.Instructions[3 + i];
            Assert.Equal(PatchConstants.BankEvent, ins.Bank);
            Assert.Equal(PatchConstants.IdDirectlyGivePlayerItem, ins.ID);

            uint type = BinaryPrimitives.ReadUInt32LittleEndian(ins.ArgData.AsSpan(0, 4));
            uint flag = BinaryPrimitives.ReadUInt32LittleEndian(ins.ArgData.AsSpan(8, 4));
            uint count = BinaryPrimitives.ReadUInt32LittleEndian(ins.ArgData.AsSpan(12, 4));

            Assert.Equal(PatchConstants.ItemTypeArmor, (byte)type);
            Assert.Equal(RoundtableCarePackageConstants.SharedGiveFlagId, flag);
            Assert.Equal(1u, count);
        }
    }

    [Fact]
    public void EventBuilder_GiveOrder_IsHeadChestArmsLegs()
    {
        var pool = new FakePool();
        var roll = CarePackagePicker.Pick(pool, "seed");
        EMEVD.Event ev = CarePackageEventBuilder.BuildEvent(roll);

        var giveIds = new List<int>();
        for (int i = 0; i < RoundtableCarePackageConstants.TotalItems; i++)
        {
            // Gives sit at indices [3..22] (after EndIf, Wait, SetFlag).
            uint id = BinaryPrimitives.ReadUInt32LittleEndian(
                ev.Instructions[3 + i].ArgData.AsSpan(4, 4));
            giveIds.Add((int)id);
        }

        var expected = roll.Head.Concat(roll.Chest)
                               .Concat(roll.Arms)
                               .Concat(roll.Legs)
                               .ToList();
        Assert.Equal(expected, giveIds);
    }

    // ===================================================================
    // RoundtableCarePackageSplicer
    // ===================================================================
    private static EMEVD BuildFakeM11_10_WithConstructor()
    {
        var emevd = new EMEVD();
        var constructor = new EMEVD.Event(
            id: RoundtableCarePackageConstants.ConstructorEventId,
            restBehavior: EMEVD.Event.RestBehaviorType.Default);
        // A few existing $InitializeEvent / sentinel calls — the splicer
        // should append at the end without disturbing them.
        constructor.Instructions.Add(InstructionFactory.InitializeCommonEvent(0, 90005790u));
        constructor.Instructions.Add(InstructionFactory.InitializeEvent(0, 11105555u));
        constructor.Instructions.Add(InstructionFactory.InitializeEvent(0, 11107798u));
        emevd.Events.Add(constructor);
        return emevd;
    }

    [Fact]
    public void Splicer_FreshApply_InsertsEvent_AndAppendsTrigger()
    {
        var emevd = BuildFakeM11_10_WithConstructor();
        var roll = CarePackagePicker.Pick(new FakePool(), "seed");
        int constructorBefore = emevd.Events[0].Instructions.Count;

        var result = RoundtableCarePackageSplicer.Apply(emevd, roll);

        Assert.True(result.EventInserted);
        Assert.False(result.EventAlreadyPresent);
        Assert.True(result.TriggerInserted);
        Assert.False(result.TriggerAlreadyPresent);
        Assert.Equal(RoundtableCarePackageConstants.TotalItems, result.ItemsGranted);

        // New event present.
        Assert.Contains(emevd.Events,
            e => e.ID == RoundtableCarePackageConstants.CarePackageEventId);

        // Constructor grew by exactly one and the new instruction is at the tail.
        Assert.Equal(constructorBefore + 1, emevd.Events[0].Instructions.Count);
        var tail = emevd.Events[0].Instructions[constructorBefore];
        Assert.Equal(PatchConstants.BankSystem, tail.Bank);
        Assert.Equal(PatchConstants.IdInitializeEvent, tail.ID);
        uint target = BinaryPrimitives.ReadUInt32LittleEndian(tail.ArgData.AsSpan(4, 4));
        Assert.Equal(RoundtableCarePackageConstants.CarePackageEventId, target);
    }

    [Fact]
    public void Splicer_ReApply_DefaultsToIdempotent()
    {
        var emevd = BuildFakeM11_10_WithConstructor();
        var roll = CarePackagePicker.Pick(new FakePool(), "seed");

        RoundtableCarePackageSplicer.Apply(emevd, roll);
        int eventCountAfterFirst = emevd.Events.Count;
        int ctorCountAfterFirst = emevd.Events[0].Instructions.Count;

        var second = RoundtableCarePackageSplicer.Apply(emevd, roll);

        Assert.False(second.EventInserted);
        Assert.True(second.EventAlreadyPresent);
        Assert.False(second.TriggerInserted);
        Assert.True(second.TriggerAlreadyPresent);

        Assert.Equal(eventCountAfterFirst, emevd.Events.Count);
        Assert.Equal(ctorCountAfterFirst, emevd.Events[0].Instructions.Count);
    }

    [Fact]
    public void Splicer_ReApply_WithOverwrite_ReplacesEventBody()
    {
        var emevd = BuildFakeM11_10_WithConstructor();
        var rollA = CarePackagePicker.Pick(new FakePool(), "seed-A");
        var rollB = CarePackagePicker.Pick(new FakePool(), "seed-B");

        RoundtableCarePackageSplicer.Apply(emevd, rollA);
        var second = RoundtableCarePackageSplicer.Apply(
            emevd, rollB,
            new RoundtableCarePackageSplicerOptions { OverwriteExistingEvent = true });

        Assert.True(second.EventInserted);
        Assert.True(second.TriggerAlreadyPresent);

        // The replaced event body should reflect rollB ids.
        // Layout: [0]=EndIfEventFlag, [1]=Wait, [2]=SetEventFlag, [3]=first give, ...
        var replaced = emevd.Events.Single(
            e => e.ID == RoundtableCarePackageConstants.CarePackageEventId);
        uint firstGiveId = BinaryPrimitives.ReadUInt32LittleEndian(
            replaced.Instructions[3].ArgData.AsSpan(4, 4));
        Assert.Equal((uint)rollB.Head[0], firstGiveId);
    }

    [Fact]
    public void Splicer_FailsLoud_When_ConstructorEventMissing()
    {
        var emevd = new EMEVD(); // no events at all
        var roll = CarePackagePicker.Pick(new FakePool(), "seed");
        Assert.Throws<InvalidOperationException>(
            () => RoundtableCarePackageSplicer.Apply(emevd, roll));
    }

    [Fact]
    public void Splicer_RoundTripsThroughEmevdWriteRead()
    {
        var emevd = BuildFakeM11_10_WithConstructor();
        var roll = CarePackagePicker.Pick(new FakePool(), "round-trip-seed");
        RoundtableCarePackageSplicer.Apply(emevd, roll);

        // Serialise-deserialise — the only meaningful test that the bytecode
        // we synthesised doesn't trip SoulsFormats' writer or reader.
        byte[] bytes = emevd.Write();
        EMEVD reloaded = EMEVD.Read(bytes);

        var careEv = reloaded.Events.Single(
            e => e.ID == RoundtableCarePackageConstants.CarePackageEventId);
        Assert.Equal(3 + RoundtableCarePackageConstants.TotalItems, careEv.Instructions.Count);

        // Last instruction is the last give (Legs[4]); the SetEventFlag now
        // sits at index [2] before the give chain.
        uint lastId = BinaryPrimitives.ReadUInt32LittleEndian(
            careEv.Instructions[^1].ArgData.AsSpan(4, 4));
        Assert.Equal((uint)roll.Legs[^1], lastId);
    }
}

/// <summary>
/// Smoke tests for <see cref="SmithboxArmorPoolSource"/> using a tiny
/// hand-written JSON fixture. Doesn't load the real source mod's file —
/// PipelineRunnerTests cover the integration path.
/// </summary>
public class SmithboxArmorPoolSourceTests
{
    private static string WriteTempJson(string content)
    {
        string path = System.IO.Path.Combine(
            System.IO.Path.GetTempPath(),
            $"armor-pool-test-{Guid.NewGuid():N}.json");
        System.IO.File.WriteAllText(path, content);
        return path;
    }

    [Fact]
    public void Loads_AndBucketsBy_HundredsDigit_DroppingSlots4Through9()
    {
        // 1000=head, 1100=chest, 1200=arms, 1300=legs, 1400=invalid (slot 4).
        const string json = """
        {
          "Name": "EquipParamProtector",
          "Entries": [
            { "ID": 1000, "Entries": [ "x" ] },
            { "ID": 1100, "Entries": [ "x" ] },
            { "ID": 1200, "Entries": [ "x" ] },
            { "ID": 1300, "Entries": [ "x" ] },
            { "ID": 1400, "Entries": [ "x" ] },
            { "ID": 380000, "Entries": [ "x" ] },
            { "ID": 380100, "Entries": [ "x" ] },
            { "ID": 380200, "Entries": [ "x" ] },
            { "ID": 380300, "Entries": [ "x" ] }
          ]
        }
        """;
        string path = WriteTempJson(json);
        try
        {
            var pool = new SmithboxArmorPoolSource(path);

            Assert.Equal(new[] { 1000, 380000 }, pool.GetIds(ArmorSlot.Head));
            Assert.Equal(new[] { 1100, 380100 }, pool.GetIds(ArmorSlot.Chest));
            Assert.Equal(new[] { 1200, 380200 }, pool.GetIds(ArmorSlot.Arms));
            Assert.Equal(new[] { 1300, 380300 }, pool.GetIds(ArmorSlot.Legs));
            Assert.Equal(8, pool.TotalIds); // 1400 dropped
        }
        finally { System.IO.File.Delete(path); }
    }

    [Fact]
    public void Throws_WhenJsonMissing()
    {
        Assert.Throws<System.IO.FileNotFoundException>(
            () => new SmithboxArmorPoolSource(@"C:\does\not\exist.json"));
    }
}
