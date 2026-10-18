// SPDX-License-Identifier: GPL-3.0-only
using System.Collections.Generic;

namespace BossRush.Core.Models;

/// <summary>
/// Per-item-type drop categories. Order is load-bearing: it defines the
/// canonical hash form (see <see cref="Io.CanonicalDropTable"/>) and the
/// order in which the binary patcher emits SetEventFlag opcodes inside each
/// inline dispatch branch. Must match Python's generate.py CATEGORIES tuple
/// exactly — flipping two entries changes drops.canonical for all seeds.
/// </summary>
public static class CategoryNames
{
    public const string Weapon = "weapon";
    public const string Armor = "armor";
    public const string Talisman = "talisman";
    public const string Spell = "spell";
    public const string AowTool = "aow_tool";
    public const string AshesTear = "ashes_tear";

    /// <summary>
    /// Canonical ordering. Treat as frozen; changing it breaks cross-version
    /// fingerprint reproducibility.
    /// </summary>
    public static readonly IReadOnlyList<string> Ordered = new[]
    {
        Weapon, Armor, Talisman, Spell, AowTool, AshesTear,
    };
}
