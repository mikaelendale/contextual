/*
 * The `--staged` rule (spec 6.2): when a commit changes a feature's code, the
 * same commit must carry that feature's log entry and the branch's status
 * file. Problems are errors on any branch but the default one, where they are
 * warnings so small fixes and hand edits on main aren't stopped.
 */

import { existsSync, readFileSync } from "node:fs"
import { join, relative } from "node:path"

import { readFeatures, readShared, readText, statusFileFor } from "./context.js"
import { repoTop, stagedFiles } from "./git.js"
import { matches } from "./glob.js"

function cliCommand(root) {
  try {
    return JSON.parse(readFileSync(join(root, "context", ".meta.json"), "utf8")).cli ?? "npx --no-install usecontextual"
  } catch {
    return "npx --no-install usecontextual"
  }
}

/**
 * @param {{ root: string, branch: string | null, defaultBranch: string, skillDirs: string[] }} options
 * @returns {{ level: "error" | "warning", file: string | null, message: string }[]}
 */
export function checkStaged({ root, branch, defaultBranch, skillDirs }) {
  const findings = []
  const onDefault = !branch || branch === defaultBranch
  const problem = (file, message) => findings.push({ level: onDefault ? "warning" : "error", file, message })
  const note = (file, message) => findings.push({ level: "warning", file, message })

  const top = repoTop(root) ?? root
  const prefix = relative(top, root).split("\\").join("/")
  const staged = stagedFiles(root)
    .filter((p) => !prefix || p.startsWith(`${prefix}/`))
    .map((p) => (prefix ? p.slice(prefix.length + 1) : p))
  const own = (p) => p.startsWith("context/") || p === "AGENTS.md" || p === "CLAUDE.md" || skillDirs.some((d) => p.startsWith(`${d.replace(/\/$/, "")}/`))
  const code = staged.filter((p) => !own(p))
  if (code.length === 0) return findings

  const features = readFeatures(root)
  const architecture = join(root, "context", "architecture.md")
  const shared = existsSync(architecture) ? (readShared(readText(architecture)) ?? []) : []
  const touched = new Map()
  let sharedCount = 0
  for (const p of code) {
    const owners = features.filter((f) => f.covers.some((g) => matches(p, g)))
    if (owners.length > 0) {
      for (const f of owners) touched.set(f.name, [...(touched.get(f.name) ?? []), p])
    } else if (shared.some((g) => matches(p, g))) {
      sharedCount++
    } else {
      note(p, "no feature owns this path. Add it to a feature's covers: or to the shared: line in context/architecture.md")
    }
  }

  const statusFile = branch ? `context/status/${statusFileFor(branch, defaultBranch)}` : null
  for (const [name, paths] of touched) {
    const log = `context/features/${name}/log.md`
    if (!staged.includes(log)) {
      problem(log, `isn't in this commit, but ${name}'s code is (${paths.slice(0, 3).join(", ")}${paths.length > 3 ? ", …" : ""}). Add a log entry for the change`)
    }
  }
  if (touched.size > 0 && statusFile && !staged.includes(statusFile)) {
    if (!existsSync(join(root, statusFile))) {
      problem(statusFile, `doesn't exist. Run \`${cliCommand(root)} check --fix\` to create it, fill it in, and stage it with this commit`)
    } else {
      problem(statusFile, "isn't in this commit. Rewrite the branch's status file with what this change did")
    }
  }
  if (touched.size === 0 && sharedCount > 0) {
    note(null, "this commit changes only shared code. contextual-sync can record it against the features it serves later")
  }
  return findings
}
