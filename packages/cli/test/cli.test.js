import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { test } from "node:test"

import { bin } from "./helpers.js"

const packageDir = new URL("../", import.meta.url)
const pkg = JSON.parse(readFileSync(new URL("package.json", packageDir), "utf8"))
const run = (args, cwd = tmpdir()) => spawnSync(process.execPath, [bin, ...args], { cwd, encoding: "utf8" })

test("with no arguments it prints the help and exits 0", () => {
  const result = run([])
  assert.equal(result.status, 0, result.stderr)
  assert.ok(result.stdout.startsWith(`usecontextual ${pkg.version}\n`), result.stdout)
  assert.match(result.stdout, /usecontextual init /)
  assert.match(result.stdout, /usecontextual check --staged /)
})

test("--version prints the version in package.json", () => {
  assert.equal(run(["--version"]).stdout.trim(), pkg.version)
})

test("the files that ship use LF line endings, so the bin's shebang works on macOS and Linux", () => {
  const walk = (url) => readdirSync(url, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(new URL(`${e.name}/`, url)) : [new URL(e.name, url)]))
  for (const dir of pkg.files) {
    const url = new URL(`${dir}/`, packageDir)
    if (!existsSync(url)) continue // assets/ exists only after the prepack script
    for (const file of walk(url)) assert.ok(!readFileSync(file, "utf8").includes("\r"), `${file.pathname} has CRLF line endings`)
  }
  assert.ok(readFileSync(bin, "utf8").startsWith("#!/usr/bin/env node\n"))
})
