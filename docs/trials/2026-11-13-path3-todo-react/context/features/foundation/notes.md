# Notes — Foundation

## Gotchas
- 2026-11-13 · The README says `yarn start` and "Create React App", but the app uses Vite and the script is `yarn dev`. Trust `package.json`.
- 2026-11-13 · `vite.config.js` sets `base` to MDN's GitHub Pages URL, so `yarn build`/`preview` output points its assets there. `yarn dev` isn't affected.
- 2026-11-13 · `src/App.jsx` and `src/components/Todo.jsx` each define their own `usePrevious` hook.

## Open questions
- 2026-11-13 · This copy won't be deployed. Should `deploy.yml`, `auto-merge.yml` and the `base` in `vite.config.js` be removed or changed?
- 2026-11-13 · Should the README be corrected (`yarn dev`, Vite instead of CRA)?
- 2026-11-13 · Tasks are lost on reload. Should they be saved (for example in localStorage)?
- 2026-11-13 · There are no tests. Should a test tool be added?
