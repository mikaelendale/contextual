# Check
status: shipped
phase: 1
covers: packages/cli/src/check.js, packages/cli/src/fix.js, packages/cli/src/plan.js, packages/cli/src/which.js, packages/cli/src/owners.js, packages/cli/test/owners.test.js, packages/cli/test/check.test.js, packages/cli/test/fix.test.js, packages/cli/test/plan.test.js, packages/cli/test/which.test.js
depends-on: foundation

## What it does
`usecontextual check` validates a project's context: the feature folders and their fields, the index, the build plan, who owns each file, links, size caps, the status file, the skills, the deslop results and the hashes. `check --fix` repairs what's mechanical, and `which <path>` says which feature owns a file.

## Acceptance
- [x] `check` passes on `example/` with 0 errors and the two expected warnings
- [x] `check --fix` rebuilds the feature index, stores the `idea.md` hash and creates a missing status file
- [x] A file covered by two features is an error
- [x] `which <path>` names the feature that covers a path, `shared`, or no one, with exit code 1
- [x] The most specific match owns a file, and `which --unowned` lists the code no one owns
