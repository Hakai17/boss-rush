// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using System.Linq;
using BossRush.Core.Patching;
using SoulsFormats;
using Xunit;

namespace BossRush.Tests;

/// <summary>
/// Unit tests for <see cref="KaleShopMenuSplicer"/>. Rather than load a real
/// <c>t600001110.esd</c> (which would depend on the user's game files), these
/// tests fabricate a minimal ESD that mirrors just the four states the
/// splicer touches:
///
///   * State 1 = ClearTalkListData sink (target of every new shop state's
///     "menu closed" transition). Contents irrelevant — the splicer only
///     uses its ID as a transition target.
///   * State 2 = EntryCommands list (AddTalkListDataIf entries — the splicer
///     APPENDS nine new entries to this list).
///   * State 4 = Conditions branch table (the splicer INSERTS nine new
///     conditions before the trailing always-true else).
///   * State 9 = template shop state with a 39-byte "menu closed" predicate
///     on its first condition (the splicer CLONES that evaluator verbatim
///     onto each new shop state).
///
/// The assertions cover: per-tier entry count, correct menu indices / state
/// ids / visibility flags, branch insertion position (before the else),
/// evaluator cloning isolation, idempotency, and every missing-state error
/// path. Same spirit as <see cref="Tier1VisibilityBootstrapSplicerTests"/>:
/// if a future source-mod update shifts the menu shape, these fail first.
/// </summary>
public class KaleShopMenuSplicerTests
{
    // ------------------------------------------------------------------
    // Fake-ESD scaffolding
    // ------------------------------------------------------------------

    /// <summary>The 39-byte predicate we pretend is Kalé's "shop message was
    /// closed" evaluator. Contents are arbitrary — we only care that the
    /// splicer clones it byte-for-byte onto each new shop state.</summary>
    private static readonly byte[] FakeMenuClosedEvaluator = Enumerable
        .Range(0, 39)
        .Select(i => (byte)(0xC0 + (i & 0x0F)))
        .ToArray();

    private static ESD BuildFakeKaleEsd(
        int initialEntryCount = 3,
        int initialBranchCount = 7,
        bool withTrailingElse = true)
    {
        var esd = new ESD();

        var state1 = new ESD.State();
        state1.EntryCommands.Add(EsdBytecode.ClearTalkListData());

        var state2 = new ESD.State();
        for (int i = 0; i < initialEntryCount; i++)
        {
            // Use stock-style AddTalkListData entries with menu indices
            // (1..initialEntryCount) — must not collide with MenuIndexBase..+8.
            state2.EntryCommands.Add(
                EsdBytecode.AddTalkListData(
                    index: i + 1,
                    textId: 10000000 + i,
                    reqId: -1));
        }

        var state4 = new ESD.State();
        for (int i = 0; i < initialBranchCount; i++)
        {
            state4.Conditions.Add(new ESD.Condition(
                targetState: 10 + i,
                evaluator: EsdBytecode.GetTalkListEntryResultEqualsEvaluator(i + 1)));
        }
        if (withTrailingElse)
        {
            state4.Conditions.Add(new ESD.Condition(
                targetState: KaleShopMenuSplicer.BackToClearStateId,
                evaluator: EsdBytecode.AlwaysTrueEvaluator()));
        }

        var state9 = new ESD.State();
        state9.EntryCommands.Add(EsdBytecode.ShowShopMessage(1));
        state9.EntryCommands.Add(EsdBytecode.OpenRegularShop(101800, 101897));
        state9.Conditions.Add(new ESD.Condition(
            targetState: KaleShopMenuSplicer.BackToClearStateId,
            evaluator: (byte[])FakeMenuClosedEvaluator.Clone()));

        var group = new Dictionary<long, ESD.State>
        {
            [KaleShopMenuSplicer.BackToClearStateId] = state1,
            [KaleShopMenuSplicer.EntryListStateId]   = state2,
            [KaleShopMenuSplicer.BranchStateId]      = state4,
            [KaleShopMenuSplicer.TemplateShopStateId] = state9,
        };
        esd.StateGroups[KaleShopMenuSplicer.KaleMainMenuGroupId] = group;
        return esd;
    }

    // ===================================================================
    // Apply — happy path
    // ===================================================================

    [Fact]
    public void Apply_InsertsNineTierEntries_OneForEachTier()
    {
        var esd = BuildFakeKaleEsd();

        var result = KaleShopMenuSplicer.Apply(esd);

        Assert.True(result.Inserted);
        Assert.False(result.AlreadyPresent);
        Assert.Equal(
            TierClearConstants.LastTier - TierClearConstants.FirstTier + 1,
            result.TierEntries.Count);

        for (int tier = TierClearConstants.FirstTier; tier <= TierClearConstants.LastTier; tier++)
        {
            var entry = result.TierEntries[tier - TierClearConstants.FirstTier];
            Assert.Equal(tier, entry.Tier);
            Assert.Equal(
                KaleShopMenuSplicer.MenuIndexBase + (tier - TierClearConstants.FirstTier),
                entry.MenuIndex);
            Assert.Equal(
                KaleShopMenuSplicer.NewStateIdBase + (tier - TierClearConstants.FirstTier),
                entry.NewStateId);
            Assert.Equal(
                (uint)(TierClearConstants.ShopVisibilityFlagBase + tier),
                entry.VisibilityFlag);

            int expectedStart = RegulationConstants.ShopLineupRowBase
                + tier * RegulationConstants.ShopLineupTierStride;
            Assert.Equal(expectedStart, entry.ShopStartRow);
            // Range includes the optional Great Rune slot at index
            // ShopSlotsPerTier (row shopBase + 7). See KaleShopMenuSplicer
            // for rationale.
            Assert.Equal(
                expectedStart + RegulationConstants.ShopSlotsPerTier,
                entry.ShopEndRow);
        }
    }

    [Fact]
    public void Apply_Appends_NineAddTalkListDataIf_To_State2_PreservingStockEntries()
    {
        const int stockCount = 5;
        var esd = BuildFakeKaleEsd(initialEntryCount: stockCount);
        var state2 = esd.StateGroups[KaleShopMenuSplicer.KaleMainMenuGroupId]
                        [KaleShopMenuSplicer.EntryListStateId];
        int before = state2.EntryCommands.Count;

        KaleShopMenuSplicer.Apply(esd);

        Assert.Equal(before + 9, state2.EntryCommands.Count);

        // The first `stockCount` entries must be unchanged (bank 1, id 19,
        // NOT AddTalkListDataIf).
        for (int i = 0; i < stockCount; i++)
        {
            Assert.Equal(1, state2.EntryCommands[i].CommandBank);
            Assert.Equal(19, state2.EntryCommands[i].CommandID);
            Assert.Equal(3, state2.EntryCommands[i].Arguments.Count);
        }

        // The last nine entries must be AddTalkListDataIf (bank 5, id 19)
        // with the expected menu indices in arg[1].
        for (int i = 0; i < 9; i++)
        {
            var cmd = state2.EntryCommands[stockCount + i];
            Assert.Equal(5, cmd.CommandBank);
            Assert.Equal(19, cmd.CommandID);
            Assert.Equal(4, cmd.Arguments.Count);

            int decodedIndex =
                  cmd.Arguments[1][1]
                | (cmd.Arguments[1][2] << 8)
                | (cmd.Arguments[1][3] << 16)
                | (cmd.Arguments[1][4] << 24);
            Assert.Equal(KaleShopMenuSplicer.MenuIndexBase + i, decodedIndex);
        }
    }

    [Fact]
    public void Apply_InsertsBranchConditions_BeforeTrailingElse()
    {
        const int stockBranchCount = 7;
        var esd = BuildFakeKaleEsd(initialBranchCount: stockBranchCount, withTrailingElse: true);
        var state4 = esd.StateGroups[KaleShopMenuSplicer.KaleMainMenuGroupId]
                        [KaleShopMenuSplicer.BranchStateId];

        KaleShopMenuSplicer.Apply(esd);

        // Stock 7 + 9 new + 1 else = 17 conditions.
        Assert.Equal(stockBranchCount + 9 + 1, state4.Conditions.Count);

        // First `stockBranchCount` preserved — still target 10..16.
        for (int i = 0; i < stockBranchCount; i++)
            Assert.Equal((long?)(10L + i), state4.Conditions[i].TargetState);

        // Next 9 are the per-tier branches, in tier order, targeting
        // NewStateIdBase..+8.
        for (int i = 0; i < 9; i++)
        {
            var c = state4.Conditions[stockBranchCount + i];
            Assert.Equal((long?)(KaleShopMenuSplicer.NewStateIdBase + i), c.TargetState);
        }

        // LAST condition MUST still be the always-true else (41 a1). If the
        // splicer appended after the else, new branches would be unreachable
        // — the failure mode this test exists to catch.
        var last = state4.Conditions[^1];
        Assert.Equal(new byte[] { 0x41, 0xa1 }, last.Evaluator);
        Assert.Equal((long?)KaleShopMenuSplicer.BackToClearStateId, last.TargetState);
    }

    [Fact]
    public void Apply_EachNewShopState_HasClonedMenuClosedEvaluator_TargetingState1()
    {
        var esd = BuildFakeKaleEsd();
        var group = esd.StateGroups[KaleShopMenuSplicer.KaleMainMenuGroupId];

        KaleShopMenuSplicer.Apply(esd);

        for (int tier = TierClearConstants.FirstTier; tier <= TierClearConstants.LastTier; tier++)
        {
            long stateId = KaleShopMenuSplicer.NewStateIdBase + (tier - TierClearConstants.FirstTier);
            Assert.True(group.ContainsKey(stateId), $"missing new state {stateId}");

            var state = group[stateId];
            // Tier shop state layout mirrors Athena's Moonwalk Starlight
            // Shop state 4: ONLY OpenPuppetShop on EntryCommands, no
            // ShowShopMessage prefix, and the exit condition uses the
            // puppet-shop-flavoured menu-closed evaluator.
            Assert.Equal(1, state.EntryCommands.Count);
            Assert.Equal(1, state.EntryCommands[0].CommandBank);
            Assert.Equal(144, state.EntryCommands[0].CommandID); // OpenPuppetShop

            var cond = Assert.Single(state.Conditions);
            Assert.Equal((long?)KaleShopMenuSplicer.BackToClearStateId, cond.TargetState);
            // Exit evaluator is the puppet-shop-flavoured predicate from
            // EsdBytecode.PuppetShopMenuClosedEvaluator, cloned so each
            // tier state owns its own byte array.
            Assert.Equal(EsdBytecode.PuppetShopMenuClosedEvaluator, cond.Evaluator);
            Assert.NotSame(EsdBytecode.PuppetShopMenuClosedEvaluator, cond.Evaluator);
        }
    }

    [Fact]
    public void Apply_ClonedEvaluators_AreNotAliasedToTemplate()
    {
        // Mutating one new-state's evaluator must not affect the template
        // or any sibling new state. Proves CloneBytes is being applied.
        var esd = BuildFakeKaleEsd();
        var group = esd.StateGroups[KaleShopMenuSplicer.KaleMainMenuGroupId];
        var template = group[KaleShopMenuSplicer.TemplateShopStateId];

        KaleShopMenuSplicer.Apply(esd);

        var tier1State = group[KaleShopMenuSplicer.NewStateIdBase];
        var tier2State = group[KaleShopMenuSplicer.NewStateIdBase + 1];

        tier1State.Conditions[0].Evaluator![0] = 0xEE;

        Assert.NotEqual(0xEE, template.Conditions[0].Evaluator![0]);
        Assert.NotEqual(0xEE, tier2State.Conditions[0].Evaluator![0]);
    }

    [Fact]
    public void Apply_ShopRowRanges_AreContiguousAndNonOverlapping()
    {
        var esd = BuildFakeKaleEsd();
        var result = KaleShopMenuSplicer.Apply(esd);

        // For every adjacent pair, the gap must be exactly
        //   ShopLineupTierStride - ShopSlotsPerTier = 100 - 7 = 93
        // (the shop range spans 8 IDs now — 7 base slots plus the optional
        // Great Rune slot at index 7 — and tiers are 100 apart). A
        // regression that, say, set stride=11 would make tiers overlap.
        for (int i = 1; i < result.TierEntries.Count; i++)
        {
            int prevEnd  = result.TierEntries[i - 1].ShopEndRow;
            int nextStart = result.TierEntries[i].ShopStartRow;
            Assert.True(nextStart > prevEnd, $"tier {i} overlaps tier {i - 1}");
            Assert.Equal(
                RegulationConstants.ShopLineupTierStride - RegulationConstants.ShopSlotsPerTier,
                nextStart - prevEnd);
        }
    }

    // ===================================================================
    // Idempotency
    // ===================================================================

    [Fact]
    public void Apply_RunningTwice_IsIdempotent_NoDoubleInsertion()
    {
        var esd = BuildFakeKaleEsd();
        var group = esd.StateGroups[KaleShopMenuSplicer.KaleMainMenuGroupId];
        var state2 = group[KaleShopMenuSplicer.EntryListStateId];
        var state4 = group[KaleShopMenuSplicer.BranchStateId];

        var first = KaleShopMenuSplicer.Apply(esd);
        int state2CountAfterFirst = state2.EntryCommands.Count;
        int state4CountAfterFirst = state4.Conditions.Count;
        int groupCountAfterFirst  = group.Count;

        var second = KaleShopMenuSplicer.Apply(esd);

        Assert.True(first.Inserted);
        Assert.False(first.AlreadyPresent);
        Assert.False(second.Inserted);
        Assert.True(second.AlreadyPresent);
        Assert.Empty(second.TierEntries);

        // Lists must not have grown on the second run.
        Assert.Equal(state2CountAfterFirst, state2.EntryCommands.Count);
        Assert.Equal(state4CountAfterFirst, state4.Conditions.Count);
        Assert.Equal(groupCountAfterFirst,  group.Count);
    }

    // ===================================================================
    // Missing-state error paths
    // ===================================================================

    [Fact]
    public void Apply_NullEsd_Throws()
    {
        Assert.Throws<ArgumentNullException>(() => KaleShopMenuSplicer.Apply(null!));
    }

    [Fact]
    public void Apply_MissingMenuGroup_ThrowsLoudly()
    {
        var esd = BuildFakeKaleEsd();
        esd.StateGroups.Remove(KaleShopMenuSplicer.KaleMainMenuGroupId);

        var ex = Assert.Throws<InvalidOperationException>(() => KaleShopMenuSplicer.Apply(esd));
        Assert.Contains(KaleShopMenuSplicer.KaleMainMenuGroupId.ToString(), ex.Message);
    }

    [Fact]
    public void Apply_MissingEntryListState_ThrowsLoudly()
    {
        var esd = BuildFakeKaleEsd();
        esd.StateGroups[KaleShopMenuSplicer.KaleMainMenuGroupId]
           .Remove(KaleShopMenuSplicer.EntryListStateId);

        Assert.Throws<InvalidOperationException>(() => KaleShopMenuSplicer.Apply(esd));
    }

    [Fact]
    public void Apply_MissingBranchState_ThrowsLoudly()
    {
        var esd = BuildFakeKaleEsd();
        esd.StateGroups[KaleShopMenuSplicer.KaleMainMenuGroupId]
           .Remove(KaleShopMenuSplicer.BranchStateId);

        Assert.Throws<InvalidOperationException>(() => KaleShopMenuSplicer.Apply(esd));
    }

    [Fact]
    public void Apply_MissingTemplateShopState_ThrowsLoudly()
    {
        // Cannot clone the menu-closed evaluator without the template —
        // splicer must refuse rather than synthesize a wrong predicate.
        var esd = BuildFakeKaleEsd();
        esd.StateGroups[KaleShopMenuSplicer.KaleMainMenuGroupId]
           .Remove(KaleShopMenuSplicer.TemplateShopStateId);

        Assert.Throws<InvalidOperationException>(() => KaleShopMenuSplicer.Apply(esd));
    }

    [Fact]
    public void Apply_TemplateStateWithNoConditions_ThrowsLoudly()
    {
        var esd = BuildFakeKaleEsd();
        var template = esd.StateGroups[KaleShopMenuSplicer.KaleMainMenuGroupId]
                         [KaleShopMenuSplicer.TemplateShopStateId];
        template.Conditions.Clear();

        var ex = Assert.Throws<InvalidOperationException>(() => KaleShopMenuSplicer.Apply(esd));
        Assert.Contains(KaleShopMenuSplicer.TemplateShopStateId.ToString(), ex.Message);
    }

    [Fact]
    public void Apply_TemplateStateFirstConditionHasEmptyEvaluator_ThrowsLoudly()
    {
        var esd = BuildFakeKaleEsd();
        var template = esd.StateGroups[KaleShopMenuSplicer.KaleMainMenuGroupId]
                         [KaleShopMenuSplicer.TemplateShopStateId];
        template.Conditions[0] = new ESD.Condition(
            targetState: KaleShopMenuSplicer.BackToClearStateId,
            evaluator: Array.Empty<byte>());

        Assert.Throws<InvalidOperationException>(() => KaleShopMenuSplicer.Apply(esd));
    }

    // ===================================================================
    // Options
    // ===================================================================

    [Fact]
    public void Apply_HonorsCustomMenuTextId()
    {
        var esd = BuildFakeKaleEsd(initialEntryCount: 0);
        const int customText = 123456789;

        KaleShopMenuSplicer.Apply(esd,
            new KaleShopMenuSplicerOptions { MenuTextId = customText });

        var state2 = esd.StateGroups[KaleShopMenuSplicer.KaleMainMenuGroupId]
                        [KaleShopMenuSplicer.EntryListStateId];

        foreach (var cmd in state2.EntryCommands)
        {
            // Arg[2] is the text ID (6-byte 82 <LE32> a1 form).
            byte[] arg = cmd.Arguments[2]!;
            int decoded =
                  arg[1]
                | (arg[2] << 8)
                | (arg[3] << 16)
                | (arg[4] << 24);
            Assert.Equal(customText, decoded);
        }
    }

    [Fact]
    public void Apply_DefaultsTo_PlaceholderMenuTextId_20000009()
    {
        var esd = BuildFakeKaleEsd(initialEntryCount: 0);

        KaleShopMenuSplicer.Apply(esd);

        var state2 = esd.StateGroups[KaleShopMenuSplicer.KaleMainMenuGroupId]
                        [KaleShopMenuSplicer.EntryListStateId];
        var firstArg2 = state2.EntryCommands[0].Arguments[2]!;
        int decoded =
              firstArg2[1]
            | (firstArg2[2] << 8)
            | (firstArg2[3] << 16)
            | (firstArg2[4] << 24);
        Assert.Equal(20000009, decoded);
        Assert.Equal(KaleShopMenuSplicer.PlaceholderMenuTextId, decoded);
    }
}
