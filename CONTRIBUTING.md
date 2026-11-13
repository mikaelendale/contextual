# Contributing

Thanks for helping. Contextual is a folder of plain markdown files that coding agents read, a small CLI that checks it, and four agent skills. [The spec](docs/spec.md) describes all of it; the decisions in its section 13 are settled, so please don't reopen them without new evidence.

## Good ways to help

- **Try it in your coding agent** and file a [harness report](https://github.com/mikaelendale/contextual/issues/new?template=harness_report.yml), whether it went well or not. Reports from Antigravity, and from agents we haven't listed, help the most.
- **Report a bug** with the [bug form](https://github.com/mikaelendale/contextual/issues/new?template=bug_report.yml).
- **Fix something.** For anything bigger than a small fix, open an issue first so we can agree on the approach.

Security problems go through [SECURITY.md](SECURITY.md), not a public issue.

## Working on the code

You need Node.js 20 or newer and git. The CLI has no dependencies, so there's nothing to install.

```bash
cd packages/cli
npm test

cd ../../example
node ../packages/cli/bin/usecontextual.js check --branch main   # 0 errors, 2 warnings
```

CI runs both on every push and pull request, on Node 20, 22, 24 and 26.

[What's in this repo](README.md#whats-in-this-repo) maps the folders. The rules for changing them are in [docs/maintaining.md](docs/maintaining.md). The ones people trip on:

- Change `example/` and `templates/` together. The tests compare them.
- Templates that a skill ships in its `assets/` folder are copies of files in `templates/`. Edit the original, then copy it over.
- Keep each skill's `SKILL.md` short. Detail goes in its `references/` folder.
- If you change a skill, try it in at least one coding agent, and say which one, and what `check` said afterwards, in the pull request.

## Pull requests

- One change per pull request, with a description of what changed and why.
- Tests and `check` pass.
- Write docs and messages in plain words: what something does, not how great it is.
- No co-author or tool attribution lines in commit messages.

By contributing, you agree that your work is released under the [MIT license](LICENSE).
