/*
 * `usecontextual check --fix`: repairs what is mechanical (spec section 6),
 * then `check` runs as usual. So far it rebuilds context/features/_index.md
 * and stores the idea.md hash once setup has written idea.md. Creating a
 * missing status file comes with `init`, which ships the templates.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

import { buildIndex, hashText, readFeatures, readPlan, readText } from "./context.js"

/** @returns {string[]} one line per change made */
export function fix({ root }) {
  const changes = []
  const ctx = join(root, "context")
  const metaPath = join(ctx, ".meta.json")
  let meta = null
  try {
    meta = JSON.parse(readText(metaPath))
  } catch {
    // check reports a broken .meta.json; nothing here can repair it
  }
  const cli = meta?.cli ?? "npx usecontextual"

  const planPath = join(ctx, "build-plan.md")
  const indexPath = join(ctx, "features", "_index.md")
  if (existsSync(planPath) && existsSync(join(ctx, "features"))) {
    const { phases } = readPlan(readText(planPath))
    const featuresByName = new Map(readFeatures(root).map((f) => [f.name, f]))
    const index = buildIndex({ cli, phases, featuresByName })
    if (!existsSync(indexPath) || readText(indexPath) !== index) {
      writeFileSync(indexPath, index)
      changes.push("rebuilt context/features/_index.md")
    }
  }

  const ideaPath = join(ctx, "idea.md")
  if (meta && existsSync(ideaPath) && !meta.hashes?.idea) {
    const hash = hashText(readText(ideaPath))
    const raw = readFileSync(metaPath, "utf8")
    // Keep the file's own layout: replace only the null value when it's there.
    const replaced = raw.replace(/("idea"\s*:\s*)null/, `$1"${hash}"`)
    if (replaced !== raw) {
      writeFileSync(metaPath, replaced)
    } else {
      meta.hashes = { ...(meta.hashes ?? {}), idea: hash }
      writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`)
    }
    changes.push("stored the idea.md hash in context/.meta.json")
  }

  return changes
}
