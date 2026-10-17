# Rocache — changelog

## 1.2.0-a.36 — 2026-10-17

First published version.

- feat(rocache): run under the native plugin manager, keep the userscript path (69f380faa)
- fix(rocache): stop caching a 200 that isn't the asset, and retry transients (4e0579f78)
- rocache: asset-lists infrastructure (2f0e98af9)
- feat(plugins/rocache): verbose console logs toggle in /rocache panel (964ed8514)
- feat(plugins/rocache): pluggable storage backend (fs / cacheapi / opfs) (8def1aa5a)
- feat(plugins/rocache): persistent asset cache via fetch-intercept pipeline (ed00432bd)
