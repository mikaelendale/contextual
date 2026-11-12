# Conventions

## Code
- JavaScript with JSX, ES modules, React function components and hooks. No TypeScript.
- Lint: `yarn lint` (ESLint, `--max-warnings 0`). No formatter is configured; follow `.editorconfig` and match the file you're in.
- `react/prop-types` is off. Components read `props.x` directly.
- Keep accessibility patterns already in use: visually hidden text on buttons, `aria-pressed` on toggles, and focus moved on purpose after edit and delete.

## Packages and tools
Use only the packages and tools listed in `stack/`. Adding another one, even a one-off `npx` command, needs a record in `decisions/` first.

## Naming and files
- App shell and state: `src/App.jsx` (owned by `foundation`). Mount and seed data: `src/main.jsx`.
- One component per file in `src/components/`, PascalCase file names (`Todo.jsx`), each file owned by one feature.
- Styles go in `src/index.css` (shared). Group new rules under a comment for the feature they belong to.
- Functions are camelCase verbs (`addTask`, `toggleTaskCompleted`). Constants are UPPER_SNAKE (`FILTER_MAP`).
- Task shape: `{ id: "todo-<id>", name: string, completed: boolean }`.

## Tests
None yet. No test tool is installed. Adding one (for example Vitest) needs a record in `decisions/`. Until then, check a feature by running `yarn dev` and using it in the browser, plus `yarn lint`.

## Git
- Branches: `feat/<feature>`. Tiny fixes may go straight on `main`.
- Commit messages: short imperative subject, with Conventional Commits prefixes where they fit (`feat:`, `fix:`, `chore:`), as in the existing history.
- The owner merges.

## Errors and logging
There are no errors shown to the person today: no network, no storage, and invalid input (such as an empty name) is accepted silently. There's no logging.
