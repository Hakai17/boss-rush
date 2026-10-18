// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Buffers.Binary;
using System.Collections.Generic;
using SoulsFormats;

namespace BossRush.Core.Patching;

/// <summary>
/// Splices the Roundtable Hold care-package event into
/// <c>m11_10_00_00.emevd.dcx</c>. Two mutations per apply:
///
/// <list type="number">
///   <item><b>Insert event 11105800.</b> Body produced by
///     <see cref="CarePackageEventBuilder.BuildEvent"/> from a seeded
///     <see cref="CarePackageRoll"/>.</item>
///   <item><b>Wire it into the constructor.</b> Append
///     <c>InitializeEvent(0, 11105800)</c> to event 0 (the map's
///     <c>$Event(0, Default, …)</c> entry) so the new event runs on every
///     map-load.</item>
/// </list>
///
/// <para>
/// <b>Idempotency.</b> Re-running on already-patched bytes is a no-op:
/// the event-insert step detects an existing event with id 11105800 and
/// (by default) leaves it untouched; the constructor-wire step detects
/// an existing matching <c>InitializeEvent(0, 11105800)</c> and
/// skips. Set <see cref="RoundtableCarePackageSplicerOptions.OverwriteExistingEvent"/>
/// to <c>true</c> to replace the event body in place — useful in dev
/// loops that want every pipeline run to emit a fresh roll.
/// </para>
///
/// <para>
/// <b>Where the trigger goes in the constructor.</b> We append at the
/// END of event 0's instruction list. The mod's existing constructor
/// already has dozens of <c>$InitializeEvent(0, …)</c> / <c>$InitializeCommonEvent(0, …)</c>
/// calls — one more at the tail can't break skip-count math because
/// the constructor body has no skip / goto instructions ranging across
/// the entire event (verified by inspecting m11_10_00_00.emevd.dcx.js
/// lines 11..140). If a future source-mod update adds such a structure,
/// this splicer will need a SpliceHelpers.AdjustPrecedingSkipCounts call.
/// </para>
/// </summary>
public static class RoundtableCarePackageSplicer
{
    /// <summary>
    /// Mutates <paramref name="m11_10"/> in place. Returns whether the
    /// event body and the constructor wiring were freshly inserted vs.
    /// already present.
    /// </summary>
    public static RoundtableCarePackageSpliceResult Apply(
        EMEVD m11_10,
        CarePackageRoll roll,
        RoundtableCarePackageSplicerOptions? options = null)
    {
        ArgumentNullException.ThrowIfNull(m11_10);
        ArgumentNullException.ThrowIfNull(roll);
        options ??= new RoundtableCarePackageSplicerOptions();

        var newEvent = CarePackageEventBuilder.BuildEvent(roll);

        // ---- (1) Insert / replace event body ----------------------------
        bool eventInserted = false;
        bool eventAlreadyPresent = false;

        int existingIdx = -1;
        for (int i = 0; i < m11_10.Events.Count; i++)
        {
            if (m11_10.Events[i].ID == newEvent.ID)
            {
                existingIdx = i;
                break;
            }
        }

        if (existingIdx < 0)
        {
            m11_10.Events.Add(newEvent);
            eventInserted = true;
        }
        else if (options.OverwriteExistingEvent)
        {
            m11_10.Events[existingIdx] = newEvent;
            eventInserted = true;
        }
        else
        {
            eventAlreadyPresent = true;
        }

        // ---- (2) Wire into the constructor ------------------------------
        var constructor = FindEventOrThrow(m11_10, RoundtableCarePackageConstants.ConstructorEventId);

        bool triggerInserted = false;
        bool triggerAlreadyPresent = false;

        if (HasMatchingInitializeEvent(constructor, RoundtableCarePackageConstants.CarePackageEventId))
        {
            triggerAlreadyPresent = true;
        }
        else
        {
            constructor.Instructions.Add(InstructionFactory.InitializeEvent(
                slot: 0,
                targetEventId: RoundtableCarePackageConstants.CarePackageEventId));
            triggerInserted = true;
        }

        return new RoundtableCarePackageSpliceResult(
            EventInserted: eventInserted,
            EventAlreadyPresent: eventAlreadyPresent,
            TriggerInserted: triggerInserted,
            TriggerAlreadyPresent: triggerAlreadyPresent,
            ItemsGranted: RoundtableCarePackageConstants.TotalItems);
    }

    // ------------------------------------------------------------------
    private static EMEVD.Event FindEventOrThrow(EMEVD emevd, long id)
    {
        foreach (var ev in emevd.Events)
        {
            if (ev.ID == id) return ev;
        }
        throw new InvalidOperationException(
            $"Roundtable care-package splicer: event {id} (the map's Default "
            + "constructor) not found in m11_10_00_00.emevd. Source mod does "
            + "not match the expected Roundtable Hold layout.");
    }

    private static bool HasMatchingInitializeEvent(EMEVD.Event ev, uint targetEventId)
    {
        foreach (var ins in ev.Instructions)
        {
            if (ins.Bank != PatchConstants.BankSystem) continue;
            if (ins.ID != PatchConstants.IdInitializeEvent) continue;
            if (ins.ArgData.Length < 8) continue;
            uint target = BinaryPrimitives.ReadUInt32LittleEndian(
                ins.ArgData.AsSpan(4, 4));
            if (target == targetEventId) return true;
        }
        return false;
    }
}

// =======================================================================
// Option + result types
// =======================================================================
public sealed class RoundtableCarePackageSplicerOptions
{
    /// <summary>
    /// When an event with id 11105800 already exists in the target EMEVD,
    /// controls whether to replace it. Default <c>false</c> (idempotent
    /// re-patch — leave the existing body alone). Set <c>true</c> in dev
    /// loops where every pipeline run should emit a fresh roll.
    /// </summary>
    public bool OverwriteExistingEvent { get; init; } = false;
}

public sealed record RoundtableCarePackageSpliceResult(
    bool EventInserted,
    bool EventAlreadyPresent,
    bool TriggerInserted,
    bool TriggerAlreadyPresent,
    int ItemsGranted);
