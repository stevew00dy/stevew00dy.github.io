# Undisputed Noobs

The official website for **Undisputed Noobs (uNoob)** — a gaming community led by **Sherpa Steve**.

Calm guides. No hype. No noise. Step-by-step help for new players.

## Live Site

[undisputednoobs.com](https://undisputednoobs.com)

## YouTube

[youtube.com/@undisputednoobs](https://www.youtube.com/@undisputednoobs)

## Dev

```bash
npm install
npm run dev:landing
```

## Deploy

```bash
npm run deploy
```

Builds the landing page and publishes to GitHub Pages. The tools (Armor Tracker, Exec Hangar Tracker, Wikelo Tracker) are deployed from their own repos.

## Analytics (Cloudflare Web Analytics)

Visitor tracking uses Cloudflare Web Analytics (privacy-first, no cookies). To enable:

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Web Analytics** → **Add a site**
2. Add `undisputednoobs.com` (or your hostname)
3. Copy the token from the JS snippet
4. Create `apps/landing/.env` with: `VITE_CF_ANALYTICS_TOKEN=your_token_here`
5. Rebuild and deploy

Analytics will appear in the Cloudflare dashboard within a few minutes.

## Built With

- React 19
- Tailwind CSS v4
- Vite 7
- TypeScript
