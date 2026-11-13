// The presets: same headings as the templates they replace, and a project laid
// down with one passes check.
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { existsSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

import { PRESETS } from "../src/assets.js"
import { check } from "../src/check.js"
import { readText } from "../src/context.js"
import { bin, describe, repoRoot, tempRepo, templates } from "./helpers.js"

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => (statSync(join(dir, name)).isDirectory() ? walk(join(dir, name)).map((p) => `${name}/${p}`) : [name]))


for (const preset of PRESETS) {
  const dir = join(repoRoot, "presets", preset, "context")

  test(`${preset}: every file that replaces a template keeps its headings, in order`, () => {
    for (const rel of walk(dir)) {
      const template = join(templates, "repo", "context", rel)
      if (!existsSync(template)) continue
      const wanted = [...readText(template).replace(/<!--[\s\S]*?-->/g, "").matchAll(/^## .*$/gm)].map((m) => m[0])
      const have = [...readText(join(dir, rel)).matchAll(/^## .*$/gm)].map((m) => m[0])
      assert.deepEqual(have.filter((h) => wanted.includes(h)), wanted, `${preset}/${rel} lost or reordered a heading`)
    }
  })

  test(`${preset}: conventions keep the rule on packages and tools`, () => {
    const text = readText(join(dir, "conventions.md"))
    assert.match(text, /## Packages and tools\nUse only the packages and tools listed in `stack\/`\./)
    assert.match(text, /needs a record in `decisions\/` first/)
  })

  test(`${preset}: init --preset lays it down, and check passes with 0 errors`, () => {
    const repo = tempRepo()
    const result = spawnSync(process.execPath, [bin, "init", "--preset", preset], { cwd: repo, encoding: "utf8" })
    assert.equal(result.status, 0, result.stderr)
    for (const rel of walk(dir)) assert.equal(readText(join(repo, "context", rel)), readText(join(dir, rel)), `${rel} wasn't laid down from the preset`)
    const errors = check({ root: repo, branch: "main" }).findings.filter((f) => f.level === "error")
    assert.deepEqual(errors, [], describe(errors))
  })
}

test("presets never name a framework version", () => {
  for (const preset of PRESETS) {
    for (const rel of walk(join(repoRoot, "presets", preset, "context"))) {
      const text = readText(join(repoRoot, "presets", preset, "context", rel))
      assert.ok(!/\b(Next\.js|Laravel|React|Inertia|Tailwind CSS|Node\.js|PHP) \d/.test(text), `${preset}/${rel} names a version; versions come from the project's manifest`)
    }
  }
})
