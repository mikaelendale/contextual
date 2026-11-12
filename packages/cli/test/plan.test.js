// The plan-file format, and the contextual-plan skill and prompt that write it.
import assert from "node:assert/strict"
import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

import { readText } from "../src/context.js"
import { readPlanFile } from "../src/plan.js"
import { example, repoRoot } from "./helpers.js"

const plan = join(repoRoot, "skills", "contextual-plan")

test("the example's idea.md is a valid plan file", () => {
  const { problems, phases } = readPlanFile(readText(join(example, "context", "idea.md")))
  assert.deepEqual(problems, [])
  assert.ok(phases.length >= 2)
})

test("a plan with a renamed heading, a missing acceptance line or a duplicate feature is caught", () => {
  const good = readText(join(example, "context", "idea.md"))
  assert.ok(readPlanFile(good.replace("## Design direction", "## Look")).problems.some((p) => /## headings should be/.test(p)))
  assert.ok(readPlanFile(good.replace(/(\n- [^\n]+\n)(\s+- acceptance:[^\n]*\n)+/, "$1")).problems.some((p) => /has no acceptance line/.test(p)))
  assert.ok(readPlanFile(good.replace("### Phase 1 —", "### Phase One —")).problems.length > 0)
})

test("the copy-paste prompt carries the plan format exactly as docs/plan-file.md gives it", () => {
  const block = (text) => text.match(/```markdown\n(# <Project name>[\s\S]*?)```/)[1]
  assert.equal(block(readText(join(plan, "prompt.md"))), block(readText(join(repoRoot, "docs", "plan-file.md"))))
})

test("the chat skill's plan-file reference is docs/plan-file.md", () => {
  assert.equal(readText(join(plan, "references", "plan-file.md")), readText(join(repoRoot, "docs", "plan-file.md")))
})

test("the chat skill has portable frontmatter, starting with when to use it", () => {
  assert.match(readText(join(plan, "SKILL.md")), /^---\nname: contextual-plan\ndescription: Use when [^\n]{20,1000}\nlicense: MIT\n---\n/)
})

test("every plan the skill or the prompt produced in a trial is a valid plan file", () => {
  const dir = join(repoRoot, "docs", "trials")
  const plans = existsSync(dir)
    ? readdirSync(dir, { recursive: true }).filter((p) => String(p).endsWith("contextual-plan.md")).map((p) => join(dir, String(p)))
    : []
  for (const p of plans) assert.deepEqual(readPlanFile(readText(p)).problems, [], p)
})
