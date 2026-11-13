# Conventions

## Code
- The CLI: JavaScript modules for Node.js 20 or newer, with no runtime dependencies. Keep each command in its own file in `packages/cli/src/`.
- The site: TypeScript and React; `npm run lint` in `site/` runs ESLint.
- Files use LF line endings (`.gitattributes`).
- Docs, skills and messages are in plain words: what something does, not how good it is.

## Packages and tools
Use only the packages and tools listed in `stack/`. Adding another one, even a one-off `npx` command, needs a record in `decisions/` first.

## Naming and files
- A CLI command: `packages/cli/src/<command>.js`, with its tests in `packages/cli/test/<command>.test.js`. Shared helpers stay in the `src/` files `foundation` owns.
- A skill: `skills/<name>/SKILL.md`, short, with detail in `references/` and templates in `assets/`, one level deep. Assets are copies of `templates/`: edit the original, then copy it over.
- A template: `templates/`. Change `example/` in the same commit; the tests compare them.
- The site: Next.js's `app/` routes; section components in `site/components/home/`; UI building blocks in `site/components/ui/`.
- Feature folders, skills and branches are kebab-case.

## Tests
- The CLI: Node's test runner. All of it: `cd packages/cli && npm test` (about 3 seconds). One file: `node --test test/<file>.test.js`. Run the whole suite before every commit.
- The example: `cd example && node ../packages/cli/bin/usecontextual.js check --branch main` gives 0 errors and 2 warnings.
- The site has no tests: `npm run build` and `npm run lint` in `site/`, and a look at the page at 375px and at desktop width.
- Skills are tried in real coding agents; see `docs/maintaining.md` and `docs/trials/`.

## Git
- A feature's work goes on `feat/<feature>`. Tiny fixes may go straight on `main`.
- Commit messages: a plain summary line, then what changed and why. No co-author or tool attribution lines.
- The owner merges and publishes.

## Errors and logging
The CLI prints findings to stdout and failures to stderr. Exit codes: 0 when clean, 1 when `check` finds errors or `which` finds no owner, 2 for usage problems, 65 when `check --staged` finds errors. The hook blocks only on 65.
