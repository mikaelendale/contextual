I've read the code. Here's the proposed split. I haven't written anything yet.

**The project:** MDN's sample todo app, TodoMatic. It's one page where you add, complete, rename, delete and filter tasks. Tasks live only in React state, so they're gone after a reload, and the app starts with three seeded tasks. **Stack:** React 18.2 and Vite 5, JavaScript/JSX, `nanoid` for IDs, ESLint 8 and Yarn. It deploys to GitHub Pages through `.github/workflows/deploy.yml`. There are no tests.

**`foundation`**: the HTML entry, mounting the app and seeding the data, the `App` shell that holds task and filter state, plus build, lint, CI and repo config.
`covers: index.html, src/main.jsx, src/App.jsx, vite.config.js, .eslintrc.cjs, package.json, .nvmrc, .editorconfig, .github/**`

**Features** (all `shipped`, all based only on reading the code, since there are no tests and I haven't run it):

| Feature | What it does | covers |
|---|---|---|
| `add-task` | Type a name in "What needs to be done?" and click Add to create a task | `src/components/Form.jsx` |
| `manage-tasks` | Mark a task done or not done, rename it (with focus moving between the edit field and the Edit button), or delete it (focus returns to the list heading) | `src/components/Todo.jsx` |
| `filter-tasks` | All / Active / Completed toggle buttons with `aria-pressed`, plus the "N tasks remaining" heading | `src/components/FilterButton.jsx` |

The handlers for these features (`addTask`, `toggleTaskCompleted`, `editTask`, `deleteTask`, `FILTER_MAP`) live in `src/App.jsx`. Each file can have only one owner, so `App.jsx` goes to `foundation`, and each feature's `build.md` will point to its handler there.

**`shared:`** `src/index.css` (the global stylesheet and UI building blocks: `.btn`, `.stack-*`, `.visually-hidden`) and `public/**`.

**Unowned files:** none. Every code file has exactly one owner.

**Issues I'll record in `notes.md` / questions for you:**
- Both forms let you submit an empty name. The code says this is left as an exercise.
- "N tasks remaining" counts the tasks in the current filter, not the tasks still to do.
- Nothing is saved: tasks reset on reload.
- The README says `yarn start` and "Create React App", but the script is `yarn dev` and the build uses Vite.
- `vite.config.js` sets `base` to `mdn.github.io/todo-react`, and `auto-merge.yml` only runs for the `mdn` org. Is this a fork you'll deploy somewhere else?

Does this split match how you think about the project? Tell me what to rename, merge or split, or say go ahead.
