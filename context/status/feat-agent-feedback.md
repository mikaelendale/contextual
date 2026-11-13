# Status — feat-agent-feedback
Updated: 2026-11-13 · by: claude-code

## Current focus
agent-feedback, after the most-specific-owner rule it needs.

## Last session
- `check`, `which` and `check --staged` resolve owners by the most specific match (spec 3.8); `which --unowned` lists code no one owns (issue #4).
- Setup's path 3 mentions nested `AGENTS.md` files (issue #6); `site/` has a `CLAUDE.md`.

## In progress
The feedback command (`packages/cli/src/feedback.js`), then the site's form.

## Blocked / needs a human
Nothing.

## Next
1. `usecontextual feedback`: flags, automatic fields, cleaning, the link, opening the browser; `on` and `off`.
2. `init` asks once; `update` keeps the block in step.
3. The site: the form, Send, the table, the list page.
4. Docs, CHANGELOG, a real trial.
