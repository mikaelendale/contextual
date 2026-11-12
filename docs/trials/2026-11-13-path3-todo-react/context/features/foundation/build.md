# Build — Foundation

## Files
- `index.html` · root `#root` element, page title "TodoMatic", loads `src/main.jsx`
- `src/main.jsx` · mounts `<App tasks={DATA}>` in StrictMode, defines the three seeded tasks, imports `index.css`
- `src/App.jsx` · task and filter state, handlers for every feature, page layout, `usePrevious` hook, focus on the list heading after a delete
- `vite.config.js` · React plugin, `base: "https://mdn.github.io/todo-react/"`
- `.eslintrc.cjs` · lint rules
- `package.json`, `yarn.lock`, `.nvmrc`, `.editorconfig`, `.gitignore` · scripts, dependencies, Node version, editor settings
- `README.md`, `CONTRIBUTING.md`, `REVIEWING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `LICENSE` · MDN's repo docs
- `.github/workflows/deploy.yml` · build and deploy to GitHub Pages on push to `main`
- `.github/workflows/auto-merge.yml` · MDN-only auto-merge
- `.github/ISSUE_TEMPLATE/*`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/CODEOWNERS` · MDN's GitHub templates

## Data
`tasks` state in `App`: `{ id: string, name: string, completed: boolean }[]`, seeded from `DATA` in `src/main.jsx`. `filter` state: `"All" | "Active" | "Completed"`. In memory only.

## Routes and actions
One page at `/`. Scripts: `dev` (Vite on port 3000), `build`, `preview`, `lint`.

## Components
`App` (`src/App.jsx`) composes `Form`, `FilterButton` and `Todo`. No shared components.

## Follows
- [stack/overview.md](../../stack/overview.md), [stack/requirements.md](../../stack/requirements.md)
- [design/layouts.md](../../design/layouts.md), [design/principles.md](../../design/principles.md)
