# Tests — Auth

## Automated
- `e2e/auth.spec.ts` (Playwright): the sign-in link works once, signed-out redirect, sign out. It reads sign-in links from `.e2e/outbox.json`.
- Run only these: `pnpm test:e2e e2e/auth.spec.ts`, about 20 seconds.

## How a person reaches it
Open any `/app` page while signed out, or press "Sign in" on the home page.

## How the agent checks it
1. `pnpm dev`, then open http://localhost:3000/app. You land on `/sign-in`.
2. Enter any email and submit. The sign-in link prints in the dev server's terminal.
3. Open the link: you land on `/app/links`. Open it again: "This link has expired or was already used."
4. Account menu → Sign out: you're back on `/sign-in`, and `/app` redirects again.

## What proves it works
- After step 3, a `session` row for that user, and the account menu shows the email.
- After step 4, that `session` row is gone.

## Last result
2026-09-20 · `e2e/auth.spec.ts` 3/3 pass · manual steps 1–4 checked.
