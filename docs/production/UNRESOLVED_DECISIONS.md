# UNRESOLVED DECISIONS

**Status of this document:** GOVERNED — the open-questions ledger. Every item is a **question for Mert**,
never a proposed answer. Claude may critique and structure these questions but must not resolve them.

**How to use.** When Mert answers an item, move the decision into the appropriate governed doc
(`DIRECTOR_CHARTER.md`, `CREATIVE_REGISTRY.md`, `WRITING_DIRECTIVE.md`, or a future technical doc) and mark
the item RESOLVED with a date. Do not delete resolved items — strike them through and note where the
answer now lives.

**2026-07-11 update.** The Phase 1 interview produced `docs/director/PROJECT_CONTRACT.md` (APPROVED by
Mert), which resolves or partially resolves several items below. The contract also carries its own list of
newly surfaced open items (contract § "Unresolved items carried out of Phase 1") — treat that list as an
extension of this ledger.

Items are grouped by the gate they block. Nothing downstream of a gate should begin until its blocking
items are answered.

---

## A. Required before technical planning

1. ~~**Combat model: generic simulation vs authored, state-conditioned branching.**~~ The research
   (`ONE_PIECE_POWERS_SCALING RESEARCH.md` Laws 3/15; `ONE_PIECE_FIGHT_LAW.md`) insists "matchups are
   authored, not computed." A deterministic offline CYOA can honor this: outcomes authored, branches
   deterministic, engine checks approved story state to select among authored scenes and consequences.
   **RESOLVED 2026-07-11** → `PROJECT_CONTRACT.md` § Determinism guarantees: authored outcomes +
   state-conditioned branching confirmed; checkable state variables listed there.
2. ~~**State model scope.**~~ Which categories of persistent state does the game track across the whole
   campaign? **RESOLVED at category level 2026-07-11** → `PROJECT_CONTRACT.md` § Determinism guarantees:
   injuries, techniques, knowledge/secrets, relationships, reputation/bounty, allies, promises, witnesses,
   route flags, equipment, prior choices, location. Engine-level detail remains for technical planning.
3. **Save / progression structure across the three parts** (Pre-Timeskip → Post-Timeskip → Final Saga):
   one continuous state, or gated hand-offs between parts? **PARTIALLY RESOLVED 2026-07-11** — the
   save/reload philosophy is fixed in `PROJECT_CONTRACT.md` § Save and reload philosophy (permanence
   within a save; multi-slot allowed; regular autosave; no in-fiction rewind). **Still open:** one
   continuous state vs gated hand-offs between the three parts.

## B. Required before visual prototyping

4. ~~**Visual medium and presentation.**~~ **RESOLVED 2026-07-11** → `PROJECT_CONTRACT.md` § Medium and
   presentation: prose-primary + SFW illustration layer (portraits, splash art, key-art, bounty posters);
   explicit content prose-only; art generated in-session only after the relevant design is locked.
5. **Distinct visual identity direction** — what makes the game "visually polished and distinctive" as a
   text RPG? **CONCEPT SEEDED 2026-07-13 (Mert):** *"the page reads like watching the anime"* — episode
   presentation (title cards, cold opens, TO BE CONTINUED stings), attack-name splash typography,
   onomatopoeia beats (DON!!), reaction cut-ins, aura/Haki text styling, key-art stills at detonation
   moments. Component license drafted into `WRITING_DIRECTIVE.md §0.4`; full visual design and approval
   still pending at the UI phase.

## C. Required before protagonist lock

6. ~~**Is any prior protagonist restored?**~~ **RESOLVED 2026-07-11** → `PROJECT_CONTRACT.md`
   § Protagonist: start clean with one fully fixed, authored original protagonist (superseding the
   customizable self-insert concept). "Archon D. Merdo" and all old material remain DEPRECATED/non-canon.
   **Updated 2026-07-13:** Mert **deliberately restored the "Archon D." dynasty name** for the new
   protagonist, Merdou ("it's good writing"). The restoration covers the name/lineage only; all other
   old campaign material stays DEPRECATED unless Mert explicitly names it.
7. ~~**Devil Fruit vs Haki-only vs other.**~~ **RESOLVED 2026-07-13** — **Mythical Zoan, Model: Bull
   of Heaven** (chosen after Shuten-dōji was scrapped for balance), scoped to own-body momentum, with a
   **Haki-first fighting identity**. Brief:
   `docs/director/briefs/BULL_OF_HEAVEN_DEVIL_FRUIT_BRIEF.md` — **LOCKED (Mert, 2026-07-13,
   "lock everything"; PROPOSED sections ratified by that blanket approval).** *(Status corrected
   during Phase 1 reset, 2026-07-20 — this entry previously said UNDER_REVIEW, which was stale.)*
8. ~~**Protagonist name sourcing.**~~ **RESOLVED 2026-07-13** — protagonist named **Merdou** of the
   Archon D. Dynasty. Roots traceable (Merdou ← creator's name; Archon ← Greek "ruler"); the formal
   naming audit lives in the protagonist brief.
9. ~~**Adopt the canon "D." clan or not.**~~ **RESOLVED 2026-07-13** — the "D." is adopted deliberately
   via the restored Archon D. dynasty.

## D. Required before starting-island lock

10. ~~**Where and when does the story begin** in the One Piece world/timeline?~~ **RESOLVED 2026-07-13**
    — era: a few months before the Straw Hat crew forms; sea: **North Blue**; starting island: **the
    **Coin Toss Island** (Merdou and Ashren's pit-fighting home — see
    `docs/director/briefs/COIN_TOSS_ISLAND_BRIEF.md`). Route: Coin Toss Island → **Loguetown** to find
    the Part-I crew (Smoker/Tashigi crossing on the table, per Mert).
11. ~~**Relationship to the canon timeline at the start.**~~ **RESOLVED at policy level 2026-07-11** →
    `PROJECT_CONTRACT.md` § Canon-baseline policy ("canon is starting history, not an invisible wall";
    graduated divergence across the three parts). Specific encounters still require locked briefs.

## E. Required before enemy design

12. ~~**Tone-ceiling / grimdark dial.**~~ **RESOLVED 2026-07-11** → `PROJECT_CONTRACT.md` § Tone target
    and grimdark ceiling: warm One Piece baseline is the default resting tone; "no border" is the
    reachable ceiling of earned routes; 18+ treatment; sole hard line — all sexual content adults-only.
13. **Enemy-faction structure** — how many institutional layers does the game's world use
    (`One Piece research 2.md §3.1` suggests ≥7)? *(Scope decision.)*

## F. Required before potential-crew design

14. **Crew size and role model** — Strawhat-pattern roster, or different? **PARTIALLY RESOLVED
    2026-07-11** — the two-crew structure is fixed (`PROJECT_CONTRACT.md` § Crew: a doomed Part-I original
    crew containing the second Supernova; a new Part-II crew). **Still open:** size and role model of each.
15. ~~**Recruitment agency** — can player choices gain/lose crew, and can crew die or betray?~~
    **RESOLVED 2026-07-11** → `PROJECT_CONTRACT.md` § Crew and § Crew death, betrayal, and departure
    policy: yes to all, with causal-grounding rules and Mert-lock required for unavoidable losses.

## G. Required before first-arc writing

16. ~~**Scene length target.**~~ **RESOLVED 2026-07-13** — Mert approved the research recommendation:
    **800–1,000 words per scene/choice node.**
17. ~~**Choice-design contract.**~~ **RESOLVED 2026-07-11** → `PROJECT_CONTRACT.md` § Choice rule and
    § Outcome range: exactly-three confirmed with seven approved exceptions; choices are character
    stances; loss is a branch, not game-over.
18. ~~**Canon-encounter policy.**~~ **RESOLVED at policy level 2026-07-11** → `PROJECT_CONTRACT.md`
    § Canon-baseline policy (graduated divergence; Straw Hat protections pre-divergence-approval; Sabaody
    as first mandatory crossover). Each specific encounter still requires a locked
    `CANON_ENCOUNTER_BRIEF.md`.
19. ~~**Writing directive.**~~ **RESOLVED 2026-07-13, then SUPERSEDED 2026-07-20** — Mert delegated
    the stylistic layer to Claude ("I leave it to you to put the One Piece Eiichiro Oda paint...");
    `docs/director/WRITING_DIRECTIVE.md` was drafted from the research corpus and LOCKED by Mert's
    2026-07-13 blanket approval — then **ARCHIVED in the Phase 1 instruction reset** after the
    2026-07-20 audit found it the primary drift source (audit §4-D1). Active prose guidance now
    lives in `docs/writing/` (SCENE_GRAMMAR, ANTI_CLAUDEISM, FIGHT_DIRECTION, SCENE_GATE), which
    carries Mert's three verbatim rulings and awaits his review. *(This entry previously said
    "UNDER_REVIEW — no rule is active," which had been stale since the 2026-07-13 lock.)*

## H. Safe to postpone

20. **Research-artifact cleanup.** Whether to strip the `citeturn…` / `entity[…]` / `image_group{…}`
    residue in `ONE_PIECE_APPEARANCE_LAW.md`, `ONE_PIECE_CHARACTER_NAMING_CHARACTERS_RESEARCH.md`,
    `ONE_PIECE_POWERS_SCALING RESEARCH.md` — cosmetic; the folder is currently kept untouched.
21. **Filename normalization** of the research folder (inconsistent casing/spaces). Cosmetic; deferred
    unless Mert requests it.
22. **Fact-check pass** on a handful of citations flagged during the audit (some IMDb ratings and chapter
    numbers in the episode/fight files). Only matters if those facts are reused as project claims.
23. **Redundancy consolidation** — the "silhouette law" recurs across four files; dedupe when it is drawn
    into templates.
