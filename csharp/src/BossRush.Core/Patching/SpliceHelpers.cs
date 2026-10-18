// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using SoulsFormats;

namespace BossRush.Core.Patching;

/// <summary>
/// Helpers shared by the EMEVD splicers. The core problem solved here: when
/// we insert a new instruction into an event, any <b>preceding</b>
/// count-based skip instruction whose target lies at or past the insertion
/// point now lands one instruction short. Fixing <c>Parameter.InstructionIndex</c>
/// (which the splicers already do) is necessary but not sufficient — the skip
/// byte inside <c>ArgData</c> also needs to be bumped.
///
/// <para>
/// <b>Root cause of the "every boss kill warps to Roundtable" regression.</b>
/// Per-tier detector event 90009931 compiles each <c>else if</c> branch to
/// <code>
///   SetEventFlag(X, ON)
///   SkipUnconditionally(N)   // N jumps past the else body to the trailing inits
/// </code>
/// The tier-clear splicer inserted <c>InitializeCommonEvent(0, OnTierClear)</c>
/// inside the else body (immediately before the 90009921 warp anchor). With the
/// skip counts unchanged, every such <c>SkipUnconditionally(N)</c> in the
/// preceding non-else branches then landed on the new trigger and fell
/// through into the 90009921 warp — causing a Roundtable warp on every
/// non-final boss kill, exactly the symptom the user reported.
/// </para>
/// </summary>
internal static class SpliceHelpers
{
    /// <summary>
    /// Scan <paramref name="instructions"/> for count-based skip instructions
    /// at positions before <paramref name="insertedAt"/>. For each skip whose
    /// target (in PRE-insertion indexing) was at or past
    /// <paramref name="insertedAt"/>, increment its skip-count byte by 1 so
    /// the skip continues to land on the same logical instruction after the
    /// insertion.
    ///
    /// <para>
    /// Call this <b>after</b> inserting the new instruction. The method reads
    /// <paramref name="insertedAt"/> as the absolute index of the newly
    /// inserted instruction in the post-insertion layout; this is identical
    /// to the pre-insertion position of the first instruction that got
    /// shifted, which is the frame the skip counts were calibrated against.
    /// </para>
    /// </summary>
    /// <returns>Number of skip instructions whose count was adjusted.</returns>
    /// <exception cref="InvalidOperationException">
    /// Thrown if a skip's count byte is already <c>255</c> and would overflow
    /// the EMEVD u8 skip field by incrementing. In that case the source event
    /// layout cannot be byte-patched and must be rebuilt.
    /// </exception>
    public static int AdjustPrecedingSkipCounts(
        IList<EMEVD.Instruction> instructions, int insertedAt)
    {
        ArgumentNullException.ThrowIfNull(instructions);
        if (insertedAt < 0 || insertedAt > instructions.Count)
            throw new ArgumentOutOfRangeException(nameof(insertedAt),
                $"insertedAt={insertedAt} is outside [0, {instructions.Count}].");

        int adjusted = 0;
        // Only instructions at positions < insertedAt can possibly jump
        // across the insertion point (a skip is a forward relative jump).
        for (int p = 0; p < insertedAt; p++)
        {
            var ins = instructions[p];
            if (!TryGetSkipCount(ins, out byte count)) continue;

            // In the PRE-insertion frame the skip lands at (p + 1 + count).
            // If that target was >= insertedAt, the instruction at that
            // index is now one slot later and we must bump the skip
            // count by 1 to keep the same semantic target.
            int preTarget = p + 1 + count;
            if (preTarget < insertedAt) continue;

            if (count == byte.MaxValue)
            {
                throw new InvalidOperationException(
                    $"Skip instruction at index {p} in event has count={count}; "
                    + "incrementing would overflow the u8 skip field. The source "
                    + "event layout cannot be byte-patched and must be rewritten "
                    + "(split into multiple hops, or re-emitted with labeled gotos).");
            }

            ins.ArgData[0] = (byte)(count + 1);
            adjusted++;
        }
        return adjusted;
    }

    /// <summary>
    /// Returns <c>true</c> if <paramref name="ins"/> is one of the three EMEVD
    /// instruction shapes whose first arg byte is a forward skip count:
    /// <c>(1000, 3) SKIP Unconditionally</c>,
    /// <c>(1000, 5) SKIP IF Comparison</c>, or
    /// <c>(1003, 1) SKIP IF Event Flag</c>. Other branch-like instructions
    /// (e.g. label-based gotos) are unaffected by instruction-index shifts
    /// and are intentionally not handled here.
    /// </summary>
    private static bool TryGetSkipCount(EMEVD.Instruction ins, out byte count)
    {
        count = 0;
        if (ins.ArgData is null || ins.ArgData.Length < 1) return false;

        bool isSkip =
            (ins.Bank == PatchConstants.BankControlFlowSystem
                && (ins.ID == PatchConstants.IdSkipUnconditionally
                 || ins.ID == PatchConstants.IdSkipIfComparison))
         || (ins.Bank == PatchConstants.BankControlFlowEvent
                && ins.ID == PatchConstants.IdSkipIfEventFlag);
        if (!isSkip) return false;

        count = ins.ArgData[0];
        return true;
    }
}
