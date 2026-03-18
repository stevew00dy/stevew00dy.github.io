# Local Review Process

Use this process when you want the homepage and all tracker apps served together locally.

## Correct launch path

From `d:\Cursor\projects\Undisputednoobs\stevew00dy.github.io` run:

```powershell
npm.cmd run review:local
```

This does two things:

1. Builds the full site into `dist`
2. Serves the built site on `http://127.0.0.1:4181/`

## URLs

- Homepage: `http://127.0.0.1:4181/`
- Crafting Tracker: `http://127.0.0.1:4181/crafting-tracker/`
- Refining Tracker: `http://127.0.0.1:4181/refining-tracker/`

## Important

- Do not use a standalone tracker Vite dev server when the goal is to review the full site.
- The full-site build plus static server is the stable path that avoids the white-screen/path mismatch problem.
- For local review, treat `4181` as the default port unless there is a deliberate reason to change it.
