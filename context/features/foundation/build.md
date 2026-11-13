# Build — Foundation

## Files
- `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, `LICENSE` · the front page, release notes, how to help, how to report a security problem, the MIT license
- `.gitattributes`, `.gitignore` · LF line endings; ignored files
- `.github/workflows/ci.yml` · the CLI's tests and `check` on `example/`, for every push and pull request
- `.github/ISSUE_TEMPLATE/` · the bug report and harness report forms
- `docs/harnesses.md` · where each harness reads rules and skills
- `docs/maintaining.md` · the rules for changing this repo, and how to run trials
- `docs/trials/` · real runs in real harnesses
- `docs/release/` · the file list of each release's package
- `skills/README.md` · how a skill folder is laid out
- `packages/cli/package.json`, `README.md`, `LICENSE`, `.gitignore` · the npm package's manifest and its page
- `packages/cli/bin/usecontextual.js` · the executable
- `packages/cli/src/cli.js` · argument parsing, help, and each command's output and exit code
- `packages/cli/src/context.js` · reading context files: features, the shared line, hashes
- `packages/cli/src/files.js` · the project's file list and the current branch
- `packages/cli/src/git.js` · calls to git
- `packages/cli/src/glob.js` · the glob matcher for `covers:` and `shared:`
- `packages/cli/src/assets.js` · where the templates and skills are: the repo's folders in a checkout, `assets/` in the package
- `packages/cli/scripts/bundle-assets.mjs` · copies templates, presets and skills into `assets/` before packing
- `packages/cli/test/helpers.js` · temp repos and copies of the example, for the tests
- `packages/cli/test/cli.test.js`, `skills.test.js` · help and version; the skills' shape and copies

## Data
None.

## Routes and actions
- `usecontextual --help`, `usecontextual --version`
- CI on every push and pull request

## Components
None.

## Follows
[conventions](../../conventions.md), [stack](../../stack/_index.md), [deploy](../../stack/deploy.md)
