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

## Releasing the npm package

- npm is the only registry. There's no GitHub Packages copy.
- No GitHub release until there's a real version to tag.
- A published version can never be reused or changed, so every publish gets a new version number.
- Commit before publishing, so the commit npm records (`gitHead`) matches the published code.
- Check the file list with `npm pack --dry-run` in `packages/cli` first.
- The owner publishes from their own terminal (`npm publish`, approved with 2FA). Agents prepare and verify a release, but don't publish it.
