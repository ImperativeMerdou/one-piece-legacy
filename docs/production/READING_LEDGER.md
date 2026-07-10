# READING LEDGER

**Purpose.** A per-file audit of every document in `ONE PIECE RESEARCH/`, recording what exists, whether
it was fully processed, what is malformed, and what *kind* of claims each file carries. This is the
evidence base that `RESEARCH_INDEX.md` and `CLAUDE.md` cite. It records processing status only — it does
**not** approve any content as project canon.

**Status of this document:** GOVERNED — production record. Update when a research file is added, removed,
edited, or re-audited.

**Sourcing categories used below** (qualitative, checkable — no invented percentages):

- **DOC** = documented canon or creator statement (traceable to the manga/anime/SBS/official profile or an
  Oda/other-creator interview)
- **INT** = source-backed interpretation (a defensible reading of canon, but the author's, not Oda's)
- **CRAFT** = craft inference (a general writing/design principle abstracted from patterns)
- **REC** = project recommendation (advice on how to build)
- **SPEC** = speculative or uncertain claim
- **OBS** = obsolete medium-specific instruction (targets a live-AI / SillyTavern runtime this project
  does not have)

**Read method.** All files were read at 100% coverage (three parallel full-text passes with last-line
confirmation and verbatim mid/end quotes). No file was sampled or skimmed.

**Folder totals (current):** 7 files · ~312 KB · 2,891 lines · ~44,000 words (`wc -w` ~44,248).
Two past-project files were removed on 2026-07-10 — see **Removed files** at the end.

---

## 1. `One Piece research 2.md`

- **Size / lines / words:** 50,681 B · 468 lines · ~7,716 words (`wc -w`)
- **Fully processed:** YES (read through line 468; final line is a closing code fence).
- **Major sections:** §1 Core Operating Philosophy; §2 Honorifics, Pronouns, Speech Levels (2.1–2.8, incl.
  honorific table); §3 World Laws, Institutions, Factions (3.1–3.8); §4 Power-System Design (4.1–4.9); §5
  Mistakes to Avoid (5.1–5.5); §6 Scene-Audit Checklist; **§7 Directive — "HAND THIS TO A WRITER OR AN
  AI"** (fenced block).
- **Unreadable / malformed:** None. Honorific table and fenced directive render correctly.
- **Duplicate / alternate versions:** None.
- **Claim types present:** DOC (accurate description of real One Piece institutions, fruit/Haki mechanics,
  named canon) · CRAFT (≥7-institution-layer rule, ≥4-of-7 island-divergence rule, five fight anchors,
  audit checklist) · REC · minor SPEC (a few etymology attributions).
- **Canon-hygiene flag:** §7 is authoring guidance framed "…OR AN AI" — treat as **human-authoring
  guidance only**; do not wire into any runtime. See `RESEARCH_INDEX.md §1`.

## 2. `One Piece Research 3.md`

- **Size / lines / words:** 48,603 B · 597 lines · ~7,519 words (`wc -w`)
- **Fully processed:** YES (read through line 597; final line "Now go make your cast.").
- **Major sections:** PART 0 Operating Principle; PART 1 Core Principles (12 Laws); PART 2 Building a
  Readable Character (2.1–2.8); PART 3 Personality and Voice (3.1–3.8); PART 4 Unified Character (4.1–4.4);
  PART 5 Power and Fighting Identity (5.1–5.5); PART 6 Naming System (6.1–6.4); PART 7 Common Mistakes (25
  rejects); PART 8 Practical Character Template; PART 9 Final Checklist (Gatekeeping); PART 10 Closing
  Doctrine.
- **Unreadable / malformed:** None.
- **Duplicate / alternate versions:** None. "Silhouette law" overlaps files 3 and 4 below (noted as
  redundancy, not duplication).
- **Claim types present:** DOC (Oda design-philosophy quotes; large body of mostly-accurate character
  etymologies) · CRAFT (12 Laws, axis rule, template + gatekeeping checklist) · INT · minor SPEC. No
  invented project entities — Part 8/9 are blank forms.
- **Canon-hygiene flag:** §6.2 invites importing the canon "D." clan — a *design option*, not a
  pre-approval. See `RESEARCH_INDEX.md §2`.

## 3. `ONE_PIECE_APPEARANCE_LAW.md`

- **Size / lines / words:** 37,825 B · 297 lines · ~4,723 words (`wc -w`)
- **Fully processed:** YES (read through line 297).
- **Major sections:** Research lens and evidence base; Silhouette/body/face/head-shape grammar;
  Outfit/culture/evolution grammar; Attractiveness and mixed-tone appeal grammar; Weapons and props as
  identity anchors; Crew lineup and ensemble balance; Rulebook/template/failure modes (blocks A–D).
- **Unreadable / malformed:** **Web-export machine artifacts present** — `image_group{…}` placeholders
  (e.g. L19), inline `entity["fictional_character",…]` tags (e.g. L22), and `citeturn…view…` provenance
  stamps throughout. Readable; must be stripped before any reuse, never copied forward as content.
- **Duplicate / alternate versions:** None. Silhouette overlap with files 2 and 4.
- **Claim types present:** DOC (one-piece.com profiles, Film Red model sheets, SBS "three circles, one X")
  · CRAFT (self-labeled at L13) · REC. All named examples are real canon used pedagogically; no invented
  entities.

## 4. `ONE_PIECE_CHARACTER_NAMING_CHARACTERS_RESEARCH.md`

- **Size / lines / words:** 40,023 B · 415 lines · ~4,818 words (`wc -w`)
- **Fully processed:** YES (read through line 415).
- **Major sections:** Research basis / what "belongs" means; The core grammar (name/silhouette/compression/
  contradiction/comedy/speech/dream-wound/tri-balance/prop/epithet); Category grammars by role (captains,
  first mates, comic crew, Marines, Cipher Pol, tyrants, tragic allies, island weirdos, underworld,
  monsters, children); Failure modes; Character construction rulebook; Naming rulebook + practical
  creation template.
- **Unreadable / malformed:** Same web-export artifacts as file 3 (`image_group{…}` e.g. L46, `entity[…]`
  tags, `citeturn…` stamps). Minor typos ("dangrous"). Readable.
- **Duplicate / alternate versions:** None.
- **Claim types present:** DOC (SBS, VIVRE CARD/official database, epithet/bounty mechanics) · CRAFT
  (self-labeled at L14/L30) · REC. **"Eldoria/Valethor" and "The Shadow Emperor of Oblivion" appear only
  as anti-examples of what NOT to do** — not proposed content. No invented project entities.

## 5. `ONE_PIECE_EPISODES_ANATOMY_RESEARCH.md`

- **Size / lines / words:** 51,443 B · 506 lines · ~7,701 words (`wc -w`)
- **Fully processed:** YES (read through line 506).
- **Major sections:** Part I Primary episode dissections (Wano: Ep 915, 972, 994, 1015–1016, 1026–1027,
  1033, 1062, 1071/1074); Part II Non-Wano benchmarks (Arlong Park, Enies Lobby, Marineford, Whitebeard);
  Part III Showrunner Rulebook (A–K); Part IV Dialogue law; Part V Prose adaptation law; Part VI Critical
  analysis of Wano; Conclusion.
- **Unreadable / malformed:** None. Romanizations/macrons render correctly.
- **Duplicate / alternate versions:** None. Shares "Beat-Breath-Burst" prose rhythm with file 6.
- **Claim types present:** DOC (specific episodes/chapters, SBS Vol. 105, IMDb ratings, Oda's
  Dragon-Ball-differentiation statement) · CRAFT (the lettered "laws") · INT/SPEC (director-intent
  readings; some ratings warrant a spot-check). Frames the target medium as **"CYOA saga / prose"** —
  natively on-genre. Only invented fragments are unnamed illustrative prose snippets.

## 6. `ONE_PIECE_FIGHT_LAW.md`

- **Size / lines / words:** 47,986 B · 331 lines · ~7,475 words (`wc -w`)
- **Fully processed:** YES (read through line 331; final line "Build the sentence first. Then throw the
  punch.").
- **Major sections:** **Part A** — Twelve laws of One Piece combat (I Taxonomy; II Entry conditions; III
  Combat identity; IV Escalation; V Comedy-in-combat; VI Public spectacle/crowd; VII Humiliation/damage;
  VIII Flashback/trigger; IX Named attacks/finisher; X Environmental destruction; XI Reversal/turning
  point; XII Parallel crew fights/aftermath). **Part B** — Prose CYOA fight adaptation (translation
  problem; carrying energy in prose; **CYOA-specific fight design**; steal/refuse list; master principle).
- **Unreadable / malformed:** None.
- **Duplicate / alternate versions:** None. Sibling to file 5.
- **Claim types present:** DOC (chapters; Oda's de-emphasis-of-fighting / rubber-for-comedy intent) · CRAFT
  (the twelve laws) · REC (Part B design rules). **Most directly on-genre file:** choices as character
  stances not tactical picks, loss-as-branch not game-over, persistent injury/resource state. A few
  chapter-number citations warrant a spot-check. No invented project entities.

## 7. `ONE_PIECE_POWERS_SCALING RESEARCH.md`

*(Note the space, not underscore, before "RESEARCH" in the real filename.)*

- **Size / lines / words:** 35,165 B · 277 lines · ~4,296 words (`wc -w`)
- **Fully processed:** YES (read through line 277; final line "Awakening becomes routine.").
- **Major sections:** Method / canon anchors; The series signature feel; The fifteen laws of One Piece
  power grammar; Rulebooks and design laws (blocks A–D); Practical power design template (block E).
- **Unreadable / malformed:** **Web-export artifacts present** — `image_group{…}` (e.g. L29), `entity[…]`
  tags, `citeturn…` stamps. Readable.
- **Duplicate / alternate versions:** None.
- **Claim types present:** DOC (official Devil Fruit/Haki rules, power-as-commodity/cruelty) · CRAFT (15
  laws, creation rulebooks) · REC. **Contains the "matchups are authored, not computed" stance and warns
  against computed tiers / "balanced kits" / procedural simulation** (Laws 3, 15). This is a craft stance
  the project *keeps* (authored outcomes), not a conflict with determinism — see `UNRESOLVED_DECISIONS.md`.
  No invented project entities.

---

## Removed files (2026-07-10)

Deleted at Mert's direction as leftover material from past/other projects. Both were fully processed
before removal; any craft they carried that is still wanted survives in the seven files above (the
principles were redundant across the set) and in `RESEARCH_INDEX.md`.

- **`One Piece Research 1.md`** — "THE ARCHON D. MERDO SHOWRUNNER BIBLE." Built around a **deprecated
  protagonist from a prior campaign** (Archon D. Merdo, spec §IV.2). Past-project material; non-canon.
- **`ONE_PIECE_RESEARCH_BIBLE.md`** — "Storytelling and Design Dossier **for SillyTavern RP**." Built for
  a **different platform/project** (a live-AI SillyTavern RP); its §§11 & 13 were sampler/lorebook/
  narrator-card machinery with no runtime target in this deterministic offline game.

---

## Cross-file summary

- **Fully processed:** all 7 surviving files (100%). **Unreadable:** none. **Malformed (artifact residue
  to strip):** files 3, 4, 7.
- **Deprecated original material:** the example protagonist "Archon D. Merdo" lived only in the now-removed
  `One Piece Research 1.md`. It remains non-canon unless Mert restores it.
- **Obsolete medium-specific machinery:** the SillyTavern dossier is removed; only `One Piece research 2.md`
  §7's "…or an AI" framing remains (human-authoring guidance only).
- **Redundancy:** the "silhouette law" recurs near-verbatim across files 2, 3, 4.
- **Standing gap:** no dedicated writing-directive file exists — logged in `UNRESOLVED_DECISIONS.md`.
