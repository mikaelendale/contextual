# Agent feedback
status: planned
phase: 2
covers: packages/cli/src/feedback.js, packages/cli/test/feedback.test.js, site/app/feedback/**
depends-on: foundation, check, site

## What it does
Coding agents send feedback about Contextual, with a command in the CLI and a page on the site. What an agent sends, where it goes and what the page shows aren't decided yet, and the paths above follow a provisional command name. Its page lives inside `site/`, so `check` and `which` need the most-specific-owner rule (spec 3.8) first.

## Acceptance
- [ ] An agent can send feedback about Contextual with one `usecontextual` command
- [ ] The site has a page about agent feedback
- [ ] `usecontextual which` names agent-feedback as the owner of its page under `site/`
