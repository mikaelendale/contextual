# Build — Agent feedback

## Files
- `packages/cli/src/feedback.js` · the `feedback` command: flags, the automatic fields, cleaning the text, building the link, opening the browser; `feedback on` and `off`
- `packages/cli/test/feedback.test.js` · its tests
- `templates/agent-feedback-block.md` · the feedback block's text
- `site/app/agent/feedback/page.tsx` · the review form: reads the fragment, shows what will be sent
- `site/app/agent/feedback/send/route.ts` · the Send endpoint: validates, rate-limits, writes one row
- `site/app/agent/feedback/reports/page.tsx` · the owner's list, behind a secret, with filters; the site's page visits sit above it
- `site/lib/feedback/` · the fields, server validation, the database calls; the connection (`site/lib/db.ts`) and the rate limit (`site/lib/rate-limit.ts`) are shared with the site
- `site/db/migrations/0001_agent_feedback.sql` · the table
- `docs/agent-feedback.md` · what is collected, what never is, how to turn it off
- Also touched: `packages/cli/src/cli.js`, `init.js`, `update.js` and `context.js` (foundation, init, update), the `.meta.json` template (templates), `.github/` (foundation: the connection-string check), `README.md`, `CHANGELOG.md` (foundation)

## Data
- `context/.meta.json` in a project: `"feedback": "on"` or `"off"`.
- Neon: one table, `agent_feedback`, created by `site/db/migrations/0001_agent_feedback.sql`. No IP addresses, no free-form metadata.

## Routes and actions
- `usecontextual feedback --harness … --model … --skill … --category … --severity … --happened … --expected … [--suggestion …] [--file …] [--print]`
- `usecontextual feedback on`, `usecontextual feedback off`; `init --feedback on|off`
- `/agent/feedback`: the form; `POST /agent/feedback/send`; `/agent/feedback/reports`: the list

## Components
The site's `Section`, `SectionTitle`, `PANEL` and buttons (see `design/components.md`). No new shared component.

## Follows
[principles](../../design/principles.md), [layouts](../../design/layouts.md), [conventions](../../conventions.md), [the most specific owner](../../decisions/2026-11-13-most-specific-owner.md)
