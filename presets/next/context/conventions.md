# Conventions

## Code
- TypeScript, strict. Run the `lint` script before committing. <!-- fill: the format command, if the repo has one. -->
- No default exports, except where Next.js requires them (pages, layouts, route handlers).

## Packages and tools
Use only the packages and tools listed in `stack/`. Adding another one, even a one-off `npx` command, needs a record in `decisions/` first.

## Naming and files
- Files and folders in kebab-case; components in PascalCase.
- A feature's code lives in `src/features/<feature>/`, with its tests next to the code. Its pages live in `src/app/`.
- UI building blocks go in `src/components/ui/`. Nothing in there knows about a feature.

## Tests
- Unit: Vitest, `*.test.ts` next to the code. One feature: `vitest run src/features/<feature>`.
- End to end: Playwright, in `e2e/<feature>.spec.ts`. One feature: `playwright test e2e/<feature>.spec.ts`.
<!-- fill: how long each takes once there are tests, and how e2e tests sign in or seed data. -->

## Git
- One branch per feature: `feat/<feature>`. Typos and one-line fixes may go straight on `main`.
- Commit messages: imperative, one line.
- The owner merges.

## Errors and logging
- Server actions return an error the person can act on; forms show it next to the field.
- Unexpected errors are thrown, logged by the host, and shown by the nearest `error.tsx`.
