# ESD (TalkESD) opcodes — verified and unverified

This is the opcode / bytecode cheatsheet for Elden Ring's `.esd` files
(NPC talk scripts inside `.talkesdbnd.dcx` containers). Entries marked
**VERIFIED** are confirmed by either (a) decoding real in-game ESDs
through `inspect-esd`, (b) cross-reference with Athena Randomizer's
Moonwalk shop ESDs, or (c) existing `EsdBytecode.cs` helpers that are
actively used in shipped code. Entries marked **UNVERIFIED** are best
guesses — do NOT rely on their semantics without confirming first.

## What an ESD contains, briefly

- **StateGroups** (`esd.StateGroups`) — keyed by int id. Each group is
  a dictionary of states keyed by long state id.
- **State** (`ESD.State`) — has `EntryCommands`, `ExitCommands`,
  `WhileCommands` (lists of `CommandCall`), and `Conditions` (list of
  `ESD.Condition`).
- **CommandCall** — has `CommandBank` (int), `CommandID` (int),
  `Arguments` (list of `byte[]`, each terminated with `0xa1`).
- **Condition** — has `TargetState` (long?, null if subconditions),
  `Evaluator` (byte[] expression, terminated with `0xa1`), optional
  `PassCommands` and `Subconditions`.

## CommandCall bank / id — VERIFIED

Format in dumps: `bank=<B> id=<I> args=<N>`.

| Bank | ID | Name | Args | Notes |
|---|---|---|---|---|
| 1 | 10 | `ShowShopMessage(mode)` | 1 i32 | Shows the menu/message box. Typically `mode=1`. Must NOT precede `OpenPuppetShop` (makes the puppet shop silently bail). |
| 1 | 19 | `AddTalkListData(index, textId, reqId)` | 3 i32 | Adds an unconditional menu entry. `reqId=-1` means no requirement. |
| 1 | 20 | `ClearTalkListData()` | 0 | Clears the talk-list buffer. Precedes AddTalkListData sequences. |
| 1 | 22 | `OpenRegularShop(startRowId, endRowId)` | 2 i32 | Opens a vanilla rune-priced shop window scanning `ShopLineupParam` rows in `[start, end]`. Purchase confirm reads "for N runes." |
| 1 | 110 | *(menu init — name unverified)* | 0 | Consistently appears as the FIRST EntryCommand on menu-build states. Best guess: initializes talk-list UI context. |
| 1 | 144 | `OpenPuppetShop(startRowId, endRowId)` | 2 i32 | Opens a Starlight-Shards-priced shop window scanning `ShopLineupParam` rows in `[start, end]`. Purchase confirm reads "for N Starlight Shards." Requires (a) NO prefix EntryCommand, (b) puppet-flavored exit evaluator (see below), (c) rows with `costType=2`, `eventFlag_forRelease=0`, unique per-row `eventFlag_forStock` at stride-10 spacing. |
| 5 | 19 | `AddTalkListDataIf(condBytecode, index, textId, reqId)` | 4 (1 expr + 3 i32) | Conditional menu entry. `condBytecode` is arbitrary ESDLang expression terminated with `0xa1`; typically `GetEventFlag(X) == 1`. |
| 7 | -1 | *(state-exit transition — name unverified)* | 1 i32 | Seen only in `Condition.PassCommands`. Appears to terminate a sub-state chain. Do not use in `EntryCommands`. |

## CommandCall bank / id — UNVERIFIED

Appeared in real ESDs but semantics unconfirmed. If you need one of
these, cross-reference vawser's `er-documentation` repository or test
empirically before depending on them.

| Bank | ID | Context seen | Best guess |
|---|---|---|---|
| 1 | 9 | Athena StateGroup 2147483641 State 1 | Unknown init call |
| 1 | 18 | Athena StateGroup 2147483641 State 1 | Unknown |
| 1 | 35 | Kalé State 7 EntryCommands[1] (no args) | Unknown — follows opcode 110 |
| 1 | 67 | Athena StateGroup 2147483641 State 1 | Unknown |
| 1 | 71 | Athena StateGroup 2147483641 State 1 | Unknown |
| 1 | 80 | Athena StateGroup 2147483641 State 1 (1 arg) | Unknown |
| 6 | 2147483645 | Athena StateGroup 1 State 1 EntryCommands[0] (no args) | Unknown init-style call — `2147483645 = 0x7FFFFFFD` is suspicious (near Int32.MaxValue). |

## Evaluator bytecode — VERIFIED primitives

Evaluator expressions are postfix / stack-based. Every evaluator must
end with `0xa1` (End).

| Bytes | Meaning | Notes |
|---|---|---|
| `0x41` | Push small literal `true` | Used standalone in `[0x41, 0xa1]` for "always true" / else-branch evaluators. |
| `0x4f` | Open subexpression | Pairs with `0x95` (close). Used for grouping. |
| `0x57 0x84` | `GetTalkListEntryResult()` | No args. Pushes the int of the menu entry the player picked. |
| `0x7a` | `CheckSpecificPersonGenericDialogIsOpen(arg)` | 1-arg function. Close with `0x85`. |
| `0x7b` | `CheckSpecificPersonMenuIsOpen(menuType, arg)` | 2-arg function. Close with `0x86`. `menuType=28` = puppet shop (verified from Athena). |
| `0x82 <LE32>` | Push i32 literal (5 bytes) | Little-endian. |
| `0x85` | Binary `==` OR close 1-arg function call | **Context-dependent.** If preceded by a 1-arg function (e.g. `0x7a`), closes the call. Otherwise compares top two stack values. |
| `0x86` | Close 2-arg function call | Pairs with `0x7b` or similar. |
| `0x95` | Close subexpression / pop | Pairs with `0x4f`. Also appears as a trailing close on flag-value comparisons. |
| `0x98` | Logical NOT | Inverts top of stack. |
| `0x99` | Binary `||` (short-circuit OR) | Binary operator. |
| `0xa1` | **End of expression** | Required terminator on every evaluator and every argument byte array. |
| `0xa9 0x00` | `GetEventFlag(n)` closing | Follows a pushed flag-id literal. Reads as "get the flag value as an int." |

## Argument byte encoding — VERIFIED

- **6-byte scalar i32 arg:** `0x82 <LE32> 0xa1` — the canonical form
  for every i32 argument in CommandCall.Arguments (e.g. menu index,
  shop row id, text id).
- **14-byte flag-check condition arg:** `0x4f 0x82 <flag LE32> 0x85
  0x82 0x01 0x00 0x00 0x00 0x95 0xa1` — decodes to `GetEventFlag(flag)
  == 1`. Used as arg[0] of `AddTalkListDataIf` (bank=5 id=19).

## Key composite evaluators — VERIFIED

### Always-true (else-branch / default route)
```
0x41 0xa1
```
2 bytes. Used as the LAST condition's evaluator in any state's
condition list — it's the "default" route. New conditions MUST be
inserted before this one.

### `GetEventFlag(X) == 1`
```
0x4f                      // open subexpr
0x82 <X LE32>             // push flag id
0x85                      // == (binary)
0x82 0x01 0x00 0x00 0x00  // push 1
0x95                      // close subexpr
0xa1                      // end
```
11 bytes. Built by `EsdBytecode.GetEventFlagEquals1Evaluator(uint)`.

### `GetTalkListEntryResult() == N` (menu branch)
```
0x57 0x84                 // GetTalkListEntryResult()
0x82 <N LE32>             // push N
0x95                      // == + close (context: binary ==, then pop)
0xa1                      // end
```
9 bytes. Used in branch-state conditions to route based on which menu
entry the player picked.

### `PuppetShopMenuClosedEvaluator` (exit predicate for puppet-shop states)
```
0x7b                                  // CheckSpecificPersonMenuIsOpen (2-arg call open)
0x82 0x1c 0x00 0x00 0x00              // push 28 (puppet-shop menu-type id)
0x82 0x00 0x00 0x00 0x00              // push 0
0x86                                  // close 2-arg call
0x7a                                  // CheckSpecificPersonGenericDialogIsOpen (1-arg call open)
0x82 0x00 0x00 0x00 0x00              // push 0
0x85                                  // close 1-arg call
0x82 0x00 0x00 0x00 0x00 0x95         // == 0  ("dialog NOT open")
0x98                                  // logical NOT  → "dialog IS open"
0x82 0x00 0x00 0x00 0x00 0x95         // == 0  ("menu-is-open AND dialog-is-open equals 0")
0xa1                                  // end
```
33 bytes. Decompiles to:
```
assert not (CheckSpecificPersonMenuIsOpen(28, 0)
            and not CheckSpecificPersonGenericDialogIsOpen(0))
```
Available as `EsdBytecode.PuppetShopMenuClosedEvaluator`. Verified
byte-for-byte against Athena Randomizer's Moonwalk Starlight Shop
state 2 (from `t460006100.esd` in
`Resources/me3-v0.8.0/dlc/script/talk/m61_00_00_00.talkesdbnd.dcx`).

### Regular-shop menu-closed evaluator
Cloned byte-for-byte from Kalé's template state (`StateGroup 2147483644 State 9`)
via `ExtractMenuClosedEvaluator(templateShopState)`. Do NOT synthesize
from scratch — it's 33 bytes of reverse-engineered state-transition
logic that we don't fully parse. Clone it, don't rewrite it.

**Important:** the regular-shop evaluator and the puppet-shop evaluator
are NOT interchangeable. Using the regular-shop evaluator on a
puppet-shop state makes the state auto-exit on the first tick (silent
no-op). This was the root cause of a long debugging session — don't
repeat it.

## `EsdBytecode.cs` helpers — use these, don't re-implement

All of these already exist at
`src/BossRush.Core/Patching/EsdBytecode.cs`. Calling the helpers
is cheaper than hand-encoding bytes and avoids forgetting terminators.

| Helper | Returns | Use for |
|---|---|---|
| `PushInt32(int)` | `byte[5]` | Raw i32 push (no terminator). |
| `PushUInt32(uint)` | `byte[5]` | Same, unsigned. |
| `End` (const = 0xa1) | `byte` | Explicit terminator reference. |
| `ArgInt32(int)` | `byte[6]` | 6-byte `CommandCall` arg (`0x82 <LE32> 0xa1`). |
| `CloneBytes(byte[])` | `byte[]` | Defensive copy. **Always clone evaluators** when cloning a state — shared refs cause aliasing bugs (tier 1 mutation leaks into tier 2). |
| `ShowShopMessage(int mode)` | `CommandCall` | `bank=1 id=10`, 1 i32 arg. |
| `CloseShopMessage()` | `CommandCall` | `bank=1 id=110`, 0 args. *(Name is our guess; see UNVERIFIED table.)* |
| `OpenRegularShop(start, end)` | `CommandCall` | `bank=1 id=22`, 2 i32 args. |
| `OpenPuppetShop(start, end)` | `CommandCall` | `bank=1 id=144`, 2 i32 args. |
| `AddTalkListData(idx, text, req)` | `CommandCall` | `bank=1 id=19`, 3 i32 args. |
| `AddTalkListDataIf(cond, idx, text, req)` | `CommandCall` | `bank=5 id=19`, 4 args (cond+3 i32). |
| `GetEventFlagEquals1Evaluator(uint flag)` | `byte[11]` | 11-byte `GetEventFlag(flag) == 1` expression with terminator. |
| `PuppetShopMenuClosedEvaluator` (readonly) | `byte[33]` | The puppet-shop exit predicate. Clone before assigning to a `Condition`. |

## State-composition patterns — VERIFIED

### Menu-build state (what Kalé's state 7 does)
```
EntryCommands = [
    bank=1 id=110          // menu init (exact name unverified)
    bank=1 id=35           // unknown companion opcode
    ClearTalkListData()    // bank=1 id=20
    AddTalkListData(1, textId1, -1)         // bank=1 id=19
    AddTalkListData(2, textId2, -1)         // ...
    AddTalkListDataIf(cond, 30, textId30, -1)   // bank=5 id=19, conditional
    ... (more entries) ...
    ShowShopMessage(1)     // bank=1 id=10
]
```

### Branch state (routes menu pick to target state)
```
EntryCommands = []   // no commands
Conditions = [
    { target = 100, evaluator = GetTalkListEntryResult() == 30 }    // → tier 1 shop
    { target = 101, evaluator = GetTalkListEntryResult() == 31 }    // → tier 2 shop
    ... more routes ...
    { target = <back-to-menu>, evaluator = [0x41, 0xa1] }           // else (LAST)
]
```

### Puppet-shop state (Boss Rush tier shop, post-fix)
```
EntryCommands = [
    OpenPuppetShop(rowStart, rowEnd)   // bank=1 id=144, ONLY command
]
Conditions = [
    { target = <back-to-menu>, evaluator = CloneBytes(PuppetShopMenuClosedEvaluator) }
]
```

### Regular-shop state (vanilla Kalé bell-bearing pattern)
```
EntryCommands = [
    ShowShopMessage(1)                 // bank=1 id=10
    OpenRegularShop(rowStart, rowEnd)  // bank=1 id=22
]
Conditions = [
    { target = <back-to-menu>, evaluator = CloneBytes(<regular-shop menu-closed evaluator from template>) }
]
```

## Inspection procedure

Before claiming anything about an ESD:

```
./bossrush.exe inspect-esd \
    --bnd <path/to/something.talkesdbnd.dcx> \
    --name <entry.esd>
```

Output shows each StateGroup, each state, each EntryCommands /
ExitCommands / WhileCommands entry as `bank=X id=Y args=N` with each
arg's hex bytes, and each Condition's evaluator as hex. Grep the
output for what you need — `bank=1 id=144` to find OpenPuppetShop
sites, `id=19 args=4` to find AddTalkListDataIf conditions, etc.

Large ESDs (Kalé's `t314001110.esd` is dozens of StateGroups deep) —
use `sed -n '/^=== StateGroup <id>/,/^=== StateGroup /p'` to slice a
single group.

## Hazards and anti-patterns

1. **Never clone an evaluator across semantically-different state
   types.** Regular-shop evaluator on puppet-shop state = silent
   no-op (verified failure mode).
2. **Always `CloneBytes` when assigning** any `byte[]` from
   `EsdBytecode.*` constants into a new `Condition` or `CommandCall`.
   Shared references cause aliasing (mutating tier 1 leaks to tier 2+).
3. **Never forget the `0xa1` terminator.** Every evaluator, every
   argument byte array. Missing terminator = parser crash or silent
   wrong behavior.
4. **Don't synthesize a new evaluator for semantics you don't fully
   parse.** Extract and clone from a known-working template state
   instead. Kalé's ESD has templates for most state types.
5. **Don't trust the UNVERIFIED table.** If you need one of those
   opcodes, confirm via Athena decode or vawser's documentation before
   depending on it.
6. **Insert branch conditions BEFORE the trailing `[0x41, 0xa1]` else.**
   If you append after the else, new conditions are unreachable. See
   `KaleShopMenuSplicer.InsertBranchCondition` for the reference
   implementation.
