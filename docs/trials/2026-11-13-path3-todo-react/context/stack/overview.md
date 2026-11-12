# Stack overview

**Language.** Plain JavaScript with JSX, as ES modules (`"type": "module"`). The project came from MDN's React tutorial, which teaches in JavaScript.

**UI.** React 18 with function components and hooks. All task and filter state sits in `src/App.jsx` and goes down to the components as props. There is no router and no state library, because the app is a single page.

**Build.** Vite 5 with the React plugin serves the app in development and bundles it for production. The README still talks about Create React App, which is out of date (see `status/main.md`).

**IDs.** `nanoid` makes the IDs for new tasks (`todo-<nanoid>`).

**Styling.** One global stylesheet, `src/index.css`, with hand-written utility classes (`.btn`, `.stack-*`, `.visually-hidden`). No CSS framework.

**Lint.** ESLint 8 using the recommended, react, react-hooks and react-refresh rule sets, with zero warnings allowed.

**Storage.** None. Tasks start from three seeded tasks in `src/main.jsx` and are lost on reload.

**Tests.** None.
