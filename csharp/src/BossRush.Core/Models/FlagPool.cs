// SPDX-License-Identifier: GPL-3.0-only
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace BossRush.Core.Models;

/// <summary>
/// Deserialized shape of step2-flag-pool/flag_pool.json. Mirrors the Python
/// consumers in generate.py / patch_mod.py:
///   award_flag_to_itemlot: { "&lt;award_flag_int&gt;": { mod_category, itemlots[] } }
/// Only the fields we actually need are modeled; unknown fields are dropped
/// silently (System.Text.Json default).
/// </summary>
public sealed class FlagPoolFile
{
    [JsonPropertyName("award_flag_to_itemlot")]
    public Dictionary<string, AwardFlagEntry> AwardFlagToItemlot { get; set; } = new();
}

public sealed class AwardFlagEntry
{
    [JsonPropertyName("mod_category")]
    public string? ModCategory { get; set; }

    [JsonPropertyName("itemlots")]
    public List<Itemlot> Itemlots { get; set; } = new();
}

public sealed class Itemlot
{
    [JsonPropertyName("lot_id")]
    public int LotId { get; set; }
}
