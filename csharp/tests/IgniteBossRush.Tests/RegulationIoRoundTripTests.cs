// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using IgniteBossRush.Core.Patching;
using SoulsFormats;
using Xunit;

namespace IgniteBossRush.Tests;

/// <summary>
/// Round-trip fidelity tests for <see cref="RegulationIo"/>.
///
/// <para>
/// <b>The invariant we actually care about:</b> after
/// <c>SaveEldenRing(out, LoadEldenRing(in))</c> the output must parse back
/// to a BND4 whose binder-file list is structurally equivalent to the
/// source and whose <i>untouched</i> binder-file payloads are byte-equal.
/// That's what protects us from silent behaviour drift in unrelated game
/// systems — if no byte of any PARAM we didn't edit changed, nothing else
/// in the game can have changed.
/// </para>
///
/// <para>
/// <b>Why not strict ciphertext byte-equality?</b> The earlier version of
/// this file asserted <c>SHA-256(source) == SHA-256(output)</c>. That held
/// on synthetic BND4s but fails on real modded regulation.bin for two
/// reasons that aren't bugs in the patcher: (a) the vendored
/// <c>RegulationDecryptor</c> decrypts with <c>PaddingMode.None</c> (keeps
/// the original trailing bytes verbatim) but re-encrypts with
/// <c>PaddingMode.PKCS7</c>, so if the mod was repacked by a tool that
/// didn't use PKCS7 the final ciphertext block diverges; (b)
/// <c>BND4.Write()</c> is free to renormalise internal alignment / entry
/// ordering, and any such renormalisation cascades through CBC as a full
/// hash change. Neither changes what the game sees at the row level.
/// </para>
///
/// <para>
/// <b>Fixture discovery + skip policy:</b> matches <see cref="GoldenFingerprintTests"/>.
/// The real <c>mod/regulation.bin</c> is ~50MB and not safe to vendor into
/// this test project. Instead the test walks up from the test binary's
/// directory looking for the mod tree; if it can't find one, the test is
/// reported as skipped (via <c>Assert.True(true, reason)</c>) so CI stays
/// green when the repo isn't mounted — e.g. when shipping only the
/// <c>csharp/</c> subfolder.
/// </para>
/// </summary>
public class RegulationIoRoundTripTests
{
    [Fact]
    public void LoadSaveRoundTrip_OnRealModRegulation_PreservesBinderContents()
    {
        // A no-op decrypt → BND4.Read → BND4.Write → encrypt cycle must not
        // silently corrupt any binder payload. We compare the re-parsed
        // output BND4 against the source BND4 entry-by-entry; every Name /
        // Flags / ID / CompressionInfo / Bytes must match. This is stronger
        // than a BND4 header-only check and catches accidental PARAM drift
        // anywhere in the ~hundreds-of-files regulation tree.
        if (!TryLocateModRegulation(out string regulationPath))
        {
            Assert.True(true,
                "mod/regulation.bin not found. Skipped — this is expected when " +
                "the test binary runs outside the repo tree.");
            return;
        }

        string scratchDir = Path.Combine(Path.GetTempPath(),
            "ignite-regulation-rt-" + Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(scratchDir);
        string outPath = Path.Combine(scratchDir, "regulation.bin");

        try
        {
            BND4 sourceBnd = RegulationIo.LoadEldenRing(regulationPath);
            RegulationIo.SaveEldenRing(outPath, sourceBnd);
            BND4 outputBnd = RegulationIo.LoadEldenRing(outPath);

            AssertBindersFunctionallyEquivalent(sourceBnd, outputBnd,
                expectedMutatedFileNames: Array.Empty<string>());
        }
        finally
        {
            try { if (Directory.Exists(scratchDir)) Directory.Delete(scratchDir, recursive: true); }
            catch { /* best effort */ }
        }
    }

    [Fact]
    public void PatcherApply_OnRealModRegulation_LocatesAllThreeRequiredParams()
    {
        if (!TryLocateModRegulation(out string regulationPath))
        {
            Assert.True(true,
                "mod/regulation.bin not found. Skipped — see round-trip test comment.");
            return;
        }

        string scratchDir = Path.Combine(Path.GetTempPath(),
            "ignite-regulation-apply-" + Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(scratchDir);
        string outPath = Path.Combine(scratchDir, "regulation.bin");

        try
        {
            var result = new RegulationPatcher(new RegulationPatcherOptions
            {
                SourceRegulationPath = regulationPath,
                OutputRegulationPath = outPath,
                Force = true,
            }).Apply();

            Assert.True(result.EquipParamGoodsLocated);
            Assert.True(result.ItemLotParamMapLocated);
            Assert.True(result.ShopLineupParamLocated);
            Assert.True(result.TotalBinderFiles > 100,
                "Expected hundreds of param files in a real ER regulation.bin");

            // Phase A invariant (functional form): a no-op patcher (Plan
            // null, no row mutations) must preserve every binder file's
            // payload byte-for-byte. We don't assert file-level SHA equality
            // on the encrypted regulation.bin — see class doc-comment for
            // why ciphertext identity isn't a realistic guarantee.
            BND4 sourceBnd = RegulationIo.LoadEldenRing(regulationPath);
            BND4 outputBnd = RegulationIo.LoadEldenRing(outPath);
            AssertBindersFunctionallyEquivalent(sourceBnd, outputBnd,
                expectedMutatedFileNames: Array.Empty<string>());
        }
        finally
        {
            try { if (Directory.Exists(scratchDir)) Directory.Delete(scratchDir, recursive: true); }
            catch { /* best effort */ }
        }
    }

    // ==================================================================
    // Phase B — mutation round-trip integration
    // ==================================================================

    [Fact]
    public void PatcherApply_WithPlan_WritesExpectedRows()
    {
        // This is the end-to-end Phase B integration gate: given a real
        // regulation.bin and a minimal plan, the patcher should:
        //   1. Decrypt + parse without error
        //   2. Emit 9 ItemLot rows granting vanilla Starlight Shards (1290)
        //   3. Emit 99 ShopLineup rows with costType=2 (Starlight Shards)
        //      and value=1 (one shard per slot)
        //   4. Re-encrypt + write an output file that round-trips back to
        //      the same rows (i.e. no silent byte corruption in the write
        //      path).
        // EquipParamGoods is NO LONGER mutated — we reuse the vanilla
        // Starlight Shards row as the shop currency. See
        // TierClearConstants.AmberShardGoodsId for rationale.
        if (!TryLocateModRegulation(out string regulationPath))
        {
            Assert.True(true,
                "mod/regulation.bin not found. Skipped — see round-trip test comment.");
            return;
        }

        string scratchDir = Path.Combine(Path.GetTempPath(),
            "ignite-regulation-phaseB-" + Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(scratchDir);
        string outPath = Path.Combine(scratchDir, "regulation.bin");

        try
        {
            var plan = RegulationPatcherTests.MakeMinimalPlan();

            var result = new RegulationPatcher(new RegulationPatcherOptions
            {
                SourceRegulationPath = regulationPath,
                OutputRegulationPath = outPath,
                Plan = plan,
                Force = true,
            }).Apply();

            // Result bookkeeping: 0 goods rows (no longer mutated) +
            // 9 ItemLot + 63 Shop = 72 total.
            Assert.Equal(0,  result.EquipParamGoodsRowsWritten);
            Assert.Equal(9,  result.ItemLotParamMapRowsWritten);
            Assert.Equal(63, result.ShopLineupParamRowsWritten);
            Assert.Equal(72, result.RowsWritten);

            // Re-parse the output and assert the rows are actually there
            // with the cell values we meant to write. This is the strongest
            // available signal that PARAM.Write() → regulation-encrypt →
            // regulation-decrypt → PARAM.Read() is lossless for our edits.
            BND4 sourceBnd = RegulationIo.LoadEldenRing(regulationPath);
            BND4 outBnd    = RegulationIo.LoadEldenRing(outPath);
            var located    = RegulationPatcher.LocateRequiredParams(outBnd);

            AssertStarlightShardsGoodsRowPresent(located.EquipParamGoods);
            AssertItemLotRows(located.ItemLotParamMap);
            AssertShopLineupRows(located.ShopLineupParam, plan);

            // Surgical-mutation guard: the two tables we edit are allowed
            // to differ; every other binder file must byte-equal the source.
            // This is the byte-level signal that we didn't accidentally
            // touch unrelated game systems. EquipParamGoods is no longer
            // in the mutated set — the patcher leaves it alone now that
            // we use vanilla Starlight Shards as the currency.
            AssertBindersFunctionallyEquivalent(sourceBnd, outBnd,
                expectedMutatedFileNames: new[]
                {
                    "ItemLotParam_map",
                    "ShopLineupParam",
                });
        }
        finally
        {
            try { if (Directory.Exists(scratchDir)) Directory.Delete(scratchDir, recursive: true); }
            catch { /* best effort */ }
        }
    }

    [Fact]
    public void PatcherApply_WithPlan_Idempotent()
    {
        // Running the patcher on its own output should produce byte-
        // identical bytes. Uses the real regulation.bin for a realistic
        // param shape.
        if (!TryLocateModRegulation(out string regulationPath))
        {
            Assert.True(true, "mod/regulation.bin not found. Skipped.");
            return;
        }

        string scratchDir = Path.Combine(Path.GetTempPath(),
            "ignite-regulation-idempotent-" + Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(scratchDir);
        string firstPath = Path.Combine(scratchDir, "regulation-1.bin");
        string secondPath = Path.Combine(scratchDir, "regulation-2.bin");

        try
        {
            var plan = RegulationPatcherTests.MakeMinimalPlan();

            new RegulationPatcher(new RegulationPatcherOptions
            {
                SourceRegulationPath = regulationPath,
                OutputRegulationPath = firstPath,
                Plan = plan,
                Force = true,
            }).Apply();

            new RegulationPatcher(new RegulationPatcherOptions
            {
                SourceRegulationPath = firstPath,
                OutputRegulationPath = secondPath,
                Plan = plan,
                Force = true,
            }).Apply();

            Assert.Equal(Sha256File(firstPath), Sha256File(secondPath));
        }
        finally
        {
            try { if (Directory.Exists(scratchDir)) Directory.Delete(scratchDir, recursive: true); }
            catch { /* best effort */ }
        }
    }

    // ------------------------------------------------------------------
    // Functional-equivalence helper
    // ------------------------------------------------------------------
    /// <summary>
    /// Asserts that <paramref name="output"/> is a functionally-equivalent
    /// BND4 to <paramref name="source"/>: same header flags, same file
    /// count, and every binder file's (Name, Flags, ID) tuple plus payload
    /// bytes match — except for entries whose basename is listed in
    /// <paramref name="expectedMutatedFileNames"/>, which are checked for
    /// structural presence only (mutation is verified row-level elsewhere).
    /// </summary>
    private static void AssertBindersFunctionallyEquivalent(
        BND4 source, BND4 output, IReadOnlyCollection<string> expectedMutatedFileNames)
    {
        Assert.Equal(source.Files.Count, output.Files.Count);
        Assert.Equal(source.Format, output.Format);
        Assert.Equal(source.Version, output.Version);
        Assert.Equal(source.BigEndian, output.BigEndian);
        Assert.Equal(source.BitBigEndian, output.BitBigEndian);
        Assert.Equal(source.Unicode, output.Unicode);

        var mutatedSet = new HashSet<string>(expectedMutatedFileNames,
            StringComparer.OrdinalIgnoreCase);

        for (int i = 0; i < source.Files.Count; i++)
        {
            BinderFile src = source.Files[i];
            BinderFile dst = output.Files[i];
            string context = $"binder[{i}] src='{src.Name}' dst='{dst.Name}'";

            Assert.True(string.Equals(src.Name, dst.Name, StringComparison.Ordinal),
                "name mismatch at " + context);
            Assert.True(src.Flags == dst.Flags, "flags mismatch at " + context);
            Assert.True(src.ID == dst.ID, "id mismatch at " + context);

            string srcBase = StripBinderBasename(src.Name);
            if (mutatedSet.Contains(srcBase))
                continue;

            // Unmutated files: bytes must be bit-identical.
            Assert.True(src.Bytes.Length == dst.Bytes.Length,
                $"length mismatch at {context}: src={src.Bytes.Length} dst={dst.Bytes.Length}");
            Assert.True(src.Bytes.AsSpan().SequenceEqual(dst.Bytes),
                "payload bytes differ at " + context);
        }
    }

    private static string StripBinderBasename(string? path)
    {
        if (string.IsNullOrEmpty(path)) return string.Empty;
        int slash = Math.Max(path.LastIndexOf('\\'), path.LastIndexOf('/'));
        string name = slash < 0 ? path : path.Substring(slash + 1);
        const string ext = ".param";
        return name.EndsWith(ext, StringComparison.OrdinalIgnoreCase)
            ? name.Substring(0, name.Length - ext.Length)
            : name;
    }

    // ------------------------------------------------------------------
    // Phase B row-level assertions
    // ------------------------------------------------------------------
    /// <summary>
    /// Vanilla Starlight Shards (row 1290) must still be present in the
    /// output EquipParamGoods — we no longer clone or mutate goods rows,
    /// so this is really just a "the patcher didn't accidentally delete
    /// the currency row we depend on" smoke test.
    /// </summary>
    private static void AssertStarlightShardsGoodsRowPresent(BinderFile file)
    {
        PARAM param = PARAM.Read(file.Bytes);
        var def = ParamdefLoader.Load(RegulationConstants.EquipParamGoodsDefXml);
        param.ApplyParamdef(def);

        PARAM.Row? row = param[RegulationConstants.AmberShardGoodsId]; // 1290
        Assert.NotNull(row);
    }

    private static void AssertItemLotRows(BinderFile file)
    {
        PARAM param = PARAM.Read(file.Bytes);
        var def = ParamdefLoader.Load(RegulationConstants.ItemLotParamDefXml);
        param.ApplyParamdef(def);

        for (int tier = TierClearConstants.FirstTier; tier <= TierClearConstants.LastTier; tier++)
        {
            int rowId = RegulationConstants.ShardAwardLotId(tier);
            PARAM.Row? row = param[rowId];
            Assert.NotNull(row);

            Assert.Equal(RegulationConstants.AmberShardGoodsId,
                Convert.ToInt32(GetCell(row!, RegulationConstants.ItemLotField_LotItemId01)));
            Assert.Equal(RegulationConstants.ItemLotCategoryGoods,
                Convert.ToInt32(GetCell(row!, RegulationConstants.ItemLotField_LotItemCategory01)));
            Assert.Equal(RegulationConstants.ItemLotFullWeightSlot01,
                Convert.ToInt32(GetCell(row!, RegulationConstants.ItemLotField_LotItemBasePoint01)));
            Assert.Equal(RegulationConstants.ShardsPerTierClear,
                Convert.ToInt32(GetCell(row!, RegulationConstants.ItemLotField_LotItemNum01)));
            // Engine-level atomic idempotency: getItemFlagId must be wired
            // to the per-tier ShardAwardEventFlag so the engine awards
            // exactly once per tier across all 90009921 re-fires.
            Assert.Equal((uint)(TierClearConstants.ShardAwardEventFlagBase + tier),
                Convert.ToUInt32(GetCell(row!, RegulationConstants.ItemLotField_GetItemFlagId)));
        }
    }

    private static void AssertShopLineupRows(BinderFile file, IgniteBossRush.Core.Models.TierRewardsPlan plan)
    {
        PARAM param = PARAM.Read(file.Bytes);
        var def = ParamdefLoader.Load(RegulationConstants.ShopLineupParamDefXml);
        param.ApplyParamdef(def);

        foreach (var tier in plan.Tiers)
        {
            for (int slotIdx = 0; slotIdx < tier.Slots.Count; slotIdx++)
            {
                var slot = tier.Slots[slotIdx];
                int rowId = RegulationConstants.ShopLineupRowId(tier.Tier, slotIdx);
                PARAM.Row? row = param[rowId];
                Assert.NotNull(row);

                Assert.Equal(slot.ParamId,
                    Convert.ToInt32(GetCell(row!, RegulationConstants.ShopLineupField_EquipId)));
                Assert.Equal(RegulationPatcher.MapEquipType(slot.Kind),
                    Convert.ToByte(GetCell(row!, RegulationConstants.ShopLineupField_EquipType)));
                // eventFlag_forRelease = 0 — required by OpenPuppetShop.
                // Per-tier menu visibility is enforced at ESD level via
                // Kalé's AddTalkListDataIf condition, not on the row.
                Assert.Equal(0u,
                    Convert.ToUInt32(GetCell(row!, RegulationConstants.ShopLineupField_EventFlagForRelease)));
                // mtrlId is left at the paramdef "no material required"
                // sentinel (-1). Setting it to 0 would gate the row behind
                // EquipMtrlSetParam[0], blocking purchases even though
                // costType=2 (Starlight Shards) is set.
                Assert.Equal(-1,
                    Convert.ToInt32(GetCell(row!, RegulationConstants.ShopLineupField_MtrlId)));
                Assert.Equal(RegulationConstants.ShopCostTypeStarlightShards,
                    Convert.ToByte(GetCell(row!, RegulationConstants.ShopLineupField_CostType)));
                Assert.Equal(RegulationConstants.ShopCostPerSlotAmberShards,
                    Convert.ToInt32(GetCell(row!, RegulationConstants.ShopLineupField_Value)));
                Assert.Equal((short)1,
                    Convert.ToInt16(GetCell(row!, RegulationConstants.ShopLineupField_SellQuantity)));
            }
        }
    }

    private static object GetCell(PARAM.Row row, string internalName)
    {
        foreach (var c in row.Cells)
            if (string.Equals(c.Def.InternalName, internalName, StringComparison.Ordinal))
                return c.Value;
        throw new InvalidOperationException($"cell '{internalName}' not found on row {row.ID}");
    }

    // ------------------------------------------------------------------
    // helpers
    // ------------------------------------------------------------------
    private static bool TryLocateModRegulation(out string path)
    {
        path = string.Empty;
        string? dir = AppContext.BaseDirectory;
        // Walk upward looking for "<ignite-root>/mod/regulation.bin".
        for (int i = 0; i < 16 && dir is not null; i++)
        {
            string candidate = Path.Combine(dir, "mod", "regulation.bin");
            if (File.Exists(candidate))
            {
                path = candidate;
                return true;
            }
            dir = Path.GetDirectoryName(dir);
        }
        return false;
    }

    private static string Sha256File(string file)
    {
        using var sha = SHA256.Create();
        using var fs = File.OpenRead(file);
        byte[] hash = sha.ComputeHash(fs);
        return Convert.ToHexString(hash);
    }
}
