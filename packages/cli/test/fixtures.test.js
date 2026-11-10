// The example and the templates must agree: the example is what a filled-in
// template looks like.
import assert from "node:assert/strict"
import { readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

import { contextualBlock, readText } from "../src/context.js"
import { example, templates } from "./helpers.js"

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => (statSync(join(dir, name)).isDirectory() ? walk(join(dir, name)) : [join(dir, name)]))

test("the example's AGENTS.md block is the template's block, filled in", () => {
  const cli = JSON.parse(readText(join(example, "context", ".meta.json"))).cli
  const fromTemplate = contextualBlock(readText(join(templates, "repo", "AGENTS.md"))).replaceAll("{{cli}}", cli)
  assert.equal(contextualBlock(readText(join(example, "AGENTS.md"))), fromTemplate)
})

test("the example ships deslop.md unchanged", () => {
  assert.equal(
    readText(join(example, "context", "design", "deslop.md")),
    readText(join(templates, "repo", "context", "design", "deslop.md")),
  )
})

test("the example has every file the repo template lays down", () => {
  const base = join(templates, "repo")
  for (const path of walk(base)) {
    const rel = path.slice(base.length + 1)
    assert.ok(statSync(join(example, rel), { throwIfNoEntry: false }), `example/ is missing ${rel}`)
  }
})

test("templates: valid JSON, every comment closed, no filled-in project content", () => {
  JSON.parse(readText(join(templates, "repo", "context", ".meta.json")).replace(/"\{\{[a-z_]+\}\}"/g, '"x"'))
  for (const path of walk(templates).filter((p) => p.endsWith(".md"))) {
    const text = readText(path)
    assert.equal((text.match(/<!--/g) ?? []).length, (text.match(/-->/g) ?? []).length, `unbalanced comment in ${path}`)
    assert.ok(!/Linkboard/.test(text), `${path} mentions the example project`)
  }
})
