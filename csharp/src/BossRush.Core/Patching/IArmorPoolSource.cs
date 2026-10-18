// SPDX-License-Identifier: GPL-3.0-only
using System.Collections.Generic;

namespace BossRush.Core.Patching;

/// <summary>Elden Ring armor slot. <c>EquipParamProtector</c> collapses
/// "boots" into <see cref="Legs"/>; there are 4 slots total, not 5.</summary>
public enum ArmorSlot
{
    Head  = 0,
    Chest = 1,
    Arms  = 2,
    Legs  = 3,
}

/// <summary>
/// Source of armor item IDs for the Roundtable care package.
/// Implementations decide whether the pool comes from the full
/// <c>EquipParamProtector</c> table, a hand-curated allow-list, or a
/// future Smithbox-driven filter — the splicer just consumes IDs.
///
/// <para>
/// <b>Determinism contract.</b> <see cref="GetIds"/> must return ids in a
/// stable order across calls (typically ascending) so the seeded picker's
/// output is reproducible. Implementations that read external data
/// (files, DB) must sort before returning.
/// </para>
/// </summary>
public interface IArmorPoolSource
{
    /// <summary>All candidate armor IDs for the given slot, in stable
    /// (typically ascending) order. May be empty — the picker treats an
    /// empty slot as a fail-loud condition since the spec is "5 unique
    /// items per slot".</summary>
    IReadOnlyList<int> GetIds(ArmorSlot slot);
}
