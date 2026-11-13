# Status — main
Updated: 2026-11-13 · by: claude-code

## Current phase
Phase 1 is done and released as 0.1.0 (13 November 2026). Phase 2, agent feedback, is merged (#8) as 0.2.0 and not published yet.

## Recently merged
- 2026-11-13 · agent-feedback · the `feedback` command and its block, the site's form, Send and the owner's list (#8)
- 2026-11-13 · check · the most specific match owns a file; `which --unowned`
- 2026-11-13 · contextual-setup · nested `AGENTS.md` files get a `CLAUDE.md` next to them
- 2026-11-13 · commit-hook · the hook blocks only when `check --staged` ran and found errors
- 2026-11-13 · foundation · CI on Node 20 to 26, SECURITY.md, CONTRIBUTING.md and issue forms

## Blocked / needs a human
- Publishing 0.2.0.
- The live site still deploys from the old teaser repo. `docs/maintaining.md` says how to move it here.
- Later work is in GitHub issues #2 to #7.

## Next
Finish agent-feedback: send the first reports through the form, check the owner's list against the database, and tick its last two acceptance boxes.
