# Conventions

## Code
- TypeScript, strict. Run `pnpm lint` and `pnpm format` before committing.
- Validate every server action's input with zod, at the top of the action.
- No default exports, except where Next.js requires them (pages, layouts, route handlers).

## Packages and tools
Use only the packages and tools listed in `stack/`. Adding another one, even a one-off `npx` command, needs a record in `decisions/` first.

## Naming and files
- Files and folders in kebab-case (`create-board-dialog.tsx`). Components in PascalCase. Tables plural, in snake_case.
- A feature's code lives in `src/features/<feature>/`: `schema.ts`, `actions.ts`, `queries.ts`, `components/`, with tests next to the code.

## Tests
- Unit: Vitest, `*.test.ts` next to the code. One feature: `pnpm vitest run src/features/<feature>`, a few seconds.
- End to end: Playwright, in `e2e/`. One feature: `pnpm test:e2e e2e/<feature>.spec.ts`, under a minute.
- The full e2e suite takes about 4 minutes. Run it once before asking for a merge, not after every change.
- e2e tests sign in with `signInAs(page, email)` from `e2e/helpers/auth.ts`, which creates a session directly. Only `e2e/auth.spec.ts` goes through a real magic link.

## Git
- One branch per feature: `feat/<feature>`. Typos and one-line fixes may go straight on `main`.
- Commit messages: imperative, one line ("Add board page").
- The owner merges. Agents stop at a pushed branch.

## Errors and logging
- Actions return `{ error }` with a sentence the person can act on. Forms show it under the field; anything else goes in a toast.
- Unexpected errors are thrown, logged by Vercel, and shown with the shared error screen (`src/app/app/error.tsx`).
