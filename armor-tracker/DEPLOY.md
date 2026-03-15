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

The armor-tracker is now a standard Vite app like the other trackers:

```powershell
cd armor-tracker
npm run build
```

Output goes to `armor-tracker/dist/`. The main site build copies that output into `stevew00dy.github.io/dist/armor-tracker/`.
