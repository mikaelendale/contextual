# usecontextual

The Contextual CLI: everything a script can do, with no AI. Zero runtime dependencies.

> [!WARNING]
> The package is `usecontextual`. `npx contextual` runs a different, unrelated package.

Not published yet. Built so far:

| Command | What it does |
|---|---|
| `usecontextual check [--branch <name>]` | Checks the context against the spec (section 6.1). Exit code 1 when there are errors |
| `usecontextual which <path>` | Shows who owns a file: a feature, the `shared:` line, or no one (exit code 1) |

Still to come, in step 3: `init`, `update`, `check --fix`, `check --staged` and the git hook. The design is in sections 6 and 7 of [the spec](../../docs/spec.md).

## Tests

```bash
npm test
```

The tests use Node's built-in runner (Node 20 or newer). The main one is that `check` passes on [`example/`](../../example/) with 0 errors. The rest break copies of the example and confirm `check` catches each break, test `which`, and check that the example still matches the templates.
