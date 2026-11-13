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
 * The line the hook runs. With a package.json it calls the local pinned copy,
 * and says so (without blocking) when that copy isn't installed yet. Without
 * one it calls a pinned npx, never a bare name.
 */
export function hookLine({ hasPackageJson, version }) {
  if (hasPackageJson) {
    return `if [ -x node_modules/.bin/usecontextual ]; then node_modules/.bin/usecontextual check --staged || exit 1; else echo "usecontextual isn't installed here, so the context check was skipped. Run your package manager's install."; fi ${HOOK_MARK}`
  }
  return `npx --yes usecontextual@${version} check --staged || exit 1 ${HOOK_MARK}`
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
