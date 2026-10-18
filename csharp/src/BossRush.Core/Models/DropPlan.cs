// SPDX-License-Identifier: GPL-3.0-only
using System.Collections.Generic;

namespace BossRush.Core.Models;

/// <summary>
/// In-memory representation of one generate.py run's output. Serialized to
/// drops.json via <see cref="Io.CanonicalJsonWriter"/> with byte-identical
/// formatting to Python (sorted keys, 2-space indent, no trailing newline).
/// </summary>
public sealed class DropPlan
{
    public DropPlanMeta Meta { get; set; } = new();

    /// <summary>
    /// boss_flag (as string, matching Python's json-key casting) -&gt; {category: lot_id}.
    /// </summary>
    public Dictionary<string, Dictionary<string, int>> Drops { get; set; } = new();
}

public sealed class DropPlanMeta
{
    public string Tool { get; set; } = "BossRush-SeededDrops";
    public string ToolVersion { get; set; } = "0.1.0";
    public string Mod { get; set; } = "Boss Rush Alpha Version v3.6.4 Boss Arena";
    public string Mode { get; set; } = "per-item-type-full-randomization";
    public string Seed { get; set; } = "";
    public string SeedOrigin { get; set; } = "user-supplied";
    public string GeneratedUtc { get; set; } = "";
    public int BossCount { get; set; }
    public List<string> Categories { get; set; } = new(CategoryNames.Ordered);
    public Dictionary<string, int> PoolSizes { get; set; } = new();
    public Dictionary<string, int> ExcludedCounts { get; set; } = new();
    public string FingerprintSha256 { get; set; } = "";
}
