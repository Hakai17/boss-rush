// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace BossRush.Core.Patching;

/// <summary>
/// <see cref="IArmorPoolSource"/> backed by a Smithbox "Stripped Row Names"
/// JSON file for <c>EquipParamProtector</c>. The file ships inside the
/// source mod at
/// <c>.smithbox/Project/Stripped Row Names/EquipParamProtector.json</c> and
/// enumerates every row id in the param table; we use it as the cheapest
/// available "list of every armor id" — no PARAMDEF parsing, no
/// regulation.bin decrypt, no embedded resource.
///
/// <para>
/// <b>Slot inference.</b> Vanilla ER and Shadow of the Erdtree consistently
/// encode the equip slot in the row id's hundreds digit:
/// <c>(id % 1000) / 100</c> ⇒ 0=Head, 1=Chest, 2=Arms, 3=Legs.
/// Empirically (verified against this mod's stripped-names file) ~97%
/// (794 / 820) of EquipParamProtector rows fall into slots 0..3; the
/// remaining ~26 rows in slots 4..9 are cut/test/NPC-only entries which
/// we drop. If the user later supplies a curated allow-list via a
/// different <see cref="IArmorPoolSource"/> implementation, this heuristic
/// becomes irrelevant.
/// </para>
///
/// <para>
/// <b>Determinism.</b> Returned ids are sorted ascending so the seeded
/// picker produces byte-identical output across runs given the same seed
/// + JSON file.
/// </para>
/// </summary>
public sealed class SmithboxArmorPoolSource : IArmorPoolSource
{
    /// <summary>Default relative path inside a source-mod directory.</summary>
    public const string DefaultRelativePath =
        ".smithbox/Project/Stripped Row Names/EquipParamProtector.json";

    /// <summary>
    /// Upper bound on player-grantable armor ids. EquipParamProtector rows
    /// at <c>id &gt;= 2_000_000</c> are predominantly NPC-only variants
    /// (5xxxxxxx for cut/dummy entries, 3xxxxxx for some boss armor with
    /// no player bbox / inventory icon). Granting one of these via
    /// <c>DirectlyGivePlayerItem</c> appears to silently no-op — the engine
    /// rejects items the player can't equip. Cap defaults to 2M to keep
    /// picks inside the vanilla + base DLC range; talisman/Erdtree-Boss
    /// armor in 1.5M..1.9M still qualifies.
    /// </summary>
    public const int DefaultPlayerObtainableIdCeiling = 2_000_000;

    private readonly Dictionary<ArmorSlot, IReadOnlyList<int>> _idsBySlot;

    public SmithboxArmorPoolSource(string jsonPath)
        : this(jsonPath, DefaultPlayerObtainableIdCeiling)
    {
    }

    public SmithboxArmorPoolSource(string jsonPath, int idCeiling)
    {
        if (string.IsNullOrWhiteSpace(jsonPath))
            throw new ArgumentException("jsonPath must be non-empty", nameof(jsonPath));
        if (!File.Exists(jsonPath))
            throw new FileNotFoundException(
                $"Smithbox EquipParamProtector row-names JSON not found at {jsonPath}. "
                + "Expected the source mod to ship the Smithbox project directory; "
                + "if it doesn't, supply a different IArmorPoolSource implementation.",
                jsonPath);

        _idsBySlot = LoadAndBucket(jsonPath, idCeiling);
    }

    /// <inheritdoc/>
    public IReadOnlyList<int> GetIds(ArmorSlot slot)
    {
        return _idsBySlot.TryGetValue(slot, out var list)
            ? list
            : Array.Empty<int>();
    }

    /// <summary>
    /// Convenience: total row count across all four valid slots. Useful
    /// for diagnostic logging from the pipeline runner.
    /// </summary>
    public int TotalIds => _idsBySlot.Values.Sum(l => l.Count);

    // ------------------------------------------------------------------
    private static Dictionary<ArmorSlot, IReadOnlyList<int>> LoadAndBucket(string path, int idCeiling)
    {
        // The Smithbox file shape is:
        //   { "Name": "EquipParamProtector",
        //     "Entries": [ { "ID": <int>, "Entries": [<string>] }, ... ] }
        // We don't care about the names — only the IDs.
        using var stream = File.OpenRead(path);
        using var doc = JsonDocument.Parse(stream);

        if (!doc.RootElement.TryGetProperty("Entries", out var entriesEl)
            || entriesEl.ValueKind != JsonValueKind.Array)
        {
            throw new InvalidDataException(
                $"Smithbox row-names file at {path} is missing the top-level "
                + "'Entries' array. Is this the right file?");
        }

        // Pre-bucket into HashSets to dedupe (defensive — Smithbox files are
        // unique-per-id by construction but if someone hand-edits we don't
        // want a duplicate id sneaking into the picker pool).
        var buckets = new Dictionary<ArmorSlot, HashSet<int>>
        {
            [ArmorSlot.Head]  = new HashSet<int>(),
            [ArmorSlot.Chest] = new HashSet<int>(),
            [ArmorSlot.Arms]  = new HashSet<int>(),
            [ArmorSlot.Legs]  = new HashSet<int>(),
        };

        foreach (var entry in entriesEl.EnumerateArray())
        {
            if (!entry.TryGetProperty("ID", out var idEl)
                || idEl.ValueKind != JsonValueKind.Number)
                continue;
            if (!idEl.TryGetInt32(out int id)) continue;

            int slotDigit = (id % 1000) / 100;
            // Skip ids whose hundreds digit is 4..9 — cut/test/NPC-only
            // rows that don't correspond to any of the four wearable slots.
            if (slotDigit < 0 || slotDigit > 3) continue;

            // Skip rows above the player-obtainable ceiling. EquipParamProtector
            // ships hundreds of NPC-only / cut / dummy rows in the 5M+ range
            // (and some 3M boss armor) which DirectlyGivePlayerItem silently
            // no-ops on — the engine refuses to put non-equippable items into
            // the player inventory. Filtering up-front keeps the picker honest.
            if (id >= idCeiling) continue;

            buckets[(ArmorSlot)slotDigit].Add(id);
        }

        // Freeze to sorted IReadOnlyList for the picker's determinism contract.
        var result = new Dictionary<ArmorSlot, IReadOnlyList<int>>(buckets.Count);
        foreach (var kv in buckets)
        {
            var arr = kv.Value.ToArray();
            Array.Sort(arr);
            result[kv.Key] = arr;
        }
        return result;
    }
}
