// SPDX-License-Identifier: GPL-3.0-only
//
// DEPRECATED — this file is a tombstone.
//
// Tests for DispatcherSealSplicer were retired along with the splicer itself
// when the OnTierClear trigger architecture moved from common_func event
// 90009921 (with a per-tier seal flag) to the Boss Rush Roundtable Hold
// completion events (which already latch once per tier clear). See
// TierCompletionTriggerSplicerTests for the replacement coverage.

namespace BossRush.Tests;
