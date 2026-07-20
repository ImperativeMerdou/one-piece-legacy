# CHARACTER MODEL LOCKS — visual continuity rules

**Status:** GOVERNED — operational (Phase 4C, 2026-07-21, Fable, per Mert's Phase 4 order).
Binding on every present-day depiction in the visual build. Concrete art lives behind
logical roles (`char.*`, `npc.*`); current art is **TEMP_VISUAL_MODEL** composited from the
private library (provenance in the local, uncommitted `.private-assets-cache/models/
ASSET_MODEL_NOTES.json`) and is replaceable without touching story data.

## MERDOU (roles `char.merdou.*`)

REQUIRED: bald head · **full dark beard, visible in medium and close shots** · massive
broad build, visually heavier than ordinary humans · thick neck/shoulders, heavy forearms ·
crimson clothing language · open/strained shirt or bare chest per build · chest scar
continuity · loud expressive face. Neck kanji where the neck is visible and unobstructed.
FORBIDDEN: clean-shaven or stubble-only depiction · slim/average body · smooth generic
hero face · blank mannequin stare · **real horns before the correct exposure state**
(`exposure.merdou` — horn-state art is gated by save state, never default) · hat/hood that
hides the bald silhouette.
HARD VALIDATION: any present-day Merdou image without the full dark beard fails
automatically unless metadata marks it childhood / flashback / disguise / medical /
Mert-approved temporary state. A high composition score cannot override this.
EXPRESSION SET (built): neutral · talk (loud) · shout · laugh (huge) · grin (drunk
confidence) · angry · combat · serious · shock · smug · hurt (plaster) · embarrassed
(blush) · disgust. Scale: rendered ≥1.12× Ashren's height at equal shot depth.

## ASHREN (roles `char.ashren.*`)

REQUIRED: lean, visibly lighter frame than Merdou · high-collared concealment coat, closed
silhouette · silver-white theatrical swept hair (one-eye fringe is the current model's
signature) · controlled posture · pale ash/charcoal palette with one cool accent (scarf).
FORBIDDEN in ordinary public scenes: wings, wing bulges being obvious, open flame,
Lunarian markers. Flame-sputter state = sparks + smoke wisps only (`flustered`).
Wing/flame reveal art is gated by story state (`secrets.wings/flame`), absent from the
slice. Not a re-badged canon Lunarian: base silhouette diverges (fringe, scarf, flail-era
kit) and must keep diverging as art improves.
EXPRESSION SET (built): neutral · smug · talk · serious · angry · flustered (sparks) ·
shock · hurt.

## SUPPORT (roles `npc.*`)

- **Auntie Marn** — iron-gray hair, work dress with petal-dye accents, rolled fists,
  loud tavern-keeper face. Never frail.
- **Brakko** — huge torso, tiny grinning face, iron-gray wrapped fists, goon energy;
  splinted-arm variant per `flags.brakkoArm`.
- **Collectors ×2** — dark "good coats, too good", composed, never shouting; one heavy
  pinstripe, one long checked coat with dark glasses.
- **Joro** — young, worn, ordinary; appears via anime-family cut-in busts + staged
  silhouettes at tables (no full sprite yet — listed unresolved).
- **Announcer / crowd / kids / cats** — cut-in strips, layered silhouettes, and prop
  clusters; no two identical clones adjacent in one shot.
- **Gups** — slice presence is silhouette-only (owner's box, trunk raised); on-model
  person render deferred to the arc's later phases.

## FAMILY RULE

All stage sprites and cut-ins come from the same anime-render family (or composites
matched to it). Framed card art appears only as deliberate card-styled cut-ins. SVG
fallback dolls never share a shot with anime-family sprites — fallback mode swaps the
whole scene, not single actors.
