# CHOICE-CONSEQUENCE SYSTEM — the four-layer loop

**Status:** GOVERNED — operational (Phase 3A, 2026-07-20, Fable, per Mert's Phase 3 order).
Defines the mandatory life cycle of every choice. Companion to `GAME_STATE_SCHEMA.md`
(data) and `SCORECARDS.md §2` (quality gate).

## Layer 1 — Player knowledge before choosing

The choice card states: (a) the intended ACTION in the actor's voice, (b) the obvious
immediate RISK in one plain sentence. Never revealed: hidden consequences, downstream
routes, "correct" answers. Locked options render with `locked_text` explaining the state
reason diegetically ("Your purse is empty tonight") without exposing raw variables.

## Layer 2 — Immediate consequence beat (mandatory, branch-specific)

Clicking a choice NEVER jumps to the next unrelated scene. Each option owns a consequence
beat sequence (1–8 nodes) that plays out: what the actor actually does · who reacts (named
witnesses, reaction-ladder order per REFERENCE_MATRIX §3) · what changes in the room ·
what is gained · what is lost · what new danger begins · what opens or closes. Reconvergence
before this sequence completes is a validator ERROR.

## Layer 3 — WHAT CHANGED panel

After the consequence beats, a compact dismissible panel shows `known_effects` in plain
language with icons — never raw variables, never plus-one spam:

```
ASHREN — Delighted you took the dive. He will not stop mentioning it.
PURSE — +40,000 berries.
GUPS — No longer considers you an immediate threat.
⟡ A hidden thread has changed.
```

Rules: 2–6 lines; each line = WHO/WHAT + one behavioral sentence; hidden effects collapse to
the single thread line; the HUD (money, injuries, exposure pips, promise count) updates in
the same tick with a brief highlight; the story continues only after the player dismisses
the panel (advance input).

## Layer 4 — Later callback (the memory contract)

Every choice is remembered by at least one later scene through diegetic means: dialogue,
changed locations, unavailable characters, altered prices, injuries in staging, rumors,
headlines, relationship behavior, enemy tactics, unlocked/locked routes. Declared per
choice in the episode manifest (`callbacks:`) and validator-enforced (`GAME_STATE_SCHEMA §4`).
An end-of-episode summary alone does not satisfy the contract.

## Choice functions (rotate; no axis twice in a row)

tactic · preparation · route · information · trust · promise · sacrifice · refusal ·
resource allocation · public stance · concealment · rescue priority · who receives dangerous
information.

## Rejection tests (fail any → redesign)

- Options reconverge immediately with cosmetic differences.
- One option is obviously the writer's favorite (text chills or rewards).
- Compassionate/brutal/indifferent triple, or an apathy option filling slot three.
- The option changes prose tone rather than events.
- A late political outcome (island fate) selectable without earlier groundwork constraining
  which outcomes are actually offered — earlier relationships, promises, evidence, debts,
  and public acts must gate the final option list.

## Hidden-thread economy

Hidden effects surface when the player could logically discover them (a rumor reaches the
Kettle; a collector's ledger is seen; Gups changes tactics). At surfacing time, the scene
plays the discovery diegetically AND the panel may show a `THREAD REVEALED` line linking
back to the causing choice ("Because someone noticed Ashren's sparks in the pit…"). Every
hidden effect must surface within the saga (no orphan threads at the sting; validator
telemetry lists unsurfaced threads).
