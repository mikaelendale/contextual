import { readFileSync } from "node:fs"
import { basename } from "node:path"

import { check } from "./check.js"
import { fix } from "./fix.js"
import { findRoot } from "./context.js"
import { which } from "./which.js"

const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"))
const DOCS = "https://github.com/mikaelendale/contextual"

const HELP = `usecontextual ${version}

Usage:
  usecontextual check [--branch <name>]   check the context in this repo
  usecontextual check --fix               rebuild the feature index, store the idea.md hash, then check
  usecontextual which <path>              show which feature owns a file

Not released yet: init, update, check --staged.
Docs: ${DOCS}`

function parseArgs(args) {
  const flags = { _: [] }
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg.startsWith("--")) {
      const [key, inline] = arg.slice(2).split("=", 2)
      if (inline !== undefined) flags[key] = inline
      else if (args[i + 1] !== undefined && !args[i + 1].startsWith("--") && key === "branch") flags[key] = args[++i]
      else flags[key] = true
    } else {
      flags._.push(arg)
    }
  }
  return flags
}

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`

function notReleased(what, err) {
  err(`usecontextual ${what}: not released yet. See ${DOCS}`)
  return 2
}

/** Runs the CLI and returns its exit code: 0 ok, 1 problems found, 2 usage errors and commands that aren't released yet. */
export function runCli(argv, { cwd, out, err }) {
  const [command, ...rest] = argv
  const flags = parseArgs(rest)

  if (!command || command === "help" || command === "--help" || command === "-h") {
    out(HELP)
    return 0
  }
  if (command === "--version" || command === "-v") {
    out(version)
    return 0
  }
  if (command === "init" || command === "update") return notReleased(command, err)
  if (command === "check" && flags.staged) return notReleased("check --staged", err)
  if (command !== "check" && command !== "which") {
    err(`Unknown command "${command}". Run usecontextual --help.`)
    return 2
  }

  const root = findRoot(cwd)
  if (!root) {
    err("No context/.meta.json here or in any folder above it. Run `npx usecontextual init` first.")
    return 2
  }

  if (command === "check") {
    if (flags.branch === true) {
      err("--branch needs a branch name.")
      return 2
    }
    if (flags.fix) for (const change of fix({ root })) out(`fixed: ${change}`)
    const result = check({ root, branch: typeof flags.branch === "string" ? flags.branch : null })
    const errors = result.findings.filter((f) => f.level === "error")
    const warnings = result.findings.filter((f) => f.level === "warning")
    out(`usecontextual check · ${basename(root)}${result.branch ? ` · branch ${result.branch}` : ""}`)
    for (const f of [...errors, ...warnings]) {
      out(`  ${f.level.padEnd(7)}  ${f.file ? `${f.file}: ` : ""}${f.message}`)
    }
    out(`${plural(errors.length, "error")}, ${plural(warnings.length, "warning")}`)
    return errors.length > 0 ? 1 : 0
  }

  const target = flags._[0]
  if (!target) {
    err("Usage: usecontextual which <path>")
    return 2
  }
  const result = which({ root, path: target, cwd })
  if (result.outside) {
    err(`${target} isn't inside this project.`)
    return 2
  }
  if (result.contextual) {
    out(`${result.path} is one of Contextual's own files; it needs no owner.`)
    return 0
  }
  if (result.owners.length > 1) {
    for (const f of result.owners) out(`${f.name}  context/features/${f.name}/README.md  (${f.status})`)
    out("More than one feature covers this path. `usecontextual check` reports it as an error.")
    return 2
  }
  if (result.owners.length === 1) {
    const f = result.owners[0]
    out(`${f.name}  context/features/${f.name}/README.md  (${f.status})`)
    if (result.shared) out("It's also on the shared: line, which `usecontextual check` reports as an error.")
    return 0
  }
  if (result.shared) {
    out("shared  (the shared: line in context/architecture.md)")
    return 0
  }
  out("no feature owns this path")
  return 1
}
