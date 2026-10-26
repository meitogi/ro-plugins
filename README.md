# ro-plugins

Published builds of the roBrowser v3 plugins, served through jsDelivr.
`index.json` lists every plugin with its latest version and the URL of each
release. `<slug>/<version>/` holds the three bundles of one release.
`<slug>/patchlog.json` and `<slug>/info.json` hold what the Plugin Manager shows
players.

Nothing here is edited by hand. `wtf plugins publish` writes it from the
monorepo (`robrowser/tools/v3/scripts/publish-plugins.mjs`).

## Versions

Strict semver: **PATCH** = a fix only, **MINOR** = a backwards-compatible
feature, **MAJOR** = a breaking change. A published version never changes; a
bug found after release ships as a new version.

The registry runs in one of two modes, and the kind of change decides which
pre-releases a version goes through in each:

| Change | Private (today) | Public |
|---|---|---|
| PATCH, a contained fix | `X.Y.Z` | `X.Y.Z` |
| PATCH that touches saved data or packets | `X.Y.Z` | `-rc.N`, then `X.Y.Z` |
| MINOR, a new feature | `X.Y.Z` | `-b.N` (testers), then `X.Y.Z` |
| MINOR, an experimental feature | `X.Y.Z` | `-a.N`, then `-b.N`, then `X.Y.Z` |
| MAJOR | `X.Y.Z` | `-a.N`, then `-b.N`, then `-rc.N`, then `X.Y.Z` |

**Private (today)**: every release is final, with no `-a` / `-b` / `-rc`
suffix. The people using these plugins run them every day, so every build that
reaches them is a real release. Versions published earlier as `X.Y.Z-a.N`
move to plain `X.Y.Z` on their next release.

**Public**: `-a` is for us only, `-b` is for players who opt in to testing,
and `-rc` is frozen: only blocking fixes, then it ships unchanged as `X.Y.Z`.
Semver puts `a` < `b` < `rc` < the release, so the order in the table is also
the order players see.
