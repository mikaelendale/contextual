# Working on this repo

Rules for changing Contextual itself. The rules Contextual gives to other projects are in [the spec](spec.md).

## Before every commit

- Run `npm test` in `packages/cli`. `check` must pass on `example/` with 0 errors and the two expected warnings.
- Change the example and the templates together. The tests check that the example's `AGENTS.md` block, `deslop.md` and its hash match the templates.
- Every template a skill ships in its `assets/` folder is a copy of a file in `templates/`, and `skills/contextual-setup/references/plan-file.md` is a copy of `docs/plan-file.md`. Edit the original, then copy it over; the tests catch a copy that drifted.
- Commit messages have no co-author or tool attribution lines.
- Files are stored with LF line endings (`.gitattributes`).

## Skills

- Skills live in `skills/<name>/`. The CLI's `init` and `update` will copy them into a project's `.agents/skills/` and `.claude/skills/`.
- [harnesses.md](harnesses.md) records where each harness looks for skills. Check it against the official docs before every release.
- Keep each `SKILL.md` short. Put detail in `references/` and templates in `assets/`, one level deep.

## How the CLI behaves at the edges

Settled while building 0.1.0. Keep them unless the spec changes.

- `init` outside a git repo refuses and says to run `git init`. It doesn't run it.
- `init --force` never overwrites a file. It only lets `init` add its files next to an existing `context/` folder that isn't Contextual's.
- The hook blocks a commit only when `check --staged` ran and found errors; it exits 65 for that. If the CLI can't run at all (not installed yet, offline, npm down, the pinned version not found, Node missing), the hook prints a note and lets the commit through.
- Until setup has run (no `context/idea.md`), the hook only warns, on every branch.
- On the default branch, `check --staged` turns every finding into a warning, full-check errors included, so a broken context file never stops a hand edit on main (spec 4.2).
- A plan file may have one sentence under a phase heading; setup ignores it.
- `Deslop: not UI` may carry a short reason, such as `Deslop: not UI (setup only)`.

## Trying the skills in other agents

The trials in [trials/](trials/) were run this way. Run them the same way when a skill or a harness changes.

- Start each run in a fresh folder, and run `check` yourself afterwards; don't take the agent's word for it.
- Give each agent its own sandbox or a scoped permission list: edits inside the project and a short list of shell commands. Never use a flag that approves everything.
- Claude Code: `claude -p`, with the person's own settings and personal skills left out, and an allowlist of shell commands.
- Codex: `codex exec` in its `workspace-write` sandbox. That sandbox makes `.git` read-only, so add `--add-dir <repo>/.git`; without it, `contextual-next` can't branch or commit.
- OpenCode: `opencode run`, with the permissions in the project's `.opencode/opencode.json`.
- Antigravity: its CLI needs a sign-in in a browser, so it hasn't been tried yet.
- Write the results in `docs/trials/`: what was asked, what the agent did, and the `check` result. Leave out local paths, costs and account details.

## Releasing the npm package

- npm is the only registry. There's no GitHub Packages copy.
- No GitHub release until there's a real version to tag.
- A published version can never be reused or changed, so every publish gets a new version number.
- Commit before publishing, so the commit npm records (`gitHead`) matches the published code.
- Check the file list with `npm pack --dry-run` in `packages/cli` first.
- The owner publishes from their own terminal (`npm publish`, approved with 2FA). Agents prepare and verify a release, but don't publish it.
