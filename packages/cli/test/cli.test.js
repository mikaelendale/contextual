import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
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

test("contrast prints the ratio of two colors, and says which minimums it meets", () => {
  const ok = spawnSync(process.execPath, [bin, "contrast", "6c6c74", "#f7f5f2"], { encoding: "utf8" })
  assert.equal(ok.status, 0, ok.stderr)
  assert.equal(ok.stdout.trim(), "4.78:1 · passes 4.5:1 for text · passes 3:1 for outlines, focus rings and large text")
  const low = spawnSync(process.execPath, [bin, "contrast", "a0a09a", "ffffff"], { encoding: "utf8" })
  assert.match(low.stdout, /^2\.\d\d:1 · fails 4\.5:1 for text · fails 3:1/)
  const bad = spawnSync(process.execPath, [bin, "contrast", "teal"], { encoding: "utf8" })
  assert.equal(bad.status, 2)
  assert.match(bad.stderr, /Give two hex colors/)
})

test("a crash says it's a bug in usecontextual, where to report it, and exits 70, never 1 or 65", () => {
  // A context/.meta.json that is a folder makes the read throw: a stand-in for any unexpected error.
  const dir = mkdtempSync(join(tmpdir(), "usecontextual-crash-"))
  mkdirSync(join(dir, "context", ".meta.json"), { recursive: true })
  const result = spawnSync(process.execPath, [bin, "check", "--staged"], { cwd: dir, encoding: "utf8" })
  assert.equal(result.status, 70, result.stdout + result.stderr)
  assert.match(result.stderr, /^usecontextual \d+\.\d+\.\d+ stopped on an unexpected error, on \w+ with Node v\d+/)
  assert.match(result.stderr, /This is a bug in usecontextual, not in your project\. Please report it at https:\/\/github\.com\/mikaelendale\/contextual\/issues/)
  rmSync(dir, { recursive: true, force: true })
})
