# Notes — Commit hook

## Gotchas
- 2026-11-13 · The hook used to end in `|| exit 1`, so an unpublished pinned version or being offline blocked every commit. It blocks only on exit 65 now: keep `check --staged`'s exit code and the hook line in step.
- 2026-11-13 · git shows a hook's output on stderr.
- 2026-11-13 · `hooks/github-actions.yml` still uses checkout v4 and setup-node v4, older than this repo's CI (v7).

## Open questions
- 2026-11-13 · Windows: the hook runs through Git for Windows' sh, and nobody has tried it. Does the line, with `npx` and the exit codes, work there?
