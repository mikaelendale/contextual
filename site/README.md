# Contextual

The website for Contextual: an open source context structure that gives AI coding agents persistent memory of your project. It works with Claude Code, Codex, OpenCode and Antigravity.

Built with Next.js 16, Tailwind CSS 4, shadcn/ui and [Paper Shaders](https://shaders.paper.design).

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Settings

| Variable | What it does |
| --- | --- |
| `SITE_URL` | The public address, `https://contextual.mikaelen.site`. It makes the canonical link and the share-card links absolute. Vercel fills this in on its own. |
| `DATABASE_URL` | The Neon connection string for agent feedback. Create the table once with `psql "$DATABASE_URL" -f db/migrations/0001_agent_feedback.sql`. Never commit it: CI fails if a connection string is in the repo. |
| `FEEDBACK_REPORTS_SECRET` | A long random secret that opens `/agent/feedback/reports`, the list of reports. Without it, nobody can open the list. |
| `GITHUB_TOKEN` | Optional. The GitHub button's star count and repo numbers come from GitHub's public API, asked by our server about once an hour. That fits well inside GitHub's limit without a token; set one (no scopes needed) only if the numbers stop showing. |

On Vercel, set the project's Root Directory to `site`.

## Where things are

| Path | What it is |
| --- | --- |
| `app/page.tsx` | The page |
| `components/sky.tsx` | The hero sky, its motion and the constellation |
| `components/live-dither.tsx` | Paper's image dithering, patched for slow, live grain with a colour ramp |
| `public/dither/` | Greyscale images the dithering turns into the sky and the cards |
| `app/opengraph-image.png`, `app/twitter-image.png` | The share card (1200×630) |
| `app/icon.tsx`, `app/apple-icon.tsx` | The browser and home screen icons |

Product marks: the Claude Code mark is from [simple-icons](https://simpleicons.org) (CC0), and the Codex, OpenCode and Antigravity marks are from [Lobe Icons](https://github.com/lobehub/lobe-icons) (MIT). The marks belong to their owners.
