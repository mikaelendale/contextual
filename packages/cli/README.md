# usecontextual

The Contextual CLI: everything a script can do, with no AI. Zero runtime dependencies.

> **Warning:** The package is `usecontextual`. `npx contextual` runs a different, unrelated package.

Contextual isn't released yet. Two commands work in this version:

| Command | What it does |
|---|---|
| `usecontextual check [--branch <name>]` | Checks the context against the spec (section 6.1). Exit code 1 when there are errors |
| `usecontextual which <path>` | Shows who owns a file: a feature, the `shared:` line, or no one (exit code 1) |
| `usecontextual check --fix` | Rebuilds the feature index and stores the `idea.md` hash, then checks. Not in 0.0.1 |

`init`, `update` and `check --staged` print "not released yet" and exit. The design is in sections 6 and 7 of [the spec](https://github.com/mikaelendale/contextual/blob/main/docs/spec.md).

## Tests

```bash
npm test
```

The tests use Node's built-in runner (Node 20 or newer). The main one is that `check` passes on [`example/`](https://github.com/mikaelendale/contextual/tree/main/example) with 0 errors. The rest break copies of the example and confirm `check` catches each break, test `which`, and check that the example still matches the templates.
