// The example and the templates must agree: the example is what a filled-in
// template looks like.
import assert from "node:assert/strict"
import { readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

import { contextualBlock, hashText, readText } from "../src/context.js"
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

test("the example's deslop.md hash in .meta.json is the shipped file's hash", () => {
  const meta = JSON.parse(readText(join(example, "context", ".meta.json")))
  assert.equal(meta.hashes.deslop, hashText(readText(join(templates, "repo", "context", "design", "deslop.md"))))
})

test("the example's logs show every deslop result: pass with how it was checked, fixed, not verified, not UI", () => {
  const featuresDir = join(example, "context", "features")
  const lines = walk(featuresDir)
    .filter((p) => p.endsWith("log.md"))
    .flatMap((p) => readText(p).split("\n"))
    .filter((l) => l.startsWith("- Deslop: "))
  for (const form of [/^- Deslop: pass \(.+\)$/, /^- Deslop: fixed \S/, /^- Deslop: not verified \S/, /^- Deslop: not UI\.?$/]) {
    assert.ok(lines.some((l) => form.test(l)), `no log line matches ${form}`)
  }
})

test("the example keeps the conventions template's fixed rule on packages and tools", () => {
  const section = readText(join(templates, "repo", "context", "conventions.md")).match(/## Packages and tools\n[^#]+/)[0]
  assert.ok(readText(join(example, "context", "conventions.md")).includes(section))
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

test("the repo templates, as init lays them down, pass check with 0 errors", async () => {
  const { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } = await import("node:fs")
  const { tmpdir } = await import("node:os")
  const { check } = await import("../src/check.js")
  const dir = mkdtempSync(join(tmpdir(), "usecontextual-fresh-"))
  try {
    const fill = { "{{cli}}": "npx usecontextual", "{{date}}": "2026-11-12", "{{contextual_version}}": "0.0.1", "{{default_branch}}": "main", "{{deslop_hash}}": "sha256:x" }
    const base = join(templates, "repo")
    for (const path of walk(base)) {
      const to = join(dir, path.slice(base.length + 1))
      mkdirSync(join(to, ".."), { recursive: true })
      let text = readFileSync(path, "utf8")
      for (const [k, v] of Object.entries(fill)) text = text.replaceAll(k, v)
      writeFileSync(to, text)
    }
    const errors = check({ root: dir, branch: "main" }).findings.filter((f) => f.level === "error")
    assert.deepEqual(errors, [], errors.map((e) => `${e.file}: ${e.message}`).join("\n"))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
