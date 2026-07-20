# GAME STATE SCHEMA — Coin Lands Saga engine data model

**Status:** GOVERNED — operational spec (Phase 3A, 2026-07-20, Fable). Extends
`STORY_ENGINE.md` (which remains the parent spec: sidecar philosophy, fake-branching
validation, locked ledger vocabulary). This document defines the CONCRETE, machine-executed
format the Phase 3 engine runs. Format: **JSON** (one file per episode + one manifest),
loaded by the offline player. No AI, no network, fully deterministic.

## 1. Node format

Every story beat is a node. A scene is an ordered set of nodes sharing a `scene` id.

```json
{
  "id": "e1-s2-b04",
  "episode": 1,
  "scene": "e1-s2",
  "beat_type": "dialogue",
  "location": "kettle-interior",
  "background": "bg-kettle-night",
  "characters": [ {"id": "merdou", "pose": "talking", "position": "left"} ],
  "speaker": "merdou",
  "portrait": "merdou-angry",
  "text": "That was a FULL GLASS, you CHAIN-HANDED COW.",
  "caption": null,
  "sfx_visual": "impact-small",
  "animation": "shake-light",
  "conditions": [ {"key": "flags.fixNamed", "op": "eq", "value": true} ],
  "choice_options": null,
  "immediate_effects": null,
  "state_set": {"flags.sawSteel": true},
  "next_node": "e1-s2-b05",
  "consequence_node": null,
  "reconvergence_node": null
}
```

**`beat_type` values:** `card` (narrator location/time card) · `caption` (action text) ·
`dialogue` · `choice` · `consequence` (immediate-consequence beat) · `panel`
(`what-changed` panel) · `reveal` (full-width impact image/attack card) · `cutin`
(reaction strip) · `title` (scene/episode title card) · `sting` · `transition`.

**Conditional content:** a node renders only if all `conditions` pass; sibling variant nodes
carry the same `next_node`. Exactly one candidate may match at any point (validator-enforced);
a final fallback variant with `conditions: []` is required wherever variants exist.

**Choice nodes** carry `choice_options`:

```json
{
  "beat_type": "choice",
  "choice_id": "E1-C1",
  "axis": "tactic",
  "prompt": "The Pit holds its breath.",
  "choice_options": [
    {
      "id": 1,
      "label": "\"You wanted a show?! FINE! EVERYBODY WATCH!\"",
      "risk": "Ashren bet against you. The purse dies with the comeback.",
      "conditions": [],
      "locked_text": null,
      "immediate_effects": { "state_set": {"rep.pit": "SHOWMAN"},
        "resource_change": {"purse": -40000},
        "relationship_change": {"ashren": "banter-strained"},
        "known_effects": [
          {"icon": "crowd", "label": "PIT CROWD", "text": "A comeback they will sing on the Steps."},
          {"icon": "berry", "label": "PURSE", "text": "The bet dies with the win. -40,000 berries."}
        ],
        "hidden_effects": [ {"key": "gups.alert", "delta": 2} ],
        "unlock": ["e2-opener-show"], "lock": [] },
      "consequence_node": "e1-s3-c1a",
      "reconvergence_node": "e1-s4-b01"
    }
  ]
}
```

Rules: `label` = the action in Merdou's (or the actor's) voice; `risk` = the obvious
immediate risk, stated plainly (LAYER 1 of the consequence loop); `locked_text` shown when
`conditions` fail (locked-option display per contract exception 7); every option's
`consequence_node` is a REAL branch-specific beat sequence — reconvergence is illegal before
it completes (validator rule).

## 2. State families (save-file shape)

```json
{
  "resources": { "purse": 0, "debt": {"marn": 0, "house": 0}, "stakes": null },
  "injuries":  { "merdou": [], "ashren": [] },
  "promises":  [ {"id": "tribe", "text": "…", "status": "open"} ],
  "secrets":   { "bull": "hidden", "patricide": "ashren-knows", "wings": "hidden",
                 "flame": "hidden", "conqueror": "dormant" },
  "exposure":  { "level": "none", "witnesses": [], "whispers": [] },
  "reputation":{ "pit": "JOKE", "island": "local-loudmouth", "headlines": [] },
  "bonds":     { "ashren": "loyal", "marn": "warm", "joro": "neutral", "hale": "wary",
                 "priya": "neutral", "gups": "dismissive" },
  "knowledge": { "player": [], "gups": [], "marines": [] },
  "evidence":  [],
  "pressure":  { "island": 0, "gups_alert": 0, "marine_suspicion": 0 },
  "routes":    { "opened": [], "closed": [] },
  "marks":     { "cointoss": null },
  "world":     { "joro_fate": null, "kettle": "safe", "ferry": "running",
                 "sailors": {}, "boat": null },
  "flags":     {},
  "history":   { "choices": [], "scenes_seen": [], "beats_read": [] },
  "meta":      { "slot": 1, "timestamp": 0, "timeline_altered": false, "version": "3.0" }
}
```

**Bond vocabulary (qualitative, player-facing):** `hostile · wary · neutral · warm · loyal ·
strained · frightened · impressed · suspicious`. Raw numbers never surface in normal play;
internal counters may exist but the DISPLAYED state is always one of these words plus a
one-line behavioral note. Developer debug mode (`?debug=1` / toggle) shows the exact numeric
trace and full mutation log.

## 3. Effect vocabulary

`state_set` (absolute) · `state_change` (delta on numeric keys) · `relationship_change`
(bond word transitions; validator checks legal transitions — e.g. `warm→frightened` requires
a flagged frightening event) · `resource_change` · `unlock`/`lock` (route lists; locks are
permanent per save) · `promise_add`/`promise_resolve` · `injury_add` · `evidence_add` ·
`exposure_raise` · `mark_set` (once per island, permanent).

**`known_effects`** feed the WHAT CHANGED panel verbatim (plain language, icon-tagged).
**`hidden_effects`** surface later; the panel shows only `A hidden thread has changed.` when
any hidden effect fired (one line regardless of count — no information leakage).

## 4. Callback contract (LAYER 4 enforcement)

Every choice declares `callbacks: [ {scene, kind} ]` in the episode manifest — at least one
LATER scene that explicitly reads its state (dialogue, price, injury, rumor, tactic,
availability). The validator fails any choice with an empty callback list, and any callback
pointing at a scene that never reads the key. End-of-episode summaries do not count.

## 5. Save system

- **Autosave** after every resolved choice and scene end (slot 0).
- **Manual slots** 1–6; saves store the full state object + node cursor; export/import as
  JSON text (clipboard) for backup.
- **Replay episode** from any completed episode boundary (spawns a new save copying state
  at that boundary). Re-choosing inside an existing save marks `meta.timeline_altered=true`
  and the HUD badges the save as an ALTERED TIMELINE (per Mert's order: no silent rewind).
- **Skip-read:** `history.beats_read` powers fast-forward through already-read beats;
  backscroll shows the current scene's already-played beats read-only.
- **New-game reset** wipes one slot after typed confirmation.

## 6. Validation suite (run before every stage commit)

1. Graph integrity: every `next_node`/`consequence_node`/`reconvergence_node` resolves; no
   orphan nodes; no cycle without a state change.
2. Choice legality: 3 options at ordinary nodes (or documented exception class); every option
   has consequence beats before reconvergence; axis rotation between consecutive choices.
3. Variant exclusivity + fallback presence.
4. Callback contract (see §4). 5. Bond-transition legality. 6. `closes` honored (locked
   routes unreachable). 7. Score sidecars present and passing for every scene/choice/fight.
8. Word-count and narrator-share telemetry per scene (soft warnings).
