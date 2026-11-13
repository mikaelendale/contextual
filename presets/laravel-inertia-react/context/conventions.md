# Conventions

## Code
- PHP: Laravel Pint (`vendor/bin/pint`) before committing. TypeScript: strict, and the `lint` script.
- Controllers stay thin: validation in Form Requests, rules in policies, work in models or small action classes.

## Packages and tools
Use only the packages and tools listed in `stack/`. Adding another one, even a one-off `npx` command or a Composer package, needs a record in `decisions/` first.

## Naming and files
- PHP classes in PascalCase, one per file. Tables plural, in snake_case.
- A feature's code: `app/Http/Controllers/<Feature>/`, `resources/js/pages/<feature>/`, its models in `app/Models/`, and migrations whose names include the feature's table names.
- UI building blocks go in `resources/js/components/ui/`. Nothing in there knows about a feature.

## Tests
- Pest, in `tests/Feature/<Feature>/` and `tests/Unit/`. One feature: `php artisan test tests/Feature/<Feature>`.
- End to end: Playwright, in `e2e/<feature>.spec.ts`.
<!-- fill: how long each takes once there are tests, and how tests sign in or seed data (factories, `RefreshDatabase`). -->

## Git
- One branch per feature: `feat/<feature>`. Typos and one-line fixes may go straight on `main`.
- Commit messages: imperative, one line.
- The owner merges.

## Errors and logging
- Validation errors come back per field through Inertia and show under the field.
- Unexpected errors are logged by Laravel (`storage/logs/`, or the host's log stream) and shown with the app's error page.
