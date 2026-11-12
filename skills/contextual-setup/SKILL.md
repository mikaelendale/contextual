---
name: contextual-setup
description: Use when the person says "set up contextual", "set up the context", "fill in the context" or "plan this project", or right after `usecontextual init`. Writes the project's context in context/ for the first time, from contextual-plan.md when there is one, or from a few questions when the repo is empty.
license: MIT
---

# Set up the project context

`usecontextual init` laid down `AGENTS.md`, `CLAUDE.md` and the `context/` skeleton. Every place that needs content holds a `<!-- fill: … -->` comment. This skill replaces each comment with the project's real content and deletes the comment.

First read `context/.meta.json`. Its `cli` value is the command that runs the CLI in this repo, written `<cli>` below.

## 1. Find the path

Look at what's in the repo, ignoring `.git/`, `context/`, `AGENTS.md`, `CLAUDE.md`, the skill folders and what `init` added (a `package.json` whose only dependency is `usecontextual`, its lockfile, `node_modules/`, `.gitignore`).

- `context/idea.md` exists: setup already ran. Stop, and ask what the person wants changed.
- `contextual-plan.md` is at the repo root: **path 1**. Go to step 3.
- No plan file and nothing else in the repo: **path 2**. Go to step 2.
- No plan file, but there is code: this is an existing project, and that path isn't available yet. Say so and stop. Don't invent a plan from the code.

## 2. Path 2: ask, then write the plan

1. Ask the questions in [references/questions.md](references/questions.md), all in one message. Then wait for the answers.
2. Write `contextual-plan.md` at the repo root from the answers. Start from [assets/contextual-plan.md](assets/contextual-plan.md) and follow the format in [references/plan-file.md](references/plan-file.md). Keep the person's own words in Idea and Users.
3. Show the plan and ask the person to confirm it or say what to change. Don't write anything in `context/` until they confirm.

## 3. Write the context from the plan

Read `contextual-plan.md` in full. Then fill the files in the order given in [references/fill-from-plan.md](references/fill-from-plan.md), which says what goes where. Always add a first feature the plan doesn't list, `foundation`: it owns the app shell, layouts and config. Rules for every file:

- Keep every heading the template has, in order. Delete each `<!-- fill: … -->` comment once its content is written.
- Write only what the plan says or what follows directly from it. When something isn't decided, write "Not decided yet" and add the question to "Blocked / needs a human" in `context/status/main.md`.
- Never edit between `<!-- contextual:start -->` and `<!-- contextual:end -->` in `AGENTS.md`, and never edit `context/design/deslop.md` or `context/features/_index.md`.

## 4. Finish

1. Move `contextual-plan.md` to `context/idea.md` without changing a character: plain `mv`, or `git mv` if `git ls-files contextual-plan.md` lists it. Then check that `context/idea.md` exists and the plan file is gone. From now on nobody edits `idea.md`.
2. Run `<cli> check --fix`. It rebuilds the feature index and stores the hash of `idea.md`. Then fix every error it reports and run it again, until there are 0 errors. Before any code exists, these warnings are expected: no code outside `context/`, and `shared:` paths that match no files yet.
3. If this is a git repo, commit everything setup wrote, plus what `init` added, as one commit on the default branch: `Set up Contextual`. Skip this if the person said not to commit.
4. Tell the person, in a few lines, what you wrote, the open questions waiting for them, and that "build the next feature" starts Phase 1.
