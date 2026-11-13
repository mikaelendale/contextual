# Build — Foundation

## Files
- `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `drizzle.config.ts`, `.env.example` · the project's config, at the repo root
- `vitest.config.ts`, `playwright.config.ts` · the two test runners
- `src/app/layout.tsx` · the root layout: fonts, `globals.css`, the toast container
- `src/app/page.tsx` · the home page
- `src/app/globals.css` · Tailwind, and the color, type and spacing tokens from design/principles.md
- `src/app/app/layout.tsx` · the signed-in layout: the sidebar, and the content column
- `src/app/app/error.tsx` · the error screen with "Try again"
- `src/db/index.ts` · the Drizzle client over Neon's HTTP driver
- `e2e/smoke.spec.ts` · opens the home page
- `e2e/helpers/auth.ts` · `signInAs(page, email)`, added for auth's e2e tests (see log)
- `public/` · the favicon and the share image

## Data
None of its own. `src/db/index.ts` connects; each feature keeps its tables in its own `schema.ts`.

## Routes and actions
- `/` · the home page
- `/app/**` · every signed-in page renders inside `src/app/app/layout.tsx`

## Components
Uses `Button` and `Toast` from `src/components/ui/` (design/components.md). The sidebar is part of the layout, not a shared component.

## Follows
- [design/layouts.md](../../design/layouts.md) (App shell), [design/principles.md](../../design/principles.md)
- [stack/requirements.md](../../stack/requirements.md), [stack/drizzle.md](../../stack/drizzle.md)
