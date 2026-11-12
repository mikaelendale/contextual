# Foundation
status: shipped
phase: 1
covers: *, src/app/*.tsx, src/app/globals.css, src/app/app/layout.tsx, src/app/app/error.tsx, src/db/index.ts, e2e/smoke.spec.ts, e2e/helpers/**, public/**
depends-on: none

## What it does
The app shell every other feature builds on: the Next.js app with its root and signed-in layouts, the global styles, the error screen, the database client, the config and the test setup. It has no product feature of its own; contextual-setup adds it to every project as the first feature.

## Acceptance
- [x] On a fresh clone, the steps in stack/requirements.md end with the home page open at http://localhost:3000.
- [x] Every signed-in page uses one layout: the sidebar, and the content at most 960px wide. On a phone the sidebar becomes a menu button.
- [x] An unexpected error in a signed-in page shows the error screen with a "Try again" button, not a blank page.
- [x] On a fresh clone, `pnpm test:e2e e2e/smoke.spec.ts` passes.
