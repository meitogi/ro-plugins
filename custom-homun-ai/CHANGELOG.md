# CustomHomunAI — changelog

## 1.9.0-a.32 — 2026-10-17

First published version.

- feat(custom-homun-ai): hide the config surface for a foreign AI (230386ac8)
- feat(custom-homun-ai): rename a stored AI folder (66066aed2)
- feat(custom-homun-ai): flee and kite retreat to a spot inside the owner's vision (7cf154104)
- feat(homun-ai): tank/heal mode, an MVP override, and damage learned per mob (68b9663ac)
- fix(custom-homun-ai): don't engage mobs walled off from a skill shot (2676c71f2)
- feat(custom-homun-ai): show learned damage per mob + fix owner-damage pollution (69d9f727d)
- fix(custom-homun-ai): judge a re-import on the AI, and merge the panel controls (87056bd56)
- feat(custom-homun-ai): import an AI folder without freezing the game (ece94d6f8)
- feat(custom-homun-ai): pure-Lua pathfinding via a drag-and-droppable AI folder (da766ebaa)
- feat(custom-homun-ai): pure-Lua A* + .gatc reader, not yet wired (7a2629fd7)
- feat(custom-homun-ai): feed the current map name to the AI Lua sandbox (d56532942)
- custom-homun-ai: unreachable-target handling, flinch-lock fix, defend/resume, diagnostics (413a61ffc)
- custom-homun-ai: fix learned persistence on the vendored wasmoon-lua5.1 engine (6eccb3f06)
- custom-homun-ai: experimental HP-gate (passive damage learning) + CLI lua gen/smoke (649103d7c)
- custom-homun-ai: AI command reference + manual/per-mob cooldown + foldable per-mob strategy accordion (0360c840c)
- feat(custom-homun-ai+shim): followAhead predictive mode + AzzyAI per-tick followOwner port (18895efa0)
- fix(custom-homun-ai+shim): pre-empt diagnostic loop + arm gate in tank pickup (a140dcde9)
- fix(custom-homun-ai): 1.7.0-a.4 — optimistic SP accounting (spEst) + GetResMsg drain order (CHAI_BUILD 2.0.0-a.3) (fbf0aca20)
- refactor(custom-homun-ai): 1.7.0-a.2 — single-script runtime-gated Lua (CHAI_BUILD 2.0.0-a.1) (2b8ffea4a)
- feat(custom-homun-ai): 1.6.0-a.2 — reload cleanup + chai diagnostics (caf811968)
- feat(custom-homun-ai): 1.5.0-a.22 — Mobs tab + PER_MOB dispatcher (Sessions B+C mobs-tab) (72439c39b)
- feat(custom-homun-ai): 1.5.0-a.3 — Mobs tab shell + schema v3 (Session A mobs-tab) (16b9876af)
- custom-homun-ai 1.1.0 — S4 composable flag matrix + schema v2 migration (93d9b8903)
- custom-homun-ai 1.0.0-a.28 — agro-list skill-only kite + SkillObject UI-path patch (4d01abada)
- custom-homun-ai 1.0.0-a.22 — agro-list + agro-list-skill (whitelist JS-side) (f2c17d59a)
- custom-homun-ai 1.0.0-a.21 — S1+S2 : presets support + persistence + manual cmd + aggro (ea36b1fc4)
