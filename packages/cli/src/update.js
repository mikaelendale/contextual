/*
 * `usecontextual update` (spec 6): refreshes the fixed parts to this version,
 * and nothing else. The fixed parts are the Contextual block in AGENTS.md, the
 * CLAUDE.md import, context/design/deslop.md (and its hash), both skill copies,
 * the hook line and the version in .meta.json. Project content is never read
 * for rewriting, let alone changed.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

import { assetRoot, INSTALLED_SKILLS } from "./assets.js"
import { BLOCK_END, BLOCK_START, findRoot, hashText, readText } from "./context.js"
import { hookLine, installHook } from "./hook.js"
import { installSkills, templateBlock } from "./init.js"

/** @returns {{ root: string, changes: string[], hook: object }} */
export function update({ cwd, version }) {
  const root = findRoot(cwd)
  if (!root) throw new UpdateError("No context/.meta.json here or in any folder above it. Run `init` first.")
  const assets = assetRoot()
  const metaPath = join(root, "context", ".meta.json")
  const meta = JSON.parse(readText(metaPath))
  // A pinned npx (a repo with no package.json) moves to this version; `npx usecontextual` stays as it is.
  const cli = (meta.cli ?? "npx usecontextual").replace(/usecontextual@[0-9][^\s]*/, `usecontextual@${version}`)
  const changes = []

  const agentsPath = join(root, "AGENTS.md")
  const block = templateBlock(assets, cli)
  if (!existsSync(agentsPath)) {
    writeFileSync(agentsPath, `${block}\n`)
    changes.push("AGENTS.md: created with the Contextual block")
  } else {
    const text = readFileSync(agentsPath, "utf8")
    const start = text.indexOf(BLOCK_START)
    const end = text.indexOf(BLOCK_END)
    if (start === -1 || end === -1) {
      writeFileSync(agentsPath, `${text}${text.endsWith("\n") ? "" : "\n"}\n${block}\n`)
      changes.push("AGENTS.md: added the Contextual block after the existing content")
    } else {
      const next = text.slice(0, start) + block + text.slice(end + BLOCK_END.length)
      if (next !== text) {
        writeFileSync(agentsPath, next)
        changes.push("AGENTS.md: refreshed the Contextual block")
      }
    }
  }

  const claudePath = join(root, "CLAUDE.md")
  const claude = existsSync(claudePath) ? readFileSync(claudePath, "utf8") : null
  if (claude === null || !/^@AGENTS\.md[ \t]*$/m.test(claude)) {
    writeFileSync(claudePath, `${claude ?? ""}${claude && !claude.endsWith("\n") ? "\n" : ""}@AGENTS.md\n`)
    changes.push("CLAUDE.md: added the @AGENTS.md import")
  }

  const deslopPath = join(root, "context", "design", "deslop.md")
  const deslop = readText(join(assets, "templates", "repo", "context", "design", "deslop.md"))
  if (!existsSync(deslopPath) || readText(deslopPath) !== deslop) {
    writeFileSync(deslopPath, deslop)
    changes.push("context/design/deslop.md: replaced with this version's")
  }

  const before = readFileSync(metaPath, "utf8")
  let after = before.replace(/("deslop"\s*:\s*)(null|"[^"]*")/, `$1"${hashText(deslop)}"`)
  after = after.replace(/("contextual"\s*:\s*)"[^"]*"/, `$1"${version}"`)
  after = after.replace(/("cli"\s*:\s*)"[^"]*"/, `$1${JSON.stringify(cli)}`)
  if (after !== before) {
    writeFileSync(metaPath, after)
    changes.push("context/.meta.json: version and deslop.md hash")
  }

  const skillDirs = Array.isArray(meta.skillDirs) && meta.skillDirs.length ? meta.skillDirs : [".agents/skills", ".claude/skills"]
  installSkills(root, assets, skillDirs)
  changes.push(`skills refreshed in ${skillDirs.join(" and ")} (${INSTALLED_SKILLS.join(", ")})`)

  const hook = installHook({ top: root, line: hookLine({ hasPackageJson: existsSync(join(root, "package.json")), version }) })
  return { root, changes, hook }
}

export class UpdateError extends Error {}
