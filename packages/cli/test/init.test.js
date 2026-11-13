import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { test } from "node:test"

import { check } from "../src/check.js"
import { hashText, readText } from "../src/context.js"
import { bin, describe, gitIn, repoRoot, tempRepo, write } from "./helpers.js"

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"))
const run = (args, cwd) => spawnSync(process.execPath, [bin, ...args], { cwd, encoding: "utf8" })
const meta = (dir) => JSON.parse(readText(join(dir, "context", ".meta.json")))
const errors = (dir, branch = "main") => check({ root: dir, branch }).findings.filter((f) => f.level === "error")

test("init in an empty repo lays down everything, and check passes with 0 errors", () => {
  const dir = tempRepo()
  const result = run(["init"], dir)
  assert.equal(result.status, 0, result.stdout + result.stderr)
  for (const file of ["AGENTS.md", "CLAUDE.md", "context/build-plan.md", "context/design/deslop.md", "context/status/main.md"]) {
    assert.ok(existsSync(join(dir, file)), `${file} is missing`)
  }
  for (const d of [".agents/skills", ".claude/skills"]) {
    for (const s of ["contextual-setup", "contextual-next", "contextual-sync"]) assert.ok(existsSync(join(dir, d, s, "SKILL.md")), `${d}/${s}`)
  }
  const m = meta(dir)
  assert.equal(m.contextual, pkg.version)
  assert.equal(m.defaultBranch, "main")
  assert.equal(m.cli, `npx --yes usecontextual@${pkg.version}`, "no package.json, so a pinned npx")
  assert.deepEqual(m.skillDirs, [".agents/skills", ".claude/skills"])
  assert.equal(m.hashes.deslop, hashText(readText(join(dir, "context/design/deslop.md"))))
  assert.ok(!/\{\{/.test(readText(join(dir, "AGENTS.md")) + readText(join(dir, "context/.meta.json"))), "a placeholder was left unfilled")
  assert.deepEqual(errors(dir), [], describe(errors(dir)))
  const hook = join(dir, ".git", "hooks", "pre-commit")
  assert.match(readText(hook), new RegExp(`npx --yes usecontextual@${pkg.version.replaceAll(".", "\\.")} check --staged \\|\\| exit 1 # usecontextual`))
  assert.ok(statSync(hook).mode & 0o100, "the hook must be executable")
  assert.match(result.stdout, /set up contextual/)
})

test("with a package.json, init pins itself as a dev dependency and the hook calls the local copy", () => {
  const dir = tempRepo()
  write(dir, "package.json", '{\n  "name": "app",\n  "private": true\n}\n')
  write(dir, "pnpm-lock.yaml", "lockfileVersion: '9.0'\n")
  const result = run(["init", "--no-install"], dir)
  assert.equal(result.status, 0, result.stderr)
  assert.equal(JSON.parse(readText(join(dir, "package.json"))).devDependencies.usecontextual, pkg.version)
  assert.match(result.stdout, /run pnpm install/)
  assert.equal(meta(dir).cli, "npx --no-install usecontextual", "a fresh clone without node_modules must not download a copy")
  assert.match(readText(join(dir, "AGENTS.md")), /Run `npx --no-install usecontextual which <path>`/)
  assert.match(readText(join(dir, "context/features/_index.md")), /`npx --no-install usecontextual check --fix`/)
  assert.match(readText(join(dir, ".git/hooks/pre-commit")), /node_modules\/\.bin\/usecontextual check --staged \|\| exit 1/)
})

test("init keeps an existing AGENTS.md and CLAUDE.md, adding the block and the import once", () => {
  const dir = tempRepo()
  write(dir, "AGENTS.md", "# My app\nOur own rules.\n")
  write(dir, "CLAUDE.md", "Use pnpm.\n")
  assert.equal(run(["init"], dir).status, 0)
  const agents = readText(join(dir, "AGENTS.md"))
  assert.ok(agents.startsWith("# My app\nOur own rules.\n"), "existing content first, unchanged")
  assert.equal(agents.split("<!-- contextual:start -->").length, 2)
  assert.ok(!agents.includes("<!-- fill: replace this comment"), "an existing AGENTS.md keeps its own heading")
  assert.equal(readText(join(dir, "CLAUDE.md")), "Use pnpm.\n@AGENTS.md\n")
  assert.equal(run(["update"], dir).status, 0)
  assert.equal(readText(join(dir, "AGENTS.md")).split("<!-- contextual:start -->").length, 2, "update doesn't add a second block")
  assert.equal(readText(join(dir, "CLAUDE.md")).match(/@AGENTS\.md/g).length, 1)
})

test("init refuses to run twice, or over a context/ folder that isn't Contextual's, unless --force", () => {
  const dir = tempRepo()
  assert.equal(run(["init"], dir).status, 0)
  const again = run(["init"], dir)
  assert.equal(again.status, 2)
  assert.match(again.stderr, /already set up here/)

  const other = tempRepo()
  write(other, "context/notes.md", "my own notes\n")
  write(other, "context/conventions.md", "# Our conventions\n")
  const refused = run(["init"], other)
  assert.equal(refused.status, 2)
  assert.match(refused.stderr, /isn't Contextual's/)
  assert.ok(!existsSync(join(other, "AGENTS.md")), "nothing written when it refuses")
  const forced = run(["init", "--force"], other)
  assert.equal(forced.status, 0, forced.stderr)
  assert.equal(readText(join(other, "context/conventions.md")), "# Our conventions\n", "--force never overwrites")
  assert.match(forced.stdout, /kept {5}context\/conventions\.md/)
  assert.ok(existsSync(join(other, "context/build-plan.md")))
})

test("init outside a git repo says to run git init, and writes nothing", (t) => {
  const plain = mkdtempSync(join(tmpdir(), "usecontextual-plain-"))
  try {
    if (spawnSync("git", ["rev-parse", "--show-toplevel"], { cwd: plain }).status === 0) return t.skip("the temp folder is inside a git repo")
    const result = run(["init"], plain)
    assert.equal(result.status, 2)
    assert.match(result.stderr, /git init/)
    assert.ok(!existsSync(join(plain, "context")))
  } finally {
    rmSync(plain, { recursive: true, force: true })
  }
})

test("harnesses: detected from the repo, or chosen with --harness", () => {
  const claudeOnly = tempRepo()
  mkdirSync(join(claudeOnly, ".claude"))
  assert.equal(run(["init"], claudeOnly).status, 0)
  assert.deepEqual(meta(claudeOnly).skillDirs, [".claude/skills"])
  assert.ok(!existsSync(join(claudeOnly, ".agents")))
  assert.deepEqual(errors(claudeOnly), [], describe(errors(claudeOnly)))

  const chosen = tempRepo()
  assert.equal(run(["init", "--harness", "codex,antigravity,opencode"], chosen).status, 0)
  assert.deepEqual(meta(chosen).skillDirs, [".agents/skills"])

  const bad = run(["init", "--harness", "cursor"], tempRepo())
  assert.equal(bad.status, 2)
  assert.match(bad.stderr, /unknown harness "cursor"/)
})

test("the hook: an existing pre-commit hook is kept, and the line is added once", () => {
  const dir = tempRepo()
  write(dir, ".git/hooks/pre-commit", "#!/bin/sh\nnpm run lint\n")
  assert.equal(run(["init"], dir).status, 0)
  assert.equal(run(["update"], dir).status, 0)
  const hook = readText(join(dir, ".git/hooks/pre-commit"))
  assert.ok(hook.startsWith("#!/bin/sh\nnpm run lint\n"))
  assert.equal(hook.match(/# usecontextual/g).length, 1)
})

test("the hook with husky goes in .husky/pre-commit, never in husky's generated .husky/_", () => {
  const dir = tempRepo()
  mkdirSync(join(dir, ".husky", "_"), { recursive: true })
  writeFileSync(join(dir, ".husky", "_", "pre-commit"), "# generated by husky\n")
  gitIn(dir, ["config", "core.hooksPath", ".husky/_"])
  const result = run(["init"], dir)
  assert.equal(result.status, 0, result.stderr)
  assert.match(readText(join(dir, ".husky/pre-commit")), /usecontextual@\S+ check --staged/)
  assert.equal(readText(join(dir, ".husky/_/pre-commit")), "# generated by husky\n")
  assert.ok(!existsSync(join(dir, ".git/hooks/pre-commit")))
})

test("the hook with another hook manager: nothing written, the line printed", () => {
  const dir = tempRepo()
  gitIn(dir, ["config", "core.hooksPath", ".githooks-managed"])
  const result = run(["init"], dir)
  assert.equal(result.status, 0)
  assert.match(result.stdout, /Add this line to its pre-commit hook/)
  assert.ok(!existsSync(join(dir, ".githooks-managed")))
})

test("the hook in a worktree goes in the shared hooks folder git reports", () => {
  const dir = tempRepo()
  write(dir, "README.md", "hi\n")
  gitIn(dir, ["add", "-A"])
  gitIn(dir, ["commit", "-q", "-m", "start"])
  const tree = join(dir, "..", `${dir.split("/").pop()}-tree`)
  gitIn(dir, ["worktree", "add", "-q", tree, "-b", "feat/x"])
  try {
    const result = run(["init"], tree)
    assert.equal(result.status, 0, result.stderr)
    assert.match(readText(join(dir, ".git/hooks/pre-commit")), /usecontextual@\S+ check --staged/)
  } finally {
    rmSync(tree, { recursive: true, force: true })
  }
})

test("an unknown preset is refused", () => {
  const result = run(["init", "--preset", "rails"], tempRepo())
  assert.equal(result.status, 2)
  assert.match(result.stderr, /Unknown preset "rails"/)
})

test("init's skills are this repo's skills", () => {
  const dir = tempRepo()
  run(["init"], dir)
  assert.equal(readText(join(dir, ".claude/skills/contextual-next/SKILL.md")), readText(join(repoRoot, "skills/contextual-next/SKILL.md")))
})
