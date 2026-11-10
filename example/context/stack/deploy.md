# Deploy

## Where it runs
- Production: Vercel, from `main`, at https://linkboard.example. Database: the Neon branch `main`.
- Previews: Vercel builds every pushed branch. Previews share the Neon branch `preview`.
- Development: your machine, with the Neon branch `dev`.

## How a change ships
1. The owner merges the feature branch into `main`.
2. Vercel runs `pnpm db:migrate && pnpm build`. If the migration fails, the deploy stops and the old version keeps running.
3. Check the feature on production with the steps in its `tests.md`.

## Rolling back
- Code: in Vercel, promote the previous deployment.
- Database: migrations only add things (new tables, new nullable columns), so the previous code keeps working after a rollback. Removing a column takes two releases: stop using it, then drop it.

## Secrets
In Vercel's environment variables, per environment. Only the owner can change production values.
