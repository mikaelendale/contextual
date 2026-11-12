# Stack

| Layer | Choice | Notes |
|---|---|---|
| Language | JavaScript (JSX, ES modules) | No TypeScript; `@types/react` is installed but unused |
| UI | React 18 + ReactDOM | Function components and hooks, state in `src/App.jsx` |
| Build / dev server | Vite 5 with `@vitejs/plugin-react` | `vite.config.js` |
| IDs | nanoid | New task IDs in `src/App.jsx` |
| Styling | One global stylesheet | `src/index.css`, no CSS framework |
| Lint | ESLint 8 with react, react-hooks, react-refresh plugins | `.eslintrc.cjs` |
| Package manager | Yarn (classic lockfile) | `yarn.lock`; Node version in `.nvmrc` |
| Storage | None | Tasks live in React state only |
| Tests | None | |
| Hosting | None (local only) | See `deploy.md` |
