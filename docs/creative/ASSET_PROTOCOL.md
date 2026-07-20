# ASSET PROTOCOL — sourcing, licensing, overrides

**Status:** GOVERNED — operational (Phase 3A, 2026-07-20, Fable, per Mert's Phase 3 order).
Governs every player-facing visual asset in the committed build. Companion:
`docs/research/VISUAL_REFERENCE_PROTOCOL.md` (study-only material — unchanged and stricter).

## 1. Allowed sources for COMMITTED assets

Public-domain archives · CC0 · CC-BY (attribution recorded) · Wikimedia Commons with
compatible license · public-domain maritime art · legally reusable photography/textures ·
open-source game-asset libraries (license checked per asset) · **original CSS/SVG/canvas
work** (preferred default) · original compositions from compatible materials · assets Mert
supplies with his own rights.

**Never committed:** manga pages, anime frames, official One Piece character art, fan art
without license, anything whose license is unverifiable. If no legal asset fits: original
CSS/SVG treatment → designed silhouette → art brief for later commission. Never steal to
fill a slot.

## 2. Manifest (mandatory ledger)

Every downloaded asset gets an entry in `assets/ASSET_MANIFEST.json` BEFORE use:
`filename · original_url · creator · license · attribution_required (text) · modifications ·
scene_usage · redistribution_allowed`. Original in-repo CSS/SVG work is logged with
`source: "original"`. The validator fails the build if a referenced asset lacks an entry.

## 3. Private overrides (gitignored)

- `reference/raw-private/` — Mert's private study material (existing; never committed).
- `assets/private-overrides/` — Mert may drop personal/local images here; the engine loads
  `assets/private-overrides/OVERRIDES.json` at runtime if present and substitutes any asset
  id → local file path. Nothing in this directory is ever committed or required; the game
  must be fully playable without it.

## 4. Art direction constraints (committed set)

One processing system across all backgrounds: consistent 16:9 crops · controlled palette
(cold North Blue grays + petal-dye accents) · unified grain/ink overlay · consistent edge
treatment and vignette rules · atmospheric depth (3 planes where possible). No single heavy
filter slapped on mismatched photographs. Character visuals: designed silhouettes/portraits
in one style; replaceable by manifest so commissioned art can drop in later.
