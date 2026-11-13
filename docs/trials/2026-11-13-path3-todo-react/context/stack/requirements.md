# Requirements

## Runtime
- Node.js at the version in `.nvmrc`.
- Yarn (classic), which reads `yarn.lock`.

## Accounts
None.

## Environment variables
None.

## First run
```bash
yarn install
yarn dev        # Vite on http://localhost:3000, opens the browser
```
Other scripts: `yarn build` (production bundle in `dist/`), `yarn preview` (serves `dist/`), `yarn lint`.

Note: `vite.config.js` sets `base` to `https://mdn.github.io/todo-react/`. That affects `build`/`preview` asset URLs, not `dev`.
