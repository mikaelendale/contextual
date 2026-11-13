// update: refreshes Contextual's own files and nothing else.
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { join } from "node:path"
import { test } from "node:test"

import { readText } from "../src/context.js"
import { bin, edit, repoRoot, tempRepo, write } from "./helpers.js"

const run = (args, cwd) => spawnSync(process.execPath, [bin, ...args], { cwd, encoding: "utf8" })

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

test("update moves a repo with a package.json from `npx usecontextual` to `npx --no-install usecontextual`", () => {
  const dir = tempRepo()
  write(dir, "package.json", '{ "name": "app", "private": true }\n')
  run(["init", "--no-install"], dir)
  for (const file of ["context/.meta.json", "AGENTS.md", "context/features/_index.md"]) edit(dir, file, (t) => t.replaceAll("npx --no-install usecontextual", "npx usecontextual"))
  const result = run(["update"], dir)
  assert.equal(result.status, 0, result.stderr)
  assert.equal(JSON.parse(readText(join(dir, "context/.meta.json"))).cli, "npx --no-install usecontextual")
  assert.ok(!/npx usecontextual/.test(readText(join(dir, "AGENTS.md")) + readText(join(dir, "context/features/_index.md"))))
  assert.equal(run(["check", "--branch", "main"], dir).status, 0)
})
