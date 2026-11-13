# Build — Site

## Files
- `site/app/` · the page, the layout, the global styles, the icons and the share card
- `site/components/home/` · the sections and their figures: `repo-map.tsx`, `check-run.tsx`, `plate.tsx`, `wire.ts`, `section.tsx` and the rest
- `site/components/` · the sky, the live dither, the install module, the GitHub button, the copy command, the product marks, the logo
- `site/components/ui/` · shadcn/ui building blocks
- `site/lib/` · `github.ts` (the repo's numbers), `links.ts`, `utils.ts`
- `site/public/dither/` · greyscale images the dither turns into the sky, the cards and the plates
- `site/AGENTS.md` · Next.js's notes for agents, and `site/CLAUDE.md` · `@AGENTS.md`, so Claude Code reads them
- `site/package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `components.json`, `README.md` · config and docs; the feedback pages under `site/app/agent/` and `site/lib/feedback/` belong to agent-feedback

## Data
None stored. The GitHub numbers are cached for an hour (`use cache`, `cacheLife("hours")`).

## Routes and actions
- `/`: the only page

## Components
See [components](../../design/components.md).

## Follows
[principles](../../design/principles.md), [layouts](../../design/layouts.md)
