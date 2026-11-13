// Who owns a file (spec 3.8): the most specific match among covers: globs and the shared: line.
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { test } from "node:test"

import { STAGED_ERRORS_EXIT } from "../src/hook.js"
import { SHARED, ownerOf, specificity } from "../src/owners.js"
import { which } from "../src/which.js"
import { addCode, bin, commitAll, copyExample, describe, edit, errorsIn, gitIn, warningsIn, write } from "./helpers.js"

const run = (args, cwd) => spawnSync(process.execPath, [bin, ...args], { cwd, encoding: "utf8" })
const f = (name, ...covers) => ({ name, covers })

test("specificity: an exact path beats any glob; otherwise more folders before the first wildcard", () => {
  assert.equal(specificity("site/app/feedback/page.tsx"), Infinity)
  assert.equal(specificity("site/app/feedback/**"), 3)
  assert.equal(specificity("site/**"), 1)
  assert.equal(specificity("*"), 0)
  assert.equal(specificity("src/features/b*/**"), 2)
})

test("a new feature inside another feature's folder owns its files", () => {
  const features = [f("site", "site/**"), f("agent-feedback", "site/app/agent/feedback/**")]
  assert.equal(ownerOf("site/app/agent/feedback/page.tsx", features).owner, "agent-feedback")
  assert.deepEqual(ownerOf("site/app/agent/feedback/page.tsx", features).beaten, [{ owner: "site", glob: "site/**" }])
  assert.equal(ownerOf("site/app/page.tsx", features).owner, "site")
})

test("an exact path beats a glob, and the shared: line takes part the same way", () => {
  const features = [f("site", "site/**"), f("cli", "packages/cli/**"), f("feedback", "packages/cli/src/feedback.js")]
  assert.equal(ownerOf("packages/cli/src/feedback.js", features).owner, "feedback")
  assert.equal(ownerOf("site/components/ui/button.tsx", features, ["site/components/ui/**"]).owner, SHARED)
  assert.equal(ownerOf("site/components/logo.tsx", features, ["site/components/ui/**"]).owner, "site")
})

test("equally specific matches tie, including the same glob in two features", () => {
  assert.deepEqual(ownerOf("src/features/boards/x.ts", [f("a", "src/features/**"), f("b", "src/features/b*/**")]).tied, ["a", "b"])
  assert.deepEqual(ownerOf("src/x.ts", [f("a", "src/**"), f("b", "src/**")]).tied, ["a", "b"])
  assert.deepEqual(ownerOf("src/x.ts", [f("a", "src/**")], ["src/**"]).tied, [SHARED, "a"].sort())
})

test("check: a feature inside another's folder is fine; an emptied glob and a tie are errors", () => {
  const dir = copyExample()
  addCode(dir)
  // links takes one of boards' files with an exact path: no error, and boards keeps the rest.
  edit(dir, "context/features/links/README.md", (t) => t.replace("covers: src/features/links/**", "covers: src/features/links/**, src/features/boards/sample.ts"))
  assert.deepEqual(errorsIn(dir), [], describe(errorsIn(dir)))
  // A glob whose every file goes to more specific owners counts as matching nothing: links/** (three folders) beats l*/** (two).
  edit(dir, "context/features/boards/README.md", (t) => t.replace("covers: src/features/boards/**", "covers: src/features/boards/**, src/features/l*/**"))
  // boards is in progress, so this is a warning; for a shipped feature it's an error.
  assert.ok(warningsIn(dir).some((w) => /covers src\/features\/l\*\/\*\*, but every file it matches belongs to a more specific glob/.test(w.message)), describe(warningsIn(dir)))
  // Equally specific: still an error.
  edit(dir, "context/features/boards/README.md", (t) => t.replace(", src/features/l*/**", ", src/features/links/**"))
  assert.ok(errorsIn(dir).some((e) => /is covered by more than one feature: boards, links, equally specifically/.test(e.message)), describe(errorsIn(dir)))
})

test("which names the owner and the broader glob it beat", () => {
  const dir = copyExample()
  addCode(dir)
  edit(dir, "context/features/links/README.md", (t) => t.replace("covers: src/features/links/**", "covers: src/features/links/**, src/features/boards/sample.ts"))
  assert.equal(which({ root: dir, path: "src/features/boards/sample.ts" }).owner.name, "links")
  const result = run(["which", "src/features/boards/sample.ts"], dir)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /^links /)
  assert.match(result.stdout, /more specific than src\/features\/boards\/\*\* \(boards\)/)
})

test("which --unowned lists the code files no one owns, and check counts them once setup has run", () => {
  const dir = copyExample()
  addCode(dir)
  const clean = run(["which", "--unowned"], dir)
  assert.equal(clean.status, 0, clean.stdout)
  assert.match(clean.stdout, /Every code file has an owner/)

  write(dir, "scripts/seed.ts", "// stand-in\n")
  write(dir, "src/lib/rate-limit.ts", "// stand-in\n")
  write(dir, "NOTES.md", "Top-level docs need no owner.\n")
  const listed = run(["which", "--unowned"], dir)
  assert.equal(listed.status, 1)
  assert.deepEqual(listed.stdout.trim().split("\n").slice(0, -1), ["scripts/seed.ts", "src/lib/rate-limit.ts"])
  assert.ok(warningsIn(dir).some((w) => /2 files have no owner\. `npx --no-install usecontextual which --unowned` lists them/.test(w.message)), describe(warningsIn(dir)))
})

test("check --staged asks for the log of the feature that owns the file, not the broader one", () => {
  const dir = copyExample()
  addCode(dir)
  edit(dir, "context/features/links/README.md", (t) => t.replace("covers: src/features/links/**", "covers: src/features/links/**, src/features/boards/sample.ts"))
  commitAll(dir)
  gitIn(dir, ["switch", "-q", "-c", "feat/links"])
  edit(dir, "src/features/boards/sample.ts", (t) => t + "// changed by links\n")
  gitIn(dir, ["add", "--", "src/features/boards/sample.ts"])
  const result = run(["check", "--staged"], dir)
  assert.equal(result.status, STAGED_ERRORS_EXIT, result.stdout)
  assert.match(result.stdout, /context\/features\/links\/log\.md: isn't in this commit, but links's code is/)
  assert.doesNotMatch(result.stdout, /boards\/log\.md/)
})
