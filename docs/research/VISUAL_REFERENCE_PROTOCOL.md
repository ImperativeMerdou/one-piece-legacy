# VISUAL REFERENCE PROTOCOL

**Status:** GOVERNED (Phase 1, 2026-07-20). How local visual references are studied. Mechanics are
extracted; style is never imitated; nothing copyrighted is committed or reproduced.

## Directory layout

```
reference/
  raw-private/               ← LOCAL ONLY — entire tree gitignored, never committed
    manga-pages/             ← Mert adds legally accessed pages/screenshots himself
    anime-keyframes/
    character-sheets/
  studies/                   ← committed TEXT-ONLY analyses (templates below)
    manga-scenes/
    anime-fights/
    character-designs/
  distilled/                 ← committed cross-study principle digests feeding the writing toolbox
```

## Rules

1. **Mert supplies all raw material manually.** The model never downloads manga chapters, anime
   episodes, or images; never adds copyrighted files to the repo.
2. The model may **study** local images Mert provides and write text analyses into `studies/`
   using the blank templates there (`_TEMPLATE_*.md`).
3. Studies record **mechanics** — counts, orders, distances, rhythms, functions — plus abstract
   transferable principles. They never reproduce dialogue, trace or verbally "trace" compositions,
   or instruct imitation of Oda's drawing style.
4. Every study ends with a **do-not-copy list**: the distinctive compositions, dialogue, designs,
   or choreography that belong to the source and are off-limits.
5. `distilled/` digests carry only abstract principles forward (they feed
   `docs/writing/ONE_PIECE_SCENE_GRAMMAR.md` / `FIGHT_DIRECTION.md` via normal Mert-reviewed
   updates). No digest quotes source dialogue or describes a panel in reproducible detail.
6. Studying a scene authorizes **nothing** for canon: no encounter, no character, no borrowed
   beat becomes project content except through the charter loop.
7. `.gitignore` enforces rule 1 mechanically (all of `raw-private/`, plus all image/video
   formats anywhere under `reference/`). If a raw file ever appears in `git status`, stop and fix
   the ignore before any commit.
