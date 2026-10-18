// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Buffers.Binary;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.Json;
using BossRush.Core.Io;
using BossRush.Core.Models;
using SoulsFormats;

namespace BossRush.Core.Patching;

/// <summary>
/// Binary equivalent of Python's step6-patcher/patch_mod.py.
///
/// Produces a patched copy of the mod's <c>event/</c> folder with:
///
///   (a) 11 reward events (90001032-36, 42-46, 80) in common_func.emevd.dcx
///       rebuilt from scratch as an inline if-chain that inspects the caller-
///       forwarded boss_flag (parameter X0_4) and sets the six pre-rolled
///       award flags plus the RNG-done sync flag (1049302620).
///
///   (b) Event 90001003 (crafting-material dispatcher) in common_func.emevd.dcx
///       flattened to a single END instruction (no-op).
///
///   (c) Every Initialize*Event caller of those 11 events, in any .emevd.dcx
///       in the event/ folder, gets its stone-slot args nulled to -1 when the
///       current lot_id is tagged "pure_stone" in exclusions.json.
///
/// Why inline dispatch? EMEVD's InitializeCommonEvent (bank 2000, id 6) stores
/// every arg as a literal in the opcode stream. Passing a parent event's
/// parameter (X0_4) through to a shared sub-dispatcher triggers the binder's
/// "Linked event initializers cannot be dependent on parameters." rule. Inside
/// a reward event body, X0_4 IS a legal operand (the parent arg is present in
/// the event's own param block), so we keep the dispatch local to each event.
///
/// The patcher never touches EMELD, linked-file tables, or string data — only
/// Events[] contents. That preserves whatever bytes SoulsFormatsNEXT emits for
/// untouched streams (Phase0_RoundTripTest verified bit-identical round-trip
/// across the full mod), so changes in the output .emevd.dcx are exactly what
/// the patcher intends, nothing more.
/// </summary>
public sealed class EmevdPatcher
{
    public const string ToolName = "BossRush-ModPatcher-CS";
    public const string ToolVersion = "0.1.0"; // first C# release — parity with Py v0.3.0

    public EmevdPatcherOptions Options { get; }

    public EmevdPatcher(EmevdPatcherOptions options)
    {
        Options = options ?? throw new ArgumentNullException(nameof(options));
    }

    // ---------------------------------------------------------------------
    public EmevdPatchResult Patch()
    {
        // --- load JSON inputs ---
        var flagPool = JsonLoader.LoadFile<FlagPoolFile>(Options.FlagPoolPath);
        var exclusions = JsonLoader.LoadFile<ExclusionsFile>(Options.ExclusionsPath);
        var bossCatalog = JsonLoader.LoadFile<BossCatalogFile>(Options.BossCatalogPath);
        var drops = ReadDropsJson(Options.DropsJsonPath);

        var lotToAwardFlag = BuildReverseLookup(flagPool);
        var pureStones = BuildPureStoneSet(exclusions);
        var bossToRewardEvent = BuildBossToRewardEvent(bossCatalog);

        var branchesByRewardEvent = BuildBranchesByRewardEvent(
            drops, bossToRewardEvent, lotToAwardFlag);

        // --- prepare output event dir ---
        if (!Directory.Exists(Options.SourceEventDir))
            throw new DirectoryNotFoundException($"Source event dir not found: {Options.SourceEventDir}");
        if (Directory.Exists(Options.OutputEventDir))
        {
            if (!Options.Force)
                throw new IOException(
                    $"Output event dir {Options.OutputEventDir} already exists; set Force=true to overwrite");
            Directory.Delete(Options.OutputEventDir, recursive: true);
        }
        Directory.CreateDirectory(Options.OutputEventDir);

        // --- iterate all .emevd.dcx in source ---
        var dcxFiles = Directory.EnumerateFiles(Options.SourceEventDir, "*.emevd.dcx")
            .OrderBy(p => Path.GetFileName(p), StringComparer.Ordinal)
            .ToList();
        if (dcxFiles.Count == 0)
            throw new InvalidOperationException(
                $"No .emevd.dcx files under {Options.SourceEventDir} — wrong folder?");

        int rewardEventsRebuilt = 0;
        int branchesTotal = 0;
        int craftingNeutered = 0;
        int filesModified = 0;
        int callerEditsTotal = 0;
        int individualStoneArgsNulled = 0;
        var callerEditSamples = new List<CallerEditSample>();
        var perFileStats = new List<PerFileStats>();

        foreach (var srcPath in dcxFiles)
        {
            string name = Path.GetFileName(srcPath);
            bool isCommonFunc = string.Equals(name, "common_func.emevd.dcx", StringComparison.OrdinalIgnoreCase);

            byte[] srcBytes = File.ReadAllBytes(srcPath);
            EMEVD emevd = EMEVD.Read(srcBytes);

            bool mutated = false;

            // (1) per-file caller-site stone nulling (applies to ALL files)
            int fileCallerEdits = 0;
            int fileStoneArgsNulled = 0;
            foreach (var ev in emevd.Events)
            {
                var evEdits = NullStoneCallerArgsInEvent(
                    ev, pureStones, name, callerEditSamples);
                if (evEdits.CallerSitesEdited > 0)
                {
                    fileCallerEdits += evEdits.CallerSitesEdited;
                    fileStoneArgsNulled += evEdits.IndividualArgsNulled;
                    mutated = true;
                }
            }

            // (2) common_func-only structural patches
            int fileRewardRebuilt = 0;
            int fileBranches = 0;
            bool fileNeutered = false;
            if (isCommonFunc)
            {
                // Index events by ID
                var byId = new Dictionary<long, EMEVD.Event>(emevd.Events.Count);
                foreach (var ev in emevd.Events)
                    byId[ev.ID] = ev; // later duplicate wins — matches SoulsFormats iteration order

                foreach (long rid in PatchConstants.RewardEvents)
                {
                    if (!byId.TryGetValue(rid, out var ev))
                        throw new InvalidOperationException(
                            $"Reward event {rid} not found in common_func.emevd.dcx");
                    var rows = branchesByRewardEvent.TryGetValue((int)rid, out var r) ? r : new List<BranchEntry>();
                    RebuildRewardEvent(ev, (int)rid, rows);
                    fileRewardRebuilt++;
                    fileBranches += rows.Count;
                    mutated = true;
                }

                if (!byId.TryGetValue(PatchConstants.CraftingDispatcherEventId, out var craft))
                    throw new InvalidOperationException(
                        $"Event {PatchConstants.CraftingDispatcherEventId} not found in common_func.emevd.dcx");
                NeuterEvent(craft);
                fileNeutered = true;
                mutated = true;
            }

            // Write output
            string destPath = Path.Combine(Options.OutputEventDir, name);
            if (mutated)
            {
                byte[] outBytes = emevd.Write();
                File.WriteAllBytes(destPath, outBytes);
                filesModified++;
            }
            else
            {
                // Unchanged file: copy verbatim so subsequent tools see identical bytes.
                File.WriteAllBytes(destPath, srcBytes);
            }

            rewardEventsRebuilt += fileRewardRebuilt;
            branchesTotal += fileBranches;
            if (fileNeutered) craftingNeutered++;
            callerEditsTotal += fileCallerEdits;
            individualStoneArgsNulled += fileStoneArgsNulled;
            perFileStats.Add(new PerFileStats(
                FileName: name,
                RewardEventsRebuilt: fileRewardRebuilt,
                DispatchBranches: fileBranches,
                CraftingNeutered: fileNeutered,
                CallerSitesEdited: fileCallerEdits,
                StoneArgsNulled: fileStoneArgsNulled));
        }

        return new EmevdPatchResult(
            OutputEventDir: Options.OutputEventDir,
            FilesModified: filesModified,
            RewardEventsRebuilt: rewardEventsRebuilt,
            DispatchBranchesTotal: branchesTotal,
            CraftingDispatcherNeutered: craftingNeutered == 1,
            CallerSitesEdited: callerEditsTotal,
            IndividualStoneArgsNulled: individualStoneArgsNulled,
            PerFileStats: perFileStats,
            CallerEditSamples: callerEditSamples);
    }

    // ---------------------------------------------------------------------
    // Reward-event surgical splice
    // ---------------------------------------------------------------------
    //
    // IMPORTANT: the reward event body contains critical downstream logic
    // that MUST be preserved — the AwardItemLot calls, the
    // `SetEventFlagID(X0_4, ON)` call that marks the boss as defeated (which
    // in turn drives the teleporter's "next boss" selection), and the
    // `$InitializeCommonEvent(0, 90001052/54/55)` calls that actually grant
    // the items corresponding to the award flags we set. Earlier versions
    // of this code rebuilt the event body from scratch (wiping ev.Instructions)
    // which caused two in-game bugs:
    //
    //   * bosses dropped nothing (item-grant sub-events were never invoked)
    //   * the teleporter sent players to the boss they'd just killed
    //     (the "boss defeated" flag was never set)
    //
    // The Python reference does a surgical regex splice on the .js source,
    // replacing exactly two source-level patterns and preserving everything
    // else. This C# equivalent does the same splice at the EMEVD instruction
    // level:
    //
    //   1. Locate the mode-dispatch block (guards + InitializeCommonEvent
    //      targeting 90001050 + else-if branch) and REPLACE it with an
    //      inline SkipIfComparison chain keyed on X0_4 (the forwarded
    //      boss_flag parameter).
    //   2. Locate the conditional `if (A || B) WaitFor(sync_flag);` and
    //      strip the guard so the WaitFor is unconditional.
    //
    // All other instructions in the event body, including pre-dispatch prolog
    // (EndIf, mode-toggle rolls) and post-dispatch epilog (AwardItemLot,
    // SetEventFlagID(X0_4, ON), InitializeCommonEvent(0, 90001052/54/55)),
    // are preserved byte-for-byte.
    internal static void RebuildRewardEvent(EMEVD.Event ev, int rewardEventId, List<BranchEntry> rows)
    {
        // Build the inline SkipIf chain we'll splice in.
        var inlineInstructions = new List<EMEVD.Instruction>(capacity: rows.Count * 8 + 1);
        var inlineParameters = new List<EMEVD.Parameter>(capacity: rows.Count);
        BuildInlineDispatchChain(rows, inlineInstructions, inlineParameters);

        // Step (1): surgical replacement of the mode-dispatch block.
        SpliceModeDispatchBlock(ev, rewardEventId, inlineInstructions, inlineParameters);

        // Step (2): strip the conditional guard on WaitFor(SyncDoneFlag) so
        // it matches Python's `//patched: unconditional sync on 1049302620`.
        StripConditionalWaitForGuard(ev, rewardEventId);
    }

    private static void BuildInlineDispatchChain(
        List<BranchEntry> rows,
        List<EMEVD.Instruction> instructions,
        List<EMEVD.Parameter> parameters)
    {
        int unkId = 1;
        const int BodyLen = 7; // 6 category SetEventFlag + 1 sync SetEventFlag

        foreach (var row in rows)
        {
            // SKIP IF Comparison  skip=BodyLen, cmpType=NotEqual, lhs=<placeholder>, rhs=boss_flag
            // The lhs literal (0) is overwritten at invocation time by Parameter
            // substitution pulling bytes 0..3 from the caller's arg block
            // (X0_4 = boss_flag). When lhs == rhs, the skip is NOT taken and
            // the 7 SetEventFlag instructions that follow fire. When lhs != rhs
            // execution jumps over them to the next SkipIfComparison.
            int skipInstrIdx = instructions.Count;
            instructions.Add(InstructionFactory.SkipIfComparison(
                skip: (byte)BodyLen,
                cmp: PatchConstants.CmpNotEqual,
                lhs: 0,
                rhs: (int)row.BossFlag));

            var param = InstructionFactory.BossFlagParameter(skipInstrIdx);
            param.UnkID = unkId++;
            parameters.Add(param);

            instructions.Add(InstructionFactory.SetEventFlagOn(row.AwardFlagWeapon));
            instructions.Add(InstructionFactory.SetEventFlagOn(row.AwardFlagArmor));
            instructions.Add(InstructionFactory.SetEventFlagOn(row.AwardFlagTalisman));
            instructions.Add(InstructionFactory.SetEventFlagOn(row.AwardFlagSpell));
            instructions.Add(InstructionFactory.SetEventFlagOn(row.AwardFlagAowTool));
            instructions.Add(InstructionFactory.SetEventFlagOn(row.AwardFlagAshesTear));
            instructions.Add(InstructionFactory.SetEventFlagOn(PatchConstants.SyncDoneFlag));
        }

        // Fallback: unconditionally set sync flag so downstream WaitFor never
        // deadlocks even if an unregistered boss_flag is forwarded.
        instructions.Add(InstructionFactory.SetEventFlagOn(PatchConstants.SyncDoneFlag));
    }

    // ---------------------------------------------------------------------
    // Dispatch-block identification + splice
    // ---------------------------------------------------------------------
    // The unpatched common_func source has, inside each reward event body:
    //
    //     if (EventFlag(1049300055) || EventFlag(1049300061))
    //         $InitializeCommonEvent(0, 90001050);
    //     else if (EventFlag(1049300063)) {
    //         BatchSetEventFlags(...);
    //     }
    //
    // At the binary level this becomes, in rough terms:
    //
    //     [SkipIfEventFlag state=ON  flag=1049300055 skip=1]   ← guard 1 of the if-head
    //     [SkipIfEventFlag state=OFF flag=1049300061 skip=1]   ← guard 2 of the if-head
    //     [InitializeCommonEvent(0, 90001050, …)]              ← anchor
    //     [SkipUnconditionally skip=N]                         ← jumps over the else-if
    //     [SkipIfEventFlag state=OFF flag=1049300063 skip=M]   ← else-if guard
    //     [BatchSetEventFlags(...)]                            ← else-if body (1+ instructions)
    //
    // We locate the anchor (there's exactly one InitializeCommonEvent
    // targeting 90001050 per reward event), walk backward to absorb the
    // guard SkipIfEventFlags for 1049300055/1049300061, walk forward to
    // absorb the SkipUnconditionally + else-if guard + its body (using the
    // else-if guard's own skip count to determine body length).
    private static void SpliceModeDispatchBlock(
        EMEVD.Event ev,
        int rewardEventId,
        List<EMEVD.Instruction> newInstructions,
        List<EMEVD.Parameter> newParameters)
    {
        int anchorIdx = FindDispatchAnchor(ev, rewardEventId);

        // Walk backward across consecutive dispatch-guard SkipIfEventFlags.
        int startIdx = anchorIdx;
        while (startIdx > 0 && IsDispatchGuardSkip(ev.Instructions[startIdx - 1]))
            startIdx--;

        // Walk forward past SkipUnconditionally + else-if guard + body.
        int endIdx = anchorIdx + 1; // exclusive; default covers only the anchor
        if (endIdx < ev.Instructions.Count && IsSkipUnconditionally(ev.Instructions[endIdx]))
            endIdx++;
        if (endIdx < ev.Instructions.Count
            && IsFlagSkip(ev.Instructions[endIdx], 1049300063u, out byte elseSkip))
        {
            int elseBodyEnd = endIdx + 1 + elseSkip;
            if (elseBodyEnd > ev.Instructions.Count)
                throw new InvalidOperationException(
                    $"Event {rewardEventId}: else-if guard claims skip={elseSkip} but event only "
                    + $"has {ev.Instructions.Count} instructions starting at index {endIdx + 1}");
            endIdx = elseBodyEnd;
        }

        int oldBlockLen = endIdx - startIdx;
        int newBlockLen = newInstructions.Count;
        int delta = newBlockLen - oldBlockLen;

        // Splice instructions.
        var instrList = new List<EMEVD.Instruction>(ev.Instructions.Count - oldBlockLen + newBlockLen);
        for (int i = 0; i < startIdx; i++) instrList.Add(ev.Instructions[i]);
        instrList.AddRange(newInstructions);
        for (int i = endIdx; i < ev.Instructions.Count; i++) instrList.Add(ev.Instructions[i]);
        ev.Instructions = instrList;

        // Rewrite Parameters:
        //   - indices < startIdx: preserved unchanged
        //   - indices in [startIdx, endIdx): drop (they pointed at the old
        //     dispatch block which is gone; the original mod doesn't attach
        //     parameters to the dispatch SkipIfs / InitializeCommonEvent
        //     constants, but if a future mod did we'd lose them here — that's
        //     OK because the whole block is being replaced by new logic)
        //   - indices >= endIdx: shift by delta
        var paramList = new List<EMEVD.Parameter>();
        foreach (var p in ev.Parameters)
        {
            long idx = p.InstructionIndex;
            if (idx < startIdx)
            {
                paramList.Add(p);
            }
            else if (idx >= endIdx)
            {
                p.InstructionIndex = idx + delta;
                paramList.Add(p);
            }
            // else: inside spliced range — drop
        }
        // Append new parameters, shifting their local indices (which were
        // emitted relative to the start of inlineInstructions) to absolute
        // positions in the final Instructions list.
        foreach (var np in newParameters)
        {
            np.InstructionIndex = np.InstructionIndex + startIdx;
            paramList.Add(np);
        }
        ev.Parameters = paramList;
    }

    private static int FindDispatchAnchor(EMEVD.Event ev, int rewardEventId)
    {
        int anchorIdx = -1;
        for (int i = 0; i < ev.Instructions.Count; i++)
        {
            var ins = ev.Instructions[i];
            if (ins.Bank != PatchConstants.BankSystem) continue;
            if (ins.ID != PatchConstants.IdInitializeCommonEvent) continue;
            if (ins.ArgData.Length < 8) continue;
            uint targetEventId = BinaryPrimitives.ReadUInt32LittleEndian(
                ins.ArgData.AsSpan(4, 4));
            if (targetEventId != 90001050u) continue;

            if (anchorIdx >= 0)
                throw new InvalidOperationException(
                    $"Event {rewardEventId}: multiple InitializeCommonEvent(_, 90001050) "
                    + $"calls found (indices {anchorIdx} and {i}). Expected exactly one.");
            anchorIdx = i;
        }
        if (anchorIdx < 0)
            throw new InvalidOperationException(
                $"Event {rewardEventId}: dispatch anchor InitializeCommonEvent(_, 90001050) "
                + "not found. Source mod does not match the expected Boss Rush layout.");
        return anchorIdx;
    }

    private static bool IsDispatchGuardSkip(EMEVD.Instruction ins)
    {
        if (ins.Bank != PatchConstants.BankControlFlowEvent) return false;
        if (ins.ID != PatchConstants.IdSkipIfEventFlag) return false;
        if (ins.ArgData.Length < 8) return false;
        uint flagId = BinaryPrimitives.ReadUInt32LittleEndian(ins.ArgData.AsSpan(4, 4));
        return flagId == 1049300055u || flagId == 1049300061u;
    }

    private static bool IsSkipUnconditionally(EMEVD.Instruction ins)
    {
        return ins.Bank == PatchConstants.BankControlFlowSystem
            && ins.ID == PatchConstants.IdSkipUnconditionally;
    }

    private static bool IsFlagSkip(EMEVD.Instruction ins, uint expectedFlagId, out byte skipCount)
    {
        skipCount = 0;
        if (ins.Bank != PatchConstants.BankControlFlowEvent) return false;
        if (ins.ID != PatchConstants.IdSkipIfEventFlag) return false;
        if (ins.ArgData.Length < 8) return false;
        uint flagId = BinaryPrimitives.ReadUInt32LittleEndian(ins.ArgData.AsSpan(4, 4));
        if (flagId != expectedFlagId) return false;
        skipCount = ins.ArgData[0]; // skip byte at offset 0
        return true;
    }

    // ---------------------------------------------------------------------
    // WaitFor conditional-guard stripping
    // ---------------------------------------------------------------------
    // The unpatched mod has, further down in each reward event body:
    //
    //     if (EventFlag(1049300055) || EventFlag(1049300061))
    //         WaitFor(EventFlag(1049302620));
    //
    // Python rewrites this to an unconditional `WaitFor(EventFlag(1049302620));`.
    // At the binary level we find the WaitFor-for-sync-flag instruction and
    // delete any immediately-preceding guard SkipIfEventFlags that check
    // the mode flags 1049300055 / 1049300061.
    private static void StripConditionalWaitForGuard(EMEVD.Event ev, int rewardEventId)
    {
        int waitIdx = -1;
        for (int i = 0; i < ev.Instructions.Count; i++)
        {
            var ins = ev.Instructions[i];
            if (ins.Bank != PatchConstants.BankControlFlowEvent) continue;
            if (ins.ID != PatchConstants.IdWaitForEventFlag) continue;
            if (ins.ArgData.Length < 8) continue;
            uint flagId = BinaryPrimitives.ReadUInt32LittleEndian(ins.ArgData.AsSpan(4, 4));
            if (flagId != PatchConstants.SyncDoneFlag) continue;

            if (waitIdx >= 0)
            {
                // Multiple WaitFors on sync flag is unexpected but not an
                // error per se — only strip guards on the first.
                break;
            }
            waitIdx = i;
        }
        if (waitIdx < 0) return; // no WaitFor(SyncDoneFlag) in this event — nothing to strip

        int guardStart = waitIdx;
        while (guardStart > 0 && IsDispatchGuardSkip(ev.Instructions[guardStart - 1]))
            guardStart--;

        int guardCount = waitIdx - guardStart;
        if (guardCount == 0) return; // already unconditional

        var instrList = new List<EMEVD.Instruction>(ev.Instructions.Count - guardCount);
        for (int i = 0; i < guardStart; i++) instrList.Add(ev.Instructions[i]);
        for (int i = waitIdx; i < ev.Instructions.Count; i++) instrList.Add(ev.Instructions[i]);
        ev.Instructions = instrList;

        var paramList = new List<EMEVD.Parameter>();
        foreach (var p in ev.Parameters)
        {
            long idx = p.InstructionIndex;
            if (idx < guardStart)
            {
                paramList.Add(p);
            }
            else if (idx >= waitIdx)
            {
                p.InstructionIndex = idx - guardCount;
                paramList.Add(p);
            }
            // else: param attached to a removed guard — drop defensively
        }
        ev.Parameters = paramList;
    }

    // ---------------------------------------------------------------------
    // Neuter 90001003 crafting dispatcher
    // ---------------------------------------------------------------------
    internal static void NeuterEvent(EMEVD.Event ev)
    {
        // Single END Unconditionally is the clearest "do-nothing" body and
        // survives any future linker that requires every event to terminate
        // explicitly. An empty Instructions list is also valid in practice,
        // but adding the explicit END matches the modding community's
        // convention and avoids depending on that runtime leniency.
        ev.Instructions = new List<EMEVD.Instruction>
        {
            InstructionFactory.EndUnconditionally(),
        };
        ev.Parameters = new List<EMEVD.Parameter>();
    }

    // ---------------------------------------------------------------------
    // Caller-site stone nulling
    // ---------------------------------------------------------------------
    private struct CallerEditCounts
    {
        public int CallerSitesEdited;
        public int IndividualArgsNulled;
    }

    private static CallerEditCounts NullStoneCallerArgsInEvent(
        EMEVD.Event ev, HashSet<int> pureStones, string fileName,
        List<CallerEditSample> sampleSink)
    {
        var counts = new CallerEditCounts();
        foreach (var instr in ev.Instructions)
        {
            if (instr.Bank != PatchConstants.BankSystem) continue;
            if (instr.ID != PatchConstants.IdInitializeEvent
                && instr.ID != PatchConstants.IdInitializeCommonEvent) continue;

            // ArgData layout: [slot:i32][eventId:u32][args:i32...]
            var ad = instr.ArgData;
            if (ad.Length < 8) continue;
            uint eventId = BinaryPrimitives.ReadUInt32LittleEndian(ad.AsSpan(4, 4));
            if (!PatchConstants.StoneSlotIndices.TryGetValue((int)eventId, out var stoneIdx)) continue;

            bool dirty = false;
            int thisSiteNulled = 0;
            foreach (int argIdx in stoneIdx)
            {
                int byteOffset = (argIdx + 2) * 4;
                if (byteOffset + 4 > ad.Length) continue;
                int lot = BinaryPrimitives.ReadInt32LittleEndian(ad.AsSpan(byteOffset, 4));
                if (!pureStones.Contains(lot)) continue;

                BinaryPrimitives.WriteInt32LittleEndian(ad.AsSpan(byteOffset, 4), -1);
                dirty = true;
                thisSiteNulled++;
                if (sampleSink.Count < 40)
                {
                    sampleSink.Add(new CallerEditSample(
                        File: fileName,
                        EventOwnerId: ev.ID,
                        TargetRewardEventId: (int)eventId,
                        ArgIndex: argIdx,
                        OldLotId: lot));
                }
            }
            if (dirty)
            {
                counts.CallerSitesEdited++;
                counts.IndividualArgsNulled += thisSiteNulled;
            }
        }
        return counts;
    }

    // ---------------------------------------------------------------------
    // drops.json loader + lookup builders
    // ---------------------------------------------------------------------
    internal sealed class BranchEntry
    {
        public long BossFlag;
        public uint AwardFlagWeapon;
        public uint AwardFlagArmor;
        public uint AwardFlagTalisman;
        public uint AwardFlagSpell;
        public uint AwardFlagAowTool;
        public uint AwardFlagAshesTear;
    }

    private static Dictionary<string, Dictionary<string, int>> ReadDropsJson(string path)
    {
        using var doc = JsonDocument.Parse(File.ReadAllBytes(path));
        var drops = doc.RootElement.GetProperty("drops");
        var table = new Dictionary<string, Dictionary<string, int>>();
        foreach (var boss in drops.EnumerateObject())
        {
            var row = new Dictionary<string, int>(CategoryNames.Ordered.Count);
            foreach (var cat in boss.Value.EnumerateObject())
                row[cat.Name] = cat.Value.GetInt32();
            table[boss.Name] = row;
        }
        return table;
    }

    internal static Dictionary<int, int> BuildReverseLookup(FlagPoolFile flagPool)
    {
        // Lot -> award_flag. Python enforces 1:1 — replicate that check.
        var rev = new Dictionary<int, int>();
        foreach (var kv in flagPool.AwardFlagToItemlot)
        {
            if (!int.TryParse(kv.Key, NumberStyles.Integer, CultureInfo.InvariantCulture, out int flagId))
                throw new InvalidDataException($"Non-integer award_flag key in flag_pool: {kv.Key}");
            foreach (var lot in kv.Value.Itemlots)
            {
                if (rev.TryGetValue(lot.LotId, out int existing) && existing != flagId)
                    throw new InvalidDataException(
                        $"Lot {lot.LotId} has multiple award flags: {existing} and {flagId}");
                rev[lot.LotId] = flagId;
            }
        }
        return rev;
    }

    internal static HashSet<int> BuildPureStoneSet(ExclusionsFile exclusions)
    {
        var set = new HashSet<int>();
        foreach (var kv in exclusions.SmithingStones.LotClassification)
        {
            if (kv.Value?.Verdict == "pure_stone" &&
                int.TryParse(kv.Key, NumberStyles.Integer, CultureInfo.InvariantCulture, out int id))
            {
                set.Add(id);
            }
        }
        return set;
    }

    internal static Dictionary<long, int> BuildBossToRewardEvent(BossCatalogFile catalog)
    {
        // First occurrence wins — matches Python.
        var map = new Dictionary<long, int>();
        foreach (var b in catalog.Bosses)
        {
            if (!map.ContainsKey(b.BossFlag))
                map[b.BossFlag] = b.RewardEvent;
        }
        return map;
    }

    internal static Dictionary<int, List<BranchEntry>> BuildBranchesByRewardEvent(
        Dictionary<string, Dictionary<string, int>> drops,
        Dictionary<long, int> bossToRewardEvent,
        Dictionary<int, int> lotToAwardFlag)
    {
        var result = new Dictionary<int, List<BranchEntry>>();
        foreach (var kv in drops)
        {
            // key format tolerated: "<flag>" or "<flag>@<addr>" (Python backward-compat)
            string keyHead = kv.Key;
            int at = keyHead.IndexOf('@');
            if (at >= 0) keyHead = keyHead.Substring(0, at);
            if (!long.TryParse(keyHead, NumberStyles.Integer, CultureInfo.InvariantCulture, out long bossFlag))
                throw new InvalidDataException($"Non-integer boss_key prefix in drops.json: {kv.Key}");
            if (!bossToRewardEvent.TryGetValue(bossFlag, out int rewardEvent))
                throw new InvalidDataException($"drops.json boss_flag {bossFlag} not in boss_catalog");

            var row = kv.Value;
            var entry = new BranchEntry
            {
                BossFlag         = bossFlag,
                AwardFlagWeapon  = LookupAwardFlag(row, "weapon",     lotToAwardFlag),
                AwardFlagArmor   = LookupAwardFlag(row, "armor",      lotToAwardFlag),
                AwardFlagTalisman= LookupAwardFlag(row, "talisman",   lotToAwardFlag),
                AwardFlagSpell   = LookupAwardFlag(row, "spell",      lotToAwardFlag),
                AwardFlagAowTool = LookupAwardFlag(row, "aow_tool",   lotToAwardFlag),
                AwardFlagAshesTear = LookupAwardFlag(row, "ashes_tear", lotToAwardFlag),
            };
            if (!result.TryGetValue(rewardEvent, out var list))
            {
                list = new List<BranchEntry>();
                result[rewardEvent] = list;
            }
            list.Add(entry);
        }

        // Sort branches by boss_flag for deterministic output
        foreach (var list in result.Values)
            list.Sort((a, b) => a.BossFlag.CompareTo(b.BossFlag));

        return result;
    }

    private static uint LookupAwardFlag(
        Dictionary<string, int> row, string cat, Dictionary<int, int> lotToAwardFlag)
    {
        if (!row.TryGetValue(cat, out int lot))
            throw new InvalidDataException($"drops row missing category {cat}");
        if (!lotToAwardFlag.TryGetValue(lot, out int flagId))
            throw new InvalidDataException($"lot {lot} (category {cat}) has no award_flag in flag_pool");
        return unchecked((uint)flagId);
    }
}

// =======================================================================
// Option + result types
// =======================================================================
public sealed class EmevdPatcherOptions
{
    public required string DropsJsonPath { get; init; }
    public required string FlagPoolPath { get; init; }
    public required string ExclusionsPath { get; init; }
    public required string BossCatalogPath { get; init; }
    public required string SourceEventDir { get; init; }
    public required string OutputEventDir { get; init; }
    public bool Force { get; init; }
}

public sealed record EmevdPatchResult(
    string OutputEventDir,
    int FilesModified,
    int RewardEventsRebuilt,
    int DispatchBranchesTotal,
    bool CraftingDispatcherNeutered,
    int CallerSitesEdited,
    int IndividualStoneArgsNulled,
    IReadOnlyList<PerFileStats> PerFileStats,
    IReadOnlyList<CallerEditSample> CallerEditSamples);

public sealed record PerFileStats(
    string FileName,
    int RewardEventsRebuilt,
    int DispatchBranches,
    bool CraftingNeutered,
    int CallerSitesEdited,
    int StoneArgsNulled);

public sealed record CallerEditSample(
    string File,
    long EventOwnerId,
    int TargetRewardEventId,
    int ArgIndex,
    int OldLotId);
