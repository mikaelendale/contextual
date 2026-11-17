# What goes where

Fill the files in this order. Later files depend on choices made in earlier ones: `conventions.md` decides where code goes, and the feature READMEs' `covers:` paths follow from it.

If `init` used a preset (`context/stack/_index.md` says "Preset: …"), `stack/`, `architecture.md` and `conventions.md` already hold its defaults. Keep them, fill the remaining comments from the plan, and change a default only where the plan says otherwise.

**If the repo already has code** (a scaffold, a framework's starter, an app): read its package manifest (`package.json`, `composer.json`, `pyproject.toml`, `go.mod`, `Gemfile`, `Cargo.toml` and the like) and look at its folders before you start. Everything installed goes in `stack/`, even when the plan's Stack doesn't name it, and the existing files get owners, as step 7 says. Change no code.

Every project gets one feature the plan doesn't list: **`foundation`**, always the first item of Phase 1. It owns the app shell, the layouts, the config files at the repo root and the test setup, so that code has a real owner instead of piling up on the `shared:` line.

## 1. `AGENTS.md`

Replace the `<!-- fill: … -->` comment at the top of the file with `# <Project name>` and, on the next line, one sentence saying what the project is, taken from Idea. If the file already starts with a `# ` heading, leave it. The heading stays at the very top, above every block another tool manages (such as `<!-- BEGIN:nextjs-agent-rules -->`), and never inside one. Don't touch anything between the Contextual markers, or another tool's markers.

## 2. `context/stack/`

- `_index.md`: one table row per Stack line: Layer | Choice | Notes. Then one row for each tool already installed in the repo that the plan didn't name (from the package manifest: the framework, UI kit, styling, linting, formatting, testing), with "Already in the repo" in Notes, so the packages-and-tools rule in `conventions.md` allows them. Link to a notes file only if you create one.
- `overview.md`: one short paragraph per layer, saying what it is and why it was picked. Use the plan's reason when it gives one.
- `requirements.md`: the runtime and versions, the outside accounts needed, the environment variables (names only, never values), and the exact commands from a fresh clone to a running app. Write "None" for a section that has nothing, such as no accounts.
- `deploy.md`: where it runs and how a change ships. If hosting isn't decided, write "Not decided yet" under each heading and add the question to `questions.md` (step 9).
- Create `stack/<lib>.md`, from this skill's `assets/stack-lib.md`, only for a library that needs notes about how this repo wires it. At setup that's usually none.

## 3. `context/conventions.md`

From the stack: the lint and format commands (or "None yet"), **where new code goes** (folders per feature, the app shell and config, which `foundation` owns, and the folder for UI building blocks), naming, the test tools and the exact command to run one feature's tests, the git rules (`feat/<feature>` branches; tiny fixes may go straight on the default branch; the person merges), and how errors reach the user. Keep the template's "Packages and tools" section exactly as it is.

## 4. `context/architecture.md`

Describe the system as planned. It's fine that nothing is built yet: say "Planned" where it helps. Overview, Parts, How a request flows (one user action, step by step, with the file paths it will use), Data (what is stored, where, and which feature owns it), Outside services ("None" if none).

End Boundaries with the `shared:` line, in the same glob form as `covers:`. It lists only generated files (such as migrations) and UI building blocks (such as a `components/` folder). The app shell, layout and config go in `foundation`'s `covers:`, not here. Make sure no feature's `covers:` overlaps the line. If the stack has neither generated files nor UI building blocks yet, leave the line as `shared:` with nothing after it.

## 5. `context/design/`

- `principles.md`: from Design direction and Users. If Design direction lists References (a guideline in the repo, a design system, links), read them first and take every value they set; mark those `given`. Turn the rest of the plain words into concrete values, marked `proposed`: color tokens with hex values, and each one's contrast against the background: at least 4.5:1 for body and muted text, and at least 3:1 for anything that marks a control, such as a field's outline or a focus ring. Compute each ratio with `<cli> contrast <color> <color>`; never estimate one, because `check` recomputes them. Then font families, a type scale, a spacing scale, corner radius, motion, icons, and the words' tone. Under Look and feel, name the references and say that proposed values can be changed. If the person mentions a guideline only after setup, update the values it sets and mark them given.
- `layouts.md`: one section for each page template the Phase 1 features need, with its structure from top to bottom. Include where the empty, loading and error states go.
- `components.md`: keep the table header. Under it write "None yet. Add a row when you build a shared component."

## 6. `context/build-plan.md`

One section per phase, in order, all `[planned]`:

```
## Phase 1 — The list  [planned]
- [ ] features/foundation
- [ ] features/add-items
- [ ] features/check-off-items
```

The heading is `## Phase <n> — <name>`, with an em dash, then two spaces and the marker. Items are `- [ ] features/<folder>`, in the plan's order, after `- [ ] features/foundation` at the top of Phase 1. Delete the template comment.

## 7. `context/features/<folder>/README.md`, one per feature

Create a folder for every feature in every phase, named after the feature in kebab-case (`Check off items` becomes `check-off-items`). Each folder gets only `README.md`, from this skill's `assets/feature-README.md`:

- `status: planned`. `phase:` the phase number.
- `covers:` the paths this feature's code will live in, following `conventions.md`. No path may belong to two features, and none may be on the `shared:` line. For features in Phase 1 and Phase 2, write the paths. For later phases, write paths only when they're clear; otherwise `covers: not decided yet`, and `contextual-next` decides them before building. Never invent paths just to fill the line.
- If the repo already has code, give each existing file an owner the way [existing-code.md](existing-code.md) does: the scaffold, root config, layouts and global styles to `foundation`, and any finished part of the app to the feature it is. Then `<cli> which --unowned` should list nothing.
- `depends-on:` the features it needs built first (folder names), or `none`.
- What it does: the first sentence must make sense alone, because it becomes the feature's line in the index. Up to three more sentences.
- Acceptance: one `- [ ] ` checkbox per acceptance line in the plan, in the plan's words.

`foundation/README.md` is written the same way, from what the plan implies rather than from feature lines:

- `covers:` the root config files (`*`), the app shell and layouts, global styles and the test setup, as `conventions.md` places them. `depends-on: none`.
- What it does: "The app shell every other feature builds on: …", naming what it sets up for this stack.
- Acceptance: two to four lines anyone can check, taken from Platform, Stack and Design direction. For example: the steps in `stack/requirements.md` end with the app open; the main layout matches `design/layouts.md` at 375px and at desktop width; a must-have such as working offline actually works.

Every other Phase 1 feature has `foundation` in its `depends-on:`.

## 8. `context/status/main.md`

- Updated: today's date, and you as the agent (`claude-code`, `codex`, `antigravity` or `opencode`).
- Current phase: Phase 1 and its features. Nothing is built yet.
- Recently merged: "Nothing yet."
- Blocked / needs a human: only the questions in `questions.md` that block `foundation` or the first feature. "Nothing." if there are none.
- Next: `foundation`, then the first feature of Phase 1.

Keep it under 40 lines.

## 9. `context/questions.md`

Every Open question from the plan, and everything you marked "Not decided yet", one line each, under the heading that fits:

- **For the owner**: questions about the product that only the person can answer.
- **Proposed by the agent**: technical choices you can make yourself, such as a test tool or how migrations run. Make the choice, record it in `decisions/` (step 10), and list it here so the owner can overrule it.

End each line with the feature it blocks (`blocks checkout`), or `blocks nothing yet`. Write "Nothing." under a heading with no lines.

## 10. `context/decisions/`

If the plan chose between real alternatives and gave a reason (say, local storage over a database), record it as `YYYY-MM-DD-<slug>.md`, from this skill's `assets/decision.md`. Record each choice you proposed in step 9 the same way. Skip this when there were no such choices.
