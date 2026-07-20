# PHASE 1 INSTRUCTION RESET — REPORT

**Date:** 2026-07-20 · **Branch:** `repair/phase-1-instruction-reset` · **Scope:** instruction
hierarchy, statuses, cross-references, research quarantine, active stack, visual-reference
skeleton. **Zero creative content changed. Zero blanks filled.**

## 1. Pre-surgery state

- Branch: `main` · Commit: `615b619e159000345a538745dfe240c2971257cc`
  ("Prologue: S1 accepted; implement S2 draft (The Tavern, Running Hot)")
- Working tree at start: no tracked modifications; one untracked directory `AUDIT/` containing the
  Mert-commissioned audit (`FABLE_FULL_REPOSITORY_AUDIT.md`) — the sanctioned deliverable of the
  previous step, included in this phase's commit.

## 2. Safety tag

`pre-phase-1-surgery` — annotated tag on `615b619` (pre-surgery state), pushed with the branch.
`main` is untouched and remains at `615b619`.

## 3. Files changed (modified)

| File | Change |
|---|---|
| `CLAUDE.md` | Rewritten (160 lines): current phase, frozen-content register, active reading order, research quarantine, blank-field rule, status vocabulary (+GOVERNED/ARCHIVED), change control, current repo map, validation checks |
| `docs/director/WRITING_DIRECTIVE.md` | ARCHIVED banner prepended: superseded, not active, never auto-loaded, not citable, not a transcription of Mert's rulings (his 3 verbatim rulings identified and re-homed). Original text preserved unchanged below the banner |
| `docs/director/CREATIVE_REGISTRY.md` | Writing Directive entry updated LOCKED → ARCHIVED (historical lock preserved); pointer to where Mert's rulings now live |
| `docs/director/briefs/MERDOU_PROTAGONIST_BRIEF.md` | Cross-reference metadata only: two stale "(UNDER_REVIEW)" pointers (Bull brief, Ashren brief) corrected to "(LOCKED)", each with a dated correction note. No creative field touched |
| `docs/production/RESEARCH_INDEX.md` | Rebuilt as the reliability index: per-file contents, evidence types, known factual errors, dead-citation warnings, void "laws," consultation rules |
| `docs/production/READING_LEDGER.md` | Status → ARCHIVED with supersession note (its generous reliability grades flagged); body preserved |
| `docs/production/UNRESOLVED_DECISIONS.md` | Items 7 and 19 corrected (both stale: item 7 said the Bull brief was UNDER_REVIEW; item 19 said no directive rule was active) |

## 4. Files created / moved / archived

Created — active stack: `docs/writing/ONE_PIECE_SCENE_GRAMMAR.md` (83), `docs/writing/
ANTI_CLAUDEISM.md` (24), `docs/writing/SCENE_GATE.md` (43), `docs/writing/FIGHT_DIRECTION.md`
(52), `docs/runtime/STORY_ENGINE.md` (101), `docs/runtime/CHARACTER_RUNTIME_CARDS.md` (61),
`docs/research/VISUAL_REFERENCE_PROTOCOL.md` (39).
Created — quarantine & skeleton: `ONE PIECE RESEARCH/_ARCHIVED.md`, `.gitignore`,
`reference/` tree (3 gitignored raw-private dirs; 3 study dirs with blank templates
`_TEMPLATE_MANGA_SCENE_STUDY.md`, `_TEMPLATE_ANIME_FIGHT_STUDY.md`,
`_TEMPLATE_CHARACTER_DESIGN_STUDY.md`; `distilled/.gitkeep`).
Created — records: this report; `AUDIT/FABLE_FULL_REPOSITORY_AUDIT.md` enters version control.

Moved: **none.** Archival was done in place (banner + status) for `WRITING_DIRECTIVE.md`,
`READING_LEDGER.md`, and `ONE PIECE RESEARCH/` because moving them would break cross-references
inside LOCKED briefs and FROZEN scenes that Phase 1 is not permitted to edit. Nothing was deleted;
full history is preserved in git and the archived documents' own text is untouched.

## 5. Active reading order — before

De facto (per old CLAUDE.md + practice): `CLAUDE.md` (stale) → `DIRECTOR_CHARTER.md` →
`PROJECT_CONTRACT.md` → **`WRITING_DIRECTIVE.md` (287 lines of style law)** → `CREATIVE_REGISTRY.md`
→ briefs → **research corpus as imported authority** (the directive cites it as law; briefs cite
its "laws" by section).

## 6. Active reading order — after

Core (always): `CLAUDE.md` → `DIRECTOR_CHARTER.md` → `PROJECT_CONTRACT.md` → `CREATIVE_REGISTRY.md`.
Scene writing adds: `SCENE_GATE.md` → `ONE_PIECE_SCENE_GRAMMAR.md` → `ANTI_CLAUDEISM.md` →
`CHARACTER_RUNTIME_CARDS.md` → on-stage briefs (+ `FIGHT_DIRECTION.md` for fights).
Engine work adds: `STORY_ENGINE.md`. Never auto-loaded: research corpus, archived directive,
archived ledger (each reachable only via `RESEARCH_INDEX.md` / explicit need).

## 7. Approximate active context line count

- **Before:** core governance ~942 lines (CLAUDE 118 + directive 286 + contract 347 + charter 99 +
  registry 92) **plus ~2,891 lines of research ruling from the shadows** via directive imports and
  brief citations. Effective writing-request context: ~940–3,800 lines.
- **After:** core 700 lines (CLAUDE 160 + charter 99 + contract 347 + registry ~94); a scene task
  adds 211–263 toolbox lines + the relevant briefs; research contributes **0** unless a specific
  question sends someone through the index. Effective writing-request context: **~900–1,000 lines,
  all of it current and labelled by authority.**

## 8. Status contradictions fixed

1. CLAUDE.md "blank governed scaffold" claim about a LOCKED, populated directive — removed.
2. CLAUDE.md Phase-0 posture vs. actual phase — corrected (phase section + frozen-content section).
3. CLAUDE.md "registry empty until Mert locks" vs. 7 registered entries — corrected (map + text).
4. WRITING_DIRECTIVE LOCKED-including-REV-3 vs. internal "⟨REV 3 — UNDER_REVIEW⟩" — resolved by
   archiving the whole document; the contradictory markers are preserved as historical record and
   flagged in the banner.
5. UNRESOLVED_DECISIONS item 19 ("no rule is active") vs. the 2026-07-13 lock — corrected with the
   full timeline (locked → archived).
6. UNRESOLVED_DECISIONS item 7 (Bull brief "UNDER_REVIEW") vs. its LOCKED header — corrected.
7. MERDOU brief's two stale "(UNDER_REVIEW)" cross-references — corrected to (LOCKED).
8. Registry's directive entry (LOCKED, implying active law) — restated as ARCHIVED with history.
9. Status vocabulary extended (GOVERNED/ARCHIVED for non-creative docs) so every document now has
   exactly one legal status.

## 9. Broken / stale references fixed

Old CLAUDE.md repository tree (missing `content/`, briefs, `PROJECT_CONTRACT.md`; describing
blank/empty files that are populated) → replaced with the current map. RESEARCH_INDEX rebuilt so
its endorsements no longer contradict the audit. READING_LEDGER marked superseded rather than
silently divergent. All paths in the new CLAUDE.md verified to exist (validation §12).

## 10. Items deliberately left unresolved (with reasons)

1. **S2's invalid status `IMPLEMENTED_DRAFT` (S2:2)** — S1/S2 are frozen byte-for-byte by Mert's
   order; the freeze outranks the status-repair task. Fix on unfreeze.
2. **S1/S2 headers citing "register: Writing Directive (LOCKED)"** — same freeze.
3. **PROLOGUE_ARC_BRIEF references to directive laws** — the map is frozen pending Mert's
   compression ruling.
4. **DIRECTOR_CHARTER's Phase-0 clause (:34)** — historical restriction inside a governing doc;
   amending the charter (incl. the audit's anti-blanket-lock rule) is a Mert decision, listed in
   §14. The operational safeguard is meanwhile recorded in CLAUDE.md § Change control, labelled
   as pending his ratification.
5. **Research essays untouched** (artifacts unstripped, errors uncorrected) — per Phase 1
   instruction; quarantined and labelled instead.
6. **BULL brief's Elbaf-chain verification flag** — still open; must be verified before that lore
   goes on-page.
7. **ASHREN brief's "aura, 'he is him'" phrasing** — creative content in a LOCKED brief; audit
   §10 flags it; Mert's call.
8. **Runtime cards for Ashren/Gups/crew** — not created: their scene-blocking blanks make cards
   contentless; creating them awaits the Phase 2 authoring sessions.
9. **READING_LEDGER not merged into RESEARCH_INDEX** — archived instead of merged to avoid
   rewriting a historical record.

## 11. Files frozen from creative modification

`content/part-1/prologue/S1-the-pit.md` · `content/part-1/prologue/S2-the-tavern.md` (both
byte-for-byte) · `docs/director/briefs/PROLOGUE_ARC_BRIEF.md` (13-node map) — all pending Mert's
review. All seven briefs' creative content remains locked as-is (only MERDOU cross-ref metadata
was touched, as explicitly permitted). All BLANK and SEALED fields remain blank/sealed.

## 12. Validation results

1. **S1/S2 byte-unchanged:** `git diff --stat main -- content/` → empty. **PASS**
2. **Prologue map unchanged:** `git diff --stat main -- docs/director/briefs/PROLOGUE_ARC_BRIEF.md`
   → empty. **PASS**
3. **Briefs:** only `MERDOU_PROTAGONIST_BRIEF.md`, +4/−2 lines, both hunks cross-reference
   status metadata. **PASS**
4. **No BLANK creative field filled:** every BLANK/SEALED marker in all briefs is untouched
   (briefs diff limited to item 3). **PASS**
5. **No copyrighted material added:** no image/video files in `git status`; `.gitignore` blocks
   the entire `reference/raw-private/` tree and all media formats under `reference/`. **PASS**
6. **Research absent from ordinary reading order:** new CLAUDE.md lists it under "Never
   auto-loaded"; folder carries `_ARCHIVED.md`. **PASS**
7. **Active-file links resolve:** all 21 paths named in CLAUDE.md verified to exist. **PASS**
8. **One unambiguous status per active document:** verified across the active stack (GOVERNED /
   LOCKED / ARCHIVED headers). **PASS**
9. **Stale-phrase search** — remaining matches, each intentional:
   - `Phase 0`: CLAUDE.md:17-18 (states the phase is *complete* — correct), DIRECTOR_CHARTER.md:34
     (historical restriction, charter amendment deferred to Mert — §10.4),
     PROJECT_CONTRACT.md:279 ("Phase 0 … complete" — correct).
   - `blank governed scaffold`: zero matches outside AUDIT quotations.
   - `REV 3 — UNDER_REVIEW`: only inside the ARCHIVED `WRITING_DIRECTIVE.md` (banner mention + 3
     preserved historical section headers) — preserved deliberately as record, declared inactive
     by the banner.
   - Incorrect active paths: none found (item 7).
10. CLAUDE.md length: 160 lines (< 200 required). **PASS**

## 13. Remaining risks

1. The archived directive and research remain readable in place; a careless session that skips
   CLAUDE.md could still load them. Mitigated by banners at their heads; eliminated only by
   discipline or a future move (which requires editing frozen/locked cross-references).
2. S1/S2 remain the only prose in the repo and still carry the drifted register with "accepted by
   Mert" on S1 — a style precedent until he re-rules (Phase 2, question 1 of the audit's plan).
3. The new toolbox files are **operational but unratified** — created under this surgery's
   authority, awaiting Mert's review; until then they are Claude-labelled recommendations plus his
   three quoted rulings.
4. The charter still lacks the anti-blanket-lock amendment (only CLAUDE.md carries the safeguard).
5. Repo lives inside OneDrive; sync conflicts with git are a standing environmental risk
   (observed CRLF warnings are benign line-ending normalization per `.gitattributes`).
6. No runtime still exists; the engine spec is paper until Phase 2+ decisions.

## 14. Recommended Phase 2 questions for Mert (listed, not answered, not asked yet)

1. **Merdou's speaking and behavioral identity:** catchphrase/tic; recurring habits and gags;
   pride/insecurity pair; the one weird thing; 2–3 named attacks; the non-negotiable combat
   constraint; how numbness and Archon warmth share one register on the page.
2. **Ashren beyond tragedy + sexual comedy:** epithet; verbal tics; the one weird thing; named
   flail techniques; concealment-gear design; what non-comic tells of the hunted survivor appear
   in early scenes; whether the nosebleed stays (Sanji overlap) or a distinct failure mode
   replaces it.
3. **Coin Toss Island's non-gambling culture:** the seven axes (currency, architecture, food,
   fashion, climate, polity detail, language quirk); the rot's concrete machinery; why locals
   obey; what ordinary island life looks like on-screen.
4. **Yuri Gups's interior:** ideology/want beyond ego; both weaknesses; epithet; the one weird
   thing; his social machinery (who profits, who enforces); what sits underneath the cowardice
   for a phase-3 answer.
5. **Prologue length:** ratify, adjust, or reject the audit's 7-scene + sting compression
   (audit §22) vs. the current 13-node map.
6. **The fixed protagonist's decision boundaries:** which axes of choice are legitimate for
   Merdou (audit §15's rotation proposal); whether the exactly-three presentation stays; how much
   apathy-flavored choice his numbness may supply per arc.
7. **Archon mythology budget for Part I:** keep or trim the eight-name apex-knower list; how much
   dynasty/Void-Century weight is visible before Sabaody; which knowers get canon-encounter
   briefs and when.
8. **Tone balance:** the desired ratio of comedy / adventure / tragedy / danger for the prologue
   and Part I, so the toolbox's judgment calls have a target.
Plus carried governance items: ratify the new toolbox docs; ratify the narrator model; the charter
amendment; the register re-ruling that unfreezes S1/S2 for rewrite.
