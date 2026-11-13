# Contextual

## Idea
Written at setup from the existing code and README, and confirmed by the owner.
Contextual is an open source context structure for codebases: a folder of plain markdown files in the repo that tells an AI coding agent what the project is, how it's built, what's done and what comes next. Explain your project once; your agent remembers the rest. It works through the two standards coding agents share, `AGENTS.md` and agent skills, and ships as an npm CLI (`usecontextual`), four agent skills and a website.

## Users
Developers who build with coding agents such as Claude Code, Codex, OpenCode and Antigravity, and people with little technical experience who want to build a real app with one. This repo's own users are its maintainers and contributors.

## Platform
A command-line tool for any git repo, on Node.js 20 or newer, run with npx, pnpm dlx or bunx. The skills run inside coding agents. The website is on the web.

## Stack
- CLI: JavaScript modules on Node.js 20 or newer, with no runtime dependencies
- CLI tests: Node's built-in test runner
- Package: npm, as `usecontextual`
- Skills, templates, presets and docs: markdown
- Site: Next.js 16 with React 19, Tailwind CSS 4, shadcn/ui, Phosphor icons and Paper Shaders
- CI: GitHub Actions
- Site hosting: Vercel

## Design direction
The site: a hot orange, live-grain dithered sky with clouds and a constellation; a light Newsreader serif headline with an italic orange second line; Inter for everything else, and no monospace; calm, centred and spacious. The CLI and the docs: plain words, no hype.

## Phases
### Phase 1 — What's built
Everything that exists at setup, released as 0.1.0.
- Foundation: the repo's shell, the CLI's entry point and shared code, CI and the docs
  - acceptance: `npm test` in `packages/cli` passes on Node 20, 22, 24 and 26
  - acceptance: `usecontextual --help` lists every command
- Templates: the blank context files and stack presets every project starts from
  - acceptance: `check` passes with 0 errors on what `init` lays down from them
  - acceptance: a preset fills `stack/`, `architecture.md` and `conventions.md` without naming a framework version
- Init: `usecontextual init` adds Contextual to a git repo
  - acceptance: in an empty git repo it adds `AGENTS.md`, `CLAUDE.md`, `context/`, both skill folders and the hook, and `check` passes
  - acceptance: with a `package.json` it pins itself as an exact dev dependency
  - acceptance: it never overwrites a file, and refuses outside a git repo
- Update: `usecontextual update` refreshes Contextual's own files after an upgrade
  - acceptance: it refreshes the `AGENTS.md` block, `deslop.md`, the skills and the hook line, and leaves project content alone
- Check: `check`, `check --fix` and `which`
  - acceptance: `check` passes on `example/` with 0 errors and the two expected warnings
  - acceptance: `check --fix` rebuilds the feature index and creates a missing status file
  - acceptance: `which <path>` names the feature that owns a file
- Commit hook: the pre-commit check that a feature's code comes with its record
  - acceptance: on a feature branch, a commit of a feature's code without its log entry and status file is blocked
  - acceptance: when the CLI can't run, the hook prints a note and the commit goes through
- Contextual plan: plans a project in any AI chat
  - acceptance: the copy-paste prompt and the chat skill each give a valid `contextual-plan.md`
- Contextual setup: "set up contextual" writes the context the first time
  - acceptance: from a plan file, from questions, or from existing code, `check` passes afterwards
- Contextual next: "build the next feature" builds one feature on its own branch
  - acceptance: it builds, records and commits one feature, then stops for review
- Contextual sync: "sync the context" brings the context back in line with the code
  - acceptance: after a merge and hand edits, it records them and `check` passes
- Example: Linkboard, a finished context folder to copy from
  - acceptance: `check` on `example/` gives 0 errors
- Site: the website, contextual.mikaelen.site
  - acceptance: `npm run build` in `site/` succeeds

### Phase 2 — Agent feedback (0.2.0)
- Agent feedback: coding agents send feedback about Contextual, with a command in the CLI and a page on the site
  - acceptance: an agent can send feedback about Contextual with one `usecontextual` command
  - acceptance: the site has a page about agent feedback
  - acceptance: `usecontextual which` names agent-feedback as the owner of its page under `site/`

## Open questions
- Agent feedback: what does an agent send, where does it go, and what does the page show?
- Which repo and branch does the live site deploy from?
