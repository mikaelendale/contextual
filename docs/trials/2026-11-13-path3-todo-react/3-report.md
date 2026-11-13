Contextual is set up with the split you confirmed, and committed on `main` as `1add9c2 Set up Contextual`. `npx usecontextual check` reports 0 errors and 0 warnings. No app code was changed.

**What I wrote**
- **`AGENTS.md`**: a TodoMatic heading and a one-line description.
- **`context/idea.md`**: the project written up from the README and the code. It records that this copy is local and won't be deployed. Nobody edits it from now on.
- **Stack, conventions, architecture and design files**: these describe what exists. The design values come from `src/index.css`, with contrast ratios worked out for each color. The deploy file says "local only".
- **Four shipped features, each with all five files**:
  - `foundation` owns the root files, `.github/**`, `src/main.jsx` and `src/App.jsx`.
  - `add-task`, `manage-tasks` and `filter-tasks` own their one component each.
  - `src/index.css` and `public/**` are on the `shared:` line.
- **`build-plan.md`**: Phase 1, "What's built", marked done.

**Not verified:** I didn't run the app or the linter, and there are no tests. Every acceptance box is ticked but marked "found in the code, not verified".

**Open questions** (in `context/status/main.md` and each feature's `notes.md`):
1. Adding or renaming a task accepts an empty name. Should that be blocked?
2. "N tasks remaining" counts the tasks the current filter shows, not the unfinished ones. Should it count unfinished tasks instead?
3. Tasks are lost on reload. Should they be saved, for example in localStorage?
4. MDN's GitHub Pages workflows and the `base` URL in `vite.config.js` are still there. Should they be removed or changed?
5. The README says `yarn start` and Create React App, but the app uses `yarn dev` and Vite. Should it be fixed?
6. Should automated tests be added?

One more thing I noticed: the unpressed filter buttons have a 1.5:1 border contrast, below the 3:1 a control outline needs.

Nothing is planned beyond what's built. Answer any of the questions above, or describe something new and it becomes Phase 2. After that, "build the next feature" builds it on its own branch.
