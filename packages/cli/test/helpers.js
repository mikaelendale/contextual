import { execFileSync } from "node:child_process"
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { check } from "../src/check.js"
import { readFeatures, readShared, readText } from "../src/context.js"

// Outside a git repo the CLI falls back to CI's branch variables. The tests' temp copies aren't git repos,
// so clear them: a test should see the same branch on a laptop and in CI.
delete process.env.GITHUB_HEAD_REF
delete process.env.GITHUB_REF_NAME

const here = dirname(fileURLToPath(import.meta.url))
export const repoRoot = join(here, "..", "..", "..")
export const example = join(repoRoot, "example")
export const templates = join(repoRoot, "templates")
export const bin = join(here, "..", "bin", "usecontextual.js")

const copies = []

/** A throwaway copy of example/, removed when the process exits. */
export function copyExample() {
  const dir = mkdtempSync(join(tmpdir(), "usecontextual-test-"))
  cpSync(example, dir, { recursive: true })
  copies.push(dir)
  return dir
}
process.on("exit", () => {
  for (const dir of copies) rmSync(dir, { recursive: true, force: true })
})

export function edit(dir, file, change) {
  const path = join(dir, file)
  writeFileSync(path, change(readFileSync(path, "utf8")))
}

export function write(dir, file, text) {
  mkdirSync(dirname(join(dir, file)), { recursive: true })
  writeFileSync(join(dir, file), text)
}

export const errorsIn = (dir, branch = "feat/boards") => check({ root: dir, branch }).findings.filter((f) => f.level === "error")
export const warningsIn = (dir, branch = "feat/boards") => check({ root: dir, branch }).findings.filter((f) => f.level === "warning")
export const describe = (findings) => findings.map((f) => `${f.level} ${f.file ?? ""}: ${f.message}`).join("\n") || "(none)"

/** A file path that the glob matches, for creating stand-in code. */
export function sampleFor(glob) {
  let path = glob.replace(/\*\*\/?/g, "sample/").replace(/\*/g, "sample").replace(/\?/g, "s").replace(/\/$/, "")
  if (!/\.[a-z0-9]+$/i.test(path.split("/").pop())) path += ".ts"
  return path
}

/**
 * Adds a stand-in file for every covers: glob of features that are in progress
 * or shipped, and for every glob on the shared: line, so the ownership checks
 * have code to look at.
 */
export function addCode(dir) {
  for (const f of readFeatures(dir)) {
    if (f.status !== "shipped" && f.status !== "in-progress") continue
    for (const glob of f.covers) write(dir, sampleFor(glob), "// stand-in\n")
  }
  for (const glob of readShared(readText(join(dir, "context", "architecture.md"))) ?? []) {
    write(dir, sampleFor(glob), "// stand-in\n")
  }
}

/** A new, empty git repo in a temp folder, removed when the process exits. */
export function tempRepo() {
  const dir = mkdtempSync(join(tmpdir(), "usecontextual-repo-"))
  copies.push(dir)
  gitIn(dir, ["init", "-q", "-b", "main"])
  return dir
}

/** Turns a folder (like a copy of example/) into a git repo with everything committed on main. */
export function commitAll(dir, message = "Start") {
  if (!existsSync(join(dir, ".git"))) gitIn(dir, ["init", "-q", "-b", "main"])
  gitIn(dir, ["add", "-A"])
  gitIn(dir, ["commit", "-q", "--no-verify", "-m", message])
}

const IDENTITY = ["-c", "user.name=Test", "-c", "user.email=test@example.invalid", "-c", "commit.gpgsign=false"]
export function gitIn(dir, args, options = {}) {
  return execFileSync("git", [...IDENTITY, ...args], { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...options })
}
