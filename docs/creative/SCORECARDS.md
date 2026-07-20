# SCORECARDS — SCENE · CHOICE · CHARACTER · FIGHT (+ NAME, see NAME_GRAMMAR.md)

**Status:** GOVERNED — operational (Phase 3A, 2026-07-20). Rubrics fixed by Mert's Phase 3
order; wording below is the operating copy. Scores are **diagnostics recorded outside
player-facing text** (in `.state.yaml` sidecars / design notes). If scoring makes scenes
mechanical, the scoring system is revised, not the scene (Mert's order). Quality-gate targets:
scene average ≥86 · choice average ≥86 · character average ≥86 · Gups fight ≥90.

## 1. SCENE SCORECARD (0–100; pass ≥84)

| Criterion | Max | Floor |
|---|---|---|
| Visual clarity / storyboardability | 15 | **12** |
| Character voice | 15 | **12** |
| Meaningful change by scene end | 15 | **12** |
| One Piece reference alignment (mechanics level, per REFERENCE_MATRIX) | 10 | — |
| Slow-burn discipline / earned payoff | 10 | — |
| Comedy or human texture | 10 | — |
| Emotional honesty | 10 | — |
| Island / world texture | 5 | — |
| Choice quality, if a choice exists (else prorate: score the scene /95 ×100) | 5 | — |
| Narrator restraint | 5 | — |

Additional hard fails regardless of total: a major revelation without sufficient setup;
passing solely on attacks/gags/reaction shots.

## 2. CHOICE SCORECARD (0–100; pass ≥82, no zero in any category)

| Criterion | Max |
|---|---|
| Different immediate events per option | 20 |
| Different later consequences | 15 |
| Meaningful cost | 15 |
| Player understands the immediate risk before choosing | 10 |
| All options fit Merdou's plausible range | 10 |
| No option is filler | 10 |
| Route or content impact | 10 |
| Relationship impact | 5 |
| Thematic relevance | 5 |

Hard rules: no reconvergence before the option's immediate consequence beat has fully played;
no kind/cruel/apathetic triple; no writer's-favorite option; axis rotation across consecutive
nodes; exactly-three options at ordinary nodes per the LOCKED contract (7 exceptions apply).

## 3. CHARACTER SCORECARD (0–100; pass ≥84)

| Criterion | Max | Floor |
|---|---|---|
| Silhouette and visual identity | 15 | **≥10.5 (7/10 scaled)** |
| Voice fingerprint | 15 | **≥10.5** |
| Ordinary behavior (job/routine seen on-page) | 10 | — |
| Comedy mechanism | 10 | — |
| Serious or emotional mechanism | 10 | — |
| Personal want | 10 | **≥7** |
| Meaningful flaw | 10 | — |
| Cultural connection to island/faction | 5 | — |
| Relationship collision potential | 5 | — |
| Combat or practical function | 5 | — |
| Originality / distance from canon copies | 5 | — |

Auto-reject: reads as a direct canon copy (see ARCHETYPE_LIBRARY 50% rule). Do not generate
wounds/tics/tragedies to fill slots — an honest 0 in an unused row beats invented trauma.

## 4. FIGHT SCORECARD (0–100; pass ≥86; Gups fight ≥90)

| Criterion | Max |
|---|---|
| Readable geography | 15 |
| Opponent agency | 15 |
| Evolving mechanics | 15 |
| Failed solution or costly discovery | 10 |
| Damage continuity | 10 |
| Character revelation through action | 10 |
| Escalation | 10 |
| Environment use | 5 |
| Comedy where appropriate | 5 |
| Aftermath consequences | 5 |

Hard rules: no player-facing phase labels; transformation through behavior/geography/cost;
FIGHT_DIRECTION.md checklist and a fight design record precede prose.

## 5. Recording format (sidecar block)

```yaml
scores:
  scene: { total: 0, visual: 0, voice: 0, change: 0, opref: 0, slowburn: 0, comedy: 0,
           honesty: 0, texture: 0, choice: 0, narrator: 0, pass: false, notes: "" }
  choice: { total: 0, immediate: 0, later: 0, cost: 0, risk_clarity: 0, in_character: 0,
            no_filler: 0, route_impact: 0, relationship: 0, theme: 0, pass: false }
```
