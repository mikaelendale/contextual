# What goes where

Fill the files in this order. Later files depend on choices made in earlier ones: `conventions.md` decides where code goes, and the feature READMEs' `covers:` paths follow from it.

## 1. `AGENTS.md`

Replace the comment above the Contextual block with `# <Project name>` and, on the next line, one sentence saying what the project is, taken from Idea. Don't touch anything between the markers.

## 2. `context/stack/`

- `_index.md`: one table row per Stack line: Layer | Choice | Notes. Link to a notes file only if you create one.
- `overview.md`: one short paragraph per layer, saying what it is and why it was picked. Use the plan's reason when it gives one.
- `requirements.md`: the runtime and versions, the outside accounts needed, the environment variables (names only, never values), and the exact commands from a fresh clone to a running app. Write "None" for a section that has nothing, such as no accounts.
- `deploy.md`: where it runs and how a change ships. If hosting isn't decided, write "Not decided yet" under each heading and add the question to `status/main.md`.
- Create `stack/<lib>.md`, from this skill's `assets/stack-lib.md`, only for a library that needs notes about how this repo wires it. At setup that's usually none.

## 3. `context/conventions.md`

From the stack: the lint and format commands (or "None yet"), **where new code goes** (folders per feature, shared folders), naming, the test tools and the exact command to run one feature's tests, the git rules (`feat/<feature>` branches; tiny fixes may go straight on the default branch; the person merges), and how errors reach the user.

## 4. `context/architecture.md`

Describe the system as planned. It's fine that nothing is built yet: say "Planned" where it helps. Overview, Parts, How a request flows (one user action, step by step, with the file paths it will use), Data (what is stored, where, and which feature owns it), Outside services ("None" if none).

End Boundaries with the `shared:` line: the paths no single feature will own, in the same glob form as `covers:`. For example, root config files (`*`), the app shell, shared UI and styles. Make sure no feature's `covers:` overlaps them.

## 5. `context/design/`

- `principles.md`: from Design direction and Users. Turn the plain words into concrete values: color tokens with hex values and the contrast of muted text on the background (at least 4.5:1 for body text), font families, a type scale, a spacing scale, corner radius, motion, icons, and the words' tone. Say once, under Look and feel, that the values were proposed at setup and can be changed.
- `layouts.md`: one section for each page template the Phase 1 features need, with its structure from top to bottom. Include where the empty, loading and error states go.
- `components.md`: keep the table header. Under it write "None yet. Add a row when you build a shared component."

## 6. `context/build-plan.md`

One section per phase, in order, all `[planned]`:

```
## Phase 1 — The list  [planned]
- [ ] features/add-items
- [ ] features/check-off-items
```

The heading is `## Phase <n> — <name>`, with an em dash, then two spaces and the marker. Items are `- [ ] features/<folder>`, in the plan's order. Delete the template comment.

## 7. `context/features/<folder>/README.md`, one per feature

Create a folder for every feature in every phase, named after the feature in kebab-case (`Check off items` becomes `check-off-items`). Each folder gets only `README.md`, from this skill's `assets/feature-README.md`:

- `status: planned`. `phase:` the phase number.
- `covers:` the paths this feature's code will live in, following `conventions.md`. Every feature needs at least one path, no path may belong to two features, and none may be on the `shared:` line.
- `depends-on:` the features it needs built first (folder names), or `none`.
- What it does: the first sentence must make sense alone, because it becomes the feature's line in the index. Up to three more sentences.
- Acceptance: one `- [ ] ` checkbox per acceptance line in the plan, in the plan's words.

## 8. `context/status/main.md`

- Updated: today's date, and you as the agent (`claude-code`, `codex`, `antigravity` or `opencode`).
- Current phase: Phase 1 and its features. Nothing is built yet.
- Recently merged: "Nothing yet."
- Blocked / needs a human: every Open question from the plan, plus anything you marked "Not decided yet". "Nothing." if there are none.
- Next: the first feature of Phase 1, and why it comes first.

Keep it under 40 lines.

## 9. `context/decisions/`

If the plan chose between real alternatives and gave a reason (say, local storage over a database), record it as `YYYY-MM-DD-<slug>.md`, from this skill's `assets/decision.md`. Skip this when there were no such choices.
