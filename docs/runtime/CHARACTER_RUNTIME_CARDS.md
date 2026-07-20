# CHARACTER RUNTIME CARDS

**Status:** GOVERNED — operational format (Phase 1, 2026-07-20). A runtime card is the ≤25-line
**writing-context view** of a character: only what is needed to write them in a present scene.
Cards are *views* of the LOCKED briefs — the brief is the design record and always wins; cards are
regenerated when briefs change and **never contain anything the briefs don't**. BLANK on a card
means BLANK in the brief: do not write around it by invention — stop and ask Mert.

## Card schema

```
CARD: <name>  ·  source brief: <path>  ·  regenerated: <date>
APPEARANCE NOW:    <1-2 lines, current look incl. current injuries/gear>
PHYSICAL ACTING:   <how they move, stand, take up space>
SPEECH FINGERPRINT:<register + tics + 1-2 sample lines once authored>
ORDINARY HABITS:   <what they do when nothing is happening>
COMEDY BEHAVIOR:   <their recurring engine, if authored>
ANGER BEHAVIOR:    <what anger looks like on them>
FEAR BEHAVIOR:     <what fear looks like on them>
RELATIONSHIPS:     <per key character: 1 line + current Bond flags>
CURRENT KNOWLEDGE: <secrets known / not known (info.* state)>
CURRENT INJURIES:  <persistent damage in effect>
COMBAT METHODS:    <authored weapons, techniques, limits — authored only>
NEVER (OOC line):  <what this character will not do — authored only>
```

## Example instantiation — MERDOU (schema demonstration; approved facts only, blanks visible)

```
CARD: Archon D. Merdou · source: docs/director/briefs/MERDOU_PROTAGONIST_BRIEF.md · 2026-07-20
APPEARANCE NOW:    27; super tall, wide, burly, small belly; bald (shaved); hairy chest/arms; huge
                   chest slash scar; "Legacy" kanji neck tattoo; open crimson shirt, leather pants,
                   spiked boots, demon-horned belt.
PHYSICAL ACTING:   Pit-fighter wall; unhurried. (Further movement identity: BLANK)
SPEECH FINGERPRINT:Two authored poles — Archon tavern warmth (big laughter, explosive, funny) /
                   post-patricide numbness ("bored of life"). Catchphrase/verbal tic: BLANK.
                   Sample lines: BLANK (none authored).
ORDINARY HABITS:   Drink; cooking/cuisine-blood; pit instincts. Specific recurring gags: BLANK.
COMEDY BEHAVIOR:   Warm explosive tavern-humor (authored direction). Specific engine: BLANK.
ANGER BEHAVIOR:    Fiery, quick to anger (authored trait). Staging specifics: BLANK.
FEAR BEHAVIOR:     BLANK.
RELATIONSHIPS:     Ashren — best friend, pit-rival, first believer. Aslan/Melissa/Metehan — unseen
                   7 years (twins hate him). Mother — unauthored relationship. Father — dead by his
                   hand; buried mutual love.
CURRENT KNOWLEDGE: Knows: his own patricide, both heirloom fruits, family truth. Post-S3 (per
                   locked ruling): knows all of Ashren's truth, and vice versa.
CURRENT INJURIES:  None at game start.
COMBAT METHODS:    Blunt weapons (defining); Haki-first philosophy; dormant Conqueror's; Bull of
                   Heaven (suppressed, shallow mastery — see fruit brief). Named attacks: BLANK.
NEVER (OOC line):  BLANK (non-negotiable constraint unauthored).
```

## Rules

1. One card per character who appears on stage; no card, no scene (SCENE_GATE A).
2. Cards for Ashren, Yuri Gups, and the Groomed Pirates are **not created until their
   scene-blocking blanks are addressed with Mert** — creating them now would only document how
   unwritable they currently are (that finding already lives in audit §§10–13).
3. "Approved facts only": every card line must be traceable to a brief line or a dated Mert ruling.
4. `CURRENT *` fields are state snapshots — they change per story position and will eventually be
   generated from engine state (`STORY_ENGINE.md`); until then they are maintained by hand per arc.
