// SPDX-License-Identifier: GPL-3.0-only
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace BossRush.Core.Models;

/// <summary>
/// Deserialized shape of step4-boss-catalog/boss_catalog.json. Each entry is
/// one caller site in an .emevd.dcx.js that invokes a reward event.
/// </summary>
public sealed class BossCatalogFile
{
    [JsonPropertyName("bosses")]
    public List<BossEntry> Bosses { get; set; } = new();
}

public sealed class BossEntry
{
    [JsonPropertyName("boss_flag")]
    public int BossFlag { get; set; }

    [JsonPropertyName("reward_event")]
    public int RewardEvent { get; set; }

    [JsonPropertyName("file")]
    public string File { get; set; } = "";

    [JsonPropertyName("line")]
    public int Line { get; set; }

    /// <summary>
    /// The raw args passed in the InitializeEvent / InitializeCommonEvent
    /// call. First element is boss_flag (X0), subsequent are itemlot slots
    /// per the reward-event schema.
    /// </summary>
    [JsonPropertyName("raw_args")]
    public List<int>? RawArgs { get; set; }
}
