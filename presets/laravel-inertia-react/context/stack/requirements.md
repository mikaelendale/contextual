# Requirements

## Runtime
- PHP: the version in `composer.json`'s `require.php`, with Composer.
- Node.js: the newest LTS release, for Vite. Package manager: the one whose lockfile is in the repo.

## Accounts
<!-- fill: the outside accounts the plan needs (hosting, email, payments), and who can grant access. "None" for local development only. -->

## Environment variables
| Name | What it is | Where to get it | Needed in |
|---|---|---|---|
| `APP_KEY` | Laravel's encryption key | `php artisan key:generate` | all |
| `DB_CONNECTION` and the `DB_*` values | The database | The host's dashboard; `sqlite` in development | all |
<!-- fill: one row per other variable the plan's services need. Names only, never real values. Keep `.env.example` in step. -->

## First run
1. `composer install`, then install the JavaScript dependencies with the repo's package manager.
2. Copy `.env.example` to `.env`, then `php artisan key:generate`.
3. `php artisan migrate`
4. `composer run dev` (the server, Vite and the queue together), then open the URL it prints.
