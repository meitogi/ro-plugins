# TabTargetNative — changelog

## 7.21.0-a.23 — 2026-10-22

- fix(tab-target): Tab cycles the target after a click on the panel (fc90dbe1a)
- feat(tab-target): rare mobs — « rare ×N » badge and a minimap cross where last seen (d81595f7d)
- feat(tab-target): reachable mobs first, the others below « Unreachable » (95991d678)
- fix(tab-target): list every mob the server shows — view square, no row cap (8aedc3240)
- feat(tab-target): one « Mobs & Players » list, WoE window removed (b07c99ffb)
- feat(tab-target): Tab cycles hostile players, guardians and Emperium in WoE (1dcf46370)

## 7.21.0-a.17 — 2026-10-17

First published version.

- feat(tab-target): let Tab through to a focused window, drop the chat logs (88290606c)
- fix(v3): bring plugin windows back with the map windows on engines that keep them (1f6e39f9f)
- fix(tab-target): let digits through to inputs inside a window's shadow root (fb00c78e2)
- feat(tab-target): lock the target with a key or /focus (9de19294e)
- feat(robrowser): DI builds fill UIComponent, $raw and ItemDb; MiniMap root via getRoot (d547aa705)
- fix(tab-target): the homunculus AI no longer steals the target lock (89e37110f)
- tab-target: auto-focus homun/merc target + 9-slot F2 split skillbar (81d085432)
- feat(tab-target): re-sort mob list on every move packet (57cc65668)
- refactor(tab-target): capture observePacket / observeSendPacket off() for hot-reload cleanup (01420c7cd)
- feat(tab-target): 7.18.0-a.5 — hold-to-auto-craft + per-slot tri-state mode (c2d81fce1)
- build(plugins): re-minify dist + patch bump (5 plugins, no source change) (715c7a094)
- tab-target 7.17.0 — show mob name under focus on Tab (74e2db58e)
- tab-target 7.15.0 — Pneuma auto-self-cast (d182e0585)
- tab-target 7.14.0 — Heal sur monstres + DEV.md (02e4a1ed4)
- v3 ui 2.0.0 — bind-once via opts.onMount, drag/click stack fix (9f26fc98c)
- tab-target 7.13.3 — skill auto-focus fix + observeSendPacket layer (a9a4e1ef9)
- tab-target 7.13.2 — list cleanup overhaul + __DEBUG__ build flag (2c5c164ee)
- tab-target 7.13.1 — register packet listeners after wire-complete (b0435fa5c)
- tab-target 7.13.0 — /tt + AZERTY digit row Lv2 + skill auto-focus (a1d33c144)
- v3 release: 3.3.1 stable — registerPlayerWindow + map-ready phase (efd1fff48)
- v3 release: 3.3.0 stable — V3-only contract, legacy register paths gone (470b7fb56)
- v3 iter: 3.2.2-a.4 — tab-target v3 migration + plugin-api proxy hardening (1f33b681f)
- v3 iter: 3.2.1-a.3 — lib versioning, tests plugin bootstrap + proxy suite, libs/ restructure (4c078161a)
- v3: release 3.0.0 — framework contract (window.__RO_API) (83612eb99)
