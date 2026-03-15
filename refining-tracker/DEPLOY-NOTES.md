# Refining Tracker — Monorepo Deployment

## Current Setup

All tracker apps are now in the **monorepo** and deploy from a **single build**:

| App | Path | Deployed to |
|-----|------|-------------|
| Landing | `stevew00dy.github.io/apps/landing` | `/` |
| Refining Tracker | `refining-tracker/` | `/refining-tracker/` |
| Exec Hangar Tracker | `exec-hangar-tracker/` | `/exec-hangar-tracker/` |
| Wikelo Tracker | `wikelo-tracker/` | `/wikelo-tracker/` |
| FPS Loadout Planner | `loadout-planner/` | `/loadout-planner/` |
| Armor Tracker | `armor-tracker/` | `/armor-tracker/` |

## Deploy Everything

From the main site root:

```powershell
cd d:\Cursor\projects\Undisputednoobs\stevew00dy.github.io
npm run deploy
```

This builds the landing page and all four tracker apps, then deploys to `stevew00dy.github.io` (undisputednoobs.com).

## First-Time Setup

If you clone the monorepo fresh, run `npm install` in each app folder before the first build:

```powershell
cd exec-hangar-tracker && npm install
cd ../wikelo-tracker && npm install
cd ../loadout-planner && npm install
```

## Consistent Nav

All apps share the same top-right dropdown:

- **Progress**: Export, Import, Reset (per-app data)
- **Tools**: Links to Rare Armor, Exec Hangar, Wikelo, FPS Loadout, Refining
- **Home**: Undisputed Noobs
- **Play Star Citizen**: Referral link
