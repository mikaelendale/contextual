---
name: contextual-next
description: Use when the person says "build the next feature", "next feature", "keep building" or "continue the build", or names a planned feature to build. Picks the next feature from context/, builds it on its own feat/<name> branch, verifies it, records it in the context, and stops for review.
license: MIT
---

# Build the next feature

If you haven't this session, do the start-of-session read in `AGENTS.md` first. `<cli>` below is the `cli` value in `context/.meta.json`.

## 1. Pick the feature

- On a `feat/<name>` branch: keep working on that feature. Its status file says where it stands. Don't start another one.
- On the default branch: take the feature the person named, or else the first unticked `- [ ] features/<folder>` in `context/build-plan.md`, reading phases in order, whose `depends-on` features are all shipped. If a named feature's dependencies aren't shipped, say so and ask.
- Nothing left to build: say so and stop.
- The working tree must be clean before you branch. If it isn't, ask the person what to do with the changes.

## 2. Start the branch

1. `git switch -c feat/<folder>` from the default branch.
2. Create `context/status/feat-<folder>.md` from [assets/status-branch.md](assets/status-branch.md).
3. Create the feature's `build.md`, `tests.md`, `notes.md` and `log.md` from this skill's `assets/feature-*.md`, as [references/feature-files.md](references/feature-files.md) describes. Fill `build.md` and `tests.md` with your plan before writing code.
4. In the feature's `README.md`, set `status: in-progress`. In `context/build-plan.md`, set the phase's marker to `[in progress]` and put `← current` after the item.

## 3. Build it

- Work through the README's acceptance lines in order. Read the `stack/` and `design/` files that `build.md` links to before the code they cover.
- Before editing any file, run `<cli> which <path>` and follow the rule in `AGENTS.md`.
- Write a test for each acceptance line you can test in code, before or with the code. Follow `context/conventions.md`.
- When a product decision isn't clear, ask. Don't guess. Note the question under Open questions in `notes.md` and under "Blocked / needs a human" in the status file.
- When you choose between real alternatives, record it in `context/decisions/` from [assets/decision.md](assets/decision.md). When a library surprised you, add it to `context/stack/<lib>.md` from [assets/stack-lib.md](assets/stack-lib.md).

## 4. Verify it

Follow [references/verify.md](references/verify.md). Tick an acceptance box only after you've seen it work. If the task touched UI, run the checklist in `context/design/deslop.md` and record the result in one of its four forms. Never write `pass` for a screen you haven't seen.

## 5. Finish

1. Apply the definition of done in `AGENTS.md`: log entry, README, the other feature files, the status file, the deslop result.
2. Run `<cli> check --fix`, then fix what it reports until there are 0 errors.
3. Commit on the feature branch. Don't merge, and don't push unless the person asks.
4. Stop and report: what you built, how you verified it, what's left, and the questions waiting for the person. Merging is their decision. After the merge, "sync the context" on the default branch marks the feature shipped.
