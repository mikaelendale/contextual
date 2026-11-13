/*
 * `usecontextual which <path>`: who owns a file (spec 3.8). A feature through
 * its `covers:` globs, the `shared:` line in architecture.md, or no one. The
 * most specific match wins, and `which` names the broader globs it beat.
 * `which --unowned` lists the code files that no one owns.
 */

import { existsSync } from "node:fs"
import { isAbsolute, join, relative, resolve } from "node:path"

import { readFeatures, readShared, readText } from "./context.js"
import { listFiles } from "./files.js"
import { SHARED, isCodeFile, ownerOf } from "./owners.js"

function skillDirsOf(root) {
  try {
    return JSON.parse(readText(join(root, "context", ".meta.json"))).skillDirs ?? []
  } catch {
    return [] // check reports a broken .meta.json
  }
}

const sharedOf = (root) => {
  const architecture = join(root, "context", "architecture.md")
  return existsSync(architecture) ? (readShared(readText(architecture)) ?? []) : []
}

/** Contextual's own files need no owner: context/, AGENTS.md, CLAUDE.md and the skill folders. */
export function isContextualFile(rel, skillDirs) {
  return rel.startsWith("context/") || rel === "AGENTS.md" || rel === "CLAUDE.md" || skillDirs.some((d) => rel.startsWith(`${d.replace(/\/$/, "")}/`))
}

/**
 * @returns {{ path: string, outside?: true, contextual?: true, owner: object | null, shared: boolean, tied: string[], beaten: { owner: string, glob: string }[] }}
 *   `owner` is the feature that owns the path; `shared` is true when the shared: line does; `tied` names owners that tie.
 */
export function which({ root, path, cwd = root }) {
  const absolute = isAbsolute(path) ? path : resolve(cwd, path)
  const rel = relative(root, absolute).split("\\").join("/")
  if (rel === "" || rel.startsWith("../") || rel === ".." || isAbsolute(rel)) return { path: rel, outside: true }
  if (isContextualFile(rel, skillDirsOf(root))) return { path: rel, contextual: true, owner: null, shared: false, tied: [], beaten: [] }

  const features = readFeatures(root)
  const result = ownerOf(rel, features, sharedOf(root))
  return {
    path: rel,
    owner: result.owner && result.owner !== SHARED ? features.find((f) => f.name === result.owner) : null,
    shared: result.owner === SHARED,
    tied: result.tied,
    beaten: result.beaten,
  }
}

/** The code files that no feature covers and that aren't on the shared: line. */
export function unowned({ root }) {
  const skillDirs = skillDirsOf(root)
  const features = readFeatures(root)
  const shared = sharedOf(root)
  return listFiles(root)
    .filter((p) => !isContextualFile(p, skillDirs) && isCodeFile(p))
    .filter((p) => {
      const r = ownerOf(p, features, shared)
      return !r.owner && r.tied.length === 0
    })
}
