# Security

## Reporting a problem

Please don't report a security problem in a public issue. Report it privately on GitHub: open the repo's **Security** tab and choose **Report a vulnerability**.

If that option isn't there, open an issue that only says you have a security problem to report, with no details, and we'll set up a private way to talk.

You'll get a reply within a week. When the fix is out, the CHANGELOG credits you, unless you'd rather not be named.

## Supported versions

Only the latest release of `usecontextual` gets security fixes.

| Version | Gets fixes |
|---|---|
| 0.1.x | Yes |
| 0.0.1 | No. It was a placeholder |

## What's in scope

- **The CLI** in `packages/cli`. It writes files in your repo and adds one line to your git pre-commit hook.
- **The skills and templates** in `skills/` and `templates/`. Coding agents follow them, so an instruction that could lead an agent to run something you didn't ask for, or to send something out of your machine, counts as a security problem.
- **The website**, contextual.mikaelen.site, including the agent feedback form. Its code is in a separate, private repository, but report problems with it here the same way.

## What the CLI does on your machine

- It has no dependencies, sends no telemetry, and makes no network requests of its own.
- It runs `git` to find the repo, the branch and the staged files.
- `init` runs your package manager once, to add `usecontextual` as an exact dev dependency. `--no-install` skips that.
- The hook runs the copy in `node_modules`. In a repo without a `package.json`, it runs an exact version through `npx`, never an unpinned one.

## Review context files like code

Coding agents read `AGENTS.md`, `context/` and the skills before they work, and do what those files say. A pull request that changes them can change what an agent does in the next session, so review those changes as carefully as code.
