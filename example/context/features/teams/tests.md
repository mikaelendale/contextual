# Tests — Teams

## Automated
- `src/features/teams/actions.test.ts` (Vitest): token hashing, invite expiry, owner-only removal.
- `e2e/teams.spec.ts` (Playwright): onboarding, inviting, accepting an invite.
- Run only these: `pnpm vitest run src/features/teams` (a few seconds) and `pnpm test:e2e e2e/teams.spec.ts` (about 30 seconds).

## How a person reaches it
New users see "Name your team" after their first sign-in. Owners: Settings → Team.

## How the agent checks it
1. Sign in with a new email: you land on `/onboarding`. Name the team: you land on `/app`.
2. Settings → Team → invite a second email. The invite link prints in the dev server's terminal.
3. Open the link in a private window and sign in as the second email: you land on `/app`, in the same team.
4. As the second person, open Settings → Team: there are no Remove buttons.

## What proves it works
- After step 1, a `teams` row and an `owner` row in `members`.
- After step 3, a `member` row for the second person, and `accepted_at` set on the invite.

## Last result
2026-10-28 · vitest 11/11 pass, e2e 3/3 pass (after the invite subject fix).
