// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using BossRush.Core.Io;
using BossRush.Core.Models;
using BossRush.Core.Prng;

namespace BossRush.Core.Generation;

/// <summary>
/// Rolls a seeded drop table and writes drops.json, SEED_INFO.txt, and
/// integrity.sha256. The refill algorithm matches the earlier generator,
/// with the BossRush-v1 domain tag, so older seeds do not match.
///
/// Invariants that keep C# and Python cross-reproducible:
///   - Pool construction order: iterate flag_pool.award_flag_to_itemlot in
///     JSON-declaration order (not sorted). generate.py iterates dict items;
///     pre-3.7 Python dicts are ordered since CPython 3.6. Our JSON reader
///     (System.Text.Json) preserves declaration order.
///   - Lot deduplication per category: use SortedSet so the final pool is
///     sorted ascending by lot_id before feeding the RNG choice (matches
///     <c>sorted(pools[cat])</c> in Python).
///   - Boss dedupe: sort by (boss_flag, file, line), take first per boss_flag.
///   - Drop roll order: iterate unique_bosses in list order; for each boss,
///     roll the six categories in CategoryNames.Ordered order. This is the
///     exact sequence of RandBelow() calls Python makes.
/// </summary>
public sealed class DropGenerator
{
    public const string ToolName = "BossRush-SeededDrops";
    public const string ToolVersion = "0.1.0";

    public DropGeneratorOptions Options { get; }

    public DropGenerator(DropGeneratorOptions options)
    {
        Options = options ?? throw new ArgumentNullException(nameof(options));
    }

    /// <summary>
    /// Run the generator end-to-end: build pools, dedupe bosses, roll drops,
    /// compute canonical-table SHA-256, write drops.json + SEED_INFO.txt +
    /// integrity.sha256 under <paramref name="outDir"/>.
    /// </summary>
    public DropGenerationResult Generate(string outDir)
    {
        Directory.CreateDirectory(outDir);

        // --- load inputs ---
        var flagPool = JsonLoader.LoadFile<FlagPoolFile>(Options.FlagPoolPath);
        var exclusions = JsonLoader.LoadFile<ExclusionsFile>(Options.ExclusionsPath);
        var bossCatalog = JsonLoader.LoadFile<BossCatalogFile>(Options.BossCatalogPath);

        // --- build pools ---
        var (pools, skipped) = BuildPools(flagPool, exclusions);
        foreach (var cat in CategoryNames.Ordered)
        {
            if (pools[cat].Count == 0)
                throw new InvalidOperationException($"Empty pool for category '{cat}' — cannot generate drops");
        }

        // --- dedupe bosses ---
        var uniqueBosses = UniqueBosses(bossCatalog.Bosses);

        // --- roll drops ---
        var rng = new ShakeDeterministicRng(Options.Seed, domain: "drop-rolls-v1");
        var dropTable = new Dictionary<string, Dictionary<string, int>>(uniqueBosses.Count);
        foreach (var b in uniqueBosses)
        {
            string bossKey = b.BossFlag.ToString(CultureInfo.InvariantCulture);
            if (dropTable.ContainsKey(bossKey))
                throw new InvalidOperationException($"Duplicate boss_flag {bossKey} after dedupe");
            var drops = new Dictionary<string, int>(CategoryNames.Ordered.Count);
            foreach (var cat in CategoryNames.Ordered)
            {
                drops[cat] = rng.Choice(pools[cat]);
            }
            dropTable[bossKey] = drops;
        }

        // --- canonical table hash ---
        byte[] canonical = CanonicalDropTable.CanonicalBytes(dropTable);
        string fingerprint = ToHexLower(SHA256.HashData(canonical));

        // --- assemble in-memory DropPlan ---
        string timestamp = Options.FixedTimestampUtc
            ?? DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.ffffffzzz", CultureInfo.InvariantCulture);
        var poolSizes = new Dictionary<string, int>(CategoryNames.Ordered.Count);
        foreach (var cat in CategoryNames.Ordered)
            poolSizes[cat] = pools[cat].Count;

        // Match Python skipped dict keys: {craft, stone, unknown_cat}
        var excludedCounts = new Dictionary<string, int>
        {
            ["craft"] = skipped.Craft,
            ["stone"] = skipped.Stone,
            ["unknown_cat"] = skipped.UnknownCat,
        };

        // The on-disk JSON matches Python's dict: meta + drops. We build it
        // as a plain Dictionary<string, object> so CanonicalJsonWriter emits
        // exactly the same byte-form as json.dump(..., indent=2, sort_keys=True).
        var metaDict = new Dictionary<string, object>
        {
            ["tool"] = ToolName,
            ["tool_version"] = Options.ToolVersionOverride ?? ToolVersion,
            ["mod"] = "Boss Rush Alpha Version v3.6.4 Boss Arena",
            ["mode"] = "per-item-type-full-randomization",
            ["seed"] = Options.Seed,
            ["seed_origin"] = Options.SeedOrigin,
            ["generated_utc"] = timestamp,
            ["boss_count"] = uniqueBosses.Count,
            ["categories"] = CategoryNames.Ordered.ToList(),
            ["pool_sizes"] = poolSizes.ToDictionary(kv => kv.Key, kv => (object)kv.Value),
            ["excluded_counts"] = excludedCounts.ToDictionary(kv => kv.Key, kv => (object)kv.Value),
            ["fingerprint_sha256"] = fingerprint,
        };
        var dropsAsObject = dropTable.ToDictionary(
            kv => kv.Key,
            kv => (object)kv.Value.ToDictionary(x => x.Key, x => (object)x.Value));
        var rootDict = new Dictionary<string, object>
        {
            ["meta"] = metaDict,
            ["drops"] = dropsAsObject,
        };

        string dropsPath = Path.Combine(outDir, "drops.json");
        byte[] dropsJsonBytes = CanonicalJsonWriter.Serialize(rootDict);
        File.WriteAllBytes(dropsPath, dropsJsonBytes);

        string integrityPath = Path.Combine(outDir, "integrity.sha256");
        // Match Python: single line "<hash>  drops.canonical\n"
        string integrityLine = fingerprint + "  drops.canonical\n";
        File.WriteAllBytes(integrityPath, Encoding.UTF8.GetBytes(integrityLine));

        string seedInfoPath = Path.Combine(outDir, "SEED_INFO.txt");
        File.WriteAllBytes(seedInfoPath, Encoding.UTF8.GetBytes(
            RenderSeedInfo(timestamp, uniqueBosses.Count, poolSizes, skipped, fingerprint)));

        return new DropGenerationResult(
            DropsPath: dropsPath,
            IntegrityPath: integrityPath,
            SeedInfoPath: seedInfoPath,
            Fingerprint: fingerprint,
            BossCount: uniqueBosses.Count,
            PoolSizes: poolSizes,
            ExcludedCounts: excludedCounts);
    }

    // ----------------------------------------------------------------------
    // Pool construction
    // ----------------------------------------------------------------------
    internal static (Dictionary<string, List<int>> pools, SkipCounts skipped) BuildPools(
        FlagPoolFile flagPool, ExclusionsFile exclusions)
    {
        var craftSet = new HashSet<int>(exclusions.CraftingMaterials.ItemlotIds);
        var stoneSet = new HashSet<int>();
        foreach (var kv in exclusions.SmithingStones.LotClassification)
        {
            if (kv.Value?.Verdict == "pure_stone" &&
                int.TryParse(kv.Key, NumberStyles.Integer, CultureInfo.InvariantCulture, out int id))
            {
                stoneSet.Add(id);
            }
        }

        var pools = new Dictionary<string, SortedSet<int>>();
        foreach (var cat in CategoryNames.Ordered)
            pools[cat] = new SortedSet<int>();

        var skipped = new SkipCounts();
        foreach (var kv in flagPool.AwardFlagToItemlot)
        {
            string? cat = kv.Value.ModCategory;
            if (cat == null || !pools.ContainsKey(cat))
            {
                skipped.UnknownCat++;
                continue;
            }
            foreach (var lot in kv.Value.Itemlots)
            {
                int lotId = lot.LotId;
                if (craftSet.Contains(lotId)) { skipped.Craft++; continue; }
                if (stoneSet.Contains(lotId)) { skipped.Stone++; continue; }
                pools[cat].Add(lotId);
            }
        }

        var outPools = new Dictionary<string, List<int>>(pools.Count);
        foreach (var kv in pools)
            outPools[kv.Key] = kv.Value.ToList();
        return (outPools, skipped);
    }

    // ----------------------------------------------------------------------
    // Boss dedupe (matches Python unique_bosses)
    // ----------------------------------------------------------------------
    internal static List<BossEntry> UniqueBosses(List<BossEntry> bosses)
    {
        // Sort first, then take first occurrence per boss_flag so the caller
        // with the lowest (file, line) wins consistently.
        var ordered = bosses
            .OrderBy(b => b.BossFlag)
            .ThenBy(b => b.File, StringComparer.Ordinal)
            .ThenBy(b => b.Line)
            .ToList();

        var seen = new HashSet<int>();
        var uniq = new List<BossEntry>(ordered.Count);
        foreach (var b in ordered)
        {
            if (seen.Add(b.BossFlag))
                uniq.Add(b);
        }
        return uniq;
    }

    // ----------------------------------------------------------------------
    // Misc
    // ----------------------------------------------------------------------
    private static string ToHexLower(byte[] data)
    {
        var sb = new StringBuilder(data.Length * 2);
        foreach (var b in data) sb.Append(b.ToString("x2", CultureInfo.InvariantCulture));
        return sb.ToString();
    }

    private string RenderSeedInfo(
        string timestamp, int bossCount, Dictionary<string, int> poolSizes,
        SkipCounts skipped, string fingerprint)
    {
        var sb = new StringBuilder(2048);
        sb.Append("Boss Rush Alpha Version - Seeded Competition Drop Tool\n");
        sb.Append(new string('=', 60)).Append('\n').Append('\n');
        sb.Append("Seed            : ").Append(Options.Seed).Append('\n');
        sb.Append("Seed origin     : ").Append(Options.SeedOrigin).Append('\n');
        sb.Append("Tool            : ").Append(ToolName).Append(" v").Append(Options.ToolVersionOverride ?? ToolVersion).Append('\n');
        sb.Append("Mode            : per-item-type full randomization\n");
        sb.Append("Generated (UTC) : ").Append(timestamp).Append('\n');
        sb.Append("Bosses          : ").Append(bossCount).Append('\n');
        sb.Append("Categories      : ").Append(string.Join(", ", CategoryNames.Ordered)).Append('\n');
        sb.Append("Pool sizes (after exclusions):\n");
        foreach (var cat in CategoryNames.Ordered)
            sb.Append("  ").Append(cat.PadRight(12)).Append(" : ").Append(poolSizes[cat]).Append('\n');
        sb.Append('\n').Append("Exclusions applied:\n");
        sb.Append("  crafting_materials_skipped : ").Append(skipped.Craft).Append('\n');
        sb.Append("  pure_stones_skipped        : ").Append(skipped.Stone).Append('\n');
        sb.Append('\n').Append("SHA-256 fingerprint (canonical drop table):\n");
        sb.Append("  ").Append(fingerprint).Append('\n');
        sb.Append('\n').Append("Verification:\n");
        sb.Append("  1. Regenerate drops.json from the same seed with this tool.\n");
        sb.Append("  2. Compare integrity.sha256 — bit-identical seeds match.\n");
        sb.Append("  3. After patching, hash the packed regulation.bin drop table\n");
        sb.Append("     and confirm SEED_INFO.txt hash matches the patched artifact.\n");
        return sb.ToString();
    }

    internal sealed class SkipCounts
    {
        public int Craft;
        public int Stone;
        public int UnknownCat;
    }
}

public sealed record DropGenerationResult(
    string DropsPath,
    string IntegrityPath,
    string SeedInfoPath,
    string Fingerprint,
    int BossCount,
    IReadOnlyDictionary<string, int> PoolSizes,
    IReadOnlyDictionary<string, int> ExcludedCounts);

public sealed class DropGeneratorOptions
{
    public required string Seed { get; init; }
    public required string FlagPoolPath { get; init; }
    public required string ExclusionsPath { get; init; }
    public required string BossCatalogPath { get; init; }

    /// <summary>"user-supplied" or "auto-minted (128-bit)" etc.</summary>
    public string SeedOrigin { get; init; } = "user-supplied";

    /// <summary>Override for reproducibility tests; default = DateTime.UtcNow.</summary>
    public string? FixedTimestampUtc { get; init; }

    /// <summary>Override the tool version embedded in drops.json meta. Unit-test hook.</summary>
    public string? ToolVersionOverride { get; init; }

    /// <summary>Mint a cryptographically random hex seed of the given byte-length (default 16 = 128-bit).</summary>
    public static string MintRandomSeed(int nBytes = 16)
    {
        if (nBytes < 8) throw new ArgumentOutOfRangeException(nameof(nBytes), "at least 8 bytes required");
        Span<byte> buf = stackalloc byte[nBytes];
        RandomNumberGenerator.Fill(buf);
        var sb = new StringBuilder(nBytes * 2);
        foreach (var b in buf) sb.Append(b.ToString("x2", CultureInfo.InvariantCulture));
        return sb.ToString();
    }
}
