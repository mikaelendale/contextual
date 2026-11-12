# Deploy

## Where it runs
Locally only. This is a local copy for trying things out, and the owner won't deploy it anywhere.

The repo still has MDN's `.github/workflows/deploy.yml`, which builds and deploys to GitHub Pages on every push to `main`, and `auto-merge.yml`, which only runs in the `mdn` org. Whether to keep them is an open question in `status/main.md`.

## How a change ships
It doesn't. Changes are merged to `main` locally.

## Rolling back
Revert the commit with git. There's no data or migrations.

## Secrets
None.
