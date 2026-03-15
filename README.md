# Undisputed Noobs — Monorepo

Star Citizen community tools and trackers.

## Structure

| Path | Description |
|------|-------------|
| `armor-tracker/` | Rare armour tracker |
| `exec-hangar-tracker/` | Executive hangar maps |
| `loadout-planner/` | FPS loadout planner |
| `refining-tracker/` | Mining & refining tracker (4.7) |
| `wikelo-tracker/` | Wikelo contract tracker |
| `stevew00dy.github.io/` | Main site & landing |
| `data-dashboard/` | Data scripts & build pipeline |
| `data-filter/` | PTU data filtering |
| `data/` | Shared data (frontier-consolidated, filtered outputs) |
| `tools/` | Extract scripts (unp4k, etc.) |

## Excluded (see .gitignore)

- `DataMining/` — against Star Citizen ToS
- `data/ptu-4.7/raw/` — extracted game files
- `node_modules/`, `dist/`, `.env`

## Deploy

Each tracker has its own deploy script. Example for refining-tracker:

```bash
cd refining-tracker && npm run deploy
```

## Git

Single monorepo. All projects tracked from root.
