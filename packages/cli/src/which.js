/*
 * `usecontextual which <path>`: who owns a file (spec 3.8). A feature through
 * its `covers:` globs, the `shared:` line in architecture.md, or no one.
 */

import { existsSync } from "node:fs"
import { isAbsolute, join, relative, resolve } from "node:path"

import { readFeatures, readShared, readText } from "./context.js"
import { matches } from "./glob.js"

export function which({ root, path, cwd = root }) {
  const absolute = isAbsolute(path) ? path : resolve(cwd, path)
  const rel = relative(root, absolute).split("\\").join("/")
  if (rel === "" || rel.startsWith("../") || rel === ".." || isAbsolute(rel)) return { path: rel, outside: true }

  let skillDirs = []
  try {
    skillDirs = JSON.parse(readText(join(root, "context", ".meta.json"))).skillDirs ?? []
  } catch {
    // check reports a broken .meta.json
  }
  const contextual =
    rel.startsWith("context/") || rel === "AGENTS.md" || rel === "CLAUDE.md" || skillDirs.some((d) => rel.startsWith(`${d.replace(/\/$/, "")}/`))
  if (contextual) return { path: rel, contextual: true, owners: [], shared: false }

  const owners = readFeatures(root).filter((f) => f.covers.some((glob) => matches(rel, glob)))
  const architecture = join(root, "context", "architecture.md")
  const shared = existsSync(architecture) ? (readShared(readText(architecture)) ?? []) : []
  return { path: rel, owners, shared: shared.some((glob) => matches(rel, glob)) }
}
