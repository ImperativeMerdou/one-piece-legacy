# PRIVATE ASSET PIPELINE

**Status:** GOVERNED — operational (Phase 4A, 2026-07-21, Fable, per Mert's Phase 4 order).

## The two modes

- **PORTABLE FALLBACK MODE** — no private config present. The game runs entirely on the
  committed original SVG assets (backgrounds.js / portraits.js). Anyone cloning the repo
  gets this mode; nothing external is required.
- **MERT PRIVATE MODE** — `config/private-assets.local.json` exists and the asset root it
  names is readable. The engine resolves logical asset roles through
  `config/asset-roles.local.json` to optimized local copies in `.private-assets-cache/`.
  A developer-only status line reports: root found · index loaded · missing roles ·
  fallback roles in use.

## Hard rules (git safety)

1. The private library (`ONE PIECE ASSETS AND RESEARCH`, outside the repo) contains
   ripped/extracted copyrighted material. It is **never committed, never copied into
   tracked directories, never uploaded**. Private local build only.
2. Gitignored: `config/private-assets.local.json`, `config/asset-roles.local.json`,
   `.private-assets-cache/`. The leak scan (Stage 7) fails the build if any tracked file
   contains an absolute private path or a raw copyrighted asset.
3. Committed instead: scripts, schemas, logical asset IDs, generic fallback assets,
   visual rules, manifests without raw media.

## Pipeline pieces

| Piece | Path | Committed? |
|---|---|---|
| Root locator | `tools/asset-pipeline/locate_asset_root.py` | yes |
| Scanner/indexer | `tools/asset-pipeline/scan_assets.py` | yes |
| Thumbnails + contact sheets | `tools/asset-pipeline/make_sheets.py` | yes |
| Runtime optimizer (role → cached copy) | `tools/asset-pipeline/build_runtime.py` | yes |
| Asset browser (dev tool) | `tools/asset-browser/` | yes |
| Local config | `config/private-assets.local.json` | **no** |
| Role schema | `config/asset-roles.schema.json` | yes |
| Role mapping (private paths) | `config/asset-roles.local.json` | **no** |
| Role manifest example | `config/asset-roles.example.json` | yes |
| Index, hashes, thumbs, sheets, report | `.private-assets-cache/` | **no** |

## Index contents (per file)

absolute path · relative path · filename · extension · size · width · height · aspect ·
alpha flag · frame count (GIF/sheet heuristics) · likely category · source folder ·
dominant palette · perceptual hash (dHash) · duplicate group (exact + near) · visual
family · suitability hints (portrait/background/UI/VFX) · runtime status · manual tags ·
confidence. Unsupported/corrupt files are logged, never silently skipped. `Audio` is
indexed for completeness and **disabled at runtime — this game has no sound.**

## Role system

Story code never names source files. It requests logical roles
(`bg.cointoss.pit.wide.night`, `char.merdou.laugh`, `vfx.impact.white`…) via the runtime
loader, which resolves: private mapping → optimized cache copy → committed fallback.
Schema: `config/asset-roles.schema.json`. Candidates get a 0–100 suitability score
(see Phase 4 order §ASSET SUITABILITY SCORE); <78 is rejected unless marked temporary.
