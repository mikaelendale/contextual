// The agent skills in skills/: valid for every harness, short, and shipping
// exact copies of the templates they create files from.
import assert from "node:assert/strict"
import { cpSync, existsSync, readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { test } from "node:test"

import { check } from "../src/check.js"
import { readText } from "../src/context.js"
import { copyExample, describe, repoRoot, templates } from "./helpers.js"

const skillsDir = join(repoRoot, "skills")
const SKILLS = ["contextual-setup", "contextual-next", "contextual-sync"]
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => (statSync(join(dir, name)).isDirectory() ? walk(join(dir, name)) : [join(dir, name)]))

test("the three skills exist, each with a SKILL.md", () => {
  const found = readdirSync(skillsDir).filter((n) => statSync(join(skillsDir, n)).isDirectory())
  for (const name of SKILLS) assert.ok(found.includes(name), `skills/${name} is missing`)
  for (const name of SKILLS) assert.ok(existsSync(join(skillsDir, name, "SKILL.md")))
})

test("installed in both skill folders, the skills pass check", () => {
  const dir = copyExample()
  for (const d of [".agents/skills", ".claude/skills"]) {
    for (const name of SKILLS) cpSync(join(skillsDir, name), join(dir, d, name), { recursive: true })
  }
  const findings = check({ root: dir, branch: "feat/boards" }).findings.filter((f) => /skill/i.test(`${f.file} ${f.message}`))
  assert.deepEqual(findings, [], describe(findings))
})

test("each SKILL.md is short, and its description starts with when to use it", () => {
  for (const name of SKILLS) {
    const text = readText(join(skillsDir, name, "SKILL.md"))
    const lines = text.split("\n").length
    assert.ok(lines <= 60, `${name}/SKILL.md is ${lines} lines; keep it at 60 or fewer and move detail to references/`)
    assert.match(text, /^---\nname: [a-z-]+\ndescription: Use when /, `${name}: the description should start with the trigger phrases`)
  }
})

test("every assets/ file is an exact copy of its template", () => {
  // assets/feature-<file> comes from templates/feature/<file>; any other asset from templates/<file>
  for (const name of SKILLS) {
    const assets = join(skillsDir, name, "assets")
    if (!existsSync(assets)) continue
    for (const file of readdirSync(assets)) {
      const source = file.startsWith("feature-") ? join(templates, "feature", file.slice("feature-".length)) : join(templates, file)
      assert.ok(existsSync(source), `${name}/assets/${file} has no template at ${relative(repoRoot, source)}`)
      assert.equal(readText(join(assets, file)), readText(source), `${name}/assets/${file} differs from ${relative(repoRoot, source)}`)
    }
  }
})

test("every template a skill creates files from ships in some skill", () => {
  const shipped = new Set(
    SKILLS.flatMap((name) => {
      const assets = join(skillsDir, name, "assets")
      return existsSync(assets) ? readdirSync(assets) : []
    }),
  )
  const needed = [...readdirSync(join(templates, "feature")).map((f) => `feature-${f}`), "status-branch.md", "stack-lib.md", "decision.md", "contextual-plan.md"]
  for (const file of needed) assert.ok(shipped.has(file), `no skill ships ${file}`)
})

test("the setup skill's plan-file reference is docs/plan-file.md", () => {
  assert.equal(readText(join(skillsDir, "contextual-setup", "references", "plan-file.md")), readText(join(repoRoot, "docs", "plan-file.md")))
})

test("every file a skill points to exists inside that skill", () => {
  for (const name of SKILLS) {
    const root = join(skillsDir, name)
    for (const path of walk(root).filter((p) => p.endsWith(".md") && !p.includes(`${name}/assets/`))) {
      const text = readText(path)
      const targets = [
        ...[...text.matchAll(/\]\(((?:assets|references)\/[^)\s#]+)\)/g)].map((m) => m[1]),
        ...[...text.matchAll(/`((?:assets|references)\/[^`*\s]+)`/g)].map((m) => m[1]),
      ]
      for (const target of targets) assert.ok(existsSync(join(root, target)), `${relative(skillsDir, path)} points to ${target}, which isn't in ${name}/`)
    }
  }
})
