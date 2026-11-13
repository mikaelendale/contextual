# Log — Foundation
Newest first. One entry per task.

## 2026-11-13 · claude-code · CI runs every site test; maintaining.md describes the database
- Changed: CI's site step runs `node --test lib/*/*.test.ts`, so the visits tests run beside the feedback tests. `docs/maintaining.md` has a section on the site's database (migrations in order, reports kept at least 30 days, visits) and says the two variables are set on Vercel.
- Tests: the site's tests (12 passed); the connection-string check.
- Left open: nothing.
- Deslop: not UI.

## 2026-11-13 · claude-code · 0.1.0 published
- Changed: `CHANGELOG.md` dates 0.1.0 (13 November 2026). The spec's status line says 0.1.0 is published and 0.2.0 is merged but not published.
- Tests: from npm in an empty folder, `npx usecontextual@0.1.0` and `pnpm dlx usecontextual@0.1.0` print 0.1.0, and `init` then `check` work (0 errors, and the one warning expected before setup). The published package has the same 84 files as `docs/release/0.1.0-pack-dry-run.txt`. Bun isn't installed here, so `bunx` wasn't tried.
- Left open: publishing 0.2.0.
- Deslop: not UI.

## 2026-11-13 · claude-code · The trial link's real length
- Changed: the trial notes said 1,745 characters; the link is 1,365.
- Tests: measured the printed link.
- Left open: nothing.
- Deslop: not UI.

## 2026-11-13 · claude-code · Tests that pass the same way in CI
- Changed: `packages/cli/test/helpers.js` clears `GITHUB_HEAD_REF` and `GITHUB_REF_NAME`: outside a git repo the CLI falls back to them, so CI on a feature branch made `--fix` tests on temp copies create that branch's status file. CI runs the site's tests as `lib/feedback/*.test.ts`, which Node 24 accepts.
- Tests: `npm test` with CI's variables set: 133 passed on Node 26 and Node 20; the site's 7 passed.
- Left open: nothing.
- Deslop: not UI.

## 2026-11-13 · claude-code · The agent feedback trial, and the first reports
- Changed: `docs/trials/2026-11-13-agent-feedback/` (the trial, two screenshots, the first reports) and a row in `docs/trials/README.md`. `.meta.json` now records `"feedback": "off"` for this repo.
- Tests: the trial itself; `npm test` 133 passed.
- Left open: sending the first reports once the database is connected.
- Deslop: not UI.

## 2026-11-13 · claude-code · CI: the connection-string check and the site tests; docs for 0.2.0; version 0.2.0
- Changed: `.github/scripts/no-connection-strings.mjs` and a `repo` job in CI that runs it and `site/`'s feedback tests; the README's three lines on agent feedback; spec 6.5, 6.1, 3.7 and the revision history; CHANGELOG 0.2.0; `packages/cli/package.json` at 0.2.0.
- Tests: the check passes on the repo and fails on a planted connection string and `.env.local`; `npm test` 133 passed.
- Left open: nothing.
- Deslop: not UI.

## 2026-11-13 · claude-code · The feedback command and init --feedback in the CLI
- Changed: `packages/cli/src/cli.js`: `feedback`, `feedback on|off`, `init --feedback on|off`, init's one-time question at a terminal, and the help lines.
- Tests: `npm test` in `packages/cli`: 133 passed on Node 26, and 132 on Node 20 before the opener test was added.
- Left open: nothing.
- Deslop: not UI.

## 2026-11-13 · claude-code · which's new output and --unowned in the CLI
- Changed: `packages/cli/src/cli.js` prints the globs a `which` answer beat, handles ties, and adds `which --unowned` to the help.
- Tests: `npm test` in `packages/cli`: 120 passed, including 8 new in `owners.test.js`.
- Left open: nothing.
- Deslop: not UI.

## 2026-11-13 · claude-code · Found at setup
- Changed: nothing in the code. Read the root files, `.github/`, `docs/`, `skills/README.md`, the CLI's `package.json`, `bin/`, `scripts/` and shared `src/` files, and wrote this feature's context from them.
- Tests: `npm test` in `packages/cli`: 112 passed, on Node 26 and on Node 20. CI passed on Node 20, 22, 24 and 26.
- Left open: Antigravity and Windows are untested, and private vulnerability reporting is off (notes.md).
- Deslop: not UI.
