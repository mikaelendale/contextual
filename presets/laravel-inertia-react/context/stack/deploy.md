# Deploy

## Where it runs
<!-- fill: the host for each environment (for example Laravel Cloud, Forge, or a container host), and the branch that deploys to it. -->

## How a change ships
1. Open a pull request from the feature branch. CI runs `usecontextual check`, Pest and the end-to-end tests.
2. The owner merges.
3. The host builds the frontend (`build` script), runs `php artisan migrate --force`, and switches to the new release.

## Rolling back
<!-- fill: how to go back to the previous release on this host, and how to undo a bad migration (a new migration that reverses it; never edit one that has run). -->

## Secrets
<!-- fill: where production's `.env` values live and who can change them. -->
