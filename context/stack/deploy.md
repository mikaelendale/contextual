# Deploy

## Where it runs
- The CLI: the npm registry, as `usecontextual`, published from `packages/cli`.
- The site: Vercel, with the project's Root Directory set to `site`. Which repo and branch the live site deploys from: not decided yet (see `status/main.md`).

## How a change ships
1. CLI: tests pass, the version and `CHANGELOG.md` are updated, `npm pack --dry-run` in `packages/cli` shows the right files, and the file list in `docs/release/` is updated.
2. Commit and push, so the commit npm records (`gitHead`) matches the published code.
3. The owner runs `npm publish` from their own terminal. Agents prepare and check a release, but don't publish it.
4. Site: merging to the branch Vercel watches deploys it. A new migration in `site/db/migrations/` is run once by hand against Neon first: `psql "$DATABASE_URL" -f <file>`.

## Rolling back
A published version can never be reused or changed. Publish a fixed version, and mark the bad one with `npm deprecate`. For the site, redeploy an earlier deployment in Vercel.

## Secrets
None in the repo. `GITHUB_TOKEN`, if used, lives in the site's Vercel settings. Publishing to npm needs the owner's login and 2FA.
