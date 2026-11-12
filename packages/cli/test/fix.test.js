import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { join } from "node:path"
import { test } from "node:test"

import { readText } from "../src/context.js"
import { fix } from "../src/fix.js"
import { bin, copyExample, edit, errorsIn, example } from "./helpers.js"

test("--fix changes nothing in the example, which is already right", () => {
  const dir = copyExample()
  assert.deepEqual(fix({ root: dir }), [])
})

test("--fix rebuilds an out-of-date feature index", () => {
  const dir = copyExample()
  edit(dir, "context/features/search/README.md", (t) => t.replace(/## What it does\n.*\./, "## What it does\nFind any saved link by its title or URL."))
  assert.ok(errorsIn(dir).some((e) => /_index\.md/.test(e.file)))
  assert.deepEqual(fix({ root: dir }), ["rebuilt context/features/_index.md"])
  assert.deepEqual(errorsIn(dir), [])
  assert.match(readText(join(dir, "context/features/_index.md")), /Find any saved link by its title or URL\./)
})

test("--fix stores the idea.md hash once, keeping the layout of .meta.json", () => {
  const dir = copyExample()
  edit(dir, "context/.meta.json", (t) => t.replace(/"idea": "sha256:[0-9a-f]+"/, '"idea": null'))
  assert.deepEqual(fix({ root: dir }), ["stored the idea.md hash in context/.meta.json"])
  assert.equal(readText(join(dir, "context/.meta.json")), readText(join(example, "context/.meta.json")))
  // An edited idea.md keeps the stored hash, so check can still warn about the edit.
  edit(dir, "context/idea.md", (t) => t + "\nOne more line.\n")
  assert.deepEqual(fix({ root: dir }), [])
})

test("check --fix prints what it fixed, then the usual check", () => {
  const dir = copyExample()
  edit(dir, "context/features/_index.md", () => "# Features\n")
  const run = spawnSync(process.execPath, [bin, "check", "--fix", "--branch", "feat/boards"], { cwd: dir, encoding: "utf8" })
  assert.equal(run.status, 0, run.stdout + run.stderr)
  assert.match(run.stdout, /^fixed: rebuilt context\/features\/_index\.md\nusecontextual check · /)
  assert.match(run.stdout, /0 errors, 2 warnings/)
})
