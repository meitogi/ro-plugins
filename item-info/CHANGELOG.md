# RoItemInfo — changelog

## 1.13.0 — 2026-10-31

- fix(item-info): say so when no database could be downloaded (202d3a12d)
- feat(item-info): load a database file on the window, and say when ItemDb is missing (af7013c08)

## 1.12.0-a.2 — 2026-10-17

First published version.

- feat(item-info): mob sheet in /ii — sprite, stats, drops, spawns, skills (9e87da935)
- feat(item-db): load the mobs bundle on demand, cached per pinned commit (e4634fd95)
- feat(item-info): show boxes, drop bonuses, scripted sellers and castles in /ii (f559d3b04)
- fix(respawn-radar, item-info): mark the mounted minimap, on every engine (bce5a3119)
- feat(v3): item-db as the ItemDb plugin, handed to its consumers through deps (fcbd2da6c)
- feat(item-info): name the NPC behind a recipe, and show what it costs (d6c227d16)
- fix(item-info): 1.11.2-a.1 — owned registerCleanup disposes panel on hot-reload (listener-cleanup S10) (470764faf)
- build(plugins): re-minify dist + patch bump (5 plugins, no source change) (715c7a094)
- v3 ui 2.0.0 — bind-once via opts.onMount, drag/click stack fix (9f26fc98c)
- item-info 1.10.0-a.4 + item-db 2.2.0-a.1 — Where to buy section (420bae08d)
- item-info 1.9.0-a.1 — bundle name fallback for server-only items (653983c74)
- item-info 1.8.0-a.2 + item-db 2.1.0-a.1 — Dropped by section (45281ba50)
- item-info 1.7.1-a.2 — Cooking (lvN) instead of "skill 0" (077eee249)
- item-info 1.7.0-a.1 — split quest entries into own sections (d1b192658)
- item-info 1.6.0-a.3 — class-aware sigil labels (alchemy bucket fix) (e7f52d42b)
- item-info 1.5.0 — /iteminfo via Commands, defaultVisible false (855cb8233)
- v3 release: 3.3.1 stable — registerPlayerWindow + map-ready phase (efd1fff48)
- v3 release: 3.3.0 stable — V3-only contract, legacy register paths gone (470b7fb56)
- v3 iter: 3.2.3-a.1 — item-db lib + item-info v3 migration (f855495b5)
- v3 iter: 3.2.1-a.3 — lib versioning, tests plugin bootstrap + proxy suite, libs/ restructure (4c078161a)
- v3: release 3.0.0 — framework contract (window.__RO_API) (83612eb99)
