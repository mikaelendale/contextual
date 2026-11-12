// update, check --staged and the hook, in real git repos.
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { chmodSync, mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

import { readText } from "../src/context.js"
import { addCode, bin, commitAll, copyExample, edit, gitIn, repoRoot, tempRepo, write } from "./helpers.js"

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

test("update refreshes Contextual's own files and nothing else", () => {
  const dir = tempRepo()
  run(["init"], dir)
  edit(dir, "AGENTS.md", (t) => t.replace("## Project memory", "## Project memory (old)"))
  edit(dir, "context/design/deslop.md", (t) => t + "\nA local change.\n")
  write(dir, ".claude/skills/contextual-next/SKILL.md", "stale\n")
  edit(dir, "context/status/main.md", () => "# Status — main\nProject content.\n")
  write(dir, "context/features/a/README.md", "# A\nProject content.\n")
  const result = run(["update"], dir)
  assert.equal(result.status, 0, result.stderr)
  assert.ok(readText(join(dir, "AGENTS.md")).includes("## Project memory\n"))
  assert.equal(readText(join(dir, "context/design/deslop.md")), readText(join(repoRoot, "templates/repo/context/design/deslop.md")))
  assert.equal(readText(join(dir, ".claude/skills/contextual-next/SKILL.md")), readText(join(repoRoot, "skills/contextual-next/SKILL.md")))
  assert.equal(readText(join(dir, "context/status/main.md")), "# Status — main\nProject content.\n")
  assert.equal(readText(join(dir, "context/features/a/README.md")), "# A\nProject content.\n")
  assert.match(result.stdout, /refreshed the Contextual block/)
  assert.match(result.stdout, /deslop\.md: replaced/)
})

test("update keeps the project's heading and notes around the AGENTS.md block", () => {
  const dir = tempRepo()
  run(["init"], dir)
  edit(dir, "AGENTS.md", (t) => t.replace(/^<!-- fill:[^\n]*-->/, "# Pantry\nA shopping list.") + "\n## Our notes\nKeep these.\n")
  run(["update"], dir)
  const text = readText(join(dir, "AGENTS.md"))
  assert.ok(text.startsWith("# Pantry\nA shopping list.\n"))
  assert.ok(text.endsWith("## Our notes\nKeep these.\n"))
})

test("update without init says to run init", () => {
  const result = run(["update"], tempRepo())
  assert.equal(result.status, 2)
  assert.match(result.stderr, /Run `init` first/)
})

test("--staged on a feature branch: code without its log entry and status file is an error", () => {
  const dir = exampleRepo()
  edit(dir, "src/features/boards/sample.ts", (t) => t + "// changed\n")
  stage(dir, "src/features/boards/sample.ts")
  const result = run(["check", "--staged"], dir)
  assert.equal(result.status, 1, result.stdout)
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
  assert.equal(result.status, 1)
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

test("the hook blocks a real commit on a feature branch and lets it through on main", () => {
  const dir = exampleRepo()
  write(dir, "package.json", '{ "name": "linkboard", "private": true }\n')
  // What a package manager puts in node_modules/.bin: an executable that runs the CLI.
  mkdirSync(join(dir, "node_modules", ".bin"), { recursive: true })
  writeFileSync(join(dir, "node_modules", ".bin", "usecontextual"), `#!/bin/sh\nexec "${process.execPath}" "${bin}" "$@"\n`)
  chmodSync(join(dir, "node_modules", ".bin", "usecontextual"), 0o755)
  write(dir, ".gitignore", "node_modules/\n")
  gitIn(dir, ["add", "package.json", ".gitignore"])
  gitIn(dir, ["commit", "-q", "--no-verify", "-m", "package.json"])
  run(["update"], dir)
  gitIn(dir, ["add", "-A"])
  gitIn(dir, ["commit", "-q", "--no-verify", "-m", "update"])

  edit(dir, "src/features/boards/sample.ts", (t) => t + "// changed\n")
  stage(dir, "src/features/boards/sample.ts")
  const blocked = spawnSync("git", ["-c", "user.name=T", "-c", "user.email=t@example.invalid", "commit", "-m", "no log"], { cwd: dir, encoding: "utf8" })
  assert.notEqual(blocked.status, 0, "the hook should block this commit")
  assert.match(blocked.stdout + blocked.stderr, /boards\/log\.md: isn't in this commit/)

  gitIn(dir, ["stash", "-q"])
  gitIn(dir, ["switch", "-q", "main"])
  edit(dir, "src/features/teams/sample.ts", (t) => t + "// a one-line fix\n")
  stage(dir, "src/features/teams/sample.ts")
  const allowed = spawnSync("git", ["-c", "user.name=T", "-c", "user.email=t@example.invalid", "commit", "-m", "typo"], { cwd: dir, encoding: "utf8" })
  assert.equal(allowed.status, 0, allowed.stdout + allowed.stderr)
})
