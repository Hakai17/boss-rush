// SPDX-License-Identifier: GPL-3.0-only
using System.Collections.Generic;

namespace BossRush.Core.Models;

/// <summary>
/// In-memory representation of a per-competition <c>tier_rewards.json</c>.
/// Produced by <see cref="Generation.ShopRollGenerator"/> from the seed and
/// <see cref="ShopPoolFile"/>; consumed by both the regulation.bin patcher
/// (to write 99 ShopLineupParam rows) and the EMEVD patcher (to wire up
/// per-tier shard awards and visibility-flag flips).
///
/// We hand-emit the JSON via <see cref="Io.CanonicalJsonWriter"/> rather than
/// System.Text.Json so the on-disk file matches Python's
/// <c>json.dump(indent=2, sort_keys=True)</c> byte-for-byte. This class is
/// only the in-memory shape; serialization happens in the generator.
/// </summary>
public sealed class TierRewardsPlan
{
    public int SchemaVersion { get; init; } = 1;
    public required string CompetitionSeed { get; init; }
    public required string DomainTag { get; init; }
    public required List<TierPlan> Tiers { get; init; }
}

public sealed class TierPlan
{
    /// <summary>1..9.</summary>
    public required int Tier { get; init; }

    /// <summary>EventFlag id the mod uses to mark "currently in tier N"
    /// (see common_func.emevd, range 1049308301..309).</summary>
    public required int TierFlag { get; init; }

    /// <summary>EventFlag id the patcher gates Kalé's per-tier shop on
    /// (range 1049308401..409 — owned by BossRush, not the base mod).
    /// Exactly one shop_visibility_flag is ON at a time.</summary>
    public required int ShopVisibilityFlag { get; init; }

    /// <summary>How many Amber Shards the player is awarded on tier-clear.
    /// Per spec: 5 per tier, 45 total for a full 9-tier run.</summary>
    public required int ShardAwardCount { get; init; }

    /// <summary>One-shot guard flag preventing double-award if the player
    /// re-enters Roundtable. Range 1049308501..509.</summary>
    public required int ShardAwardEventFlag { get; init; }

    /// <summary>11 entries in fixed order: 3 weapons, 3 talismans, 3 AoW, 2 tears.</summary>
    public required List<ShopSlot> Slots { get; init; }
}

public sealed class ShopSlot
{
    /// <summary>ShopLineupParam row id we'll write into regulation.bin
    /// (8000000 + tier*100 + slotIndex; e.g. tier 1 slot 0 = 8000100).</summary>
    public required int ShopId { get; init; }

    /// <summary>One of <see cref="ShopSlotKinds"/>.</summary>
    public required string Kind { get; init; }

    /// <summary>Param id of the underlying item (EquipParamWeapon / Accessory / Gem / Goods).</summary>
    public required int ParamId { get; init; }

    /// <summary>Cost in Amber Shards. Hard-coded to 1 today; parameterised so a
    /// future spec change ("tier-9 weapons cost 2") needs no code changes.</summary>
    public required int CostAmberShards { get; init; }
}

/// <summary>
/// String constants for the <see cref="ShopSlot.Kind"/> discriminator. Keeping
/// these as constants avoids typo bugs at the JSON boundary and gives the
/// regulation patcher a single source of truth when picking which param table
/// to write each slot into.
/// </summary>
public static class ShopSlotKinds
{
    public const string Weapon = "weapon";
    public const string Talisman = "talisman";
    public const string AshOfWar = "ash_of_war";
    public const string Tear = "tear";
    /// <summary>Bonus 8th-slot kind for per-tier activated Great Runes.
    /// Only appears when the tier wins the probabilistic roll (see
    /// <see cref="Generation.ShopRollGenerator.GreatRuneChancePercent"/>).
    /// Maps to <see cref="Patching.RegulationConstants.ShopEquipTypeGoods"/> (3)
    /// in ShopLineupParam.</summary>
    public const string GreatRune = "great_rune";

    /// <summary>Head armor — replaces a talisman slot when the per-slot
    /// 50/50 category coin lands on armor. The shop window groups by
    /// <c>equipType</c> so these appear in their own armor section of
    /// Kalé's scrollable list, alongside the surviving talisman picks.
    /// Maps to <see cref="Patching.RegulationConstants.ShopEquipTypeProtector"/> (1)
    /// in ShopLineupParam, with <c>equipId</c> pointing at an
    /// <c>EquipParamProtector</c> row.</summary>
    public const string HeadArmor = "head_armor";
}
