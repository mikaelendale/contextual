// check --staged, in real git repos. The hook itself is in hook.test.js, update in update.test.js.
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { rmSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

import { STAGED_ERRORS_EXIT } from "../src/hook.js"
import { addCode, bin, commitAll, copyExample, edit, gitIn, write } from "./helpers.js"

const run = (args, cwd) => spawnSync(process.execPath, [bin, ...args], { cwd, encoding: "utf8" })

/** The example as a git repo: code for every covers: glob, committed on main, then on feat/boards. */
function exampleRepo() {
  const dir = copyExample()
  addCode(dir)
  commitAll(dir)
  gitIn(dir, ["switch", "-q", "-c", "feat/boards"])
  return dir
}
const stage = (dir, ...paths) => gitIn(dir, ["add", "--", ...paths])

test("--staged on a feature branch: code without its log entry and status file is an error", () => {
  const dir = exampleRepo()
  edit(dir, "src/features/boards/sample.ts", (t) => t + "// changed\n")
  stage(dir, "src/features/boards/sample.ts")
  const result = run(["check", "--staged"], dir)
  assert.equal(result.status, STAGED_ERRORS_EXIT, result.stdout)
  assert.match(result.stdout, /error {4}context\/features\/boards\/log\.md: isn't in this commit, but boards's code is/)
  assert.match(result.stdout, /error {4}context\/status\/feat-boards\.md: isn't in this commit/)
})

test("--staged passes when the log entry and the status file are in the commit", () => {
  const dir = exampleRepo()
  edit(dir, "src/features/boards/sample.ts", (t) => t + "// changed\n")
  edit(dir, "context/features/boards/log.md", (t) => t.replace("Newest first. One entry per task.\n", "Newest first. One entry per task.\n\n## 2026-11-13 · claude-code · A change\n- Changed: sample.ts.\n- Tests: none.\n- Left open: nothing.\n- Deslop: not UI\n"))
  edit(dir, "context/status/feat-boards.md", (t) => t.replace("Updated: 2026-11-08", "Updated: 2026-11-13"))
  stage(dir, "src/features/boards/sample.ts", "context/features/boards/log.md", "context/status/feat-boards.md")
  const result = run(["check", "--staged"], dir)
  assert.equal(result.status, 0, result.stdout)
  assert.match(result.stdout, /0 errors/)
})

test("--staged: touching another feature's code needs that feature's log entry too", () => {
  const dir = exampleRepo()
  edit(dir, "src/features/links/sample.ts", (t) => t + "// changed from boards\n")
  stage(dir, "src/features/links/sample.ts", "context/status/feat-boards.md")
  const result = run(["check", "--staged"], dir)
  assert.equal(result.status, STAGED_ERRORS_EXIT)
  assert.match(result.stdout, /context\/features\/links\/log\.md: isn't in this commit, but links's code is/)
})

test("--staged: a file no one owns, and a commit of only shared code, are warnings", () => {
  const dir = exampleRepo()
  write(dir, "scripts/seed.ts", "// new\n")
  edit(dir, "src/components/sample.ts", (t) => t + "// changed\n")
  stage(dir, "scripts/seed.ts", "src/components/sample.ts")
  const result = run(["check", "--staged"], dir)
  assert.equal(result.status, 0, result.stdout)
  assert.match(result.stdout, /warning {2}scripts\/seed\.ts: no feature owns this path/)
  assert.match(result.stdout, /this commit changes only shared code/)
})

test("--staged on the default branch warns instead of blocking", () => {
  const dir = exampleRepo()
  gitIn(dir, ["switch", "-q", "main"])
  edit(dir, "src/features/teams/sample.ts", (t) => t + "// a one-line fix\n")
  stage(dir, "src/features/teams/sample.ts")
  const result = run(["check", "--staged"], dir)
  assert.equal(result.status, 0, result.stdout)
  assert.match(result.stdout, /warning {2}context\/features\/teams\/log\.md: isn't in this commit/)
})

test("the error for a branch with no status file names the fix: check --fix", () => {
  const dir = exampleRepo()
  gitIn(dir, ["switch", "-q", "-c", "feat/link-preview"])
  edit(dir, "src/features/boards/sample.ts", (t) => t + "// changed\n")
  edit(dir, "context/features/boards/log.md", (t) => t + "\n")
  stage(dir, "src/features/boards/sample.ts", "context/features/boards/log.md")
  const result = run(["check", "--staged"], dir)
  assert.equal(result.status, STAGED_ERRORS_EXIT, result.stdout)
  assert.match(result.stdout, /error {4}context\/status\/feat-link-preview\.md: is missing: the branch feat\/link-preview needs its status file\. Run `npx --no-install usecontextual check --fix` to create it/)
  assert.match(result.stdout, /context\/status\/feat-link-preview\.md: doesn't exist\. Run `npx --no-install usecontextual check --fix` to create it/)
  assert.equal(run(["check", "--fix", "--staged"], dir).stdout.split("\n")[0], "fixed: created context/status/feat-link-preview.md from the template")
})

test("until setup has run (no context/idea.md), the hook only warns, even on a feature branch", () => {
  const dir = copyExample()
  addCode(dir)
  rmSync(join(dir, "context", "idea.md"))
  commitAll(dir)
  gitIn(dir, ["switch", "-q", "-c", "feat/boards"])
  edit(dir, "src/features/boards/sample.ts", (t) => t + "// changed\n")
  stage(dir, "src/features/boards/sample.ts")
  const result = run(["check", "--staged"], dir)
  assert.equal(result.status, 0, result.stdout)
  assert.match(result.stdout, /warning {2}context\/features\/boards\/log\.md: isn't in this commit/)
  assert.match(result.stdout, /setup hasn't run yet \(no context\/idea\.md\), so this check only warns/)
  assert.match(result.stdout, /0 errors/)
})
