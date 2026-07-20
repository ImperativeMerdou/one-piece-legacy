# STORY ENGINE

**Status:** GOVERNED — operational spec (Phase 1, 2026-07-20). Defines the deterministic machinery
this game runs on. **Spec only — nothing is implemented yet.** Phase 1 defines generic structure;
it deliberately does **not** encode the prologue's actual choices, assign numeric values to any
existing character or relationship, or invent state not grounded in the LOCKED contract.
Vocabulary below marked *(locked)* comes verbatim from `PROJECT_CONTRACT.md` (Determinism
guarantees; Approved structural policy #4). Everything else is Claude structural recommendation
awaiting Mert's ratification.

## 1. Scene identity

- Scene ID: `P<part>-<arc>-S<nn>[<variant>]` — e.g. `P1-PRO-S01`, variant suffix for
  state-conditioned versions (`P1-PRO-S02a`). One prose file per scene; IDs never reused.
- A scene declares: `entry_conditions` (state predicate), `choices` (0 or 1 node), `writes`
  (state operations), `exits` (next scene per option/condition).

## 2. State keys (categories are locked; concrete keys are registered per-arc with Mert)

Locked state categories *(contract)*: injuries, techniques, knowledge/secrets, relationships,
reputation/bounty, allies, promises, witnesses, route flags, equipment, prior choices, location.

Locked ledger vocabulary *(contract policy #4)*:
- **Dream Ledger:** `DREAM+` / `DREAM−` / `DREAM~` tags on major choices.
- **Promise Ledger:** spoken vows, each `kept | broken | open`.
- **Bond scores:** per-character trust/loyalty + betrayal flags.
- **World-Marks:** per-island `LIBERATED | OWNED | TOPPLED | RUINED`, plus witness count and
  headline flags.

Key naming convention (recommendation): `category.subject.property` — e.g.
`bond.<character_id>.trust`, `injury.merdou.<slot>`, `mark.<island_id>.status`,
`promise.<id>.status`, `flag.route.<name>`, `info.<who_knows>.<secret_id>`. One dialect only;
the three ad-hoc dialects in the frozen S1/S2 annotations are superseded and will be migrated
when those scenes are unfrozen. **No key receives a value in Phase 1.**

## 3. Consequence classes

- **Visible:** surfaced to the player diegetically (headline, dialogue, scar, bounty poster).
- **Hidden:** tracked silently, surfaced later (a witness who talks in a later arc).
Every choice option writes ≥1 consequence; a choice writing nothing is a fake choice (see §7).

## 4. Branching terms

- **Branch:** scenes reachable only under a state predicate.
- **Variant:** one scene ID, state-conditioned content blocks (used when geography converges).
- **Reconvergence:** branches may rejoin in *geography*, never in *consequence* (locked
  spine-and-ribs policy): a reconverged scene must read differently under different state —
  different beats, not swapped adjectives.
- **Route-lock:** a permanent flag closing content for the save *(locked: irreversible
  route-locking exists)*. Locks are declared, Mert-approved, and never silent.
- **Unavailable-content tracking:** every branch/option records what it closes
  (`closes: [scene ids / recruit ids / route flags]`) so fake breadth is auditable.

## 5. Specific state families (structure only)

- **Relationship state:** Bond scores per character + qualitative flags (betrayal, debt, vow) —
  scales and thresholds are Mert decisions, not yet set.
- **Reputation state:** bounty (berries), epithet(s), headline flags, per-faction attention —
  values set only by Mert-approved events.
- **Injury & resource state:** persistent injuries (with healing rules TBD by Mert), equipment,
  money, ship condition.
- **Information state:** who knows which secret (`info.*`) — the concealment economy (wings,
  horns, name) runs on this family.
- **Failure state:** loss branches are authored content — defeat, capture, debt, humiliation,
  forced retreat *(locked list, contract § Outcome range)* — each commits ≥1 permanent visible
  consequence. No game-over except authored protagonist-death crux points *(locked policy)*.

## 6. Sidecar annotation format

Prose files contain **no state operations, no notes, no proposals.** Each scene has a sidecar:

```yaml
# P1-PRO-S01.state.yaml  (format spec — not yet instantiated)
scene: P1-PRO-S01
entry: { }                 # predicates on state keys
choice:
  id: C1
  axis: <declared axis>
  options:
    - id: 1
      writes: [ <key ops> ]
      closes: [ ]
      exit: <scene id>
notes_file: P1-PRO-S01.notes.md   # production notes live here, never in prose
```

## 7. Fake-branching validation (run on every arc before implementation)

1. Every option writes ≥1 state operation naming an **event** difference.
2. For every pair of options at a node: name at least one later scene that reads or plays
   differently because of the difference. If none exists, the node is cosmetic — redesign.
3. Every reconvergence scene lists which state keys alter its content.
4. Every `closes:` list is honored (closed content is genuinely unreachable in that save).
5. Arc-level test *(locked)*: two players comparing saves after the arc must not find their
   worlds interchangeable.

## 8. Out of scope for Phase 1 (deliberately)

Runtime/tech stack choice; save/slot mechanics implementation; the prologue's concrete choice
encodings; any numeric Bond/reputation values; healing/economy tuning. Each requires Mert's
decisions recorded in `UNRESOLVED_DECISIONS.md` first.
