// SPDX-License-Identifier: GPL-3.0-only
//
// DEPRECATED — this file is a tombstone.
//
// DispatcherSealSplicer used to splice SetEventFlagOn(seal(N)) into each
// per-tier dispatcher (90009931+N / 90009951+N) else-branch so that
// OnTierClear[N] could gate on a tier-exclusive seal flag. The seal
// architecture existed only because the OnTierClear trigger was wired into
// the shared warp handler 90009921, which fires ~20× per warp sequence.
//
// The trigger now lives in the Boss Rush Roundtable Hold completion
// events (11107716 / 11107737..11107744) — see TierCompletionTriggerSplicer.
// Those events have a built-in one-shot latch, so the seal flag is no
// longer needed and this splicer has been retired. The file is kept as a
// tombstone (rather than deleted) for git-history continuity.

namespace BossRush.Core.Patching;

// Intentionally empty. Do not add members; use TierCompletionTriggerSplicer
// instead.
