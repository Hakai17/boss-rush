// SPDX-License-Identifier: GPL-3.0-only
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace BossRush.Core.Models;

/// <summary>
/// Deserialized shape of step3-exclusions/exclusions.json. Both top-level
/// blocks drive filtering of the drop pool; we only bind the fields needed
/// to reproduce generate.py's build_pools() behavior.
/// </summary>
public sealed class ExclusionsFile
{
    [JsonPropertyName("crafting_materials")]
    public CraftingMaterialsBlock CraftingMaterials { get; set; } = new();

    [JsonPropertyName("smithing_stones")]
    public SmithingStonesBlock SmithingStones { get; set; } = new();
}

public sealed class CraftingMaterialsBlock
{
    [JsonPropertyName("itemlot_ids")]
    public List<int> ItemlotIds { get; set; } = new();
}

public sealed class SmithingStonesBlock
{
    /// <summary>
    /// Keyed by itemlot_id (string in JSON, int semantically). Value carries
    /// the "verdict" discriminator; only "pure_stone" lots are excluded.
    /// </summary>
    [JsonPropertyName("lot_classification")]
    public Dictionary<string, LotClassification> LotClassification { get; set; } = new();
}

public sealed class LotClassification
{
    [JsonPropertyName("verdict")]
    public string? Verdict { get; set; }
}
