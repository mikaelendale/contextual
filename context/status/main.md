# Status — main
Updated: 2026-11-13 · by: claude-code

## Current phase
Phase 1 is done: twelve features, released as 0.1.0 once it's published. Phase 2, agent feedback for 0.2.0, is planned and not started.

## Recently merged
- 2026-11-13 · all · Contextual set up on its own repo, from the existing code
- 2026-11-13 · commit-hook · the hook blocks only when `check --staged` ran and found errors
- 2026-11-13 · foundation · CI on Node 20 to 26, SECURITY.md, CONTRIBUTING.md and issue forms
- 2026-11-13 · site · the folder diagram, the "Done means checked" run, GitHub numbers; the visit counter removed

## Blocked / needs a human
- Publish 0.1.0 from `packages/cli`, then mark it published in `CHANGELOG.md`.
- agent-feedback: what an agent sends, where it goes, and what its page shows aren't decided.
- Which repo and branch the live site deploys from isn't recorded.
- GitHub's private vulnerability reporting is off, but SECURITY.md points to it.
- Later work is in GitHub issues #2 to #7.

## Next
agent-feedback, once 0.1.0 is out. It starts with the most-specific-owner rule in `check` and `which` (spec 3.8), because its page lives inside `site/`.
