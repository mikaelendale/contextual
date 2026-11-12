# Requirements

## Runtime
- Node.js: the version in `package.json`'s `engines` field, or the newest LTS release when it has none. Check the Next.js version's minimum in its upgrade guide.
- Package manager: the one whose lockfile is in the repo (`pnpm-lock.yaml`, `package-lock.json`, `yarn.lock` or `bun.lock`).

## Accounts
- Vercel, for previews and production.
<!-- fill: any other outside accounts the plan needs (database, email, payments), and who can grant access. -->

## Environment variables
| Name | What it is | Where to get it | Needed in |
|---|---|---|---|
<!-- fill: one row per variable the plan's services need. Names only, never real values. Keep a matching `.env.example`. -->

## First run
1. Install dependencies with the repo's package manager.
2. Copy `.env.example` to `.env.local` and fill it in.
3. Start the dev server (`dev` script), then open http://localhost:3000.
<!-- fill: add steps the plan's stack needs, such as running database migrations. -->
