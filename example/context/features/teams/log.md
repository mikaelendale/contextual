# Log — Teams
Newest first. One entry per task.

## 2026-10-28 · codex · Fix the invite email's subject (on main)
- Changed: "You're invited to joint" → "You're invited to join" in `src/features/teams/emails/invite.tsx`. A one-line fix, committed straight to main.
- Tests: `pnpm vitest run src/features/teams` 11/11 pass.
- Left open: nothing.
- Deslop: pass (read the invite email the dev server printed to the terminal)

## 2026-10-02 · claude-code · Merged to main
- Changed: contextual-sync on main: status → shipped, ticked in build-plan.md (Phase 1 is done), deleted status/feat-teams.md, added a line to status/main.md.
- Tests: none run (merge only).
- Left open: nothing.
- Deslop: not UI.

## 2026-09-30 · claude-code · Accept invites, remove members
- Changed: `/invite/[token]`, which works signed out; member list with Remove for the owner only.
- Tests: 6 unit tests (expiry, owner-only removal); e2e "accepts an invite" passes.
- Left open: nothing.
- Deslop: pass (Playwright screenshots of /invite/[token] and the member list at 375px and 1280px)

## 2026-09-26 · codex · Onboarding and invites
- Changed: branch `feat/teams`; `teams`, `members` and `invites` tables (`drizzle/0002_teams.sql`); `/onboarding`; the invite form in Settings → Team; the invite email.
- Tests: 5 unit tests (token hashing, creating invites); e2e "onboarding" and "sends an invite" pass.
- Left open: accepting invites; removing members.
- Deslop: fixed the onboarding heading, which was "Welcome! 🎉"; it's "Name your team" now.
