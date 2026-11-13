# Build — Site

## Files
- `site/app/` · the page, the layout, the global styles, the icons and the share card
- `site/components/home/` · the sections and their figures: `repo-map.tsx`, `check-run.tsx`, `plate.tsx`, `wire.ts`, `section.tsx` and the rest
- `site/components/` · the sky, the live dither, the install module, the GitHub button, the copy command, the product marks, the logo
- `site/components/ui/` · shadcn/ui building blocks
- `site/lib/` · `github.ts` (the repo's numbers), `links.ts`, `utils.ts`
- `site/components/visit-beacon.tsx` · counts a visit to the home page, once per session; `site/app/api/visits/route.ts` · stores it
- `site/lib/visits/` · the counting rules (`visits.ts`, with tests) and the database calls (`db.ts`)
- `site/lib/db.ts` · the database connection, and `site/lib/rate-limit.ts` · the per-address limit; both on the `shared:` line, used by agent-feedback too
- `site/db/migrations/0002_page_visits.sql` · the visits table
- `site/public/dither/` · greyscale images the dither turns into the sky, the cards and the plates
- `site/AGENTS.md` · Next.js's notes for agents, and `site/CLAUDE.md` · `@AGENTS.md`, so Claude Code reads them
- `site/package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `components.json`, `README.md` · config and docs; the feedback pages under `site/app/agent/`, `site/lib/feedback/` and `site/db/migrations/0001_agent_feedback.sql` belong to agent-feedback

## Data
- Neon: `page_visits`, one row per page per day (UTC) with a count. Nothing about visitors.
- The browser: `contextual:seen-at` in localStorage, when it last counted.
- The GitHub numbers are cached for an hour (`use cache`, `cacheLife("hours")`).

## Routes and actions
- `/`: the only public page
- `POST /api/visits`: counts one visit; only the site's own pages, only `/`

## Components
See [components](../../design/components.md).

## Follows
[principles](../../design/principles.md), [layouts](../../design/layouts.md)
