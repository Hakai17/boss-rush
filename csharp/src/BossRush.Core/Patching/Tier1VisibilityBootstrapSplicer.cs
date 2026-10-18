// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Buffers.Binary;
using SoulsFormats;

namespace BossRush.Core.Patching;

/// <summary>
/// Makes Merchant Kalé's tier-1 shop slots <i>visible from game start</i> by
/// flipping <see cref="TierClearConstants.Tier1VisibilityFlag"/> ON inside the
/// mod's once-per-load init event.
///
/// <para>
/// <b>Why this is needed.</b> The Phase B regulation patch gates each tier's
/// 11 ShopLineupParam rows behind a per-tier visibility flag in the
/// <see cref="TierClearConstants.ShopVisibilityFlagBase"/> range. The mod's
/// init event (<see cref="TierClearConstants.ModInitEventId"/>) wipes the
/// entire range OFF on every game load via
/// <c>BatchSetEventFlags(1049308400, 1049308999, OFF)</c>. Tiers 2..9 get
/// flipped ON by the OnTierClear[N-1] event we splice in via
/// <see cref="TierClearEventSplicer"/> — but tier 1 has no predecessor to flip
/// it, so without this bootstrap Merchant Kalé's menu stays empty until the
/// player clears tier 1, and then only shows tier 2's wares (off by one!).
/// Bootstrap fixes that: tier 1 visible from start, tier 2 visible after
/// clearing tier 1, ... tier 9 visible after clearing tier 8.
/// </para>
///
/// <para>
/// <b>Why splice rather than register a new event in the constructor.</b> The
/// init event runs the batch reset and the bootstrap must run <i>after</i> it,
/// otherwise the reset would clobber our ON. Splicing the SetEventFlagID call
/// directly into the init event right after the batch reset gives a
/// guaranteed-after ordering that an independent constructor-registered event
/// can't promise (EMEVD doesn't define ordering between concurrently-launched
/// common events).
/// </para>
///
/// <para>
/// <b>Idempotency.</b> Re-running the splicer on already-bootstrapped EMEVD is
/// a silent no-op — detected by checking whether the instruction immediately
/// after the batch reset is already a <c>SetEventFlagID(Tier1VisibilityFlag, ON)</c>
/// matching ours. This mirrors <see cref="TierClearEventSplicer"/>'s own
/// idempotent re-patch convention so a competition organiser can safely re-run
/// the pipeline against a workdir that's already been patched.
/// </para>
///
/// <para>
/// <b>Loud failure modes.</b> Missing init event, multiple matching batch
/// resets in the init event, or a batch reset with the right range but found
/// at a position we can't safely splice after — all throw
/// <see cref="InvalidOperationException"/>. The splicer never silently
/// succeeds when its assumptions about the source layout don't hold; that's
/// the same convention <see cref="TierClearEventSplicer"/> uses and it caught
/// the original tier-clear collision bug at unit-test time.
/// </para>
/// </summary>
public static class Tier1VisibilityBootstrapSplicer
{
    /// <summary>
    /// Mutates <paramref name="commonFunc"/> in place. Returns whether the
    /// SetEventFlag was freshly inserted or already present from a prior run.
    /// </summary>
    public static Tier1BootstrapResult Apply(EMEVD commonFunc)
    {
        ArgumentNullException.ThrowIfNull(commonFunc);

        // ---- Locate the init event -----------------------------------------
        EMEVD.Event? initEvent = null;
        foreach (var ev in commonFunc.Events)
        {
            if (ev.ID == TierClearConstants.ModInitEventId)
            {
                initEvent = ev;
                break; // first-wins, same convention as TierClearEventSplicer
            }
        }
        if (initEvent is null)
        {
            throw new InvalidOperationException(
                $"Tier-1 bootstrap: init event {TierClearConstants.ModInitEventId} not found "
                + "in common_func.emevd. The mod does not match the expected Boss Rush layout.");
        }

        // ---- Locate the batch reset anchor ---------------------------------
        // We require EXACTLY one BatchSetEventFlags call inside the init event
        // matching (1049308400, 1049308999, OFF). The init event has several
        // batch resets across different ranges; if there are zero or two+
        // matches the splicer fails loud — silent best-guess insertion is how
        // patch bugs hide in plain sight. (Same defensive posture as
        // TierClearEventSplicer.FindAnchorIndex.)
        int anchorIdx = -1;
        for (int i = 0; i < initEvent.Instructions.Count; i++)
        {
            if (!IsTargetBatchReset(initEvent.Instructions[i])) continue;
            if (anchorIdx >= 0)
            {
                throw new InvalidOperationException(
                    $"Tier-1 bootstrap: multiple BatchSetEventFlags("
                    + $"{TierClearConstants.BatchResetStart}, "
                    + $"{TierClearConstants.BatchResetEnd}, OFF) calls "
                    + $"found in init event {TierClearConstants.ModInitEventId} "
                    + $"(indices {anchorIdx} and {i}). Expected exactly one.");
            }
            anchorIdx = i;
        }
        if (anchorIdx < 0)
        {
            throw new InvalidOperationException(
                $"Tier-1 bootstrap: anchor BatchSetEventFlags("
                + $"{TierClearConstants.BatchResetStart}, "
                + $"{TierClearConstants.BatchResetEnd}, OFF) not found in init "
                + $"event {TierClearConstants.ModInitEventId}. Source mod does "
                + "not match the expected Boss Rush layout.");
        }

        // ---- Idempotency check ---------------------------------------------
        // The splice point is anchorIdx + 1. If that slot already holds our
        // SetEventFlagID(Tier1VisibilityFlag, ON), the patcher has run before
        // and we leave the bytes untouched. Any other instruction at that
        // slot means this is a fresh splice and we'll insert in front of it.
        int spliceIdx = anchorIdx + 1;
        if (spliceIdx < initEvent.Instructions.Count
            && IsSetEventFlagOnFor(
                initEvent.Instructions[spliceIdx],
                TierClearConstants.Tier1VisibilityFlag))
        {
            return new Tier1BootstrapResult(
                Inserted: false,
                AlreadyPresent: true,
                AnchorInstructionIndex: anchorIdx,
                SpliceInstructionIndex: spliceIdx);
        }

        // ---- Insert and shift parameter indices ----------------------------
        var bootstrap = InstructionFactory.SetEventFlagOn(TierClearConstants.Tier1VisibilityFlag);
        initEvent.Instructions.Insert(spliceIdx, bootstrap);

        // Shift any Parameters that pointed at instructions ≥ spliceIdx by +1.
        // The init event in the inspected source has zero Parameters (it's a
        // pure linear sequence of unconditional flag/value sets), but we apply
        // the shift defensively in case the source is edited.
        foreach (var p in initEvent.Parameters)
        {
            if (p.InstructionIndex >= spliceIdx)
                p.InstructionIndex += 1;
        }

        // Bump the skip-count byte of any preceding count-based skip whose
        // target crosses the insertion point — mirrors the same fix in
        // TierClearEventSplicer. The init event's top-of-body
        // EndIf(EventFlag(1049300000)) compiles to a SKIP IF Event Flag that
        // jumps to the event's end; inserting our bootstrap in the middle
        // without bumping that skip would cause the guard to short-circuit
        // one instruction early on repeat game-loads.
        SpliceHelpers.AdjustPrecedingSkipCounts(initEvent.Instructions, spliceIdx);

        return new Tier1BootstrapResult(
            Inserted: true,
            AlreadyPresent: false,
            AnchorInstructionIndex: anchorIdx,
            SpliceInstructionIndex: spliceIdx);
    }

    // ------------------------------------------------------------------
    // Instruction shape predicates
    // ------------------------------------------------------------------
    /// <summary>True iff <paramref name="ins"/> is exactly
    /// <c>BatchSetEventFlags(BatchResetStart, BatchResetEnd, OFF)</c>. Also
    /// validates the bank/id and arg-data length so a hash-collision against a
    /// different opcode that happens to land in the same byte range can't
    /// fool us.</summary>
    private static bool IsTargetBatchReset(EMEVD.Instruction ins)
    {
        if (ins.Bank != PatchConstants.BankEvent) return false;
        if (ins.ID != PatchConstants.IdBatchSetEventFlags) return false;
        // (u32 start, u32 end, u8 state) packs to 12 bytes (state + 3 pad).
        if (ins.ArgData.Length < 9) return false;
        uint start = BinaryPrimitives.ReadUInt32LittleEndian(ins.ArgData.AsSpan(0, 4));
        uint end   = BinaryPrimitives.ReadUInt32LittleEndian(ins.ArgData.AsSpan(4, 4));
        byte state = ins.ArgData[8];
        return start == TierClearConstants.BatchResetStart
            && end   == TierClearConstants.BatchResetEnd
            && state == PatchConstants.FlagStateOff;
    }

    /// <summary>True iff <paramref name="ins"/> is exactly
    /// <c>SetEventFlagID(flagId, ON)</c> — used for idempotency detection.</summary>
    private static bool IsSetEventFlagOnFor(EMEVD.Instruction ins, uint flagId)
    {
        if (ins.Bank != PatchConstants.BankEvent) return false;
        if (ins.ID != PatchConstants.IdSetEventFlag) return false;
        // (u8 type, u32 flagId, u8 state) packs to 12 bytes.
        if (ins.ArgData.Length < 9) return false;
        // type is at offset 0, flagId at offset 4 (after 3-byte pad), state at offset 8.
        byte type  = ins.ArgData[0];
        uint id    = BinaryPrimitives.ReadUInt32LittleEndian(ins.ArgData.AsSpan(4, 4));
        byte state = ins.ArgData[8];
        return type  == PatchConstants.FlagTypeEventFlag
            && id    == flagId
            && state == PatchConstants.FlagStateOn;
    }
}

// =======================================================================
// Result type
// =======================================================================
/// <summary>Per-run summary for <see cref="Tier1VisibilityBootstrapSplicer"/>.
/// Exactly one of <see cref="Inserted"/> / <see cref="AlreadyPresent"/> is
/// true on a successful return — failures throw rather than encode as a
/// boolean.</summary>
public sealed record Tier1BootstrapResult(
    bool Inserted,
    bool AlreadyPresent,
    int AnchorInstructionIndex,
    int SpliceInstructionIndex);
