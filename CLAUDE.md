# CLAUDE.md — Project Constitution

Permanent operating rules for this repository. Read before any work. This is the short constitution; the
governing detail lives in `docs/director/DIRECTOR_CHARTER.md`, and the research evidence in
`docs/production/`.

## What this project is

A **fully authored, deterministic, offline One Piece Choose-Your-Own-Adventure text RPG.**

- **Deterministic & offline.** No AI, no API, no live generation at play-time. The game is authored content
  plus an engine that checks approved state and selects among **authored** scenes and consequences.
- **Exactly three authored choices** at ordinary decision points. Choices are **character stances, not
  tactical optimizations** (`ONE_PIECE_FIGHT_LAW.md` Part B).
- **Structured in three parts:** Pre-Timeskip → Post-Timeskip → Final Saga.
- **Real outcomes:** meaningful victories, failures, injuries, deaths, betrayals, alternate arc endings.
  **Loss is a branch, not game-over.** If a character dies, they stay dead.
- **Recognizably One Piece:** adventure, comedy, absurdity, wonder, emotional sincerity, political cruelty.
- **Protected from** generic AI prose, fake branching, and permanent grimdark drift.

## Who decides

**Mert is the sole creative director.** He alone designs and approves the protagonist, islands, enemies,
factions, potential crew, ships, powers, story, relationships, canon divergences, visual decisions, arc
endings, and all permanent consequences. Creative content exists **only** because Mert authored or
approved it.

## Claude may / may not

**May:** research; organize; ask demanding design questions; identify contradictions; critique weak
concepts; test ideas against the research; build blank templates; make **clearly labelled PROPOSALS only
when Mert explicitly asks**; implement designs **after Mert approves**.

**May not:** invent missing creative material; silently fill blanks; canonize research examples; assume any
prior protagonist (incl. **Archon D. Merdo**) is current; treat old campaign material as approved canon;
design islands/enemies/crew unprompted; write sample scenes unbidden; write game code, install
dependencies, or pick the tech stack during Phase 0; use AI during gameplay.

**Permission by status:** critique CONCEPT and UNDER_REVIEW; implement APPROVED; do **not** alter LOCKED
without explicit permission. **Blank fields stay blank.** Templates never contain invented project
concepts.

## The production loop (never skip a step)

```
HUMAN CONCEPT → CLAUDE QUESTIONS → HUMAN ANSWERS → STRUCTURAL AUDIT → HUMAN REVISION →
HUMAN APPROVAL → LOCKED DESIGN → IMPLEMENTATION → PLAYTEST → HUMAN FINAL EDIT
```

Only Mert advances a concept to APPROVED and LOCKED. The STRUCTURAL AUDIT is analysis, not authorship.
Full detail in `docs/director/DIRECTOR_CHARTER.md`.

## Status vocabulary (single source of truth)

`EMPTY → CONCEPT → UNDER_REVIEW → APPROVED → LOCKED → IMPLEMENTED → PLAYTESTED`

Approved/locked canon is recorded **only** in `docs/director/CREATIVE_REGISTRY.md` — which is empty until
Mert locks something.

## Canon hygiene

- **Established One Piece canon is the baseline setting and timeline** of this project (setting reference).
- **But** naming a canon character, place, or event in research does **not** approve any specific
  encounter, timeline divergence, relationship, or intervention. Each such use requires a locked
  `templates/CANON_ENCOUNTER_BRIEF.md`.
- **Research examples and interpretations are not project decisions.** Old original campaign material —
  including the **Archon D. Merdo** protagonist (whose showrunner bible has been removed from the repo) —
  is **DEPRECATED and non-canon** unless Mert explicitly restores it.

## No AI / no SillyTavern machinery at runtime

This game runs no model at play-time. The SillyTavern dossier that carried live-AI machinery (sampler
presets, DRY sampler, token budgets, narrator cards, lorebook architecture) has been **removed** from the
repo — none of it belongs here. The only remaining live-AI framing is `One Piece research 2.md` §7 ("hand
this to a writer or an AI"), which is **human-authoring guidance only** — never wire it into a runtime.

## Anti-slop, anti-fake-branching, anti-grimdark-drift

- **Anti-slop:** no empty hype, samey voices, blow-by-blow combat, or lore-dumping. Prose rules will live
  in `docs/director/WRITING_DIRECTIVE.md` (currently a blank governed scaffold).
- **Anti-fake-branching:** choices must lead to genuinely different authored consequences and persistent
  state; no cosmetic forks.
- **Anti-grimdark-drift:** darkness has a permanent ceiling (a Mert-owned decision — see
  `docs/production/UNRESOLVED_DECISIONS.md §E`). Warm/absurd baseline; darkness lands because it departs
  from that baseline.

## Combat model (research-consistent, not a conflict)

The research says "matchups are authored, not computed" (`ONE_PIECE_POWERS_SCALING RESEARCH.md` Laws 3/15).
The project **keeps** this: outcomes are authored; branches are deterministic; the engine checks approved
story state (injuries, techniques, knowledge, relationships, equipment, prior choices, location, promises,
witnesses, route flags) to select authored scenes. No universal power-tier calculator, "balanced kits," or
procedural combat simulation is required. The open technical question is logged in
`UNRESOLVED_DECISIONS.md §A`.

## Phase discipline

**Phase 0 = governance scaffolding only.** No story design, no protagonist/island/enemy/crew creation, no
tech stack, no code, no dependencies, no pre-filled templates. Later phases begin only with Mert's
approval and the relevant unresolved decisions answered.

## Repository map

```
CLAUDE.md                         ← this constitution
docs/production/
  READING_LEDGER.md               ← per-file audit of the research
  RESEARCH_INDEX.md               ← per-doc purpose, rules, contradictions, do-not-canonize flags
  UNRESOLVED_DECISIONS.md         ← open questions for Mert, grouped by gate
docs/director/
  DIRECTOR_CHARTER.md             ← authority + production loop (governing)
  CREATIVE_REGISTRY.md            ← locked canon (empty until Mert locks)
  WRITING_DIRECTIVE.md            ← prose rules (blank governed scaffold)
templates/                        ← 12 blank creative-brief templates
ONE PIECE RESEARCH/               ← source research; craft reference, NOT approved canon. Do not edit.
```

`ONE PIECE RESEARCH/` is source material — leave it untouched unless Mert requests changes.
