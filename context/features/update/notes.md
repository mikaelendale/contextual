# Notes — Update

## Gotchas
- 2026-11-13 · `update` keeps a hand-edited `cli` in `.meta.json` for the context files, but the hook line ignores it (issue #2).
- 2026-11-13 · Its tests were in `staged.test.js`; they moved to `update.test.js` the same day, so this feature owns them.

## Open questions
- 2026-11-13 · Update across versions: it has only been tested within 0.1.0. Moving a real repo from one published version to the next hasn't been tried.
