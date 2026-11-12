# Path 3: a project that already has code

The code is the source of truth here. Read it, propose how to split it into features, wait for the person to confirm, then write the context. Change no code.

## 1. Scan (read only)

Read, in this order, and stop reading a kind of file once you have what you need:

1. The file list (`git ls-files`), leaving out vendored, generated and lock files.
2. The manifests: `package.json`, `composer.json`, `pyproject.toml`, `go.mod`, `Gemfile` and the like. They give the stack and the scripts.
3. The README, for what the project is in its owner's words.
4. The entry points and routes: pages, route files, CLI commands, the app's root component.
5. The data: schema, migrations, models, or what's kept in browser storage.
6. The tests, the CI config and the lint setup, for how work is checked.

## 2. Propose, then wait

Write one message with:

- **The project** in one sentence, and the stack you found.
- **`foundation`**: the app shell, layouts, root config and test setup, with its `covers:` globs.
- **One feature per thing a person can do**, in kebab-case: what it does in one sentence, its `covers:` globs, its status (`shipped` if it works, `in-progress` if it's half built), and what each part of that rests on (a passing test, or only reading the code).
- **The `shared:` line**: generated files and UI building blocks only.
- **Every file with no owner** under that proposal. Aim for none.

Every code file gets exactly one owner: a feature, `foundation`, or the shared line. Then ask: "Does this split match how you think about the project? Tell me what to rename, merge or split, or say go ahead." Write nothing until the person confirms.

## 3. Write

Follow the fill order in `fill-from-plan.md`, describing what exists rather than what's planned. Then:

- **`context/idea.md`**: the project in the plan-file format (`plan-file.md`), written from the README and the confirmed feature list. Start Idea with the line "Written at setup from the existing code and README, and confirmed by the owner." From then on nobody edits it.
- **`build-plan.md`**: `## Phase 1 — What's built  [done]` with every shipped feature ticked, `foundation` first. Features still in progress go in `## Phase 2 — <name>  [in progress]`, unticked.
- **Each feature found in the code gets all five files**, from this skill's assets:
  - `README.md`: acceptance lines for what the feature does today. Tick a line you verified (a passing test covers it, or you ran it). A line you only read in the code is ticked too, but ends with "(found in the code, not verified)". A shipped feature has every box ticked.
  - `build.md`: the real files, data, routes and components.
  - `tests.md`: the test files that exist and the command that runs them. Write "None yet" when there are none.
  - `notes.md`: anything that looked broken or odd, and questions for the owner.
  - `log.md`: one entry, `## <today> · <agent> · Found at setup`, listing what you read, with `Deslop: not verified (existing UI, not reviewed at setup)`, or `Deslop: not UI`.
- **`status/main.md`**: what's built, what's half done, and the questions you raised.

Then finish as in step 4 of SKILL.md. `check` reports a shipped feature whose `covers:` match no files as an error, so fix the globs until it passes.
