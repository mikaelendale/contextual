import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { join } from "node:path"
import { test } from "node:test"

import { globToRegExp } from "../src/glob.js"
import { which } from "../src/which.js"
import { bin, example } from "./helpers.js"

const owner = (path) => {
  const r = which({ root: example, path })
  if (r.contextual) return "contextual"
  if (r.owners.length) return r.owners.map((f) => f.name).join(",")
  return r.shared ? "shared" : "none"
}

test("which finds the feature that covers a path", () => {
  assert.equal(owner("src/features/boards/actions.ts"), "boards")
  assert.equal(owner("src/app/app/boards/[boardId]/page.tsx"), "boards")
  assert.equal(owner("e2e/boards.spec.ts"), "boards")
  assert.equal(owner("src/app/app/links/page.tsx"), "links")
  assert.equal(owner("src/app/(auth)/sign-in/page.tsx"), "auth")
  assert.equal(owner("src/lib/auth-client.ts"), "auth")
  assert.equal(owner("src/app/invite/[token]/page.tsx"), "teams")
})

test("which covers features in collapsed phases and planned features", () => {
  assert.equal(owner("src/proxy.ts"), "auth") // Phase 1 is one line in the index
  assert.equal(owner("src/features/search/search-box.tsx"), "search")
})

test("which reports shared code", () => {
  assert.equal(owner("package.json"), "shared")
  assert.equal(owner("drizzle/0004_boards.sql"), "shared")
  assert.equal(owner("src/components/ui/button.tsx"), "shared")
  assert.equal(owner("src/app/app/layout.tsx"), "shared")
})

test("which reports paths no one owns", () => {
  assert.equal(owner("scripts/seed.ts"), "none")
  assert.equal(owner("src/lib/rate-limit.ts"), "none")
})

test("Contextual's own files need no owner", () => {
  assert.equal(owner("context/features/boards/README.md"), "contextual")
  assert.equal(owner("AGENTS.md"), "contextual")
})

test("the CLI prints the owner and exits 0, or exits 1 when no one owns the path", () => {
  const found = spawnSync(process.execPath, [bin, "which", "src/features/boards/actions.ts"], { cwd: example, encoding: "utf8" })
  assert.equal(found.status, 0, found.stderr)
  assert.match(found.stdout, /^boards {2}context\/features\/boards\/README\.md {2}\(in-progress\)/)

  const none = spawnSync(process.execPath, [bin, "which", "scripts/seed.ts"], { cwd: example, encoding: "utf8" })
  assert.equal(none.status, 1)
  assert.match(none.stdout, /no feature owns this path/)

  const fromSubfolder = spawnSync(process.execPath, [bin, "which", "../../../src/proxy.ts"], { cwd: join(example, "context", "features", "auth"), encoding: "utf8" })
  assert.match(fromSubfolder.stdout, /^auth /)
})

test("globs: ** spans folders, * stays in one, brackets and parentheses are literal", () => {
  assert.ok(globToRegExp("src/features/boards/**").test("src/features/boards/components/a/b.tsx"))
  assert.ok(!globToRegExp("src/features/boards/**").test("src/features/boards-v2/a.ts"))
  assert.ok(globToRegExp("src/**/schema.ts").test("src/schema.ts"))
  assert.ok(globToRegExp("src/**/schema.ts").test("src/features/links/schema.ts"))
  assert.ok(globToRegExp("*").test("package.json"))
  assert.ok(!globToRegExp("*").test("src/index.ts"))
  assert.ok(globToRegExp("src/lib/auth*.ts").test("src/lib/auth-client.ts"))
  assert.ok(globToRegExp("src/app/(auth)/**").test("src/app/(auth)/sign-in/page.tsx"))
  assert.ok(globToRegExp("src/app/boards/[boardId]/page.tsx").test("src/app/boards/[boardId]/page.tsx"))
  assert.ok(!globToRegExp("src/app/boards/[boardId]/page.tsx").test("src/app/boards/b/page.tsx"))
})
