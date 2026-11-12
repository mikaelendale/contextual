# Tests — Foundation

## Automated
- `e2e/smoke.spec.ts` (Playwright): the home page loads. Run only it: `pnpm test:e2e e2e/smoke.spec.ts`, about 5 seconds.
- The shell has no logic of its own, so it has no unit tests.

## How a person reaches it
Open http://localhost:3000. Every signed-in page shows the shell.

## How the agent checks it
1. On a fresh clone, follow "First run" in stack/requirements.md.
2. Open http://localhost:3000, then any `/app` page while signed in.
3. Resize to 375px: the sidebar becomes a menu button.
4. Throw an error in a page temporarily: the error screen shows "Try again".

## What proves it works
The home page renders; the sidebar and content column match design/layouts.md at 375px and 1280px; the error screen replaces the page.

## Last result
2026-09-15 · `pnpm test:e2e e2e/smoke.spec.ts` 1/1, manual steps 1–4 checked.
