// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using IgniteBossRush.Core.Prng;

namespace IgniteBossRush.Core.Patching;

/// <summary>
/// Result of a Roundtable care-package roll: 5 unique armor ids per slot,
/// in pick order. The splicer consumes these directly to build the
/// <c>DirectlyGivePlayerItem</c> chain — pick order = give order =
/// per-item dedup flag assignment order, so determinism is maintained
/// end-to-end.
/// </summary>
public sealed record CarePackageRoll(
    IReadOnlyList<int> Head,
    IReadOnlyList<int> Chest,
    IReadOnlyList<int> Arms,
    IReadOnlyList<int> Legs)
{
    /// <summary>Flatten the four slot lists into a single 20-element list
    /// in the splicer's give-order: head[0..4], chest[0..4], arms[0..4],
    /// legs[0..4]. Used by both the EMEVD splicer and the round-trip tests.</summary>
    public IReadOnlyList<(ArmorSlot Slot, int ItemId)> InGiveOrder()
    {
        var list = new List<(ArmorSlot, int)>(RoundtableCarePackageConstants.TotalItems);
        foreach (var (slot, ids) in new[]
        {
            (ArmorSlot.Head,  Head),
            (ArmorSlot.Chest, Chest),
            (ArmorSlot.Arms,  Arms),
            (ArmorSlot.Legs,  Legs),
        })
        {
            foreach (var id in ids) list.Add((slot, id));
        }
        return list;
    }
}

/// <summary>
/// Seed-driven picker that draws <see cref="RoundtableCarePackageConstants.ItemsPerSlot"/>
/// unique armor ids per slot from an <see cref="IArmorPoolSource"/>.
///
/// <para>
/// <b>Determinism.</b> Uses <see cref="ShakeDeterministicRng"/> with a
/// per-slot domain tag so re-rolling head doesn't perturb chest/arms/legs
/// — and the same (seed, pool) pair always yields the same output.
/// Algorithm is partial Fisher-Yates: copy the slot's id list, swap the
/// first <c>k</c> positions with random later positions, take the first
/// <c>k</c>. This matches the project-wide convention (no
/// <c>OrderBy(rng.Next())</c>-style shuffles — see hard rule #4 in the
/// ignite-modding skill).
/// </para>
/// </summary>
public static class CarePackagePicker
{
    /// <summary>Domain-tag prefix for the picker's RNG. Each slot gets its
    /// own sub-domain so a future change to one slot's pick logic doesn't
    /// shift the other slots' draws.</summary>
    private const string DomainPrefix = "roundtable-care-package";

    /// <summary>
    /// Pick 5 unique ids per slot from <paramref name="pool"/>, deterministic
    /// in <paramref name="seed"/>.
    /// </summary>
    public static CarePackageRoll Pick(IArmorPoolSource pool, string seed)
    {
        ArgumentNullException.ThrowIfNull(pool);
        if (string.IsNullOrWhiteSpace(seed))
            throw new ArgumentException("seed must be non-empty", nameof(seed));

        return new CarePackageRoll(
            Head:  PickSlot(pool, seed, ArmorSlot.Head),
            Chest: PickSlot(pool, seed, ArmorSlot.Chest),
            Arms:  PickSlot(pool, seed, ArmorSlot.Arms),
            Legs:  PickSlot(pool, seed, ArmorSlot.Legs));
    }

    private static IReadOnlyList<int> PickSlot(
        IArmorPoolSource pool, string seed, ArmorSlot slot)
    {
        var ids = pool.GetIds(slot);
        int k = RoundtableCarePackageConstants.ItemsPerSlot;
        if (ids.Count < k)
        {
            throw new InvalidOperationException(
                $"Care-package picker: armor pool for slot {slot} contains "
                + $"only {ids.Count} ids — need at least {k}. "
                + "Either widen the IArmorPoolSource or reduce ItemsPerSlot.");
        }

        var rng = new ShakeDeterministicRng(seed, $"{DomainPrefix}/{slot}");
        // Partial Fisher–Yates: only the first k positions need randomising
        // because we're returning the first k after shuffling.
        var work = new int[ids.Count];
        for (int i = 0; i < ids.Count; i++) work[i] = ids[i];

        for (int i = 0; i < k; i++)
        {
            int j = i + rng.RandBelow(work.Length - i);
            (work[i], work[j]) = (work[j], work[i]);
        }

        var picked = new int[k];
        Array.Copy(work, picked, k);
        return picked;
    }
}
