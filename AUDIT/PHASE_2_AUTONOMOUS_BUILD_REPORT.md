# PHASE 2 AUTONOMOUS BUILD REPORT

**Date:** 2026-07-20 · **Branch:** `build/phase-2-autonomous-prologue` (from
`repair/phase-1-instruction-reset`) · `main` untouched · nothing merged.

## 1. Major decisions made (all Working Canon unless marked [L])

1. **Prologue restructured 13 nodes → 8 scenes + sting**, ~6,100 words (Mert's 6,000–9,000
   window; several scenes run complete under 850 by design).
2. **Confession split, symmetry broken** (Mert's Phase 2B order): Merdou's patricide surfaces
   mid-argument in E3 as one four-word line; Ashren answers with an act (wings) and gets the
   longer confession *because talking too much is his character*; remaining details banked and
   completed off-page by departure — the [L] "no secrets by departure" lock is honored via a
   disclosure ledger in E3/E8 sidecars.
3. **The five-dead boat kept mundane [L]** but moved into the departure scene (E8) as a
   dawn-tide arrival at the wharf; the boat can be named by the island (C8-3) — the only
   christening route.
4. **Gups redesigned upward**: ideology ("hope must be undefeated" — cowardice as civic duty),
   the arena itself wired as his weapon (copper-mosaic circuit + Judgment Bell), panic =
   escalation-without-restraint aimed at bystanders (never tears), and a system (Priya, the
   Toll, the Ferry, Sgt. Hale's sincere propaganda-belief) that outlives him per fork.
5. **Losing-record Merdou on-screen from scene one** [L fact]: E1 opens with him *losing* while
   flirting; the comeback is the player's first choice — including the genuinely tempting
   throw-the-match option.
6. **Nosebleed replaced** [Mert-ordered originality]: Ashren's flame-sputter gag (sparks/smoke
   when flustered) — comedy welded to exposure risk; cats sabotage his romance.
7. **Woman-code rebuilt** [Mert-ordered originality]: loud machismo logic ("no manliness in
   it"), announced, tanked, complained about — distinct from Sanji's chivalry.
8. **Island de-gambled**: Old Legion founding history, Six Hundred Steps, Sunblind, step-
   shanties, maybe-buns, Ferryman tag, the Ferry (the unnamed fear), Gullwharf/Petal Row/
   Highbasket/Copper Kettle/Auntie Marn/Joro/Hale — non-gambling names comfortably exceed half.
9. **Groomed Pirates completed** (voices, laughs, kits, habits, frictions) — Wornman's
   cough-laugh "Kohohoho" seeds the sting.
10. **Merdou's laugh spelling**: "UHUHUHU!!" adopted as Working Canon after in-scene testing
    (used E1, E2, E3, E4, E8).

## 2. Working Canon created (headline items; full detail in briefs, [W]-tagged)

Merdou: ring-name gag (Magnificent/Baldy), attack set (MANNERS!! / DEAD LIFT / IRON TOAST /
CLOSING TIME!!), foolish habit (bets money he doesn't have on himself), taunt-baitability.
Ashren: laugh "Kihihihi", understatement tic, ring-name "The Persuader", flail set (METRONOME /
OVERDUE / "FULL STOP."), pre-exposition grief-tells (exits, sightlines, fire-stillness, never
haggles with children), wing-comb prop. Gups: epithet "Yuri the Unbeaten", laugh "Mmohohoho",
attack set (IVORY LAW / TRUNK GAVEL / THUNDER TOLL / JUDGMENT BELL), lieutenants (Odd-Eye
Priya, Brakko, Sgt. Hale). Island: everything in §1.8 plus stonefin cuisine and the coin-flip
granny custom. Groomed: full §1.9 designs.

## 3. Locked Canon preserved (spot-list)

Contract, charter, three-part spine, Sabaody betrayal, exactly-three choice rule + exceptions,
Bull of Heaven design (fruit unused in prologue — suppressed per brief; horns appear only as C6
option), dormant Conqueror's (never triggered), full-mutual-honesty-by-departure, five dead
mundane, player-decided takeover + Gups fate, News-Coo → Loguetown hook, 18+ scope, mythology
budget (no Void Century, no Mary Geoise, no apex names on-page; Kaido appears only as Merdou's
spoken idolization — zero canon figures on-screen; Marines are generic + one invented sergeant).

## 4. Files changed

Stage 1: 5 briefs rebuilt (two-tier [L]/[W]), CREATIVE_REGISTRY (two-tier model + arc entry),
CHARACTER_RUNTIME_CARDS (3 full cards), UNRESOLVED_DECISIONS (§G2), CLAUDE.md (phase, superseded
content, map). Stage 2: PROLOGUE_ARC_BRIEF replaced. Stage 3: S1/S2 removed (git history
preserves); 9 scene files + 9 state sidecars + _design-notes.md created. Stage 4: 7 prose
repairs from self-scan; ANTI_CLAUDEISM header updated; this report.

## 5. Prologue structure (final)

E1 Pit (C1 tactic/resource — incl. throw-the-match) → E2 Kettle (C2 resource/stance/info —
Joro & the Ferry) → E3 Steps (C3 promise — patricide line, wings, the pact) → E4 Crown gate
(C4 route — camp/dig/all-in week) → E5 Gauntlet (C5 relationship/sacrifice + **authored loss
branch**: debt cells, permanent brand) → E6 Gups (3 phases; C6 concealment crisis [L]) → E7
Fork + consequence in-scene (C7 LIBERATE/OWN/TOPPLE [L] + Gups fate) → E8 Boat/burial/departure
(C8 stance/info) → E9 Sting (state-assembled headline; Wornman silhouette).

## 6. Branch structure

Persistent exits: injuries (ribs/arm/broken/strain), exposure (none/whisper/merdou/ashren),
promise (one of three), mark.cointoss (3 values + fate sub-state), joro.fate (3), debt.brand,
boat.named, purse/debt, fix.exposed, allin, bond.{ashren,marn,island}, rep.pit. Reconvergence:
geography only (Loguetown [L]); E9's headline + sub-line assemble from state (5 text variants).
No kind/cruel/apathetic node exists; axes rotate per map. Every option writes ≥1 event.

## 7. Test paths (deterministic traces through sidecars)

**A — High public chaos:** C1-1 → C2-2 → C3-3 → C4-3 → C5-3 → C6-2 → C7-1 → C8-2. Verified:
fix named early pre-heats E4; all-in forces honest fight; broken sanction skips Gups phase 1;
horns → E9 horned-sketch headline; liberation bonfire carries Joro's PUBLIC_CAUSE page. State
math: purse lost E1 → Marn fronts C2 (debt.marn) ✓.
**B — Controlled/pragmatic:** C1-3 → C2-1 → C3-2 → C4-1 → C5-1 → C6-1 → C7-3 → C8-3. Verified:
thrown-match purse funds the marker with no Marn debt; camp week triggers collector pressure;
ribs + arm + broken carried to Loguetown; secrets intact → E9 "no pictures. Yet."; boat named
by Marn; TOPPLED empty-Crown closing image ✓.
**C — Failure-heavy/antagonistic:** C1-2 → C2-3 → C4-2 → **gauntlet loss** → E6 FROM_CELLS →
C6-3 → C7-2 → C8-2. Verified: Ferry-intel retaliation flags the Kettle; worn condition enables
loss; debt.brand permanent; branded entry texture in E6; Ashren burns → LUNARIAN? headline;
OWNED mark → Marn fear, income state, Ferry contract held unsigned (a loaded gun for Part I) ✓.
Cross-checks: Merdou in-character on all three (OWN is ambition, not aimless cruelty; codes
never violated on any path); Ashren autonomous (his burn is his own offer; refusal is tracked);
Gups dangerous to the last beat on all paths; later scenes read earlier state at 11 distinct
points.

## 8. Validation results

Anti-Claudeism grep: zero AI-tell constructions; 7 flagged passages (aphorisms/flourishes)
repaired in Stage 4. Simile density 0–4 per scene, all storyboardable. "Silence" appears once,
with staged cause. Narrator: E1/E4/E5 location cards + one E9 line ≈ 2% of words, zero jokes.
Voice-swap: Merdou (caps, crude, short), Ashren (dry, clausal, over-talks when angry), Gups
(magistrate), Marn (imperative) — all distinguishable untagged. Scene-gate: all 9 pass (visible
location, objective, interruption, prop, withheld info, material change; no interiority
anywhere; state in sidecars only). Canon boundary: no named canon character appears; no canon
event touched. Word total: 6,088 after repairs. No unresolved references (grep-verified).

## 9. Known weaknesses (honest)

1. E1 remains the shortest full scene (~640 body words) — intentionally fast cold open; may
   want one more crowd beat if it plays thin.
2. The E5 loss branch is authored as an in-file variant, not a full separate scene — adequate
   for prologue scale, will need real scene treatment if Part I keeps the pattern.
3. Gups-fate sub-choices (per fork) are specified in sidecars but compressed in prose — the
   fork scene trusts brief text; a per-fate beat each would add ~300 words if wanted.
4. "Maybe Flower" naming and several island customs are one-scene-tested at best; flagged for
   replacement if they read cute rather than lived-in during play.
5. No runtime executes the sidecars yet — state discipline is by hand until STORY_ENGINE gets
   an implementation phase.

## 10. Decisions Mert may later overturn (top of the list)

Laugh spelling "UHUHUHU!!" · all four Merdou attack names · Ashren's laugh/tic/techniques ·
"Yuri the Unbeaten" + his attack names + the wired-arena conceit · the Ferry (as the island's
named dread) · Old Legion founding · Sunblind custom · the Groomed kits/laughs/gags · the E5
loss-branch shape · the ring-name gag · Marn/Joro/Hale/Priya as recurring NPCs.

## 11. Major Decision Gates encountered

**None.** Nothing in the build changed locked identity, structure, canon contact, medium,
scope, or Archon-family truth. The closest call — restructuring the confession — was explicitly
pre-authorized in the Phase 2B order and preserves the underlying lock.
