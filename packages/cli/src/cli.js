import { existsSync, readFileSync } from "node:fs"
import { basename } from "node:path"

import { check } from "./check.js"
import { fix } from "./fix.js"
import { STAGED_ERRORS_EXIT } from "./hook.js"
import { InitError, init } from "./init.js"
import { checkStaged } from "./staged.js"
import { UpdateError, update } from "./update.js"
import { readText } from "./context.js"
import { join } from "node:path"
import { findRoot } from "./context.js"
import { which } from "./which.js"

const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"))
const DOCS = "https://github.com/mikaelendale/contextual"

const HELP = `usecontextual ${version}

Usage:
  usecontextual init [--harness <list>] [--preset <name>] [--force] [--no-install]
                                          add Contextual to this repo
  usecontextual check [--branch <name>]   check the context in this repo
  usecontextual check --fix               repair what's mechanical, then check
  usecontextual check --staged            the pre-commit check: the staged code's logs and status file
  usecontextual which <path>              show which feature owns a file
  usecontextual update                    refresh Contextual's own files to this version

  --harness   claude, codex, antigravity, opencode (comma-separated). Default: detected, or all
  --preset    next, laravel-inertia-react
Docs: ${DOCS}`

const VALUE_FLAGS = new Set(["branch", "harness", "preset"])

function parseArgs(args) {
  const flags = { _: [] }
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg.startsWith("--")) {
      const [key, inline] = arg.slice(2).split("=", 2)
      if (inline !== undefined) flags[key] = inline
      else if (args[i + 1] !== undefined && !args[i + 1].startsWith("--") && VALUE_FLAGS.has(key)) flags[key] = args[++i]
      else flags[key] = true
    } else {
      flags._.push(arg)
    }
  }
  return flags
}

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`

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
  if (command === "init") return runInit(flags, { cwd, out, err })
  if (command === "update") return runUpdate({ cwd, out, err })
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
    const branchFlag = typeof flags.branch === "string" ? flags.branch : null
    if (flags.fix) for (const change of fix({ root, branch: branchFlag })) out(`fixed: ${change}`)
    const result = check({ root, branch: branchFlag })
    if (flags.staged) {
      const meta = JSON.parse(readText(join(root, "context", ".meta.json")))
      const defaultBranch = meta.defaultBranch ?? "main"
      result.findings.push(...checkStaged({ root, branch: result.branch, defaultBranch, skillDirs: meta.skillDirs ?? [] }))
      // The hook warns and never blocks on the default branch (spec 4.2), and on every
      // branch until setup has run: before context/idea.md exists there's nothing to keep in step.
      const setupDone = existsSync(join(root, "context", "idea.md"))
      if (!setupDone) result.findings.push({ level: "warning", file: null, message: "setup hasn't run yet (no context/idea.md), so this check only warns. Tell your agent \"set up contextual\"" })
      if (!setupDone || !result.branch || result.branch === defaultBranch) for (const f of result.findings) f.level = "warning"
    }
    const errors = result.findings.filter((f) => f.level === "error")
    const warnings = result.findings.filter((f) => f.level === "warning")
    out(`usecontextual check · ${basename(root)}${result.branch ? ` · branch ${result.branch}` : ""}`)
    for (const f of [...errors, ...warnings]) {
      out(`  ${f.level.padEnd(7)}  ${f.file ? `${f.file}: ` : ""}${f.message}`)
    }
    out(`${plural(errors.length, "error")}, ${plural(warnings.length, "warning")}`)
    // With --staged the hook reads the exit code: STAGED_ERRORS_EXIT means "block", anything else that
    // isn't 0 means the CLI couldn't run (spec 6.3).
    if (errors.length === 0) return 0
    return flags.staged ? STAGED_ERRORS_EXIT : 1
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

function runInit(flags, { cwd, out, err }) {
  const harnesses = typeof flags.harness === "string" ? flags.harness.split(",").map((h) => h.trim()).filter(Boolean) : null
  const preset = typeof flags.preset === "string" ? flags.preset : null
  if (flags.harness === true || flags.preset === true) {
    err("--harness and --preset need a value, for example --harness claude,codex or --preset next.")
    return 2
  }
  let result
  try {
    result = init({ cwd, version, harnesses, preset, force: Boolean(flags.force), install: !flags["no-install"] })
  } catch (e) {
    if (e instanceof InitError || /unknown harness/.test(e.message)) {
      err(e.message)
      return 2
    }
    throw e
  }
  out(`usecontextual init · ${basename(result.top)}`)
  for (const file of result.created) out(`  added    ${file}`)
  for (const file of result.kept) out(`  kept     ${file} (already there)`)
  out(`  cli      ${result.cli}`)
  out(`  package  ${result.dependency}`)
  out(hookReport(result.hook))
  out("")
  out('Next: tell your coding agent "set up contextual". It writes the context from contextual-plan.md, from a few questions, or from the code that is already here.')
  return 0
}

function runUpdate({ cwd, out, err }) {
  let result
  try {
    result = update({ cwd, version })
  } catch (e) {
    if (e instanceof UpdateError) {
      err(e.message)
      return 2
    }
    throw e
  }
  out(`usecontextual update · ${basename(result.root)} · ${version}`)
  for (const change of result.changes) out(`  ${change}`)
  out(hookReport(result.hook))
  return 0
}

function hookReport(hook) {
  if (hook.action === "print") {
    return `  hook     a hook manager owns the hooks folder, so nothing was written. Add this line to its pre-commit hook:\n           ${hook.line}`
  }
  return `  hook     ${hook.action} ${hook.file}`
}
