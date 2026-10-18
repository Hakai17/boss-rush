// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Buffers.Binary;
using System.Collections.Generic;
using System.Linq;
using SoulsFormats;

namespace BossRush.Core.Patching;

/// <summary>
/// Strips all boss-kill item rewards from the hub events in
/// <c>common_func.emevd.dcx</c>. This covers five reward paths:
///
/// <list type="number">
///   <item><c>InitializeCommonEvent(0, 90001052)</c> — main flag→AwardItemLot
///     dispatch (200+ items: weapons, armor, talismans, spells).</item>
///   <item><c>InitializeCommonEvent(0, 90001054/055)</c> — tiered talisman
///     drops.</item>
///   <item><c>InitializeCommonEvent(0, 90001003)</c> — random crafting
///     materials dispatcher.</item>
///   <item><c>AwardItemLot(X4/X8/X12)</c> — upgrade materials (smithing
///     stones, somber stones) and upgrade tools, parameterized per boss,
///     gated on GameCycle/first-defeat.</item>
///   <item><c>AwardItemLot(1049304024)</c> — rune arc roll
///     (hardcoded lot, always fires).</item>
/// </list>
///
/// <para>
/// The <c>InitializeCommonEvent</c> calls for 90001052/054/055 sit at the
/// <b>tail</b> of each hub event, so they can be safely removed without
/// skip-count adjustments. The <c>AwardItemLot</c> calls and the
/// <c>InitializeCommonEvent(0, 90001003)</c> sit in the <b>middle</b> of
/// the event under conditional flow (GameCycle checks, first-defeat gates).
/// Removing them would break skip counts, so we <b>zero their argument
/// data</b> instead: <c>AwardItemLot(0)</c> is a no-op (lot 0 doesn't
/// exist), and <c>InitializeCommonEvent(0, 0)</c> targets a nonexistent
/// event.
/// </para>
/// </summary>
public static class BossRewardStripSplicer
{
    /// <summary>Target event IDs whose <c>InitializeCommonEvent</c> calls
    /// should be <b>removed</b> from hub events (tail-position only).</summary>
    public static readonly IReadOnlyList<uint> TailStripEventIds = new uint[]
    {
        90001052, // main flag→AwardItemLot dispatch (200+ items)
        90001054, // tiered talisman drops (set 1)
        90001055, // tiered talisman drops (set 2)
    };

    /// <summary>Target event IDs whose <c>InitializeCommonEvent</c> calls
    /// should be <b>zeroed</b> (mid-event, can't remove without skip-count
    /// fixups).</summary>
    public static readonly IReadOnlyList<uint> MidEventZeroEventIds = new uint[]
    {
        90001003, // random crafting materials dispatcher
    };

    /// <summary>
    /// Hub events that contain the boss-reward instructions. We only scan
    /// these rather than walking the entire EMEVD to avoid accidental
    /// collateral.
    /// </summary>
    private static readonly HashSet<long> HubEventIds = new()
    {
        90001032, // base-game, 2 bonus slots
        90001033, // base-game, 3 bonus slots
        90001034, // base-game, 4 bonus slots
        90001035, // base-game, 5 bonus slots + guaranteed flag
        90001036, // base-game, 1 tool slot
        90001080, // base-game, variant layout
        90001042, // DLC, 2 bonus slots
        90001043, // DLC, 3 bonus slots
        90001044, // DLC, 4 bonus slots
        90001045, // DLC, 5 bonus slots
        90001046, // DLC, 6 bonus slots
    };

    /// <summary>
    /// Walk the hub events in <paramref name="commonFunc"/> and:
    /// <list type="bullet">
    ///   <item>Remove tail-position <c>InitializeCommonEvent</c> calls
    ///     targeting <see cref="TailStripEventIds"/>, along with their
    ///     <see cref="EMEVD.Parameter"/> entries.</item>
    ///   <item>Zero the event-ID arg of mid-event <c>InitializeCommonEvent</c>
    ///     calls targeting <see cref="MidEventZeroEventIds"/>, and strip
    ///     their <see cref="EMEVD.Parameter"/> entries.</item>
    ///   <item>Zero the lot-ID arg of every <c>AwardItemLot</c> instruction
    ///     inside each hub event, and strip their <see cref="EMEVD.Parameter"/>
    ///     entries so runtime parameter substitution cannot overwrite the
    ///     zeroed value.</item>
    /// </list>
    ///
    /// <para>
    /// <b>Why strip Parameters?</b> Many of the <c>AwardItemLot</c> calls use
    /// EMEVD parameter substitution (<c>AwardItemLot(X4_4)</c> etc.) — the
    /// caller passes stone/tool lot IDs which the runtime copies into ArgData
    /// at event-initialization time, overwriting whatever is on disk. Zeroing
    /// ArgData alone is therefore insufficient; we must also remove the
    /// <see cref="EMEVD.Parameter"/> entries that drive the substitution.
    /// With no Parameter entry, the zeroed ArgData stays zero and
    /// <c>AwardItemLot(0)</c> is a no-op (lot 0 doesn't exist).
    /// </para>
    /// </summary>
    public static BossRewardStripResult Apply(EMEVD commonFunc)
    {
        if (commonFunc is null)
            throw new ArgumentNullException(nameof(commonFunc));

        var tailSet = new HashSet<uint>(TailStripEventIds);
        var midSet  = new HashSet<uint>(MidEventZeroEventIds);
        int totalStripped = 0;
        int totalAwardLotZeroed = 0;
        int totalInitCommonZeroed = 0;
        int totalParamsStripped = 0;
        var perEvent = new List<BossRewardStripEventStats>();

        foreach (var ev in commonFunc.Events)
        {
            if (!HubEventIds.Contains(ev.ID))
                continue;

            // Collect instruction indices whose Parameters must be removed.
            // We track these across passes so we can do a single Parameter
            // cleanup at the end (before the tail-removal index shift).
            var deadParamIndices = new HashSet<int>();

            // Pass 1: zero all AwardItemLot instructions (lot ID → 0)
            // and mark them for Parameter stripping.
            int awardZeroed = 0;
            for (int i = 0; i < ev.Instructions.Count; i++)
            {
                var ins = ev.Instructions[i];
                if (ins.Bank == PatchConstants.BankEvent
                    && ins.ID == PatchConstants.IdAwardItemLot
                    && ins.ArgData.Length >= 4)
                {
                    // ArgData layout: [0..3] i32 itemLotId
                    // Zero the lot ID — AwardItemLot(0) is a no-op.
                    BinaryPrimitives.WriteInt32LittleEndian(
                        ins.ArgData.AsSpan(0, 4), 0);
                    deadParamIndices.Add(i);
                    awardZeroed++;
                }
            }

            // Pass 2: zero mid-event InitializeCommonEvent calls (event ID → 0)
            // and mark them for Parameter stripping.
            int initZeroed = 0;
            for (int i = 0; i < ev.Instructions.Count; i++)
            {
                var ins = ev.Instructions[i];
                if (IsInitCommonTargeting(ins, midSet))
                {
                    // Zero ALL args — slot + event ID + any trailing variadic
                    // params. InitializeCommonEvent(0, 0) targets a nonexistent
                    // event, and zeroing trailing args ensures no stale data
                    // leaks through if the runtime somehow resolves event 0.
                    Array.Clear(ins.ArgData, 0, ins.ArgData.Length);
                    deadParamIndices.Add(i);
                    initZeroed++;
                }
            }

            // Pass 3: identify tail-position InitializeCommonEvent calls to
            // remove. We need their indices BEFORE removal so we can strip
            // their Parameters and shift surviving indices correctly.
            var tailIndices = new HashSet<int>();
            for (int i = 0; i < ev.Instructions.Count; i++)
            {
                if (IsInitCommonTargeting(ev.Instructions[i], tailSet))
                    tailIndices.Add(i);
            }

            // --- Parameter cleanup (covers all three passes) ---
            // Remove Parameters targeting any dead (zeroed) or tail (about to
            // be removed) instructions. Then shift indices to account for the
            // tail instructions being deleted.
            int paramsBeforeCleanup = ev.Parameters.Count;
            if (deadParamIndices.Count > 0 || tailIndices.Count > 0)
            {
                // Build a sorted list of removed instruction indices for the
                // index-shift calculation. Only tail indices shift surviving
                // parameters; dead (zeroed-in-place) indices don't move anything.
                var removedSorted = new List<int>(tailIndices);
                removedSorted.Sort();

                var cleanParams = new List<EMEVD.Parameter>(ev.Parameters.Count);
                foreach (var p in ev.Parameters)
                {
                    int idx = (int)p.InstructionIndex;

                    // Drop parameters for zeroed-in-place instructions.
                    if (deadParamIndices.Contains(idx))
                        continue;

                    // Drop parameters for tail instructions about to be removed.
                    if (tailIndices.Contains(idx))
                        continue;

                    // Shift index down by the count of tail instructions that
                    // were removed BEFORE this index.
                    int shift = CountLessThan(removedSorted, idx);
                    if (shift > 0)
                        p.InstructionIndex = idx - shift;

                    cleanParams.Add(p);
                }
                ev.Parameters = cleanParams;
            }
            int paramsRemoved = paramsBeforeCleanup - ev.Parameters.Count;

            // Now actually remove the tail instructions from the list.
            int before = ev.Instructions.Count;
            if (tailIndices.Count > 0)
                ev.Instructions.RemoveAll(ins => IsInitCommonTargeting(ins, tailSet));
            int tailRemoved = before - ev.Instructions.Count;

            int totalForEvent = awardZeroed + initZeroed + tailRemoved;
            if (totalForEvent > 0)
            {
                totalStripped += tailRemoved;
                totalAwardLotZeroed += awardZeroed;
                totalInitCommonZeroed += initZeroed;
                totalParamsStripped += paramsRemoved;
                perEvent.Add(new BossRewardStripEventStats(
                    ev.ID, tailRemoved, awardZeroed, initZeroed));
            }
        }

        return new BossRewardStripResult(
            totalStripped, totalAwardLotZeroed, totalInitCommonZeroed,
            totalParamsStripped, perEvent);
    }

    /// <summary>
    /// Binary-search count of elements in a sorted list that are strictly
    /// less than <paramref name="value"/>. Used to compute how many removed
    /// tail-instruction indices precede a given surviving parameter index.
    /// </summary>
    private static int CountLessThan(List<int> sorted, int value)
    {
        int lo = 0, hi = sorted.Count;
        while (lo < hi)
        {
            int mid = lo + (hi - lo) / 2;
            if (sorted[mid] < value) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }

    /// <summary>
    /// Returns <c>true</c> if <paramref name="ins"/> is an
    /// <c>InitializeCommonEvent(slot, eventId)</c> instruction whose
    /// <c>eventId</c> is in <paramref name="targets"/>.
    /// </summary>
    private static bool IsInitCommonTargeting(
        EMEVD.Instruction ins, HashSet<uint> targets)
    {
        // InitializeCommonEvent = bank 2000, id 6. ArgData layout:
        //   [0..3] i32 slot
        //   [4..7] u32 eventId
        if (ins.Bank != PatchConstants.BankSystem
            || ins.ID != PatchConstants.IdInitializeCommonEvent)
            return false;

        if (ins.ArgData.Length < 8)
            return false;

        uint eventId = BinaryPrimitives.ReadUInt32LittleEndian(
            ins.ArgData.AsSpan(4, 4));
        return targets.Contains(eventId);
    }
}

/// <summary>Result of the boss-reward strip pass.</summary>
public sealed record BossRewardStripResult(
    /// <summary>Total tail-position <c>InitializeCommonEvent</c> instructions
    /// removed across all hub events.</summary>
    int InstructionsStripped,

    /// <summary>Total <c>AwardItemLot</c> instructions whose lot-ID was
    /// zeroed (stones, tools, rune arcs).</summary>
    int AwardItemLotsZeroed,

    /// <summary>Total mid-event <c>InitializeCommonEvent</c> instructions
    /// whose event-ID was zeroed (crafting materials dispatcher).</summary>
    int InitCommonEventsZeroed,

    /// <summary>Total <see cref="EMEVD.Parameter"/> entries removed across
    /// all hub events (prevents runtime parameter substitution from
    /// overwriting zeroed ArgData).</summary>
    int ParametersStripped,

    /// <summary>Per-hub-event breakdown.</summary>
    IReadOnlyList<BossRewardStripEventStats> PerEvent);

/// <summary>Per-event stats from the boss-reward strip.</summary>
public sealed record BossRewardStripEventStats(
    long EventId,
    int TailInstructionsRemoved,
    int AwardItemLotsZeroed,
    int InitCommonEventsZeroed);
