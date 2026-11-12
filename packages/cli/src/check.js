/*
 * `usecontextual check`: validates a project's context against the spec
 * (docs/spec.md, section 6.1). It only reads; it never changes a file.
 * Not built yet: --fix and --staged (spec 6.2).
 */

import { existsSync, readdirSync, statSync } from "node:fs"
import { dirname, join, relative } from "node:path"

import {
  BLOCK_END,
  BLOCK_START,
  FEATURE_FILES,
  REQUIRED_FIELDS,
  STATUSES,
  buildIndex,
  contextualBlock,
  hashText,
  lineCount,
  phaseIsDone,
  readFeatures,
  readPlan,
  readShared,
  readText,
  statusFileFor,
} from "./context.js"
import { currentBranch, listFiles } from "./files.js"
import { matches } from "./glob.js"

const DEFAULT_CAPS = { agentsBlockLines: 60, statusLines: 40, featureReadmeLines: 60, startTokens: 3000 }
const REQUIRED_CONTEXT_FILES = [
  "build-plan.md",
  "architecture.md",
  "conventions.md",
  "status/main.md",
  "features/_index.md",
  "stack/_index.md",
  "stack/overview.md",
  "stack/requirements.md",
  "stack/deploy.md",
  "design/deslop.md",
  "design/principles.md",
  "design/layouts.md",
  "design/components.md",
]
const META_KEYS = ["contextual", "defaultBranch", "cli", "skillDirs", "lastSync", "hashes"]
const PORTABLE_SKILL_FIELDS = new Set(["name", "description", "license", "compatibility", "metadata"])
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/
const LOG_HEADING = /^(\d{4}-\d{2}-\d{2}) · \S+ · \S.*$/
const DECISION_FILE = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(-[a-z0-9]+)*\.md$/
const stripComments = (text) => text.replace(/<!--[\s\S]*?-->/g, "")

/** The four results design/deslop.md allows in a log entry. Returns what's wrong with one, or null. */
function deslopProblem(result) {
  const shown = `"Deslop: ${result}"`
  if (/^pass\b/i.test(result)) {
    return /^pass \(.*\S.*\)\.?$/i.test(result) ? null : `${shown} must say how it was checked: "Deslop: pass (<screenshot path or tool>)"`
  }
  if (/^fixed\b/i.test(result)) return /^fixed:?\s+\S/i.test(result) ? null : `${shown} must say what was fixed: "Deslop: fixed <what>"`
  if (/^not verified\b/i.test(result)) {
    return /^not verified[:,]?\s+\S/i.test(result) ? null : `${shown} must give the reason: "Deslop: not verified <reason>"`
  }
  if (/^not UI\.?$/i.test(result)) return null
  return `${shown} isn't a deslop result: use "pass (<how checked>)", "fixed <what>", "not verified <reason>" or "not UI"`
}

function walkMarkdown(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return walkMarkdown(path)
    return name.endsWith(".md") ? [path] : []
  })
}

/**
 * @param {{ root: string, branch?: string | null }} options
 * @returns {{ root: string, branch: string | null, findings: { level: "error" | "warning", file: string | null, message: string }[] }}
 */
export function check({ root, branch = null }) {
  const findings = []
  const error = (file, message) => findings.push({ level: "error", file, message })
  const warn = (file, message) => findings.push({ level: "warning", file, message })
  const ctx = join(root, "context")
  const rel = (path) => relative(root, path).split("\\").join("/")

  // --- .meta.json
  let meta = {}
  try {
    meta = JSON.parse(readText(join(ctx, ".meta.json")))
  } catch (e) {
    error("context/.meta.json", `isn't valid JSON (${e.message})`)
  }
  for (const key of META_KEYS) if (!(key in meta)) error("context/.meta.json", `is missing "${key}"`)
  if (meta.lastSync && !("commit" in meta.lastSync && "date" in meta.lastSync)) {
    error("context/.meta.json", `"lastSync" needs both "commit" and "date" (spec 3.7)`)
  }
  const caps = { ...DEFAULT_CAPS, ...(meta.caps ?? {}) }
  const cli = meta.cli ?? "npx usecontextual"
  const defaultBranch = meta.defaultBranch ?? "main"
  const skillDirs = Array.isArray(meta.skillDirs) ? meta.skillDirs : []

  // --- AGENTS.md and CLAUDE.md
  const agentsPath = join(root, "AGENTS.md")
  if (!existsSync(agentsPath)) {
    error("AGENTS.md", "is missing")
  } else {
    const text = readText(agentsPath)
    const block = contextualBlock(text)
    if (!block) {
      error("AGENTS.md", `has no Contextual block (${BLOCK_START} … ${BLOCK_END})`)
    } else {
      if (text.split(BLOCK_START).length > 2 || text.split(BLOCK_END).length > 2) error("AGENTS.md", "has more than one Contextual block")
      const n = lineCount(block)
      if (n > caps.agentsBlockLines) error("AGENTS.md", `the Contextual block is ${n} lines; the cap is ${caps.agentsBlockLines}`)
    }
  }
  const claudePath = join(root, "CLAUDE.md")
  if (!existsSync(claudePath)) {
    error("CLAUDE.md", "is missing, so Claude Code won't read AGENTS.md. It needs the line @AGENTS.md")
  } else if (!/^@AGENTS\.md[ \t]*$/m.test(readText(claudePath))) {
    error("CLAUDE.md", "doesn't import AGENTS.md. Add the line @AGENTS.md")
  }

  // --- required files
  for (const file of REQUIRED_CONTEXT_FILES) {
    if (!existsSync(join(ctx, file))) error(`context/${file}`, "is missing")
  }
  const setupDone = existsSync(join(ctx, "idea.md"))
  if (!setupDone) warn("context/idea.md", "doesn't exist yet: contextual-setup writes it")

  // --- features
  const features = readFeatures(root)
  const byName = new Map(features.map((f) => [f.name, f]))
  for (const f of features) {
    const where = `context/features/${f.name}`
    const readme = `${where}/README.md`
    if (!KEBAB.test(f.name)) error(where, "feature folders are named in kebab-case (lowercase words joined by -)")
    if (!f.readme) {
      error(readme, "is missing")
      continue
    }
    for (const field of REQUIRED_FIELDS) if (!(field in f.fields)) error(readme, `is missing its "${field}:" line`)
    if ("status" in f.fields && !STATUSES.includes(f.status)) error(readme, `has status "${f.status}"; use one of: ${STATUSES.join(", ")}`)
    if ("phase" in f.fields && f.phase === null) error(readme, `has phase "${f.fields.phase}"; use the phase number`)
    if ("covers" in f.fields && f.covers.length === 0) error(readme, `"covers:" lists no paths`)
    for (const dep of f.dependsOn) if (!byName.has(dep)) error(readme, `depends on "${dep}", which isn't a feature folder`)
    if (!f.summary) error(readme, `needs a "## What it does" section; its first sentence goes in the index`)
    if (f.acceptanceTotal === 0) error(readme, `needs at least one checkbox under "## Acceptance"`)
    if (f.status === "shipped" && f.acceptanceTicked < f.acceptanceTotal) {
      error(readme, `is shipped, but ${f.acceptanceTotal - f.acceptanceTicked} acceptance box(es) are unticked`)
    }
    const n = lineCount(f.readme)
    if (n > caps.featureReadmeLines) error(readme, `is ${n} lines; the cap is ${caps.featureReadmeLines}. Split the feature into smaller ones`)

    if (STATUSES.includes(f.status)) {
      const expected = f.status === "planned" ? ["README.md"] : FEATURE_FILES
      for (const file of expected) {
        if (!f.files.includes(file)) error(`${where}/${file}`, `is missing (a ${f.status} feature has ${expected.join(", ")})`)
      }
      if (f.status === "planned") {
        for (const file of FEATURE_FILES.slice(1)) {
          if (f.files.includes(file)) error(`${where}/${file}`, "shouldn't exist yet: a planned feature has only README.md")
        }
      }
      for (const file of f.files) {
        if (!FEATURE_FILES.includes(file)) warn(`${where}/${file}`, "isn't one of the feature files (README, build, tests, notes, log)")
      }
    }
  }

  // --- build plan
  let phases = []
  if (existsSync(join(ctx, "build-plan.md"))) {
    const plan = readPlan(readText(join(ctx, "build-plan.md")))
    phases = plan.phases
    for (const problem of plan.problems) error("context/build-plan.md", problem)
    const planned = new Map()
    for (const phase of phases) {
      for (const item of phase.items) {
        if (planned.has(item.name)) error("context/build-plan.md", `lists features/${item.name} more than once`)
        planned.set(item.name, phase)
        const f = byName.get(item.name)
        if (!f) {
          error("context/build-plan.md", `lists features/${item.name}, which has no folder`)
          continue
        }
        if (f.phase !== null && f.phase !== phase.number) {
          error(`context/features/${f.name}/README.md`, `says phase ${f.phase}, but build-plan.md has it in phase ${phase.number}`)
        }
        if (item.ticked && !["shipped", "deprecated"].includes(f.status)) {
          error("context/build-plan.md", `features/${f.name} is ticked, but its status is ${f.status}`)
        }
        if (!item.ticked && f.status === "shipped") error("context/build-plan.md", `features/${f.name} is shipped but not ticked`)
      }
    }
    for (const f of features) if (!planned.has(f.name)) error(`context/features/${f.name}`, "isn't in build-plan.md")
    for (const phase of phases) {
      const done = phaseIsDone(phase, byName)
      if (done && phase.marker !== "done") error("context/build-plan.md", `every feature in Phase ${phase.number} is finished; mark it [done]`)
      if (!done && phase.marker === "done") error("context/build-plan.md", `Phase ${phase.number} is marked [done], but not every feature in it is finished`)
    }
  }

  // --- the feature index is derived, so it must match what would be rebuilt
  const indexPath = join(ctx, "features", "_index.md")
  if (existsSync(indexPath) && readText(indexPath) !== buildIndex({ cli, phases, featuresByName: byName })) {
    error("context/features/_index.md", "is out of date: it doesn't match the feature READMEs and build-plan.md")
  }

  // --- status files
  const statusDir = join(ctx, "status")
  if (existsSync(statusDir)) {
    for (const name of readdirSync(statusDir).filter((n) => n.endsWith(".md"))) {
      const n = lineCount(readText(join(statusDir, name)))
      if (n > caps.statusLines) error(`context/status/${name}`, `is ${n} lines; the cap is ${caps.statusLines}`)
    }
  }
  const resolvedBranch = branch ?? currentBranch(root)
  if (!resolvedBranch) {
    warn(null, "couldn't tell the current branch, so its status file wasn't checked (pass --branch <name>)")
  } else {
    const file = statusFileFor(resolvedBranch, defaultBranch)
    if (!existsSync(join(statusDir, file))) error(`context/status/${file}`, `is missing: the branch ${resolvedBranch} needs its status file`)
  }

  // --- every markdown file: links, leftover guidance, log entries
  const markdown = [...(existsSync(agentsPath) ? [agentsPath] : []), ...walkMarkdown(ctx)]
  for (const path of markdown) {
    const text = readText(path)
    const file = rel(path)
    const visible = stripComments(text)
    for (const m of visible.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const target = m[1]
      if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("#")) continue
      const targetPath = target.split("#")[0].split("?")[0]
      let decoded = targetPath
      try {
        decoded = decodeURI(targetPath)
      } catch {
        // keep it as written
      }
      if (targetPath && !existsSync(join(dirname(path), decoded))) error(file, `links to ${target}, which doesn't exist`)
    }
    if (setupDone && text.includes("<!-- fill:")) warn(file, "still has template guidance (<!-- fill: … -->) to replace")
    if (path.endsWith(`${"log.md"}`) && file.startsWith("context/features/")) {
      let previous = null
      for (const m of visible.matchAll(/^## (.+)$/gm)) {
        const heading = m[1].trim()
        const date = heading.match(LOG_HEADING)?.[1]
        if (!date) {
          warn(file, `"## ${heading}" should read "## YYYY-MM-DD · agent · what was done"`)
          continue
        }
        if (previous && date > previous) warn(file, `entries should be newest first ("${heading}" comes after an older entry)`)
        previous = date
      }
      for (const m of visible.matchAll(/^[ \t]*(?:[-*][ \t]+)?Deslop:[ \t]*(.*)$/gm)) {
        const problem = deslopProblem(m[1].trim())
        if (problem) error(file, problem)
      }
    }
  }

  const decisionsDir = join(ctx, "decisions")
  if (existsSync(decisionsDir)) {
    for (const name of readdirSync(decisionsDir)) {
      if (name.endsWith(".md") && name !== "README.md" && !DECISION_FILE.test(name)) {
        warn(`context/decisions/${name}`, "decision files are named YYYY-MM-DD-<slug>.md")
      }
    }
  }

  // --- hashes (warnings only)
  if (setupDone) {
    const ideaHash = hashText(readText(join(ctx, "idea.md")))
    if (!meta.hashes?.idea) warn("context/.meta.json", "has no hash for idea.md yet")
    else if (meta.hashes.idea !== ideaHash) warn("context/idea.md", "has changed since setup. It holds the owner's own words and shouldn't be edited")
  }
  const deslopPath = join(ctx, "design", "deslop.md")
  if (existsSync(deslopPath) && meta.hashes?.deslop && meta.hashes.deslop !== hashText(readText(deslopPath))) {
    warn("context/design/deslop.md", `differs from the version Contextual ships; \`${cli} update\` restores it`)
  }

  // --- skills: present, valid, identical in every folder
  const present = skillDirs.filter((d) => existsSync(join(root, d)))
  if (skillDirs.length > 0 && present.length === 0) {
    warn(null, `the skills aren't installed (${skillDirs.join(", ")}); \`${cli} update\` installs them`)
  } else {
    for (const d of skillDirs) if (!present.includes(d)) warn(d, "is missing; .meta.json lists it as a skill folder")
    for (const d of present) {
      for (const name of readdirSync(join(root, d))) {
        if (statSync(join(root, d, name)).isDirectory()) checkSkill(join(root, d, name), `${d}/${name}`, name, error)
      }
    }
    for (const d of present.slice(1)) compareTrees(join(root, present[0]), join(root, d), present[0], d, error)
  }

  // --- who owns each file (spec 3.8)
  const architecturePath = join(ctx, "architecture.md")
  const shared = existsSync(architecturePath) ? readShared(readText(architecturePath)) : null
  if (existsSync(architecturePath) && shared === null) {
    warn("context/architecture.md", `has no "shared:" line, so shared code can't be told apart from code no one owns`)
  }
  const ownFile = (p) =>
    p.startsWith("context/") || p === "AGENTS.md" || p === "CLAUDE.md" || skillDirs.some((d) => p.startsWith(`${d.replace(/\/$/, "")}/`))
  const projectFiles = listFiles(root).filter((p) => !ownFile(p))
  const codeFiles = projectFiles.filter((p) => p.includes("/") || !/^(LICENSE.*|[^/]+\.(md|txt))$/i.test(p))
  if (codeFiles.length === 0) {
    warn(null, "found no code outside context/, so the covers: and shared: paths weren't checked")
  } else {
    for (const f of features) {
      if (f.status !== "shipped" && f.status !== "in-progress") continue
      for (const glob of f.covers) {
        if (projectFiles.some((p) => matches(p, glob))) continue
        const report = f.status === "shipped" ? error : warn
        report(`context/features/${f.name}/README.md`, `covers ${glob}, which matches no files`)
      }
    }
    for (const glob of shared ?? []) {
      if (!projectFiles.some((p) => matches(p, glob))) warn("context/architecture.md", `shared: ${glob} matches no files`)
    }
    for (const p of projectFiles) {
      const owners = features.filter((f) => f.covers.some((g) => matches(p, g))).map((f) => f.name)
      const isShared = (shared ?? []).some((g) => matches(p, g))
      if (owners.length > 1) error(p, `is covered by more than one feature: ${owners.join(", ")}`)
      else if (owners.length === 1 && isShared) error(p, `is covered by ${owners[0]} and is also on the shared: line`)
    }
  }

  return { root, branch: resolvedBranch, findings }
}

function readFrontmatter(text) {
  if (!text.startsWith("---\n")) return null
  const end = text.indexOf("\n---", 3)
  if (end === -1) return null
  const fields = {}
  const lines = text.slice(4, end).split("\n")
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!m) continue
    let value = m[2].trim()
    if (/^[>|][+-]?$/.test(value)) {
      const block = []
      while (i + 1 < lines.length && /^\s+\S|^\s*$/.test(lines[i + 1])) block.push(lines[++i].trim())
      value = block.join(" ").trim()
    }
    fields[m[1]] = value.replace(/^(["'])(.*)\1$/, "$2")
  }
  return fields
}

function checkSkill(dir, label, folderName, error) {
  const skillPath = join(dir, "SKILL.md")
  if (!existsSync(skillPath)) {
    error(`${label}/SKILL.md`, "is missing")
    return
  }
  const fields = readFrontmatter(readText(skillPath))
  if (!fields) {
    error(`${label}/SKILL.md`, "needs frontmatter that starts on line 1 with --- and closes with ---")
    return
  }
  for (const key of Object.keys(fields)) {
    if (!PORTABLE_SKILL_FIELDS.has(key)) error(`${label}/SKILL.md`, `uses "${key}", which not every harness accepts (use name, description, license, compatibility, metadata)`)
  }
  const name = fields.name ?? ""
  if (name !== folderName) error(`${label}/SKILL.md`, `name "${name}" must equal the folder name "${folderName}"`)
  if (!KEBAB.test(name) || name.length > 64) error(`${label}/SKILL.md`, "name must be lowercase letters, digits and single hyphens, 64 characters at most")
  const description = fields.description ?? ""
  if (description.length === 0 || description.length > 1024) error(`${label}/SKILL.md`, `description must be 1 to 1,024 characters (it is ${description.length})`)
}

function compareTrees(a, b, labelA, labelB, error) {
  const list = (dir, prefix = "") =>
    readdirSync(dir)
      .sort()
      .flatMap((name) => (statSync(join(dir, name)).isDirectory() ? list(join(dir, name), `${prefix}${name}/`) : [`${prefix}${name}`]))
  const filesA = list(a)
  const filesB = list(b)
  for (const f of new Set([...filesA, ...filesB])) {
    if (!filesA.includes(f) || !filesB.includes(f)) {
      error(`${filesA.includes(f) ? labelB : labelA}/${f}`, `is missing; the skill copies in ${labelA} and ${labelB} must be identical`)
    } else if (readText(join(a, f)) !== readText(join(b, f))) {
      error(`${labelB}/${f}`, `differs from ${labelA}/${f}; the skill copies must be identical`)
    }
  }
}
