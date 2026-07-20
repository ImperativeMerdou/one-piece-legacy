# CLAUDE.md — Project Constitution

Operating rules for this repository. Accurate as of Phase 1 instruction reset (2026-07-20, branch
`repair/phase-1-instruction-reset`). If this file contradicts observed repository state, the file is
wrong: say so and stop, do not improvise around it.

## Project identity

**One Piece: Legacy** — a private, fully authored, deterministic, offline One Piece CYOA text RPG.
Three parts (Pre-Timeskip → Post-Timeskip → Final Saga). Fixed original protagonist. Real permanent
consequences; loss is a branch, not game-over. No AI, no API, no live generation at play-time.
Strictly private: Mert and his friends only; never distributed or sold.
Full definition: `docs/director/PROJECT_CONTRACT.md` (LOCKED).

## Current development phase

- Phase 0 (governance) and Phases 1–2 (contract + founding canon) are **complete**. The project is
  **past Phase 0**: story design is underway under Mert's direction.
- Current state: **Phase 1 instruction reset** (repair of the instruction stack after the
  2026-07-20 audit — `AUDIT/FABLE_FULL_REPOSITORY_AUDIT.md`).
- Implemented content: prologue scenes S1 and S2 exist and are **FROZEN pending Mert's review**
  (see § Frozen content). The prologue arc map is APPROVED but flagged for restructuring review.
- No game runtime, engine, or state schema is implemented yet. `docs/runtime/STORY_ENGINE.md`
  defines the target machinery; nothing executes it.

## Creative authority

**Mert is the sole creative director.** Creative content exists only because Mert authored or
approved it. Claude may: research, organize, ask demanding design questions, identify
contradictions, critique CONCEPT/UNDER_REVIEW material, make clearly labelled PROPOSALS **only when
Mert explicitly asks**, and implement APPROVED designs. Claude may not: invent missing creative
material, silently fill blanks, canonize research examples, alter LOCKED material without explicit
permission, or design story elements unprompted. Full loop and status rules:
`docs/director/DIRECTOR_CHARTER.md`.

**A ruling is Mert's only if his words are on record.** Claude-derived rules must be labelled as
Claude recommendations and never presented with Mert's authority. (This rule exists because the
archived Writing Directive violated it — see audit §4-D1.)

## Canon boundaries

- Established One Piece canon is the baseline setting and timeline.
- Naming a canon character/place/event in research or briefs approves nothing. Every specific canon
  encounter, divergence, relationship, or intervention requires its own locked
  `templates/CANON_ENCOUNTER_BRIEF.md`.
- Locked canon lives **only** in `docs/director/CREATIVE_REGISTRY.md` (which links each element's
  brief). Old campaign material ("Archon D. Merdo") is deprecated; only the "Archon D." dynasty
  name was deliberately restored by Mert.
- Hard line, above everything: all sexual content involves adults (18+) only.

## Blank-field rule

**Blank fields stay blank until Mert answers them.** BLANK and SEALED markers in briefs are
decisions *not yet made* or *deliberately withheld* — never license to infer. Templates never
contain invented project concepts. If a scene or document needs a blank field filled, stop and ask
Mert; do not write around it with invention.

## Status vocabulary (single source of truth)

`EMPTY → CONCEPT → UNDER_REVIEW → APPROVED → LOCKED → IMPLEMENTED → PLAYTESTED`
plus, for non-creative documents only: `GOVERNED` (operating doc) and `ARCHIVED` (preserved,
not active, never auto-loaded, not citable as authority). Only Mert advances creative statuses.
Every document carries exactly one status in its header.

## Active reading order

Load in this order, and nothing else, for ordinary work:

1. `CLAUDE.md` (this file)
2. `docs/director/DIRECTOR_CHARTER.md` — authority + production loop
3. `docs/director/PROJECT_CONTRACT.md` — locked project boundaries
4. `docs/director/CREATIVE_REGISTRY.md` — what is actually locked

Then, per task:

- **Scene writing** (only when Mert has authorized the scene): `docs/writing/SCENE_GATE.md`,
  `docs/writing/ONE_PIECE_SCENE_GRAMMAR.md`, `docs/writing/ANTI_CLAUDEISM.md`,
  `docs/runtime/CHARACTER_RUNTIME_CARDS.md`, plus the LOCKED briefs of the elements on stage.
  For fight scenes add `docs/writing/FIGHT_DIRECTION.md`.
- **Engine/state work**: `docs/runtime/STORY_ENGINE.md`.
- **Design questions for Mert**: `docs/production/UNRESOLVED_DECISIONS.md`.
- **Visual reference study**: `docs/research/VISUAL_REFERENCE_PROTOCOL.md`.

**Never auto-loaded** (consult only on a specific question, via `docs/production/RESEARCH_INDEX.md`,
which states each file's reliability): the seven files in `ONE PIECE RESEARCH/` (ARCHIVED research
essays — see next section), `docs/director/WRITING_DIRECTIVE.md` (ARCHIVED),
`docs/production/READING_LEDGER.md` (ARCHIVED).

## Research: archived, not law

`ONE PIECE RESEARCH/` contains seven AI-generated craft essays. They hold useful observations,
**zero followable citations, known factual errors, and many overgeneralized "laws"**
(audit §6). Rules:

- They are **ARCHIVED reference**. They must not load during ordinary scene-writing work.
- Nothing in them is an Oda statement, a project decision, or a writing law.
- Consulting them never authorizes copying, canonizing, or citing them as authority.
- Before reusing any factual claim from them, verify it independently
  (`docs/production/RESEARCH_INDEX.md` lists known errors per file).

## Frozen content

`content/part-1/prologue/S1-the-pit.md` and `content/part-1/prologue/S2-the-tavern.md` are
**FROZEN**: byte-for-byte unchanged pending Mert's post-audit review. Do not edit, rewrite, or
re-annotate them. (Known defects — including a text corruption at S2:41 and a non-vocabulary
status header in S2 — are documented in the audit and stay in place until Mert unfreezes.)
`docs/director/briefs/PROLOGUE_ARC_BRIEF.md` (the 13-node map) is likewise frozen pending Mert's
ruling on the audit's compression proposal.

## Change control

- Every creative element passes the charter loop; only Mert advances to APPROVED/LOCKED.
- **Blanket approvals are insufficient for briefs containing BLANK fields required by the next
  implementation step** — flag such locks for per-item confirmation instead of proceeding.
  *(Operational safeguard from audit §23.2; charter amendment itself awaits Mert.)*
- Status changes are committed together with the change they describe.
- No commits or pushes without Mert's instruction. Never merge repair branches into `main`
  without his explicit approval.

## Repository map (current)

```
CLAUDE.md                          ← this constitution
AUDIT/                             ← 2026-07-20 forensic audit + Phase 1 report
docs/director/
  DIRECTOR_CHARTER.md              ← authority + production loop (GOVERNED)
  PROJECT_CONTRACT.md              ← project boundaries (LOCKED)
  CREATIVE_REGISTRY.md             ← locked canon record (GOVERNED)
  WRITING_DIRECTIVE.md             ← ARCHIVED — superseded, not active (see its banner)
  briefs/                          ← 7 locked/approved creative briefs (blanks stay blank)
docs/writing/
  ONE_PIECE_SCENE_GRAMMAR.md       ← scene toolbox (GOVERNED, operational)
  FIGHT_DIRECTION.md               ← fight toolbox (GOVERNED, operational)
  ANTI_CLAUDEISM.md                ← failure patterns + corrections (GOVERNED, operational)
  SCENE_GATE.md                    ← pre-write / pre-commit scene test (GOVERNED, operational)
docs/runtime/
  STORY_ENGINE.md                  ← deterministic state & branching spec (GOVERNED, operational)
  CHARACTER_RUNTIME_CARDS.md       ← writing-context card format (GOVERNED, operational)
docs/research/
  VISUAL_REFERENCE_PROTOCOL.md     ← how local visual references are studied (GOVERNED)
docs/production/
  RESEARCH_INDEX.md                ← per-file research reliability index (GOVERNED)
  READING_LEDGER.md                ← ARCHIVED production record
  UNRESOLVED_DECISIONS.md          ← open questions for Mert (GOVERNED)
templates/                         ← 12 blank creative-brief templates (blank by design)
content/part-1/prologue/           ← S1, S2 (FROZEN)
reference/                         ← visual-reference workspace; raw-private/ is gitignored
ONE PIECE RESEARCH/                ← ARCHIVED research essays — never auto-loaded
```

## Validation checks

Run before committing any documentation change:

- `git status` — no unintended files.
- Frozen files untouched: `git diff --stat main -- content/ docs/director/briefs/PROLOGUE_ARC_BRIEF.md`
  shows nothing (during Phase 1 repair work).
- Every path named in this file exists: check with `ls` / `Glob`.
- Every active document header carries exactly one status.
- No BLANK/SEALED field has been given content without a dated Mert ruling recorded beside it.
