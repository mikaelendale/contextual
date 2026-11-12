import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { test } from "node:test"

import { bin, example } from "./helpers.js"

const packageDir = new URL("../", import.meta.url)
const pkg = JSON.parse(readFileSync(new URL("package.json", packageDir), "utf8"))
const run = (args, cwd = tmpdir()) => spawnSync(process.execPath, [bin, ...args], { cwd, encoding: "utf8" })

test("with no arguments it prints the help and exits 0", () => {
  const result = run([])
  assert.equal(result.status, 0, result.stderr)
  assert.ok(result.stdout.startsWith(`usecontextual ${pkg.version}\n`), result.stdout)
  assert.match(result.stdout, /Not released yet: init, update, check --staged\./)
})

test("--version prints the version in package.json", () => {
  assert.equal(run(["--version"]).stdout.trim(), pkg.version)
})

test("commands that aren't released print \"not released yet\" and exit 2, in a project or not", () => {
  const empty = mkdtempSync(join(tmpdir(), "usecontextual-empty-"))
  try {
    for (const cwd of [empty, example]) {
      for (const args of [["init"], ["update"], ["check", "--staged"]]) {
        const result = run(args, cwd)
        assert.equal(result.status, 2, `${args.join(" ")}: ${result.stdout}${result.stderr}`)
        assert.ok(result.stderr.startsWith(`usecontextual ${args.join(" ")}: not released yet.`), result.stderr)
      }
    }
  } finally {
    rmSync(empty, { recursive: true, force: true })
  }
})

test("the files that ship use LF line endings, so the bin's shebang works on macOS and Linux", () => {
  for (const dir of pkg.files) {
    for (const name of readdirSync(new URL(`${dir}/`, packageDir))) {
      const text = readFileSync(new URL(`${dir}/${name}`, packageDir), "utf8")
      assert.ok(!text.includes("\r"), `${dir}/${name} has CRLF line endings`)
    }
  }
  assert.ok(readFileSync(bin, "utf8").startsWith("#!/usr/bin/env node\n"))
})
