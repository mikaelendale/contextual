# Foundation
status: shipped
phase: 1
covers: *, .github/**, src/main.jsx, src/App.jsx
depends-on: none

## What it does
The app shell every other feature builds on: the Vite + React entry, the seeded task data, and the `App` component that holds task and filter state. It also owns the root config (Vite, ESLint, package.json, `.nvmrc`), the repo docs and the GitHub workflows. `App.jsx` holds the handlers the other features use (`addTask`, `toggleTaskCompleted`, `editTask`, `deleteTask`, `FILTER_MAP`).

## Acceptance
- [x] `yarn install && yarn dev` opens TodoMatic on http://localhost:3000 (found in the code, not verified)
- [x] The app starts with three tasks: Eat (done), Sleep, Repeat (found in the code, not verified)
- [x] The page is one centred white card on a grey background, laid out as in `design/layouts.md` (found in the code, not verified)
- [x] `yarn lint` uses the ESLint config in `.eslintrc.cjs` with zero warnings allowed (found in the code, not verified)
