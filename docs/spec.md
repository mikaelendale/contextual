# Contextual — product and build spec

Status: steps 1 to 5 built and merged (13 November 2026), and 0.1.0 is ready to publish. Tried for real in Claude Code, Codex and OpenCode (`docs/trials/`). Not yet tried in Antigravity. Steps 6 and 7 (wider testing, launch) are next.
Written: November 2026. Last updated: 12 November 2026 (deslop results, the agent skills, `check --fix`; harnesses checked again). Before that, 10 November 2026 (harness behaviour verified against official docs, npm name `usecontextual`, a marked block in `AGENTS.md`, hook rules, collapsed feature index and `which`, sync fallbacks, one public repo with the site in `site/`). Section 14 lists every change.
Audience: whoever builds this (including a coding agent starting with no prior context).

---

## 1. What Contextual is

Contextual is an open source context structure for codebases. It is a folder of plain markdown files that lives in a repo and tells an AI coding agent what the project is, how it is built, what has been done, and what comes next.

The goal is three things:

- **Less prompting.** The person stops re-explaining the project in every prompt.
- **Fewer hallucinations.** The agent reads facts from files where it would otherwise guess.
- **Better results.** Work follows a plan, a design direction, and a definition of done.

Tagline: **Continuous context engineering for coding agents.**
Hero line on the site: *Explain your project once. Your agent remembers the rest.*

Supported harnesses: **Claude Code** and **Codex** (fully supported and tested), plus **Antigravity** and **OpenCode** (supported through shared standards). Details in section 2.

Who it is for: developers, and also people with little technical experience who want to build a real app by describing the idea and letting the agent follow a plan.

Site: contextual.mikaelen.site. Brand color: orange (a hot, saturated orange, kept away from Anthropic's terracotta).

npm package: **`usecontextual`** (`npx usecontextual init`). The name `contextual` on npm belongs to an unrelated package (section 6.4).

---

## 2. The three pieces

Contextual ships as three things. Each has one job, and they hand off through files.

| Piece | Where it runs | Job | Uses AI? |
|---|---|---|---|
| `contextual-plan` | Any LLM chat | Plans the project and outputs one file, `contextual-plan.md` | Yes |
| `usecontextual` (npm package) | Terminal, in the repo | Adds the folder structure, skills, and git hook; validates; updates; finds which feature owns a path | No |
| Agent skills (`contextual-setup`, `contextual-next`, `contextual-sync`) | Inside the coding agent | Fill in the context, build features, keep context current | Yes |

The rule that decides which piece owns a task: **anything a script can do, the package does** (zero tokens). Anything that needs judgment, the agent does.

### The flow for a user

```
1. Plan in chat (optional)       → get contextual-plan.md
2. Put the file in the repo root
3. npx usecontextual init        → structure, templates, skills, git hook
4. "set up contextual"           → contextual-setup skill writes the context
5. "build the next feature"      → contextual-next skill builds one feature (repeat)
   npx usecontextual check       → free validation, any time
```

Step 1 is optional. Without a plan file, the agent asks the planning questions itself in step 4.

### Supported harnesses

Contextual is built on two standards that the major coding agents share, so one set of files works in all of them:

- **`AGENTS.md`** for the rules.
- **`SKILL.md`** for the procedures.

Verified on 10 November 2026 against each tool's official docs, and against its source code where the docs were silent (sources in section 11). Checked again on 12 November 2026; the findings and links are in [harnesses.md](harnesses.md):

| Harness | Level | Reads rules from | Reads project skills from | Explicit skill call |
|---|---|---|---|---|
| Claude Code | Fully supported, tested by us | `CLAUDE.md`, which imports `AGENTS.md`. It reads `AGENTS.md` directly only when there is no `CLAUDE.md` | `.claude/skills/` | `/contextual-setup` |
| Codex | Fully supported, tested by us | `AGENTS.md`, from the repo root down to the working directory, 32 KiB combined | `.agents/skills/` | `$contextual-setup` |
| Antigravity | Supported through the standards, not yet tested | `AGENTS.md` (combined with `GEMINI.md` when both exist) | `.agents/skills/` (the older `.agent/skills/` still works) | `/contextual-setup` |
| OpenCode | Supported through the standards, tested once (setup and one feature) | `AGENTS.md` only. Version 2 never reads `CLAUDE.md` | `.agents/skills/`, `.claude/skills/`, `.opencode/skills/` | `@contextual-setup` |
| Cursor, Copilot, others | Probably works, untested, no promises | `AGENTS.md` | varies | varies |

What follows from the table:

- One `AGENTS.md` plus a `CLAUDE.md` that imports it reaches all four.
- The skills go in two folders: `.agents/skills/` for Codex, Antigravity and OpenCode, and `.claude/skills/` for Claude Code, whose docs do not mention `.agents/skills/`.
- The two sets are **copies, not symlinks**. Git checks symlinks out as plain text files on Windows by default, and Antigravity's CLI has a reported bug listing skills through a Windows junction.
- The copies must stay byte-identical. OpenCode 2 silently uses the `.agents` copy; OpenCode 1 picks either one at random.
- The skills are installed in the repo only, never also at user level. Codex shows two skills with the same name, and typing `$contextual-setup` then selects neither.
- Triggering in plain words ("set up contextual") is the model's choice in every harness. The docs show the explicit calls above as the fallback.

Why skills and not slash commands: command formats differ in every harness, and Antigravity has deprecated its slash-command workflows in favor of skills. (Google posted a retirement date of 1 November 2026, then withdrew it; existing workflows still run.) The skill format is the portable choice.

What does not port: harness-specific hooks. Enforcement therefore uses a git pre-commit hook (section 6.3), which works no matter which agent is driving.

These mechanisms change often. Re-verify the table before every release.

---

## 3. The context structure (what lands in a user's repo)

```
AGENTS.md                    the map and the rules. Contextual owns one marked block
CLAUDE.md                    imports AGENTS.md with the line @AGENTS.md
context/
  idea.md                    the person's original plan. never edited by the agent
  build-plan.md              phases, each listing features
  status/
    main.md                  where the project stands
    <branch>.md              one status file per working branch (feat/boards → feat-boards.md)
  architecture.md            how the system fits together, and the shared: list (section 3.8)
  conventions.md             code style, testing, commit rules
  stack/
    _index.md                table of choices
    overview.md              what we use and why
    requirements.md          versions, accounts, env vars
    deploy.md                where and how it ships
    <lib>.md                 how a library is wired in THIS repo, with gotchas
  design/
    deslop.md                fixed ban list, same in every project
    principles.md            this project's own look
    layouts.md               page templates
    components.md            what components exist and when to use them
  features/
    _index.md                one row per feature, one line per finished phase. rebuilt by the package
    <feature>/
      README.md              what it does, status, paths it owns, acceptance
      build.md               how it is built: files, tables, routes, components
      tests.md               how to prove it works
      notes.md               gotchas and open questions
      log.md                 every task done on this feature, newest first
  decisions/                 short "we chose X over Y because" records, one file each: YYYY-MM-DD-<slug>.md
  .meta.json                 version, hashes, last sync (commit and date), settings
.agents/skills/              contextual-setup, contextual-next, contextual-sync
.claude/skills/              identical copies, for Claude Code
<hooks folder>/pre-commit    runs usecontextual check --staged (section 6.3)
```

### 3.1 Root files

**`AGENTS.md`** is the entry point. AGENTS.md is the cross-tool standard: Codex, Antigravity, and OpenCode read it natively. Claude Code reads `CLAUDE.md`, so `CLAUDE.md` imports `AGENTS.md` with the line `@AGENTS.md`. One source of truth.

**Contextual owns a marked block, not the whole file.** Many repos already have an `AGENTS.md`, and other tools write into it. Next.js 16, for one, writes its own marked block and puts it back if it is removed. So:

- Contextual's rules live between `<!-- contextual:start -->` and `<!-- contextual:end -->`. `init` adds the block after any existing content, and `update` rewrites only what is between the markers.
- The project's own heading and one-line description sit just above the block, outside it, because they are project content that `update` must not touch.
- The size cap (about 60 lines) applies to the block only. Text that other tools or people add outside it is not ours to police.
- If `CLAUDE.md` already exists, `init` appends `@AGENTS.md` to it, once. It never replaces the file. Without that line Claude Code would not read `AGENTS.md` at all.

The block contains only:

- The read order (section 4.1).
- The path rule: before editing a path, find its owner with `usecontextual which <path>` (sections 3.8 and 4.3). If a feature owns it, read that feature's README first. If it is on the `shared:` line, keep the change small and mention it in the log entry. If nothing owns it, say so, then add it to the right feature's `covers:` or to the `shared:` line.
- The definition of done (section 4.2).
- Hard rules (never edit `idea.md`, follow `deslop.md` and `principles.md` for UI, ask when a product decision is unclear).
- The list of Contextual skills and when to use each.

Everything else lives in `context/` and is loaded on demand.

### 3.2 `idea.md`

The person's own words. If they came with `contextual-plan.md`, that file is moved here unchanged during setup. Otherwise setup writes the person's answers here in the same plan-file format (`docs/plan-file.md`). The agent never edits it after setup.

`init` does not create it. The first `check --fix` after setup stores its hash in `.meta.json`, so later `check` runs can detect edits.

### 3.3 `build-plan.md`

Phases, each a checklist of feature folders. Slow-moving. A phase is done only when every feature in it is `shipped` (or `deprecated`). It is only ticked on the main branch. Each phase heading ends with `[planned]`, `[in progress]` or `[done]`.

```
## Phase 2 — Core product  [in progress]
- [x] features/links
- [ ] features/boards          ← current
- [ ] features/link-preview
```

### 3.4 Status files

One file per branch in `context/status/`. The agent runs `git branch --show-current` and reads the matching file. Overwritten every session, capped at about 40 lines.

**File name rule.** The branch name in lowercase, with `/` and any character outside `a-z`, `0-9`, `.`, `_` and `-` replaced by `-`: `feat/boards` becomes `feat-boards.md`. The default branch always uses `main.md`, even when it is called `master` (`.meta.json` records the real name). If the current branch has no file, the agent reads `main.md` and creates the branch file at the end of the task.

```
# Status — feat-boards
Updated: <date> · by: claude-code

## Current focus
## Last session
## In progress
## Blocked / needs a human
## Next
```

`main.md` holds the project-level state: current phase, what merged recently, what needs a human, what is next.

### 3.5 Feature folders

Every feature is a folder. This replaces the earlier single-file-per-feature design, which got bloated.

**Folder name rule.** The feature's name from the plan in kebab-case: lowercase, words joined by `-`, nothing else (`Link preview` becomes `link-preview`). Unique within the project. A folder is never renamed once created; if a feature's scope changes, its README changes.

**`README.md`** — always read first, kept short (about 60 lines).

```
# Boards
status: planned | in-progress | shipped | deprecated
phase: 2
covers: src/features/boards/**, src/app/app/boards/**
depends-on: auth, links

## What it does
## Acceptance
- [ ] testable statements; the feature ships when all are checked
```

The first sentence under "What it does" becomes the feature's line in `_index.md`, so it has to make sense on its own.

**`build.md`** — files, tables, routes, components, and links to the `stack/` and `design/` files this feature must follow.

**`tests.md`** — not test code (that stays in `src/`). It records which test files cover the feature, the command to run only them, the manual steps to verify it in the real interface, and the last result. Borrowed idea: for each feature, record how a user reaches it, how the agent drives it, and what observable state proves it works. A passing build is not proof.

**`notes.md`** — gotchas that broke or surprised us, and open questions a human must decide.

**`log.md`** — one entry per task, newest first, dated (no global numbering). What changed, what tests were added, what was left open, and the deslop result (section 3.6). Each entry starts with `## <YYYY-MM-DD> · <agent> · <what was done>`.

A **planned** feature has only `README.md`. The other four files are created when work starts. This avoids dozens of empty files.

### 3.6 `design/deslop.md`

Shipped by default, identical in every project, never generated. It is a ban list plus a checklist the agent runs after any UI work. The first full version is `templates/repo/context/design/deslop.md`; it grows the starting list below into five groups (color and effects, layout, icons and images, words, controls and states) and a nine-step checklist, which includes 4.5:1 contrast for body text and 3:1 for field outlines and focus rings.

Starting ban list:

- Purple or blue-to-purple gradients; gradient text.
- Emoji used as icons.
- Cards inside cards.
- The three-column grid of icon + heading + two lines.
- Glass blur and glow effects everywhere.
- Everything centered; no clear hierarchy.
- Fully rounded pills on every element.
- Heavy drop shadows on flat content.
- Fake testimonials, fake logos, fake metrics.
- Filler copy ("Build faster", "Supercharge your workflow", lorem ipsum).
- More than one primary button on a screen.
- Inconsistent spacing; values outside the project's spacing scale.
- Lists, tables, and async actions with no empty, loading, or error state.

`deslop.md` says what to avoid. `principles.md` says what to do for this project (colors, type scale, spacing scale, radius, tone). Both are required reading for UI work.

**The result goes in the log entry**, as one of four forms:

| Result | When |
|---|---|
| `Deslop: pass (<how it was checked>)` | Every item passed. The parentheses name a screenshot path or the tool used (for example "Playwright screenshots at 375px and 1280px"). A pass without them is an error |
| `Deslop: fixed <what>` | Problems were found and fixed |
| `Deslop: not verified <reason>` | The UI couldn't be rendered (no browser, no dev server), so the checklist couldn't run. The next session that can render it runs the checklist |
| `Deslop: not UI` | The task didn't touch the UI |

An agent never writes `pass` for a screen it hasn't seen. `check` rejects any other form (section 6.1).

### 3.7 `.meta.json`

- The Contextual version and creation date.
- The default branch's real name.
- The exact command the context files show for the CLI: `npx --no-install usecontextual` where it is a dev dependency, so a fresh clone without `node_modules` fails instead of downloading an unpinned copy; or a pinned `npx --yes usecontextual@<version>` when there's no `package.json` (section 6.3).
- Which skill folders were installed.
- **The last sync: its commit hash and its date.** The date survives squash merges and rebases that remove the commit from history (section 7).
- Hashes of `idea.md` and `deslop.md`, computed with line endings normalized to LF, so a Windows checkout with `core.autocrlf` does not look like an edit.
- The size caps and the token budget (section 4.3).

### 3.8 Who owns a file

Every file outside `context/` has exactly one owner:

- **A feature**, through the `covers:` globs in its README.
- **The shared list**, only for generated files (such as migrations) and UI building blocks. It is one line at the end of the Boundaries section of `context/architecture.md`, in the same glob syntax as `covers:`:

```
shared: drizzle/**, src/components/**
```

The app shell, layouts, root config and test setup are not shared: they belong to **`foundation`**, a feature `contextual-setup` adds to every project as the first item of Phase 1. Without it, the first feature built puts most of its files on the shared list (it happened in testing: 10 of 13), and `which` stops telling the agent anything.

Contextual's own files (`context/`, `AGENTS.md`, `CLAUDE.md`, the skill folders) need no owner. A file can't be covered by two features, or by a feature and the shared list; `check` reports either as an error. A changed file that has no owner at all gets a warning, "no feature owns this path" (section 6.2). `usecontextual which <path>` answers the question for one file.

---

## 4. The rules the agent follows

### 4.1 Read order (every session)

1. `AGENTS.md`
2. `context/status/<current-branch>.md` (section 3.4; `main.md` when there is none)
3. `context/features/_index.md`
4. The `README.md` of the feature in focus
5. Only then, as needed: that feature's other files, and the `stack/` and `design/` files it links to

Never read by default: other features' folders, `decisions/`, old log entries.

Target: the agent spends under roughly 3,000 tokens on context before starting work, no matter how large the project gets.

### 4.2 Definition of done (every task)

1. Add an entry to the feature's `log.md`.
2. Update the feature's `README.md` (status, acceptance boxes) and any changed facts in `build.md` / `tests.md` / `notes.md`.
3. Rewrite the status file for the current branch.
4. If the task touched UI: run the deslop checklist and record the result in the log entry, in one of the forms in section 3.6.

A task missing any of these is not done. This is an instruction in AGENTS.md, backed by a git pre-commit hook that runs `usecontextual check --staged` (section 6.2). Git does not care which agent is driving, so enforcement works in every harness, on every clone where the hook is installed.

**On a feature branch the hook blocks; on the default branch it warns. Until setup has run (no `context/idea.md`), it only warns, on every branch.** Tiny fixes (a typo, a one-line bug) can go straight on main, and people editing by hand on main are not stopped; `contextual-sync` catches the context up afterwards. On a feature branch, `git commit --no-verify` is the deliberate way past the hook.

### 4.3 Keeping context small as the project grows

- **Index, then open.** `_index.md` has one row per feature in a phase that is still open, and **one line per finished phase** ("Phase 1 — Accounts: done · auth, teams"). A phase is finished when every feature in it is shipped or deprecated. Without this, the index grows with the project's history: the other files read every session use about 2,000 tokens at their caps, which leaves room for only 30 to 40 index rows before the 3,000-token target breaks.
- **Find a file's owner without the index.** `usecontextual which <path>` prints the feature folder whose `covers:` globs match the path (including features in collapsed phases), or `shared` when the path is on the `shared:` line, or "no feature owns this path" (section 3.8). AGENTS.md tells the agent to run it before editing a path.
- **Fixed-size hot files.** Files read every session have hard caps: the AGENTS.md block about 60 lines, a status file about 40 lines, a feature README about 60 lines.
- **Growth goes where it is not read.** History lives in `log.md` files and `decisions/`, which are searched, never read whole.
- **Split when big.** `check` flags any feature file over its cap; the fix is splitting the feature into sub-features.
- **Path scoping.** Each feature declares `covers:` globs, and AGENTS.md tells the agent to open the covering feature before editing a path. Some harnesses support rule files that load when matching paths are touched; generating those from `covers:` is an optional later improvement, not a v1 requirement.

Size caps above are starting defaults and should be tuned during testing.

### 4.4 Branches

- The `context/` folder is in git, so it branches with the code. On a branch, a feature folder describes that branch's code.
- **One branch per feature** is the default, named `feat/<feature>`. Tiny fixes (typo, one-line bug) may go straight on main with no branch and no new status file; the hook only warns there (section 4.2).
- Starting a branch creates its status file (section 3.4). Different filenames per branch means no merge conflicts, and parallel agents in separate worktrees do not collide.
- Log entries use dates, not global numbers, so two branches cannot create the same id.
- `_index.md` is derived. It is rebuilt from feature READMEs and `build-plan.md` by the package and never hand-merged. On conflict, regenerate.
- On merge to main: the feature flips to `shipped`, the plan is ticked, the branch status file is deleted, and `main.md` gets a line. This is done by the `contextual-sync` skill on main.

---

## 5. Piece 1 — `contextual-plan` (chat skill)

Runs in a normal LLM chat. It only plans. It never writes the context folder.

It asks a small number of questions (five at most): the idea, who it is for, web or mobile, whether it needs accounts, whether it needs payments. It proposes a stack and a design direction, then outputs one file.

**It must also exist as a plain copy-paste prompt** on the website, so it works in any LLM and trying Contextual costs nothing. The site reads the prompt from `skills/contextual-plan/` in this repo, so there is one copy.

### Plan file format (`contextual-plan.md`)

Fixed headings, same every time, so the agent never has to guess when splitting it. The full rules (what each section holds, how setup maps it, how feature lines are written) are in `docs/plan-file.md`.

```
# <Project name>

## Idea
## Users
## Platform
## Stack
## Design direction
## Phases
### Phase 1 — <name>
- <feature>: <one line>
  - acceptance: <testable statement>
  - acceptance: <testable statement>
## Open questions
```

---

## 6. Piece 2 — `usecontextual` (npm package)

Deterministic, no AI. Works the same for new and existing projects. It runs inside git hooks, so start-up time matters: zero runtime dependencies is the goal.

| Command | What it does |
|---|---|
| `npx usecontextual init` | Adds the `AGENTS.md` block and the `CLAUDE.md` import (section 3.1), the `context/` skeleton, `deslop.md`, and the agent skills. Detects which harness folders exist (or takes a flag) and places the skills accordingly; when none are found it installs both `.agents/skills/` and `.claude/skills/`. Adds itself as a pinned dev dependency and installs the git pre-commit hook (6.3). `--preset <name>` fills `stack/`, `architecture.md` and `conventions.md` from a preset (`next`, `laravel-inertia-react`). Refuses to overwrite existing context without a flag. |
| `npx usecontextual check` | Validates the context (6.1). `--fix` repairs what is mechanical: rebuilds `_index.md`, creates a missing status file for the current branch, stores the `idea.md` hash once setup has written it. `--staged` adds the commit rule the hook uses (6.2). `--branch <name>` names the branch when git can't (CI often checks out a detached HEAD). |
| `npx usecontextual update` | Refreshes the fixed parts (the `AGENTS.md` block, `deslop.md`, both skill copies, the hook line) to the latest version without touching project content. |
| `npx usecontextual which <path>` | Prints the path's owner (section 3.8): the feature folder whose `covers:` globs match it, or `shared`. Otherwise prints "no feature owns this path" and exits with code 1. |

### 6.1 What `check` validates

- Every feature folder has a `README.md` with the required fields and a valid status value.
- Planned features have only `README.md`; in-progress and shipped features have all five files.
- `_index.md` matches the feature READMEs, including the one-line entries for finished phases.
- Every feature in `build-plan.md` has a folder, and every folder is in the plan.
- `covers:` globs match at least one file: an error for shipped features, a warning for features in progress (the work may not have created the files yet).
- Every file has at most one owner: no file is covered by two features, or by a feature and the `shared:` line (section 3.8).
- Every glob on the `shared:` line matches at least one file (warning).
- No more than a third of the files that have an owner are on the `shared:` line (warning). More means the app shell or config is being parked there instead of in `foundation`.
- When there are no files outside `context/` at all (a project before its first code, or `example/`), the three checks above are skipped with a warning that says so.
- Links between context files resolve.
- No file is over its size cap. For `AGENTS.md`, only the Contextual block counts.
- A status file exists for the current branch.
- The two skill copies are identical, and every `SKILL.md` has valid frontmatter (section 7.1). Harnesses skip a malformed skill without a word, so this is the only place the problem shows up.
- No template guidance (`<!-- fill: … -->` comments) is left in a file after setup (warning only).
- Every `Deslop:` line in a feature's `log.md` is one of the four results in section 3.6, and a `pass` says how it was checked.
- `idea.md` and `deslop.md` are unmodified (hash check; warning only).

Exit code is non-zero on errors. It runs in the git pre-commit hook that `init` installs, and can also run in CI.

### 6.2 The `--staged` rule

With `--staged`, `check` also reads `git diff --cached --name-only` and maps every staged path outside `context/` to its feature through `covers:`. When a feature's code changed but its `log.md` or the current branch's status file is not staged too, it reports a problem:

- On any branch other than the default branch, it is an error and the commit is blocked.
- On the default branch, it is a warning and the commit goes through.

A change to another feature's files counts too: that feature's `log.md` needs an entry as well, so its history shows who touched it.

Paths on the `shared:` line (section 3.8) are fine in a commit that also changes a feature. A commit that changes only shared code gets a warning, so `contextual-sync` can map it later.

A changed file that no feature covers and that isn't on the `shared:` line gets a warning: "no feature owns this path."

When the branch has no status file at all, the error says how to make one: `usecontextual check --fix` creates it from the template.

Until setup has run (no `context/idea.md`), every finding is a warning, on every branch: there's no context yet to keep in step.

A pre-commit hook cannot read the commit message, so there is no "skip" tag in messages. On a feature branch, `git commit --no-verify` is the way past the hook, on purpose.

### 6.3 Installing the hook

- **The hook calls a local, pinned copy.** `init` adds `usecontextual` as a dev dependency at an exact version, using the repo's package manager (found from its lockfile: pnpm, yarn, bun, otherwise npm). The hook runs that copy, `node_modules/.bin/usecontextual check --staged`: no npx, no network.
- **Fallback for repos with no `package.json`** (a Laravel or Python project without Node tooling): the hook calls a pinned `npx --yes usecontextual@<exact version> check --staged`.
- **Never a bare name.** `npx` skips its install prompt when no one is at the terminal, as in a git hook, so a bare `npx <name>` installs and runs whatever that name points to at the time.
- **Where it goes.** `init` asks git: `git rev-parse --git-path hooks`. That gives the right folder in a plain repo, in a worktree (the shared hooks folder), and when `core.hooksPath` is set.
- **Hook managers.** When `core.hooksPath` is set (husky, lefthook, simple-git-hooks), `init` does not write into that folder; husky, for one, regenerates its `_` folder. It adds the command to the manager's own pre-commit file (`.husky/pre-commit`), or, for a manager it doesn't know, prints the line to add.
- **An existing `pre-commit` hook** is kept. `init` appends one marked line so `update` can find it later.
- **Hooks don't travel with the repo.** A fresh clone, a teammate's checkout, Codex cloud, Claude Code on the web and CI have no hook until `init` or `update` runs there. So the rule in `AGENTS.md` is the enforcement for cloud agents, and the docs ship a CI job that runs `usecontextual check` on every pull request.

### 6.4 The package name

The package is `usecontextual`. The name `contextual` on npm belongs to an unrelated React package from 2022, and the `@contextual` scope belongs to someone else as well. The README and the site warn that `npx contextual` runs a different package. Skills and templates only ever print the command stored in `.meta.json`.

---

## 7. Piece 3 — the agent skills

Three skills in the standard `SKILL.md` format, installed into the repo by the package. They are skills, not slash commands, so the same files work in every supported harness. The person triggers them in plain words ("set up contextual", "build the next feature", "sync the context") or with the harness's explicit call (section 2).

### 7.1 Skill file rules

- The frontmatter starts on line 1 (Codex requires it) and uses only the portable fields: `name`, `description`, and optionally `license`, `compatibility`, `metadata`. Claude-only fields such as `argument-hint` are an error outside Claude Code.
- `name` equals the folder name: lowercase letters, digits and single hyphens, 64 characters at most.
- `description` is at most 1,024 characters and starts with the trigger phrases. Codex shortens descriptions when many skills are installed, so what comes first is what survives.
- Supporting files, such as the feature templates, ship inside the skill's folder.
- Each skill stays short. `SKILL.md` lists the steps in order, in about 40 lines. Detail for one step goes in `references/`, which the agent reads only when that step comes up. The templates the skill creates files from go in `assets/`, as exact copies of the files in `templates/`; tests catch a copy that drifted. Paths are one level deep (Agent Skills specification; [harnesses.md](harnesses.md)).

### `contextual-setup` — one skill, three paths

The skill detects which situation it is in:

1. **Plan file present.** Reads `contextual-plan.md`, distributes it into `build-plan.md`, feature folders (README only), `stack/`, `design/principles.md`, `architecture.md`, `conventions.md`. Adds `foundation` as the first feature of Phase 1 (section 3.8). Moves the plan file to `context/idea.md`.
2. **No plan file, empty repo.** Asks the same questions as the chat skill, writes the answers to `context/idea.md` in the plan-file format, then writes everything as in path 1.
3. **Existing code.** Scans the repo (tree, manifests, README, routes, schema), proposes a feature list with the paths each covers, **waits for the person to confirm**, then writes the context. Features found in code are marked `shipped` with `build.md` filled in; anything it inferred but did not verify is marked as such.

All three paths end by running `usecontextual check --fix` and writing the first `status/main.md`.

Path 3 is the hardest to get right (feature boundaries are easy to get wrong) and is built last. Its procedure is `skills/contextual-setup/references/existing-code.md`: features found in code get all five files and a "Found at setup" log entry; an acceptance line read in the code but not verified is ticked and ends with "(found in the code, not verified)"; `idea.md` is written from the README and the confirmed feature list.

### `contextual-next` — build the next feature

1. Read status and plan; pick the next planned feature.
2. Create branch `feat/<name>` and its status file.
3. Create the feature's `build.md`, `tests.md`, `notes.md`, `log.md`.
4. Build it, following the linked `stack/` and `design/` files.
5. Run the tests and the manual verification in `tests.md`.
6. For UI: run the deslop checklist.
7. Apply the definition of done, run `check`, stop, and report. Merging is the person's decision.

### `contextual-sync` — reconcile context with code

For when a human changed code by hand or the rule was skipped. Diff since the last sync, map changed paths to features via `covers:`, update what is affected, flag what it cannot map, rewrite status. On main after a merge, it finalizes the merged feature (section 4.4).

**Finding "since the last sync".** `.meta.json` stores the commit hash and the date of the last sync.

1. If no sync has run yet, diff from the commit that set Contextual up (the one that added `context/.meta.json`), so the first sync sees content changes too, not only added and removed files.
2. If that commit is still in the current branch's history, diff from it.
3. If it is gone (a squash merge or a rebase removed it), diff from the last commit before the stored date: `git rev-list -1 --before=<date> HEAD`.
4. If that fails too (no date stored, or no commit before it), rescan: compare every in-progress and shipped feature's `covers:` paths with its `build.md`, and update whatever no longer matches.

At the end, sync stores the new commit hash and date.

### Enforcement

A git pre-commit hook runs `usecontextual check --staged` (section 6.2). It blocks on feature branches, and warns on the default branch, when code changed but the feature log or the branch status file did not. This replaces the earlier idea of a Claude Code Stop hook, which worked in only one harness.

---

## 8. The Contextual repo (what we build)

One public repo, `mikaelendale/contextual`, with fresh history and the MIT license. The teaser site moves into it as `site/`; the site's earlier history stays in a private repo, so opening the source does not publish it.

```
contextual/
  packages/cli/              the npm package usecontextual: init, check, update, which
  skills/
    contextual-plan/         chat skill + the plain copy-paste prompt
    contextual-setup/        agent skill: the three setup paths
    contextual-next/         agent skill: build the next feature
    contextual-sync/         agent skill: reconcile context with code
  templates/                 every blank context file, plus deslop.md
  hooks/                     the git pre-commit hook
  presets/                   ready-made stacks
  example/                   one finished context folder to imitate
  docs/                      this spec, the plan-file format, the rules
  site/                      the website (Next.js), deployed from this folder
```

**Presets for v1:** Next.js, and Laravel with Inertia and React. A preset is a filled-in `stack/` folder plus matching `architecture.md` and `conventions.md` defaults.

**`example/` matters.** A model copies a finished example far better than it follows written rules. The example is a complete, small project context: "Linkboard", a team bookmarking app, using the feature-folder and per-branch-status structure. It is a snapshot of a feature branch partway through the second phase, so every kind of file is present.

---

## 9. Build order

1. **Templates and example.** Everything else depends on these. Includes `deslop.md` and the plan-file format. *Done 10 November 2026.*
2. **Agent skills**: `contextual-setup` paths 1 and 2, `contextual-next`, `contextual-sync`.
3. **Package**: `init`, `check`, `update`, `which`, harness detection, and the git hook. *Built 13 November 2026, with presets.*
4. **Chat skill** and the copy-paste prompt. *Built 13 November 2026.*
5. **`contextual-setup` path 3** (existing codebases). *Built 13 November 2026; tried on mdn/todo-react.*
6. **Testing** (section 10).
7. **Docs and launch.**

---

## 10. How we test it

Build three things with Contextual before calling it ready:

1. **Greenfield, non-technical persona.** A simple SaaS from a two-sentence idea, across five or six sessions, without reading the code. Tests the plan and status loop.
2. **Existing repo.** A real medium-sized codebase. Tests whether setup gets feature boundaries right and whether `contextual-sync` keeps up.
3. **Alternating agents.** One project, switching between Claude Code and Codex each session. Tests the handoff. Then a short run in Antigravity and in OpenCode to confirm the skills load, trigger, and follow the rules.

What to measure: tokens spent before work starts, how often the person had to re-explain something, whether status and logs were updated without being asked, and how the UI looks with and without `deslop.md`.

---

## 11. What the research says (and how it shaped the design)

- **AGENTS.md is the standard entry file** across coding agents, and it is deliberately schema-free. So Contextual uses it as the root and adds structure underneath.
- **Root instruction files must be short.** Bloated ones get ignored. The community has converged on progressive disclosure: a small root file that points to detail loaded on demand. Contextual is built around this.
- **The Cline Memory Bank** is the closest existing pattern: structured markdown files for project memory, with a rule to update them after every task. Its weakness is reading every file at the start of every task, which does not scale. Contextual reads an index and one folder.
- **Spec-driven development** (GitHub Spec Kit, Kiro) is the dominant method: write a spec, then a plan, then tasks, then code. Contextual's idea → build plan → feature acceptance is the same shape, with memory added.
- **A controlled study (Khatri, July 2026) found that context files did not improve task correctness** for Claude Code or Codex. It ran 17 merged-PR tasks from three Python repos, using each repo's own `AGENTS.md` (248 to 1,236 words; not generic or generated files), under three conditions: no file, the file always loaded, and topic files loaded on demand. Pass rates did not move, though the authors note the sample can only detect effects larger than about 30 percentage points. Failures came from implementation skill, not missing repo knowledge. Two things did change. Loading on demand cut Claude's cache-creation tokens on 11 of 11 tasks. And one concrete operational fact, "the full test suite is slow", made Claude run targeted tests instead and finish about a quarter faster (an exploratory result from one repo). Design consequence: Contextual is not a style guide. Its value is task decomposition (the plan), state that cannot be inferred from code (status, logs, decisions), concrete facts (gotchas, how a library is wired here, which tests to run and how long they take), and on-demand loading. Whether it cuts hallucinations and re-prompting is for our own testing (section 10) to show.
- **The harnesses have converged.** Codex, Antigravity, and OpenCode read `AGENTS.md`, Claude Code reads it through `CLAUDE.md`, and all four load skills in the `SKILL.md` format. Building on those two standards is what makes multi-harness support cheap. Verified 10 November 2026 (section 2).
- **pstack (Lauren Tan) and gstack (Garry Tan)** are workflow stacks: playbooks, review, verification, shipping. They define how the agent works. Contextual defines what the project is and where it stands, so it sits underneath them. Ideas borrowed: real verification over "the build passed", resume notes between sessions, and anti-slop checks.

Sources:

- AGENTS.md overview: https://tessl.io/blog/the-rise-of-agents-md-an-open-standard-and-single-source-of-truth-for-ai-coding-agents
- Context files ablation study (P. Khatri, "Do Context Files Help Coding Agents? A Two-Agent Ablation Study on Real Repositories"): https://arxiv.org/abs/2607.27250
- Cline Memory Bank: https://docs.cline.bot/features/memory-bank
- Spec-driven development tools: https://ssojet.com/blog/best-spec-driven-development-tools
- pstack deep dive: https://flaviocopes.com/pstack/
- gstack: https://github.com/garrytan/gstack
- Agent Skills specification: https://agentskills.io/specification
- Claude Code skills and memory: https://code.claude.com/docs/en/skills, https://code.claude.com/docs/en/memory
- Codex skills and AGENTS.md: https://learn.chatgpt.com/docs/build-skills, https://learn.chatgpt.com/docs/agent-configuration/agents-md
- Antigravity skills, rules, and the workflows deprecation: https://antigravity.google/docs/skills, https://antigravity.google/docs/rules, https://antigravity.google/docs/migration/workflows-to-skills
- OpenCode skills and instructions: https://opencode.ai/docs/skills/, https://opencode.ai/docs/instructions/
- npm exec (no prompt without a terminal): https://docs.npmjs.com/cli/commands/npm-exec

---

## 12. Open questions

- Final size caps for hot files (tune during testing).
- Final contents of `deslop.md`. A full first version exists; refine it during testing.
- Should `contextual-next` open a pull request, or stop at a pushed branch?
- License (MIT assumed). Confirm before the repo goes public.
- Whether old log entries need a roll-up step once a feature's `log.md` gets long.
- Should `init` also add a `prepare` script, so `npm install` puts the hook back for teammates (the way husky does it)? It would close most of the "hooks don't travel" gap, but it edits the person's `package.json` scripts.

Settled on 10 November 2026: the npm name, the skill paths for each harness, copies over symlinks, the license (MIT), and the repo (`mikaelendale/contextual`).

---

## 13. Decisions already made (do not reopen without a reason)

- Name: Contextual. Fully supported: Claude Code and Codex. Supported through standards: Antigravity and OpenCode.
- Three pieces: chat skill, npm package, agent skills.
- No zip. The handoff from chat is one markdown file.
- Feature folders, not single feature files. Planned features start with README only.
- Per-feature `log.md`, not a global worklog.
- Status is a line in each feature README plus a derived index; features never move between "new" and "existing" folders.
- One status file per branch. One branch per feature, with an exception for tiny fixes.
- `deslop.md` ships by default and is the same everywhere.
- The package does everything mechanical; the agent does everything that needs judgment.
- `idea.md` is never edited by the agent.
- Agent procedures are skills (`SKILL.md`), not slash commands.
- Enforcement is a git pre-commit hook, not a harness-specific hook.
- The npm package is `usecontextual`. The README and site warn that `npx contextual` is an unrelated package.
- One public repo with fresh history: the spec's folders at the root, the site in `site/`. The site's old history stays private.
- Skills are copied, not symlinked, into `.agents/skills/` and `.claude/skills/`, kept identical, and installed in the repo only.
- Contextual owns a marked block in `AGENTS.md`, and only that block counts toward the cap. An existing `CLAUDE.md` gets `@AGENTS.md` appended.
- The hook runs a pinned local dev dependency; a pinned `npx` only in repos with no `package.json`; never a bare name. It blocks on feature branches and warns on the default branch.
- Finished phases collapse to one line in `_index.md`, and `usecontextual which <path>` finds a file's feature.
- `.meta.json` stores the last sync's commit and date. Sync falls back from the commit, to the date, to a rescan of `covers:` paths.
- Every file has one owner: a feature's `covers:`, or the `shared:` line in `architecture.md`. A changed file with neither gets the warning "no feature owns this path."
- License: MIT, copyright Mikael Endale. Public repo: `mikaelendale/contextual`.

---

## 14. Revision history

- **13 November 2026, before publishing 0.1.0.**
  - A missing branch status file's error names the fix, `check --fix` (section 6.2).
  - Until setup has run, the hook only warns, on every branch (sections 4.2, 6.2).
  - With a `package.json`, the context files and skills use `npx --no-install usecontextual`, so a fresh clone never downloads an unpinned copy (section 3.7).
- **13 November 2026, overnight build (branch `build/v0.1`, merged in #1).**
  - The CLI's `init`, `update`, `check --staged` and the pre-commit hook (section 6). Presets for Next.js and for Laravel with Inertia and React.
  - `contextual-plan`: the chat skill and the copy-paste prompt. `contextual-setup` path 3.
  - Trials in Claude Code, Codex and OpenCode, including full runs from a packed 0.1.0 (`docs/trials/`). The harness table in section 2 now says what was tested.
  - Small rule changes from the trials: the definition of done applies to tasks on a feature; `not UI` may carry a reason; a plan may have one sentence under a phase heading.
- **13 November 2026.**
  - `deslop.md`: a ninth checklist line, 3:1 contrast for field outlines and focus rings.
  - Every project gets a first feature, `foundation`, for the app shell, layouts and config; `shared:` is only for generated files and UI building blocks, and `check` warns when more than a third of owned files are on it (sections 3.8, 6.1, 7). The example has a `foundation` feature.
  - `conventions.md` has a fixed rule: no package or tool outside the stack, not even a one-off `npx` command, without a `decisions/` record.
  - The first sync diffs from the setup commit (section 7).
- **12 November 2026.**
  - Deslop results: `pass (<how it was checked>)`, `fixed <what>`, `not verified <reason>`, `not UI`. `check` validates them (sections 3.6, 6.1).
  - Step 2 built: `contextual-setup` paths 1 and 2, `contextual-next` and `contextual-sync`, each a short `SKILL.md` with `references/` and `assets/` (section 7.1). Tried for real in Claude Code.
  - `check --fix` rebuilds the index and stores the `idea.md` hash. The plan parser ignores the sample phase in the template's comment, so a fresh repo passes `check`.
  - Harnesses checked again; findings and links in `docs/harnesses.md`. Rules for working on this repo in `docs/maintaining.md`.
- **10 November 2026, third revision.**
  - Step 1 approved.
  - Shared code is declared on a `shared:` line in `architecture.md`. A changed file with no owner gets "no feature owns this path" (sections 3.8, 6.1, 6.2).
  - `covers:` that match no files are an error for shipped features and a warning for features in progress. `check` takes `--branch`.
  - Repo: `mikaelendale/contextual`, MIT.
  - `check` and `which` started, with tests.
- **10 November 2026, second revision.**
  - Verified every harness against official docs and source (section 2).
  - Corrections: Antigravity's workflows are deprecated, not retired. The context-files study tested repos' own files on 17 tasks, not generic files (section 11).
  - The package is `usecontextual`, because `contextual` is taken (section 6.4).
  - New rules: the marked `AGENTS.md` block and existing `CLAUDE.md` files (3.1); hook behaviour, the `--staged` rule and installation (4.2, 6.2, 6.3); the collapsed index and `which` (4.3); branch and folder naming (3.4, 3.5); skill file rules (7.1); sync fallbacks (7).
  - The site moved into this repo as `site/` (section 8). Step 1 built.
- **10 November 2026, first revision.** Four-harness support, skills replace commands, git hook for enforcement.
