/*
 * Reading a project's context: feature READMEs, the build plan, the shared
 * list, .meta.json, the AGENTS.md block. Pure parsing, no judgment.
 */

import { createHash } from "node:crypto"
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, resolve } from "node:path"

export const STATUSES = ["planned", "in-progress", "shipped", "deprecated"]
export const FEATURE_FILES = ["README.md", "build.md", "tests.md", "notes.md", "log.md"]
export const REQUIRED_FIELDS = ["status", "phase", "covers", "depends-on"]
export const BLOCK_START = "<!-- contextual:start -->"
export const BLOCK_END = "<!-- contextual:end -->"

/** File text with line endings normalized to LF. */
export function readText(path) {
  return readFileSync(path, "utf8").replace(/\r\n/g, "\n")
}

export function lineCount(text) {
  if (!text) return 0
  return text.replace(/\n$/, "").split("\n").length
}

/** sha256 of the LF-normalized text, as stored in .meta.json. */
export function hashText(text) {
  return `sha256:${createHash("sha256").update(text.replace(/\r\n/g, "\n")).digest("hex")}`
}

/** The nearest folder at or above `start` that has context/.meta.json. */
export function findRoot(start) {
  let dir = resolve(start)
  for (;;) {
    if (existsSync(join(dir, "context", ".meta.json"))) return dir
    const parent = dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
}

/** feat/boards → feat-boards (spec 3.4). */
export function branchSlug(branch) {
  return branch.toLowerCase().replace(/[^a-z0-9._-]/g, "-")
}

/** The status file name for a branch: the default branch always uses main.md. */
export function statusFileFor(branch, defaultBranch) {
  return branch === defaultBranch ? "main.md" : `${branchSlug(branch)}.md`
}

export function splitList(value) {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

/** The first sentence of a paragraph, which becomes the feature's line in the index. */
export function firstSentence(paragraph) {
  const text = paragraph.trim().split("\n\n")[0].replace(/\s*\n\s*/g, " ")
  const match = text.match(/^.*?[.!?](?=\s|$)/)
  return (match ? match[0] : text).trim()
}

export function readFeature(featuresDir, name) {
  const dir = join(featuresDir, name)
  const files = readdirSync(dir).sort()
  const feature = { name, dir, files, fields: {}, readme: null }
  const readmePath = join(dir, "README.md")
  if (!existsSync(readmePath)) return feature

  const text = readText(readmePath)
  feature.readme = text
  feature.title = (text.match(/^# (.+)$/m) ?? [])[1] ?? null
  const head = text.split(/^## /m)[0]
  for (const line of head.split("\n")) {
    const m = line.match(/^([a-z-]+):\s*(.*)$/)
    if (m) feature.fields[m[1]] = m[2].trim()
  }
  feature.status = feature.fields.status
  feature.phase = /^\d+$/.test(feature.fields.phase ?? "") ? Number(feature.fields.phase) : null
  feature.covers = splitList(feature.fields.covers)
  feature.dependsOn = splitList(feature.fields["depends-on"]).filter((d) => d !== "none")

  const what = text.split(/^## What it does\n/m)[1]
  feature.summary = what ? firstSentence(what.split(/^## /m)[0]) : null

  const acceptance = (text.split(/^## Acceptance\n/m)[1] ?? "").split(/^## /m)[0]
  feature.acceptanceTotal = (acceptance.match(/^- \[[ x]\] /gm) ?? []).length
  feature.acceptanceTicked = (acceptance.match(/^- \[x\] /gm) ?? []).length
  return feature
}

export function readFeatures(root) {
  const featuresDir = join(root, "context", "features")
  if (!existsSync(featuresDir)) return []
  return readdirSync(featuresDir)
    .filter((name) => statSync(join(featuresDir, name)).isDirectory())
    .sort()
    .map((name) => readFeature(featuresDir, name))
}

/**
 * build-plan.md → phases. Headings that don't parse come back in `problems`
 * rather than being guessed at.
 */
export function readPlan(text) {
  const phases = []
  const problems = []
  for (const block of text.split(/^## /m).slice(1)) {
    const heading = block.split("\n")[0].trim()
    const m = heading.match(/^Phase (\d+) — (.+?)\s+\[(planned|in progress|done)\]$/)
    if (!m) {
      problems.push(`can't read the phase heading "## ${heading}" (expected "## Phase 1 — Name  [planned]")`)
      continue
    }
    const items = []
    for (const line of block.split("\n").slice(1)) {
      const item = line.match(/^- \[([ x])\] features\/(\S+)/)
      if (item) items.push({ name: item[2], ticked: item[1] === "x" })
    }
    phases.push({ number: Number(m[1]), name: m[2], marker: m[3], items })
  }
  return { phases, problems }
}

/** The globs on the `shared:` line of architecture.md, or null when there is no such line. */
export function readShared(architectureText) {
  const m = architectureText.match(/^shared:[ \t]*(.*)$/m)
  return m ? splitList(m[1]) : null
}

/** The Contextual block of AGENTS.md, markers included, or null. */
export function contextualBlock(agentsText) {
  const start = agentsText.indexOf(BLOCK_START)
  const end = agentsText.indexOf(BLOCK_END)
  if (start === -1 || end === -1 || end < start) return null
  return agentsText.slice(start, end + BLOCK_END.length)
}

const DONE = new Set(["shipped", "deprecated"])

/** Is every feature in this phase shipped or deprecated? */
export function phaseIsDone(phase, featuresByName) {
  return phase.items.length > 0 && phase.items.every((item) => DONE.has(featuresByName.get(item.name)?.status))
}

/**
 * The feature index, rebuilt from the READMEs and the plan (spec 4.3): a
 * finished phase is one line; an open phase is a heading and a table.
 */
export function buildIndex({ cli, phases, featuresByName }) {
  const header = `# Features\nRebuilt by \`${cli} check --fix\` from each feature's README and \`build-plan.md\`. Don't edit by hand.\n`
  if (phases.length === 0) {
    return `${header}\nNo features yet. \`contextual-setup\` adds them from the build plan.\n`
  }
  const collapsed = []
  const open = []
  for (const phase of phases) {
    if (phaseIsDone(phase, featuresByName)) {
      collapsed.push(`Phase ${phase.number} — ${phase.name}: done · ${phase.items.map((i) => i.name).join(", ")}`)
      continue
    }
    const rows = phase.items
      .filter((item) => featuresByName.has(item.name))
      .map((item) => {
        const f = featuresByName.get(item.name)
        return `| [${f.name}](${f.name}/README.md) | ${f.status} | ${f.summary} |`
      })
    open.push(`## Phase ${phase.number} — ${phase.name}\n| Feature | Status | What it does |\n|---|---|---|\n${rows.join("\n")}`)
  }
  let out = header
  if (collapsed.length) out += `\n${collapsed.join("\n")}\n`
  for (const section of open) out += `\n${section}\n`
  return out
}
