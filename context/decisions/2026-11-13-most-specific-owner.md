# The most specific match owns a file, over narrowing the broader feature's globs
Date: 2026-11-13 · Scope: check

## Context
A new feature often adds files under a path an older feature covers: agent-feedback's page will live under `site/`, which `site` covers with `site/**`. Until now two matches were an error, so the older feature had to rewrite its `covers:` line, and globs can't leave a folder out.

## Decision
The most specific match owns the file: an exact path beats any glob, and otherwise the glob with more folders before its first wildcard wins. The `shared:` line takes part the same way. Equally specific matches stay an error. The CLI applies it from 0.2.0 (spec 3.8).

## Why not the alternatives
- Narrowing the older feature's globs: `site/**` would become a list of every other folder in `site/`, and grow with each new folder.
- `!glob` exclusions: one more syntax to learn, and every new feature still edits the older feature's README.
- First feature listed wins: depends on order in files nobody reads in order.

## Revisit if
Agents get ownership wrong because a specific glob quietly takes files people expected to stay with the broader feature.
