/*
 * The git pre-commit hook (spec 6.3). Contextual owns one marked line, never
 * the whole file, so an existing hook keeps working and `update` can find the
 * line again.
 */

import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, relative } from "node:path"

import { hooksDir, hooksPathSetting } from "./git.js"

export const HOOK_MARK = "# usecontextual"

/**
 * What `check --staged` exits with when it ran and found errors. npm, npx and
 * Node exit with 1 when they fail, and the shell with 126 or 127 when a command
 * can't start, so this code is how the hook tells "the check failed" from "the
 * check couldn't run".
 */
export const STAGED_ERRORS_EXIT = 65

/**
 * The line the hook runs. It blocks the commit only when `check --staged` ran
 * and found errors. When the CLI can't run (not installed, offline, the
 * registry down, the version not found, Node missing), it prints a note and
 * the commit goes through. The `||` keeps it working in a hook file that sets
 * `set -e`. With a package.json it calls the local pinned copy; without one, a
 * pinned npx, never a bare name.
 */
export function hookLine({ hasPackageJson, version }) {
  const guarded = (cli) =>
    `usecontextual_exit=0; ${cli} check --staged || usecontextual_exit=$?; if [ "$usecontextual_exit" -eq ${STAGED_ERRORS_EXIT} ]; then exit 1; elif [ "$usecontextual_exit" -ne 0 ]; then echo "usecontextual couldn't run (exit $usecontextual_exit), so the context check was skipped."; fi`
  if (hasPackageJson) {
    return `if [ -x node_modules/.bin/usecontextual ]; then ${guarded("node_modules/.bin/usecontextual")}; else echo "usecontextual isn't installed here, so the context check was skipped. Run your package manager's install."; fi ${HOOK_MARK}`
  }
  return `${guarded(`npx --yes usecontextual@${version}`)} ${HOOK_MARK}`
}

/** Puts `line` into `file`, replacing an earlier marked line. Returns "created", "appended", "updated" or "unchanged". */
function writeLine(file, line) {
  if (!existsSync(file)) {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, `#!/bin/sh\n${line}\n`)
    chmodSync(file, 0o755)
    return "created"
  }
  const text = readFileSync(file, "utf8")
  const lines = text.split("\n")
  const at = lines.findIndex((l) => l.trimEnd().endsWith(HOOK_MARK))
  if (at >= 0) {
    if (lines[at] === line) return "unchanged"
    lines[at] = line
    writeFileSync(file, lines.join("\n"))
    return "updated"
  }
  writeFileSync(file, `${text}${text.endsWith("\n") || text === "" ? "" : "\n"}${line}\n`)
  chmodSync(file, 0o755)
  return "appended"
}

/**
 * Installs or refreshes the hook line.
 * - core.hooksPath unset: the hooks folder git reports (`git rev-parse --git-path hooks`),
 *   which is right in a plain repo and in a worktree.
 * - husky: its own `.husky/pre-commit`, never the generated `.husky/_` folder.
 * - any other hook manager: nothing is written; the line is returned to print.
 * @returns {{ action: "created" | "appended" | "updated" | "unchanged" | "print", file: string | null, line: string }}
 */
export function installHook({ top, line }) {
  const setting = hooksPathSetting(top)
  if (setting) {
    if (/(^|[\\/])\.husky([\\/]|$)/.test(setting) || existsSync(join(top, ".husky"))) {
      const file = join(top, ".husky", "pre-commit")
      return { action: writeLine(file, line), file: relative(top, file), line }
    }
    return { action: "print", file: null, line }
  }
  const dir = hooksDir(top)
  if (!dir) return { action: "print", file: null, line }
  const file = join(dir, "pre-commit")
  return { action: writeLine(file, line), file, line }
}
