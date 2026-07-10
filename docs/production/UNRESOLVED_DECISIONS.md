# UNRESOLVED DECISIONS

**Status of this document:** GOVERNED — the open-questions ledger. Every item is a **question for Mert**,
never a proposed answer. Claude may critique and structure these questions but must not resolve them.

**How to use.** When Mert answers an item, move the decision into the appropriate governed doc
(`DIRECTOR_CHARTER.md`, `CREATIVE_REGISTRY.md`, `WRITING_DIRECTIVE.md`, or a future technical doc) and mark
the item RESOLVED with a date. Do not delete resolved items — strike them through and note where the
answer now lives.

Items are grouped by the gate they block. Nothing downstream of a gate should begin until its blocking
items are answered.

---

## A. Required before technical planning

1. **Combat model: generic simulation vs authored, state-conditioned branching.** The research
   (`ONE_PIECE_POWERS_SCALING RESEARCH.md` Laws 3/15; `ONE_PIECE_FIGHT_LAW.md`) insists "matchups are
   authored, not computed." A deterministic offline CYOA can honor this: outcomes authored, branches
   deterministic, engine checks approved story state (injuries, techniques, knowledge, relationships,
   equipment, prior choices, location, promises, witnesses, route flags) to select among authored scenes
   and consequences. **Question:** confirm the authored-outcome + state-conditioned-branching model, and
   define which state variables the engine may check. *(This is a design confirmation, not a
   research-vs-determinism conflict.)*
2. **State model scope.** Which categories of persistent state does the game track across the whole
   campaign (injuries, techniques learned, knowledge/secrets, relationships, reputation/bounty, equipment,
   promises made, witnesses, route flags, resources)? *(Blocks any save-format or engine planning.)*
3. **Save / progression structure across the three parts** (Pre-Timeskip → Post-Timeskip → Final Saga):
   one continuous state, or gated hand-offs between parts?

## B. Required before visual prototyping

4. **Visual medium and presentation.** What does the game look like (pure text, text + static art, UI
   framing)? *(Determines whether `VISUAL_DIRECTION_BRIEF.md` targets prose imagery only or also assets.)*
5. **Distinct visual identity direction** — what makes the game "visually polished and distinctive" as a
   text RPG? *(Mert-owned visual decision.)*

## C. Required before protagonist lock

6. **Is any prior protagonist restored?** Default: "Archon D. Merdo" and all old material are DEPRECATED /
   non-canon. **Question:** does Mert restore anything, or start clean?
7. **Devil Fruit vs Haki-only vs other** for the protagonist — a core identity choice (the research offers
   both paths; neither is pre-approved).
8. **Protagonist name sourcing** — the research's own "sourced names live, gibberish dies" law
   (`One Piece Research 3.md §6.1`) requires a traceable root. *(Mert-owned.)*
9. **Adopt the canon "D." clan or not** (`One Piece Research 3.md §6.2`) — a deliberate design decision,
   not a default.

## D. Required before starting-island lock

10. **Where and when does the story begin** in the One Piece world/timeline (which sea, which era relative
    to canon events)? *(Baseline setting is canon; the specific entry point is Mert's.)*
11. **Relationship to the canon timeline at the start** — parallel/original region, or a canon location?
    *(Ties to the canon-encounter policy, item 18.)*

## E. Required before enemy design

12. **Tone-ceiling / grimdark dial.** `One Piece research 2.md §7` lists "Grimdark / Berserk" under NEVER
    DO, while the project goal calls for meaningful deaths, betrayals, and permanent consequences.
    **Question:** set the permanent ceiling on darkness, and where deaths/betrayals/permanent consequences
    are allowed vs forbidden. *(Directly serves the "protected from permanent grimdark drift" goal.)*
13. **Enemy-faction structure** — how many institutional layers does the game's world use
    (`One Piece research 2.md §3.1` suggests ≥7)? *(Scope decision.)*

## F. Required before potential-crew design

14. **Crew size and role model** — Strawhat-pattern roster, or different? *(Mert-owned.)*
15. **Recruitment agency** — can player choices gain/lose crew, and can crew die or betray? *(Ties to the
    tone ceiling, item 12, and the state model, item 2.)*

## G. Required before first-arc writing

16. **Scene length target.** `ONE_PIECE_EPISODES_ANATOMY_RESEARCH.md` recommends 800–1,000-word sustained
    threads for a prose CYOA. **Question:** set the offline prose length target per scene/choice node.
    *(The competing 350–500-token figure came from the now-removed SillyTavern dossier and no longer
    applies.)*
17. **Choice-design contract.** Confirm the three-choice rule as **character stances, not tactical picks**
    (`ONE_PIECE_FIGHT_LAW.md` Part B), and confirm that loss is a branch, not game-over. *(Confirmation of
    research guidance as project law.)*
18. **Canon-encounter policy.** Baseline canon is setting reference; **which** specific canon characters/
    events may be encountered, diverged from, or altered — and under what approval? *(Each specific
    encounter still requires a locked `CANON_ENCOUNTER_BRIEF.md`.)*
19. **Writing directive.** Does Mert have a separate writing directive not yet added, or should
    `docs/director/WRITING_DIRECTIVE.md` be authored later from the salvageable anti-slop/prose material in
    `ONE_PIECE_EPISODES_ANATOMY_RESEARCH.md` Part V and `ONE_PIECE_FIGHT_LAW.md` Part B? *(The former
    SillyTavern dossier that also held anti-slop material has been removed.)*

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
