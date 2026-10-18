// SPDX-License-Identifier: GPL-3.0-only
using System;
using System.Collections.Generic;
using BossRush.Core.Models;
using SoulsFormats;

namespace BossRush.Core.Patching;

/// <summary>
/// Inserts the per-tier OnTierClear event bodies (built by
/// <see cref="TierClearEventBuilder"/>) into <c>common_func.emevd.dcx</c>.
///
/// <para>
/// <b>Only event insertion lives here now.</b> The "how do these events get
/// invoked" wiring lives in <see cref="TierCompletionTriggerSplicer"/>, which
/// operates on <c>m11_10_00_00.emevd.dcx</c> (Roundtable Hold) rather than
/// <c>common_func</c>. That split reflects the underlying EMEVD layout: the
/// common_func file owns reusable event bodies and <c>Initialize</c> dispatch,
/// while Roundtable Hold's map EMEVD owns the per-tier completion events
/// (11107716 / 11107737..11107744) that detect "tier N just cleared" and
/// latch a mod-owned flag (1049300006..1049300014) exactly once.
/// </para>
///
/// <para>
/// <b>History.</b> An earlier version of this splicer also inserted 9
/// <c>InitializeCommonEvent(0, 90009990+N)</c> triggers at the start of
/// event 90009921 (the shared warp-back handler). That handler fires
/// ~20× per warp sequence, so the OnTierClear body needed a tier-exclusive
/// seal flag (set by a separate <c>DispatcherSealSplicer</c>) to avoid
/// firing nine times per clear. Moving the trigger to the Roundtable
/// completion events obsoleted both the 90009921 splice AND the seal
/// architecture; see <see cref="TierCompletionTriggerSplicer"/> for the
/// current wiring.
/// </para>
///
/// <para>
/// Event insertion is idempotent: re-running on an already-patched
/// <c>common_func.emevd</c> detects each existing OnTierClear event by ID
/// and leaves it untouched.
/// </para>
/// </summary>
public static class TierClearEventSplicer
{
    /// <summary>
    /// Mutates <paramref name="commonFunc"/> in place: inserts the OnTierClear
    /// event bodies (90009991..90009999). Wiring them to actually run is the
    /// job of <see cref="TierCompletionTriggerSplicer"/>.
    /// </summary>
    public static TierClearSpliceResult Apply(
        EMEVD commonFunc,
        TierRewardsPlan plan,
        SplicerOptions? options = null)
    {
        ArgumentNullException.ThrowIfNull(commonFunc);
        ArgumentNullException.ThrowIfNull(plan);
        options ??= new SplicerOptions();

        // ---- (a) Build new events -----------------------------------------
        var newEvents = TierClearEventBuilder.BuildAllEvents(plan);
        var newEventsByTier = new Dictionary<int, EMEVD.Event>(newEvents.Count);
        foreach (var ev in newEvents)
        {
            int tierNum = (int)(ev.ID - TierClearConstants.OnTierClearEventBase);
            newEventsByTier[tierNum] = ev;
        }

        // ---- (b) Index existing events by ID -----------------------------
        // SoulsFormats permits multiple events with the same ID; "first wins".
        var byId = new Dictionary<long, EMEVD.Event>(commonFunc.Events.Count);
        foreach (var ev in commonFunc.Events)
        {
            if (!byId.ContainsKey(ev.ID)) byId[ev.ID] = ev;
        }

        // ---- (c) Insert OnTierClear event bodies --------------------------
        // Decision tree per tier:
        //   (i)   No event body exists yet → insert it.
        //   (ii)  Event body exists AND OverwriteExistingEvents=false →
        //         treat as idempotent re-patch (trust a prior run placed it).
        //   (iii) Event body exists AND OverwriteExistingEvents=true →
        //         replace it.
        //
        // Note: unlike the old splicer we no longer cross-check a "trigger
        // already present" flag from a common_func splice step because the
        // trigger now lives in m11_10_00_00.emevd, not common_func. A foreign
        // event-ID collision in common_func would be a base-ID bug
        // (OnTierClearEventBase collided with the source mod), but testing
        // for that here would require inventing a fragile heuristic — we
        // defer to OverwriteExistingEvents instead.
        int eventsInserted = 0;
        int eventsAlreadyPresent = 0;

        for (int tierNum = TierClearConstants.FirstTier; tierNum <= TierClearConstants.LastTier; tierNum++)
        {
            var newEv = newEventsByTier[tierNum];
            bool eventIdAlreadyTaken = byId.ContainsKey(newEv.ID);

            if (!eventIdAlreadyTaken)
            {
                commonFunc.Events.Add(newEv);
                eventsInserted++;
                continue;
            }

            if (!options.OverwriteExistingEvents)
            {
                eventsAlreadyPresent++;
                continue;
            }

            commonFunc.Events.RemoveAll(e => e.ID == newEv.ID);
            commonFunc.Events.Add(newEv);
            eventsInserted++;
        }

        return new TierClearSpliceResult(
            EventsInserted: eventsInserted,
            EventsAlreadyPresent: eventsAlreadyPresent);
    }
}

// =======================================================================
// Option + result types
// =======================================================================
public sealed class SplicerOptions
{
    /// <summary>
    /// Controls behavior when an event with an OnTierClear ID already exists
    /// in <c>common_func.emevd</c>. Default <c>false</c> (leave the existing
    /// event in place — the idempotent re-patch case). Set <c>true</c> to
    /// clobber whatever is already there, for development loops that want
    /// every run to emit a fresh body.
    /// </summary>
    public bool OverwriteExistingEvents { get; init; } = false;
}

public sealed record TierClearSpliceResult(
    int EventsInserted,
    int EventsAlreadyPresent);
