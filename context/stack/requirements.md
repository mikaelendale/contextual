# Requirements

## Runtime
Node.js 20 or newer and git. npm comes with Node. The CLI has nothing to install; the site uses npm with its own lockfile.

## Accounts
None to contribute. Publishing to npm and deploying the site use the owner's accounts.

## Environment variables
| Name | What it is | Where to get it | Needed in |
|---|---|---|---|
| `SITE_URL` | The site's public address, for absolute share-card and canonical links | The address it's served at | Production, outside Vercel |
| `GITHUB_TOKEN` | Optional token for the GitHub button's numbers, if GitHub's anonymous limit is ever hit | A GitHub token with no scopes | Production, optional |

## First run
```bash
cd packages/cli && npm test
cd ../../example && node ../packages/cli/bin/usecontextual.js check --branch main
cd ../site && npm install && npm run dev
```
The site opens on http://localhost:3000.
