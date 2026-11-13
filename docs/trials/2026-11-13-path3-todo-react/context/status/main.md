# Status — main
Updated: 2026-11-13 · by: claude-code

## Current phase
Phase 1 — What's built [done]. Context written at setup from the existing code: `foundation`, `add-task`, `manage-tasks` and `filter-tasks`, all shipped. Every acceptance line came from reading the code. None was run or tested. Nothing is half built.

## Recently merged
- 2026-11-13 · setup · Contextual context written from the existing code.

## Blocked / needs a human
- Empty names: adding or renaming a task accepts an empty name. Block it, and how? (`add-task`, `manage-tasks`)
- Remaining count: "N tasks remaining" counts the tasks visible under the current filter, not unfinished tasks. Change it? (`filter-tasks`)
- Persistence: tasks are lost on reload. Save them, for example in localStorage? (`foundation`)
- Leftover MDN deploy setup: this copy won't be deployed. Remove or change `deploy.yml`, `auto-merge.yml` and the `base` in `vite.config.js`? (`foundation`)
- README: it says `yarn start` / Create React App, but the app uses `yarn dev` / Vite. Fix it? (`foundation`)
- Tests: there are none. Add a test tool (needs a `decisions/` record)? (`foundation`)

## Next
No phase is planned yet. Pick from the questions above, or describe what to build. A new feature goes into `build-plan.md` as Phase 2.
