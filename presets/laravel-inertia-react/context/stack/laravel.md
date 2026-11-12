# Laravel

## How it's wired here
- `routes/web.php` · every page route. Owned by `foundation`, plus one marked section per feature.
- `app/Http/Controllers/` · controllers, one folder per feature.
- `app/Models/` · Eloquent models.
- `database/migrations/` · schema changes, named after what they change.
- `bootstrap/app.php`, `config/` · framework setup. Owned by `foundation`.
<!-- fill: middleware, policies, jobs and mail classes this app adds, one line each. -->

## Rules
- Validate input with a Form Request, not inline in the controller.
- Authorize with policies; check ownership on every query that takes an id from the request.
- Never edit a migration that has run anywhere but your machine. Add a new one.
- Use `php artisan` generators, then move the result into the feature's folder.

## Gotchas
<!-- fill: what broke or surprised us, newest first: date · what happened · what to do instead. -->

## Docs
- https://laravel.com/docs
