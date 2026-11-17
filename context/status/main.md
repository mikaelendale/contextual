# Status — main
Updated: 2026-11-17 · by: claude-code

## Current phase
Phases 1 and 2 are done. Both are released: 0.1.0 and 0.2.0 (agent feedback), on 13 November 2026. 0.3.0, from the first agent feedback reports and a Windows tester, was published on 17 November 2026. The website moved to a separate, private repository on 13 November 2026, so this repo has no UI now.

## Recently merged
- 2026-11-17 · check, commit-hook, init, templates, skills · 0.3.0: the first agent feedback reports and Windows fixes (#12, #13)
- 2026-11-13 · site · moved to a private repository; page visits in the database went with it (#9)
- 2026-11-13 · agent-feedback · the `feedback` command and its block, the site's form, Send and the owner's list (#8)
- 2026-11-13 · check · the most specific match owns a file; `which --unowned`
- 2026-11-13 · contextual-setup · nested `AGENTS.md` files get a `CLAUDE.md` next to them

## Blocked / needs a human
- PR #10 (Antigravity tested) waits on the contributor's answers; issue #11 (the hook skipping on Windows) waits on their output.
- Later work is in GitHub issues #2, #3, #5 and #7.

## Next
Try the new setup steps in a real agent run on a Next.js scaffold with a plan file. Then the Windows hook, once #11 has its output.
