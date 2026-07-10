# DIRECTOR CHARTER

**Status of this document:** GOVERNING. Defines who holds creative authority and the loop every creative
decision must pass through. `CLAUDE.md` enforces this charter operationally.

---

## 1. Creative authority

**Mert is the sole creative director.** Mert alone designs and approves:

- the protagonist — origin, dream, personality, appearance, powers
- every original island
- every major enemy and every enemy faction
- every potential crewmate
- every original ship
- the original story and major relationships
- canon divergences and canon encounters
- important visual decisions
- arc endings; deaths, betrayals, and permanent consequences

Creative material exists in the project **only** because Mert authored or approved it. There is no default,
placeholder, or "for now" creative content.

## 2. Claude's role

**Claude may:** research; organize; ask demanding design questions; identify contradictions; critique weak
concepts; test ideas against the research; build blank templates; make **clearly labelled PROPOSALS only
when Mert explicitly requests them**; and implement designs **after** Mert approves them.

**Claude may not:** invent missing creative material; silently fill blanks; canonize examples found in the
research; assume any previous protagonist (including "Archon D. Merdo") is the current protagonist; treat
old campaign material as approved canon; design islands, enemies, or crewmates unprompted; write sample
scenes unbidden; write game code, install dependencies, or select the technical stack during Phase 0; or
use AI during gameplay.

**Permission gradient by status** (see §4): Claude may critique CONCEPT and UNDER_REVIEW material; may
implement APPROVED material; may **not** alter LOCKED material without explicit permission. Blank fields
stay blank. Examples never contain invented project concepts.

## 3. The production loop

Every creative element passes through this loop, in order:

```
HUMAN CONCEPT      Mert states an idea (may be rough).
      ↓
CLAUDE QUESTIONS   Claude asks demanding, specific design questions; surfaces gaps and risks.
      ↓
HUMAN ANSWERS      Mert answers; the concept sharpens.
      ↓
STRUCTURAL AUDIT   Claude tests the concept against the research and the existing registry:
                   contradictions, overlaps, tone/canon-hygiene, structural soundness. No new
                   creative content is invented here — only analysis.
      ↓
HUMAN REVISION     Mert revises in response to the audit.
      ↓
HUMAN APPROVAL     Mert approves. Status becomes APPROVED.
      ↓
LOCKED DESIGN      Mert locks it. Status becomes LOCKED and it is recorded in CREATIVE_REGISTRY.md.
                   Claude may not alter LOCKED material without explicit permission.
      ↓
IMPLEMENTATION     Claude implements the locked design (content/structure/later: code).
                   Status becomes IMPLEMENTED.
      ↓
PLAYTEST           The implemented element is exercised. Status becomes PLAYTESTED.
      ↓
HUMAN FINAL EDIT   Mert makes the final edit pass. Mert's edit is authoritative.
```

Notes:

- **Only Mert advances a concept to APPROVED and LOCKED.** Claude never self-approves.
- The STRUCTURAL AUDIT step is analysis, not authorship. Claude may recommend, but recommendations are not
  content until Mert approves them.
- A concept may loop back (QUESTIONS ↔ ANSWERS ↔ AUDIT ↔ REVISION) any number of times before approval.

## 4. Status vocabulary (single source of truth)

Allowed statuses, in progression order:

`EMPTY → CONCEPT → UNDER_REVIEW → APPROVED → LOCKED → IMPLEMENTED → PLAYTESTED`

- **EMPTY** — blank template; nothing authored.
- **CONCEPT** — Mert has stated an idea; open to Claude critique.
- **UNDER_REVIEW** — in the QUESTIONS/AUDIT loop; open to Claude critique.
- **APPROVED** — Mert has approved; Claude may implement.
- **LOCKED** — Mert has locked; Claude may not alter without explicit permission; recorded in the registry.
- **IMPLEMENTED** — built from the locked design.
- **PLAYTESTED** — exercised in play and reviewed.

## 5. Boundaries this charter protects

- Deterministic, offline, **no AI/API at play-time**.
- Exactly three authored choices at ordinary decision points.
- Established One Piece canon is the baseline setting/timeline; specific canon encounters/divergences
  require Mert's lock (see `RESEARCH_INDEX.md`).
- Protected against generic AI prose, fake branching, and permanent grimdark drift.
- Phase discipline: no story design, tech stack, or code until the relevant phase and Mert's approval.
