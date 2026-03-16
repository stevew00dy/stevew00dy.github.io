# Undisputed Noobs

Public monorepo for the Undisputed Noobs website and Star Citizen tracker apps.

## Live Site

[undisputednoobs.com](https://undisputednoobs.com)

## Public Apps

| Path | Route | Purpose |
|------|-------|---------|
| `stevew00dy.github.io/` | `/` | Main site and landing experience |
| `armor-tracker/` | `/armor-tracker/` | Rare armour tracking |
| `exec-hangar-tracker/` | `/exec-hangar-tracker/` | Executive Hangar tracking |
| `wikelo-tracker/` | `/wikelo-tracker/` | Wikelo contract tracking |
| `fps-loadout-tracker/` | `/fps-loadout-tracker/` | FPS loadout planning |
| `refining-tracker/` | `/refining-tracker/` | Refining and work-order tracking |

## Development

Run the landing site locally:

```bash
cd stevew00dy.github.io
npm install
npm run dev:landing
```

Build the full public site bundle:

```bash
cd stevew00dy.github.io
npm run build
```

This build:
- builds the landing app
- builds each public tracker app from the repo root
- copies all outputs into `stevew00dy.github.io/dist`
- writes the SPA fallback and `CNAME`

## Deploy

Deploy GitHub Pages from the main site folder:

```bash
cd stevew00dy.github.io
npm run deploy
```

That command rebuilds the full public site and publishes `stevew00dy.github.io/dist` to GitHub Pages.

## Stack

- React 19
- TypeScript
- Vite 7
- Tailwind CSS 4
