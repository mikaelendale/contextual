// The pre-commit hook, in real git repos and real commits. It blocks a commit only when
// `check --staged` ran and found errors. When the CLI can't run (offline, the version not
// found, Node missing), it prints a note and the commit goes through.
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { chmodSync, mkdirSync, writeFileSync } from "node:fs"
import { delimiter, join } from "node:path"
import { test } from "node:test"

import { hookLine, installHook } from "../src/hook.js"
import { addCode, bin, commitAll, copyExample, edit, gitIn, write } from "./helpers.js"

const run = (args, cwd) => spawnSync(process.execPath, [bin, ...args], { cwd, encoding: "utf8" })
const stage = (dir, ...paths) => gitIn(dir, ["add", "--", ...paths])
const SKIPPED = /usecontextual couldn't run \(exit \d+\), so the context check was skipped/

/** The example as a git repo: code for every covers: glob, committed on main, then on feat/boards. No package.json. */
function exampleRepo() {
  const dir = copyExample()
  addCode(dir)
  commitAll(dir)
  gitIn(dir, ["switch", "-q", "-c", "feat/boards"])
  return dir
}

/** Stages what check --staged blocks on a feature branch: boards's code, without its log entry or the status file. */
function stageBlockedChange(dir) {
  edit(dir, "src/features/boards/sample.ts", (t) => t + "// changed\n")
  stage(dir, "src/features/boards/sample.ts")
}

/** A real `git commit`, so the hook runs, with extra environment variables. */
function commit(dir, env = {}) {
  return spawnSync("git", ["-c", "user.name=T", "-c", "user.email=t@example.invalid", "-c", "commit.gpgsign=false", "commit", "-m", "change"], {
    cwd: dir,
    encoding: "utf8",
    env: { ...process.env, ...env },
  })
}

/** An executable `name` in a folder inside the repo's .git, to put first on PATH. Returns the PATH to use. */
function pathWith(dir, name, script) {
  const folder = join(dir, ".git", "test-bin")
  mkdirSync(folder, { recursive: true })
  writeFileSync(join(folder, name), script)
  chmodSync(join(folder, name), 0o755)
  return `${folder}${delimiter}${process.env.PATH}`
}

/** The hook line a repo without a package.json gets: a pinned npx. */
const installNpxHook = (dir) => installHook({ top: dir, line: hookLine({ hasPackageJson: false, version: "0.1.0" }) })

/** What `npx --yes usecontextual@<version>` does once the package is downloaded: run the CLI with the rest of the arguments. */
const npxRunningThisCopy = `#!/bin/sh\nshift 2\nexec "${process.execPath}" "${bin}" "$@"\n`

test("the hook blocks a real commit on a feature branch and lets it through on main", () => {
  const dir = exampleRepo()
  write(dir, "package.json", '{ "name": "linkboard", "private": true }\n')
  // What a package manager puts in node_modules/.bin: an executable that runs the CLI.
  mkdirSync(join(dir, "node_modules", ".bin"), { recursive: true })
  writeFileSync(join(dir, "node_modules", ".bin", "usecontextual"), `#!/bin/sh\nexec "${process.execPath}" "${bin}" "$@"\n`)
  chmodSync(join(dir, "node_modules", ".bin", "usecontextual"), 0o755)
  write(dir, ".gitignore", "node_modules/\n")
  gitIn(dir, ["add", "package.json", ".gitignore"])
  gitIn(dir, ["commit", "-q", "--no-verify", "-m", "package.json"])
  run(["update"], dir)
  gitIn(dir, ["add", "-A"])
  gitIn(dir, ["commit", "-q", "--no-verify", "-m", "update"])

  edit(dir, "src/features/boards/sample.ts", (t) => t + "// changed\n")
  stage(dir, "src/features/boards/sample.ts")
  const blocked = spawnSync("git", ["-c", "user.name=T", "-c", "user.email=t@example.invalid", "commit", "-m", "no log"], { cwd: dir, encoding: "utf8" })
  assert.notEqual(blocked.status, 0, "the hook should block this commit")
  assert.match(blocked.stdout + blocked.stderr, /boards\/log\.md: isn't in this commit/)

  gitIn(dir, ["stash", "-q"])
  gitIn(dir, ["switch", "-q", "main"])
  edit(dir, "src/features/teams/sample.ts", (t) => t + "// a one-line fix\n")
  stage(dir, "src/features/teams/sample.ts")
  const allowed = spawnSync("git", ["-c", "user.name=T", "-c", "user.email=t@example.invalid", "commit", "-m", "typo"], { cwd: dir, encoding: "utf8" })
  assert.equal(allowed.status, 0, allowed.stdout + allowed.stderr)
})

test("without a package.json and with no network, the hook says the check was skipped and lets the commit through", () => {
  const dir = exampleRepo()
  installNpxHook(dir)
  stageBlockedChange(dir)
  // The real npx, with a registry nothing listens on and an empty cache: what a laptop offline sees.
  const result = commit(dir, {
    npm_config_registry: "http://127.0.0.1:9/",
    npm_config_cache: join(dir, ".git", "empty-npm-cache"),
    npm_config_fetch_retries: "0",
    npm_config_update_notifier: "false",
  })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.match(result.stdout + result.stderr, SKIPPED)
})

test("without a package.json, the hook still blocks a commit when check ran and found errors", () => {
  const dir = exampleRepo()
  installNpxHook(dir)
  stageBlockedChange(dir)
  const result = commit(dir, { PATH: pathWith(dir, "npx", npxRunningThisCopy) })
  assert.notEqual(result.status, 0, "the hook should block this commit")
  assert.match(result.stdout + result.stderr, /boards\/log\.md: isn't in this commit/)
  assert.doesNotMatch(result.stdout + result.stderr, SKIPPED)
})

test("when npx can't find the pinned version, the hook says the check was skipped and lets the commit through", () => {
  const dir = exampleRepo()
  installNpxHook(dir)
  stageBlockedChange(dir)
  const notFound = `#!/bin/sh\necho "npm error notarget No matching version found for usecontextual@0.1.0." >&2\nexit 1\n`
  const result = commit(dir, { PATH: pathWith(dir, "npx", notFound) })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.match(result.stdout + result.stderr, SKIPPED)
})

test("with a package.json and no Node to run the CLI, the hook says the check was skipped and lets the commit through", () => {
  const dir = exampleRepo()
  write(dir, "package.json", '{ "name": "linkboard", "private": true }\n')
  write(dir, ".gitignore", "node_modules/\n")
  gitIn(dir, ["add", "package.json", ".gitignore"])
  gitIn(dir, ["commit", "-q", "--no-verify", "-m", "package.json"])
  // The installed bin starts with `#!/usr/bin/env node`; here env can't find its interpreter, as when Node is missing.
  mkdirSync(join(dir, "node_modules", ".bin"), { recursive: true })
  writeFileSync(join(dir, "node_modules", ".bin", "usecontextual"), "#!/usr/bin/env usecontextual-test-no-such-node\n")
  chmodSync(join(dir, "node_modules", ".bin", "usecontextual"), 0o755)
  installHook({ top: dir, line: hookLine({ hasPackageJson: true, version: "0.1.0" }) })
  stageBlockedChange(dir)
  const result = commit(dir)
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.match(result.stdout + result.stderr, SKIPPED)
})

test("in a hook file with set -e, the line still lets the commit through when the CLI can't run, and still blocks on errors", () => {
  const dir = exampleRepo()
  // A hook another tool wrote, which stops at the first failing command, with a line after Contextual's.
  const file = join(dir, ".git", "hooks", "pre-commit")
  writeFileSync(file, `#!/bin/sh\nset -e\n${hookLine({ hasPackageJson: false, version: "0.1.0" })}\necho "the next line ran"\n`)
  chmodSync(file, 0o755)
  stageBlockedChange(dir)

  const failing = commit(dir, { PATH: pathWith(dir, "npx", "#!/bin/sh\nexit 1\n") })
  assert.equal(failing.status, 0, failing.stdout + failing.stderr)
  assert.match(failing.stdout + failing.stderr, SKIPPED)
  // git shows a hook's output on stderr.
  assert.match(failing.stdout + failing.stderr, /the next line ran/)

  gitIn(dir, ["reset", "-q", "--soft", "HEAD~1"])
  const blocked = commit(dir, { PATH: pathWith(dir, "npx", npxRunningThisCopy) })
  assert.notEqual(blocked.status, 0, "the hook should block this commit")
  assert.doesNotMatch(blocked.stdout + blocked.stderr, /the next line ran/)
})
