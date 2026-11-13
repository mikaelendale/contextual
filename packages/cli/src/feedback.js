/*
 * Agent feedback (spec 6.5). `usecontextual feedback` turns one note about a
 * problem with Contextual itself into a prefilled review form on the site:
 * the report travels in the link's fragment, which browsers never send to a
 * server, and the person decides whether to press Send. This module builds
 * and opens the link; it never sends anything.
 *
 * `feedback on` and `feedback off` add and remove the feedback block in
 * AGENTS.md and record the choice in context/.meta.json.
 */

import { spawnSync } from "node:child_process"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { basename, join } from "node:path"

import { BLOCK_END, readFeatures, readText } from "./context.js"

export const FEEDBACK_URL = "https://contextual.mikaelen.site/agent/feedback"
export const FEEDBACK_START = "<!-- contextual-feedback:start -->"
export const FEEDBACK_END = "<!-- contextual-feedback:end -->"

/** The values each choice field allows. The site checks the same lists. */
export const CHOICES = {
  harness: ["claude-code", "codex", "opencode", "antigravity", "other"],
  skill: ["setup", "next", "sync", "none"],
  category: ["conflicting-rules", "unclear-skill-step", "check-false-alarm", "check-miss", "hook-friction", "template-gap", "token-cost", "structure-preference"],
  severity: ["blocked", "worked-around", "annoyance", "idea"],
}
export const TEXT_FIELDS = ["happened", "expected", "suggestion"]
export const TEXT_CAP = 600
const MODEL_CAP = 64
const FILE_CAP = 120
/** The longest link the CLI hands over: well under Windows' 8,191-character command line, and short enough to copy. */
export const LINK_CAP = 4000

const HARNESS_FOLDERS = [".agents", ".agent", ".claude", ".codex", ".opencode"]

// ---------------------------------------------------------------------------
// Turning it on and off

/** The block, filled in for this repo's CLI command. */
export function feedbackBlock(assets, cli) {
  return readText(join(assets, "templates", "agent-feedback-block.md")).replaceAll("{{cli}}", cli).trimEnd()
}

/** Whether the owner turned agent feedback on: `"feedback": "on"` in .meta.json. Anything else is off. */
export function feedbackIsOn(meta) {
  return meta?.feedback === "on"
}

/** AGENTS.md with the feedback block put in (after the Contextual block), replaced, or taken out. Nothing else changes. */
export function withFeedbackBlock(agentsText, block) {
  const without = withoutFeedbackBlock(agentsText)
  if (block === null) return without
  const end = without.indexOf(BLOCK_END)
  if (end === -1) return `${without}${without.endsWith("\n") ? "" : "\n"}\n${block}\n`
  const at = end + BLOCK_END.length
  return `${without.slice(0, at)}\n\n${block}${without.slice(at)}`
}

export function withoutFeedbackBlock(agentsText) {
  const start = agentsText.indexOf(FEEDBACK_START)
  const end = agentsText.indexOf(FEEDBACK_END)
  if (start === -1 || end === -1 || end < start) return agentsText
  // Take the block and the blank line put before it, so on, then off, gives back the same file.
  const before = agentsText.slice(0, start).replace(/\n\n$/, "\n")
  const after = agentsText.slice(end + FEEDBACK_END.length)
  return `${before.replace(/\n$/, "")}${after}`
}

/** .meta.json's text with `"feedback"` set, keeping its layout: replaced in place, or added after `"cli"`. */
export function withFeedbackState(metaText, state) {
  if (/"feedback"\s*:/.test(metaText)) return metaText.replace(/("feedback"\s*:\s*)"[^"]*"/, `$1"${state}"`)
  return metaText.replace(/("cli"\s*:\s*"[^"]*",?)(\n)/, (whole, cli, nl) => `${cli.endsWith(",") ? cli : `${cli},`}${nl}  "feedback": "${state}",${nl}`)
}

/** Turns agent feedback on or off: the block in AGENTS.md and the state in .meta.json. */
export function setFeedback({ root, assets, on }) {
  const metaPath = join(root, "context", ".meta.json")
  const metaText = readFileSync(metaPath, "utf8")
  const meta = JSON.parse(metaText)
  const agentsPath = join(root, "AGENTS.md")
  const agents = existsSync(agentsPath) ? readFileSync(agentsPath, "utf8") : ""
  const next = withFeedbackBlock(agents, on ? feedbackBlock(assets, meta.cli ?? "npx --no-install usecontextual") : null)
  const changed = next !== agents || !metaText.includes(`"feedback": "${on ? "on" : "off"}"`)
  if (next !== agents) writeFileSync(agentsPath, next)
  writeFileSync(metaPath, withFeedbackState(metaText, on ? "on" : "off"))
  return { changed }
}

// ---------------------------------------------------------------------------
// The report

/** True in CI, where agent feedback never runs. */
export function inCI(env = process.env) {
  if (env.CI && env.CI !== "false" && env.CI !== "0") return true
  return ["CONTINUOUS_INTEGRATION", "GITHUB_ACTIONS", "GITLAB_CI", "BUILDKITE", "CIRCLECI", "TF_BUILD", "JENKINS_URL"].some((k) => env[k])
}

const STOPWORDS = new Set(["app", "apps", "web", "site", "api", "cli", "test", "tests", "demo", "main", "docs", "project", "server", "client", "frontend", "backend", "context", "contextual", "feature", "features", "foundation"])

/** Names that would identify the project: its folder, package name, git remote, AGENTS.md heading, and feature names. */
export function projectNames(root) {
  const names = new Set([basename(root)])
  try {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))
    if (pkg.name) names.add(String(pkg.name).replace(/^@[^/]+\//, ""))
  } catch {}
  try {
    const config = readFileSync(join(root, ".git", "config"), "utf8")
    for (const m of config.matchAll(/url\s*=\s*\S*?[/:]([^/\s]+?)(?:\.git)?\s*$/gm)) names.add(m[1])
  } catch {}
  try {
    const heading = readFileSync(join(root, "AGENTS.md"), "utf8").match(/^# (.+)$/m)
    if (heading) names.add(heading[1].trim())
  } catch {}
  const features = new Set()
  try {
    for (const f of readFeatures(root)) features.add(f.name)
  } catch {}
  const keep = (n) => n && n.length >= 4 && !STOPWORDS.has(n.toLowerCase())
  return { project: [...names].filter(keep), features: [...features].filter(keep) }
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/**
 * Takes out what a report must never carry: code, links, absolute paths,
 * secrets, and the project's own names. Returns the text and what was removed.
 */
export function cleanText(text, names = { project: [], features: [] }) {
  const removed = []
  let out = String(text ?? "")
  const swap = (re, label, what) => {
    out = out.replace(re, () => {
      removed.push(what)
      return label
    })
  }
  swap(/```[\s\S]*?(```|$)/g, "[code removed]", "code")
  swap(/`[^`\n]{61,}`/g, "[code removed]", "code")
  swap(/\b[a-z][a-z0-9+.-]*:\/\/[^\s:@/]+:[^\s@]+@\S+/gi, "[secret removed]", "a connection string")
  swap(/\bhttps?:\/\/\S+/gi, "[link removed]", "a link")
  swap(/\b(?:sk|pk|rk)[-_][A-Za-z0-9_-]{16,}|\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}|\bgithub_pat_[A-Za-z0-9_]{20,}|\bnpm_[A-Za-z0-9]{20,}|\bxox[abpr]-[A-Za-z0-9-]{10,}|\bAKIA[0-9A-Z]{16}\b|\bAIza[0-9A-Za-z_-]{30,}|\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g, "[secret removed]", "a secret")
  swap(/\b[A-Za-z0-9+/_-]{40,}={0,2}/g, "[secret removed]", "a long token")
  swap(/(?<![\w.])(?:~|\/(?:home|Users|root|var|tmp|opt|srv|mnt|etc|private))(?:\/[^\s/'"`)]+)+/g, "[path removed]", "a path")
  swap(/\b[A-Za-z]:\\[^\s'"`]+/g, "[path removed]", "a path")
  for (const name of [...names.project].sort((a, b) => b.length - a.length)) swap(new RegExp(`(?<![\\w-])${escapeRe(name)}(?![\\w-])`, "gi"), "[project]", "the project's name")
  for (const name of [...names.features].sort((a, b) => b.length - a.length)) swap(new RegExp(`(?<![\\w-])${escapeRe(name)}(?![\\w-])`, "gi"), "[feature]", "a feature's name")
  return { text: out.trim(), removed }
}

const KEEP_STATUS = new Set(["main.md", "master.md"])
const STACK_TEMPLATES = new Set(["_index.md", "overview.md", "requirements.md", "deploy.md"])

/** A Contextual file, named without anything project-specific; null for a file that isn't Contextual's. */
export function genericFile(path, skillDirs = [".agents/skills", ".claude/skills"]) {
  const p = String(path ?? "").trim().replace(/\\/g, "/").replace(/^\.\//, "")
  if (!p) return ""
  if (p === "AGENTS.md" || p === "CLAUDE.md") return p
  for (const dir of skillDirs) if (p.startsWith(`${dir}/`)) return p.slice(0, FILE_CAP)
  let m
  if ((m = p.match(/^context\/features\/([^/]+)\/([^/]+\.md)$/))) return m[1] === "foundation" ? p : `context/features/<feature>/${m[2]}`
  if (p === "context/features/_index.md") return p
  if ((m = p.match(/^context\/status\/([^/]+\.md)$/))) return KEEP_STATUS.has(m[1]) ? p : "context/status/<branch>.md"
  if ((m = p.match(/^context\/decisions\/([^/]+\.md)$/))) return m[1] === "README.md" ? p : "context/decisions/<record>.md"
  if ((m = p.match(/^context\/stack\/([^/]+\.md)$/))) return STACK_TEMPLATES.has(m[1]) ? p : "context/stack/<lib>.md"
  if (/^context\/[A-Za-z0-9_./-]+$/.test(p) && !p.includes("..")) return p.slice(0, FILE_CAP)
  return null
}

const cap = (text, n) => (text.length > n ? `${text.slice(0, n - 1).trimEnd()}…` : text)

/** The fields the CLI adds by itself: nothing a person typed, and nothing that names the project. */
export function automaticFields({ root, version, checkCounts, packageManager }) {
  const count = (() => {
    try {
      return readFeatures(root).length
    } catch {
      return 0
    }
  })()
  const os = { darwin: "macos", win32: "windows", linux: "linux" }[process.platform] ?? "other"
  return {
    contextual: version,
    os,
    packageManager: packageManager ?? "none",
    harnessFolders: HARNESS_FOLDERS.filter((d) => existsSync(join(root, d))),
    check: checkCounts,
    features: count === 0 ? "none" : count <= 5 ? "1-5" : count <= 20 ? "6-20" : "21+",
  }
}

/** Unpadded base64url of the UTF-8 JSON, as the site expects after `#report=`. */
export const encodeReport = (report) => Buffer.from(JSON.stringify(report), "utf8").toString("base64url")
export const decodeReport = (encoded) => JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"))

/**
 * Checks the agent's values and builds the report and its link.
 * @returns {{ problems: string[], notes: string[], report?: object, link?: string }}
 */
export function buildReport({ values, auto, names, base = FEEDBACK_URL, skillDirs }) {
  const problems = []
  const notes = []
  for (const [field, allowed] of Object.entries(CHOICES)) {
    const value = values[field]
    if (typeof value !== "string" || !allowed.includes(value)) problems.push(`--${field} must be one of: ${allowed.join(", ")}`)
  }
  if (typeof values.model !== "string" || !values.model.trim()) problems.push("--model is required: the model's name as it reports it")
  for (const field of ["happened", "expected"]) {
    if (typeof values[field] !== "string" || !values[field].trim()) problems.push(`--${field} is required`)
  }
  if (problems.length) return { problems, notes }

  const report = { v: 1 }
  for (const field of Object.keys(CHOICES)) report[field] = values[field]
  report.model = cap(String(values.model).replace(/[^\w .:/+@-]/g, "").trim(), MODEL_CAP)
  const removed = []
  for (const field of TEXT_FIELDS) {
    const { text, removed: gone } = cleanText(typeof values[field] === "string" ? values[field] : "", names)
    removed.push(...gone)
    if (text.length > TEXT_CAP) notes.push(`--${field} was ${text.length} characters; cut to ${TEXT_CAP}.`)
    report[field] = cap(text, TEXT_CAP)
  }
  if (typeof values.file === "string" && values.file.trim()) {
    const file = genericFile(values.file, skillDirs)
    if (file === null) notes.push("--file isn't one of Contextual's own files, so it was left out.")
    else report.file = file
  }
  if (removed.length) notes.push(`Removed from the text: ${[...new Set(removed)].join(", ")}.`)
  Object.assign(report, auto)

  // Too long for a link: trim the longest text field until it fits, and say so.
  let link = `${base}#report=${encodeReport(report)}`
  while (link.length > LINK_CAP) {
    const longest = TEXT_FIELDS.reduce((a, b) => ((report[b] ?? "").length > (report[a] ?? "").length ? b : a))
    const over = link.length - LINK_CAP
    const keep = Math.max(0, report[longest].length - Math.ceil(over / 2) - 8)
    if (keep === 0 && report[longest].length === 0) break
    report[longest] = cap(report[longest], keep || 1)
    notes.push(`The link was too long, so --${longest} was trimmed to ${report[longest].length} characters.`)
    link = `${base}#report=${encodeReport(report)}`
  }
  return { problems, notes: [...new Set(notes)], report, link }
}

/** Opens the link in the default browser. Returns false when there's no browser to open, or opening failed. */
export function openInBrowser(link, { platform = process.platform, env = process.env, run = spawnSync } = {}) {
  let command
  let args
  if (platform === "darwin") [command, args] = ["open", [link]]
  else if (platform === "win32") [command, args] = ["cmd", ["/c", "start", '""', link]]
  else {
    if (!env.DISPLAY && !env.WAYLAND_DISPLAY) return false
    ;[command, args] = ["xdg-open", [link]]
  }
  const result = run(command, args, { stdio: "ignore", timeout: 15000 })
  return !result.error && result.status === 0
}

export const FEEDBACK_HELP = `usecontextual feedback: send feedback about Contextual itself, through a form a person reviews.

Usage:
  usecontextual feedback --harness <h> --model <name> --skill <s> --category <c> --severity <v>
                         --happened "<what happened>" --expected "<what you expected>"
                         [--suggestion "<a change that would help>"] [--file <the Contextual file involved>] [--print]
  usecontextual feedback on     add the feedback block to AGENTS.md
  usecontextual feedback off    remove it

  --harness    ${CHOICES.harness.join(", ")}
  --skill      ${CHOICES.skill.join(", ")}
  --category   ${CHOICES.category.join(", ")}
  --severity   ${CHOICES.severity.join(", ")}
  --print      print the link instead of opening the browser

Each text is cut to ${TEXT_CAP} characters. Code, links, paths, secrets and the project's names are taken out.
It opens a form; nothing is sent unless the person presses Send there.`
