// SPDX-License-Identifier: GPL-3.0-only
namespace IgniteBossRush.Core.Patching;

/// <summary>
/// Constants for the Roundtable Hold "care package" feature: a one-shot
/// grant of 20 armor pieces (5 head + 5 chest + 5 arms + 5 legs) to the
/// player on first entry into m11_10_00_00 (Roundtable Hold).
///
/// <para>
/// <b>Flag carve-up.</b> All allocations sit in the documented gap
/// <c>1049308317..1049308399</c> between TierClearLatch (..316) and
/// ShopVisibility (400..) — outside every wipe window in the
/// <c>1049308xxx</c> plateau, so the one-shot guard genuinely persists
/// per-save and never re-fires on load. See
/// <c>.claude/skills/ignite-modding/reference/flag-plateau.md</c> for the
/// full plateau map.
/// </para>
///
/// <para>
/// <b>Event placement.</b> Event <c>11105800</c> sits in m11_10's
/// <c>11105xxx</c> free zone — the only existing event in that range is
/// 11105555, leaving 11105556..11105999 as headroom. The constructor splice
/// adds <c>$InitializeEvent(0, 11105800)</c> to event 0 (the map's Default
/// constructor) so the new event runs every map-load; the body's first
/// instruction is an <c>EndIf(EventFlag(OneShotGuardFlag))</c> that bails
/// after the first successful run.
/// </para>
/// </summary>
public static class RoundtableCarePackageConstants
{
    /// <summary>Map file basename. The splicer is hardwired to operate on
    /// Roundtable Hold; mutating other map EMEVDs would require a
    /// different event ID + flag allocation review.</summary>
    public const string MapFileBaseName = "m11_10_00_00.emevd.dcx";

    /// <summary>Map's Default constructor event ID. Every Elden Ring
    /// map-EMEVD has an <c>$Event(0, Default, …)</c> entry at the top that
    /// runs once when the map loads; we splice an
    /// <c>InitializeEvent(0, 11105800)</c> call into its instruction list
    /// so our care-package event fires on every Roundtable load (with the
    /// guard flag below gating to "first-load-only" semantics).</summary>
    public const long ConstructorEventId = 0L;

    /// <summary>Event ID for the care-package body. Free in m11_10 — the
    /// only existing event in the 11105xxx range is 11105555. If a future
    /// source-mod update adds an 11105800, the splicer's idempotency check
    /// will detect the collision and either skip (default) or replace
    /// (when <c>OverwriteExistingEvent=true</c>).</summary>
    public const uint CarePackageEventId = 11105800u;

    /// <summary>One-shot guard flag. ON ⇒ care package already given.
    /// First instruction in the event body is <c>EndIf(EventFlag(this))</c>;
    /// instruction [2] sets it ON. Allocated at <c>1049308340</c> — inside
    /// the safe gap <c>1049308340..1049308399</c> between the tier-sequence
    /// wipe range (1049308301..339, cleared by m11_10 events 11107798,
    /// 11107802, 11107804, 11107805, 11107815, 11107816 whenever the
    /// player picks a boss mode) and the shop-visibility wipe range
    /// (1049308400+, cleared by the init event).
    ///
    /// <para>
    /// <b>History.</b> Previous iterations parked this flag at
    /// 1049308317, which the original flag-plateau doc claimed was safe.
    /// It wasn't — six m11_10 events wipe 1049308301..339 every time the
    /// player engages with the boss-mode-select UI, which fires
    /// constantly during the Roundtable + tier-warp loop. Our guard was
    /// being nuked between every tier attempt, causing the care package
    /// to re-grant. <c>flag-plateau.md</c> has been corrected.
    /// </para>
    ///
    /// <para>
    /// We also tried <c>EndIf(ThisEventSlot()) / SetThisEventSlot(ON)</c>
    /// to avoid using a flag at all — empirically that slot state does
    /// NOT survive a full map unload (warp to a boss arena unloads
    /// m11_10, slot goes with it).
    /// </para></summary>
    public const uint OneShotGuardFlag = 1049308340u;

    /// <summary>Shared <c>eventFlagId</c> arg passed to every
    /// <c>DirectlyGivePlayerItem</c> call. Per the source mod owner's
    /// guidance (and matching the vanilla pattern in m11_10's existing
    /// <c>DirectlyGivePlayerItem(ItemType.Goods, 1290, 6001, 1)</c> call
    /// at line 1240), this flag is a fixed magic value — the engine does
    /// not dedup on it for grants triggered from this map. Outer
    /// <see cref="OneShotGuardFlag"/> handles the "first visit only"
    /// semantics; per-item dedup is therefore unnecessary.</summary>
    public const uint SharedGiveFlagId = 6001u;

    /// <summary>Items granted per armor slot (head, chest, arms, legs).</summary>
    public const int ItemsPerSlot = 5;

    /// <summary>Number of armor slots covered (head, chest, arms, legs).
    /// Elden Ring's Protector category collapses "boots" into "legs".</summary>
    public const int SlotCount = 4;

    /// <summary>Total items granted (5 per slot × 4 slots = 20).</summary>
    public const int TotalItems = ItemsPerSlot * SlotCount;

    /// <summary>Settle-time after Roundtable load, in seconds. Mirrors the
    /// vanilla pattern in m10_00 events 10002670/10002671 where tutorial
    /// popups + item grants are preceded by
    /// <c>WaitFixedTimeSeconds(1)</c>.</summary>
    public const float LoadSettleSeconds = 1.0f;

}
