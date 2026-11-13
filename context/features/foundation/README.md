# Foundation
status: shipped
phase: 1
covers: *, .github/**, docs/harnesses.md, docs/maintaining.md, docs/trials/**, docs/release/**, skills/README.md, packages/cli/*, packages/cli/bin/**, packages/cli/scripts/**, packages/cli/src/cli.js, packages/cli/src/context.js, packages/cli/src/files.js, packages/cli/src/git.js, packages/cli/src/glob.js, packages/cli/src/assets.js, packages/cli/test/helpers.js, packages/cli/test/cli.test.js, packages/cli/test/skills.test.js
depends-on: none

## What it does
The repo's shell every other feature builds on: the root docs and config, CI, the `docs/` folder, and the CLI's entry point, argument handling and shared code (reading context files, git, globs, finding the templates). It also owns the npm package's manifest and the script that bundles the templates and skills into it.

## Acceptance
- [x] `npm test` in `packages/cli` passes on Node 20, 22, 24 and 26
- [x] `usecontextual --help` lists every command, and `--version` prints the version in `package.json`
- [x] Every skill folder has a short `SKILL.md`, and every asset in a skill is an exact copy of its template
