import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { rmSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

import { check } from "../src/check.js"
import { addCode, bin, copyExample, describe, edit, errorsIn, example, warningsIn, write } from "./helpers.js"

const hasError = (dir, pattern, branch) => {
  const errors = errorsIn(dir, branch)
  assert.ok(
    errors.some((e) => pattern.test(`${e.file ?? ""}: ${e.message}`)),
    `expected an error matching ${pattern}, got:\n${describe(errors)}`,
  )
}

// --- the example is the reference: it must pass

test("check passes on example/ with 0 errors", () => {
  const { findings } = check({ root: example, branch: "feat/boards" })
  const errors = findings.filter((f) => f.level === "error")
  assert.deepEqual(errors, [], describe(errors))
})

test("on example/, the only warnings are the expected ones: no app code, no skills yet", () => {
  const warnings = warningsIn(example)
  assert.equal(warnings.length, 2, describe(warnings))
  assert.match(warnings.map((w) => w.message).join("\n"), /found no code outside context\//)
  assert.match(warnings.map((w) => w.message).join("\n"), /skills aren't installed/)
})

test("the CLI exits 0 on example/ and prints the summary", () => {
  const run = spawnSync(process.execPath, [bin, "check", "--branch", "feat/boards"], { cwd: example, encoding: "utf8" })
  assert.equal(run.status, 0, run.stdout + run.stderr)
  assert.match(run.stdout, /0 errors, 2 warnings/)
})

test("the CLI finds the project root from a subfolder", () => {
  const run = spawnSync(process.execPath, [bin, "check", "--branch", "feat/boards"], { cwd: join(example, "context", "features"), encoding: "utf8" })
  assert.equal(run.status, 0, run.stdout + run.stderr)
})

test("the CLI exits 1 when there are errors", () => {
  const dir = copyExample()
  edit(dir, "context/features/boards/README.md", (t) => t.replace("status: in-progress", "status: doing"))
  const run = spawnSync(process.execPath, [bin, "check", "--branch", "feat/boards"], { cwd: dir, encoding: "utf8" })
  assert.equal(run.status, 1, run.stdout + run.stderr)
})

// --- each rule catches a real break (spec 6.1)

test("a status that isn't one of the four", () => {
  const dir = copyExample()
  edit(dir, "context/features/boards/README.md", (t) => t.replace("status: in-progress", "status: doing"))
  hasError(dir, /boards\/README\.md: has status "doing"/)
})

test("a README missing a required line", () => {
  const dir = copyExample()
  edit(dir, "context/features/links/README.md", (t) => t.replace(/^depends-on: .*\n/m, ""))
  hasError(dir, /links\/README\.md: is missing its "depends-on:" line/)
})

test("an in-progress feature missing one of its five files", () => {
  const dir = copyExample()
  rmSync(join(dir, "context/features/boards/tests.md"))
  hasError(dir, /boards\/tests\.md: is missing/)
})

test("a planned feature with more than its README", () => {
  const dir = copyExample()
  write(dir, "context/features/search/build.md", "# Build — Search\n")
  hasError(dir, /search\/build\.md: shouldn't exist yet/)
})

test("a shipped feature with an unticked acceptance box", () => {
  const dir = copyExample()
  edit(dir, "context/features/links/README.md", (t) => t.replace("- [x] Pasting a URL", "- [ ] Pasting a URL"))
  hasError(dir, /links\/README\.md: is shipped, but 1 acceptance box/)
})

test("a dependency on a feature that doesn't exist", () => {
  const dir = copyExample()
  edit(dir, "context/features/search/README.md", (t) => t.replace("depends-on: links, boards", "depends-on: links, tags"))
  hasError(dir, /depends on "tags"/)
})

test("a feature README over its line cap", () => {
  const dir = copyExample()
  edit(dir, "context/features/search/README.md", (t) => t + "\nmore\n".repeat(60))
  hasError(dir, /search\/README\.md: is \d+ lines; the cap is 60/)
})

test("an index that no longer matches the READMEs", () => {
  const dir = copyExample()
  edit(dir, "context/features/boards/README.md", (t) => t.replace("Boards group a team's links by topic", "Boards collect a team's links by topic"))
  hasError(dir, /_index\.md: is out of date/)
})

test("a feature folder missing from the build plan", () => {
  const dir = copyExample()
  edit(dir, "context/build-plan.md", (t) => t.replace("- [ ] features/search\n", ""))
  hasError(dir, /features\/search: isn't in build-plan\.md/)
})

test("a plan item with no folder", () => {
  const dir = copyExample()
  edit(dir, "context/build-plan.md", (t) => t.replace("- [ ] features/search\n", "- [ ] features/search\n- [ ] features/tags\n"))
  hasError(dir, /lists features\/tags, which has no folder/)
})

test("a ticked plan item whose feature isn't shipped", () => {
  const dir = copyExample()
  edit(dir, "context/build-plan.md", (t) => t.replace("- [ ] features/boards", "- [x] features/boards"))
  hasError(dir, /features\/boards is ticked, but its status is in-progress/)
})

test("a finished phase not marked done", () => {
  const dir = copyExample()
  edit(dir, "context/build-plan.md", (t) => t.replace("Phase 1 — Accounts  [done]", "Phase 1 — Accounts  [in progress]"))
  hasError(dir, /every feature in Phase 1 is finished; mark it \[done\]/)
})

test("a feature whose README phase disagrees with the plan", () => {
  const dir = copyExample()
  edit(dir, "context/features/search/README.md", (t) => t.replace("phase: 3", "phase: 2"))
  hasError(dir, /search\/README\.md: says phase 2, but build-plan\.md has it in phase 3/)
})

test("a status file over its line cap", () => {
  const dir = copyExample()
  edit(dir, "context/status/feat-boards.md", (t) => t + "- more\n".repeat(30))
  hasError(dir, /status\/feat-boards\.md: is \d+ lines; the cap is 40/)
})

test("a branch with no status file", () => {
  const dir = copyExample()
  hasError(dir, /status\/feat-search\.md: is missing/, "feat/search")
})

test("the default branch uses main.md", () => {
  const dir = copyExample()
  const errors = errorsIn(dir, "main")
  assert.ok(!errors.some((e) => /status\//.test(e.file ?? "")), describe(errors))
})

test("AGENTS.md without the Contextual block", () => {
  const dir = copyExample()
  edit(dir, "AGENTS.md", (t) => t.replace("<!-- contextual:start -->", ""))
  hasError(dir, /AGENTS\.md: has no Contextual block/)
})

test("an AGENTS.md block over its line cap", () => {
  const dir = copyExample()
  edit(dir, "AGENTS.md", (t) => t.replace("<!-- contextual:end -->", "- more\n".repeat(30) + "<!-- contextual:end -->"))
  hasError(dir, /AGENTS\.md: the Contextual block is \d+ lines; the cap is 60/)
})

test("text outside the block doesn't count toward the cap", () => {
  const dir = copyExample()
  edit(dir, "AGENTS.md", (t) => t + "\n## Notes from another tool\n" + "- line\n".repeat(80))
  assert.deepEqual(errorsIn(dir), [])
})

test("CLAUDE.md that doesn't import AGENTS.md", () => {
  const dir = copyExample()
  edit(dir, "CLAUDE.md", () => "# Claude notes\n")
  hasError(dir, /CLAUDE\.md: doesn't import AGENTS\.md/)
})

test("a broken link between context files", () => {
  const dir = copyExample()
  edit(dir, "context/stack/_index.md", (t) => t.replace("[drizzle.md](drizzle.md)", "[drizzle.md](orm.md)"))
  hasError(dir, /stack\/_index\.md: links to orm\.md, which doesn't exist/)
})

test(".meta.json without the last sync's date", () => {
  const dir = copyExample()
  edit(dir, "context/.meta.json", (t) => t.replace(/,\s*"date": "[^"]+"/, ""))
  hasError(dir, /"lastSync" needs both "commit" and "date"/)
})

test("an edited idea.md is a warning, not an error", () => {
  const dir = copyExample()
  edit(dir, "context/idea.md", (t) => t.replace("My team keeps losing", "Our team keeps losing"))
  assert.deepEqual(errorsIn(dir), [])
  assert.ok(warningsIn(dir).some((w) => /idea\.md/.test(w.file ?? "") && /changed since setup/.test(w.message)))
})

// --- ownership: covers and shared (spec 3.8)

test("with code present, the example passes the ownership checks too", () => {
  const dir = copyExample()
  addCode(dir)
  const { findings } = check({ root: dir, branch: "feat/boards" })
  const errors = findings.filter((f) => f.level === "error")
  assert.deepEqual(errors, [], describe(errors))
  assert.ok(!findings.some((f) => /found no code|matches no files/.test(f.message)), describe(findings))
})

test("a file covered by two features", () => {
  const dir = copyExample()
  addCode(dir)
  edit(dir, "context/features/links/README.md", (t) => t.replace("covers: src/features/links/**", "covers: src/features/links/**, src/features/boards/**"))
  hasError(dir, /is covered by more than one feature: boards, links/)
})

test("a file covered by a feature and on the shared: line", () => {
  const dir = copyExample()
  addCode(dir)
  edit(dir, "context/architecture.md", (t) => t.replace("shared: *,", "shared: *, src/features/links/**,"))
  hasError(dir, /is covered by links and is also on the shared: line/)
})

test("a shipped feature whose covers: matches nothing is an error; in progress, a warning", () => {
  const dir = copyExample()
  addCode(dir)
  edit(dir, "context/features/links/README.md", (t) => t.replace("covers: src/features/links/**", "covers: src/features/links/**, src/legacy/**"))
  edit(dir, "context/features/boards/README.md", (t) => t.replace("covers: src/features/boards/**", "covers: src/features/boards/**, src/boards-v2/**"))
  hasError(dir, /links\/README\.md: covers src\/legacy\/\*\*, which matches no files/)
  assert.ok(warningsIn(dir).some((w) => /covers src\/boards-v2\/\*\*, which matches no files/.test(w.message)))
})

test("a shared: glob that matches nothing is a warning", () => {
  const dir = copyExample()
  addCode(dir)
  edit(dir, "context/architecture.md", (t) => t.replace("shared: *,", "shared: *, scripts/**,"))
  assert.ok(warningsIn(dir).some((w) => /shared: scripts\/\*\* matches no files/.test(w.message)))
})

// --- skills (spec 7.1)

const skill = (name, description) => `---\nname: ${name}\ndescription: ${description}\n---\n\n# ${name}\n`

test("valid, identical skill copies pass", () => {
  const dir = copyExample()
  for (const d of [".agents/skills", ".claude/skills"]) write(dir, `${d}/contextual-next/SKILL.md`, skill("contextual-next", "Use when the person says build the next feature."))
  const findings = check({ root: dir, branch: "feat/boards" }).findings
  assert.ok(!findings.some((f) => /skill/i.test(`${f.file} ${f.message}`)), describe(findings))
})

test("skill copies that differ", () => {
  const dir = copyExample()
  write(dir, ".agents/skills/contextual-next/SKILL.md", skill("contextual-next", "Use when the person says build the next feature."))
  write(dir, ".claude/skills/contextual-next/SKILL.md", skill("contextual-next", "Builds the next feature."))
  hasError(dir, /\.claude\/skills\/contextual-next\/SKILL\.md: differs from/)
})

test("a skill whose name doesn't match its folder, or uses a Claude-only field", () => {
  const dir = copyExample()
  const text = "---\nname: next\ndescription: Builds the next feature.\nargument-hint: feature\n---\n"
  for (const d of [".agents/skills", ".claude/skills"]) write(dir, `${d}/contextual-next/SKILL.md`, text)
  hasError(dir, /name "next" must equal the folder name "contextual-next"/)
  hasError(dir, /uses "argument-hint"/)
})
