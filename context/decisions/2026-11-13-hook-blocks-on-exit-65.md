# Exit code 65 for "the check found errors", over checking that the CLI runs first
Date: 2026-11-13 · Scope: commit-hook

## Context
The hook ran `check --staged || exit 1`. npm, npx and Node also exit with 1 when they fail, so being offline, an unpublished pinned version or a missing Node blocked every commit.

## Decision
`check --staged` exits 65 when it ran and found errors. The hook blocks only on 65; any other failure prints a note and lets the commit through.

## Why not the alternatives
- Run `--version` first, then the check: two `npx` start-ups on every commit, and the network can still drop between them.
- Read the check's output for its summary line: breaks when the wording changes, and a hook line can outlive the version that wrote it.

## Revisit if
A tool the hook runs through starts using 65 for its own failures.
