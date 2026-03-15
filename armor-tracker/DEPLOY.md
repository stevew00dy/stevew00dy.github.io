# Armor Tracker — Deployment

Armor Tracker deploys as part of the **monorepo**. It is not deployed standalone.

## Deploy

From the main site root:

```powershell
cd d:\Cursor\projects\Undisputednoobs\stevew00dy.github.io
npm run deploy
```

This builds the landing page and all tracker apps (including armor-tracker), then deploys to `stevew00dy.github.io` (undisputednoobs.com).

**Live:** https://undisputednoobs.com/armor-tracker/

## Build

The armor-tracker uses a copy-and-patch build (legacy pre-built assets):

```powershell
cd armor-tracker
node scripts/build.mjs
```

Output goes to `armor-tracker/dist/`. The main deploy script runs this automatically.
