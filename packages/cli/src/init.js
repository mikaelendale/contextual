/*
 * `usecontextual init` (spec 6): lays down AGENTS.md's Contextual block, the
 * CLAUDE.md import, the context/ skeleton and the agent skills, pins itself as
 * a dev dependency, and installs the pre-commit hook. It never overwrites a
 * file that's already there.
 */

import { execFileSync } from "node:child_process"
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

import { assetRoot, INSTALLED_SKILLS, PRESETS } from "./assets.js"
import { BLOCK_END, BLOCK_START, hashText, readText } from "./context.js"
import { defaultBranch, repoTop } from "./git.js"
import { hookLine, installHook } from "./hook.js"

const LOCKFILES = [
  ["pnpm-lock.yaml", "pnpm"],
  ["yarn.lock", "yarn"],
  ["bun.lock", "bun"],
  ["bun.lockb", "bun"],
  ["package-lock.json", "npm"],
]
const ADD_EXACT_DEV = {
  npm: ["install", "--save-dev", "--save-exact"],
  pnpm: ["add", "--save-dev", "--save-exact"],
  yarn: ["add", "--dev", "--exact"],
  bun: ["add", "--dev", "--exact"],
}
export const HARNESSES = { claude: ".claude/skills", codex: ".agents/skills", antigravity: ".agents/skills", opencode: ".agents/skills" }

/** The package manager, from the lockfile; npm when there's a package.json and no lockfile; null without a package.json. */
export function packageManager(top) {
  if (!existsSync(join(top, "package.json"))) return null
  for (const [file, pm] of LOCKFILES) if (existsSync(join(top, file))) return pm
  return "npm"
}

/** Skill folders for the harnesses this repo already shows signs of; both when there are none. */
export function detectSkillDirs(top) {
  const dirs = new Set()
  if (existsSync(join(top, ".claude")) || existsSync(join(top, "CLAUDE.md"))) dirs.add(HARNESSES.claude)
  if ([".agents", ".codex", ".agent", ".opencode", "GEMINI.md"].some((p) => existsSync(join(top, p)))) dirs.add(".agents/skills")
  return dirs.size ? [...dirs].sort() : [".agents/skills", ".claude/skills"]
}

export function skillDirsFor(harnessList) {
  const dirs = new Set()
  for (const name of harnessList) {
    if (!HARNESSES[name]) throw new Error(`unknown harness "${name}"; use ${Object.keys(HARNESSES).join(", ")}`)
    dirs.add(HARNESSES[name])
  }
  return [...dirs].sort()
}

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => (statSync(join(dir, name)).isDirectory() ? walk(join(dir, name)).map((p) => `${name}/${p}`) : [name]))

export function fillPlaceholders(text, values) {
  return text.replace(/\{\{([a-z_]+)\}\}/g, (whole, key) => (key in values ? values[key] : whole))
}

/** Copies each installed skill into each skill folder, replacing what was there (they're Contextual's own files). */
export function installSkills(top, assets, skillDirs) {
  for (const dir of skillDirs) {
    for (const name of INSTALLED_SKILLS) {
      rmSync(join(top, dir, name), { recursive: true, force: true })
      cpSync(join(assets, "skills", name), join(top, dir, name), { recursive: true })
    }
  }
}

/** The Contextual block from the AGENTS.md template, filled in. */
export function templateBlock(assets, cli) {
  const text = readText(join(assets, "templates", "repo", "AGENTS.md"))
  return fillPlaceholders(text.slice(text.indexOf(BLOCK_START), text.indexOf(BLOCK_END) + BLOCK_END.length), { cli })
}

/**
 * @param {{ cwd: string, version: string, harnesses?: string[] | null, preset?: string | null, force?: boolean, install?: boolean, today?: string }} options
 * @returns {{ top: string, cli: string, skillDirs: string[], created: string[], kept: string[], dependency: string, hook: object, packageManager: string | null }}
 */
export function init({ cwd, version, harnesses = null, preset = null, force = false, install = true, today = new Date().toISOString().slice(0, 10) }) {
  const top = repoTop(cwd)
  if (!top) throw new InitError("This isn't a git repository. Run `git init` first, then `init` again.")
  if (existsSync(join(top, "context", ".meta.json"))) {
    throw new InitError("Contextual is already set up here. `update` refreshes its own files; nothing else needs init.")
  }
  if (existsSync(join(top, "context")) && !force) {
    throw new InitError("There's already a context/ folder, and it isn't Contextual's. Run init with --force to add Contextual's files next to it; nothing that exists is overwritten.")
  }
  if (preset && !PRESETS.includes(preset)) throw new InitError(`Unknown preset "${preset}". Use ${PRESETS.join(" or ")}.`)

  const assets = assetRoot()
  const pm = packageManager(top)
  const cli = pm ? "npx usecontextual" : `npx --yes usecontextual@${version}`
  const skillDirs = harnesses ? skillDirsFor(harnesses) : detectSkillDirs(top)
  const deslop = readText(join(assets, "templates", "repo", "context", "design", "deslop.md"))
  const values = {
    cli,
    date: today,
    contextual_version: version,
    default_branch: defaultBranch(top),
    deslop_hash: hashText(deslop),
  }
  const created = []
  const kept = []
  const write = (rel, text) => {
    const target = join(top, rel)
    if (existsSync(target)) {
      kept.push(rel)
      return
    }
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, text)
    created.push(rel)
  }

  // context/: the skeleton, with the preset's files where it has them
  const skeleton = join(assets, "templates", "repo", "context")
  const presetDir = preset ? join(assets, "presets", preset, "context") : null
  const files = new Set(walk(skeleton))
  if (presetDir) for (const f of walk(presetDir)) files.add(f)
  for (const rel of [...files].sort()) {
    const source = presetDir && existsSync(join(presetDir, rel)) ? join(presetDir, rel) : join(skeleton, rel)
    let text = fillPlaceholders(readText(source), values)
    if (rel === ".meta.json") text = text.replace(/"skillDirs": \[[^\]]*\]/, `"skillDirs": ${JSON.stringify(skillDirs).replace(/","/g, '", "')}`)
    write(`context/${rel}`, text)
  }

  // AGENTS.md: the whole template when there's none, otherwise the block after what's there
  const agentsPath = join(top, "AGENTS.md")
  if (!existsSync(agentsPath)) {
    write("AGENTS.md", fillPlaceholders(readText(join(assets, "templates", "repo", "AGENTS.md")), values))
  } else if (!readFileSync(agentsPath, "utf8").includes(BLOCK_START)) {
    const text = readFileSync(agentsPath, "utf8")
    writeFileSync(agentsPath, `${text}${text.endsWith("\n") ? "" : "\n"}\n${templateBlock(assets, cli)}\n`)
    created.push("AGENTS.md (Contextual block added after the existing content)")
  } else {
    kept.push("AGENTS.md")
  }

  // CLAUDE.md: created, or the import appended once
  const claudePath = join(top, "CLAUDE.md")
  if (!existsSync(claudePath)) {
    write("CLAUDE.md", readText(join(assets, "templates", "repo", "CLAUDE.md")))
  } else if (!/^@AGENTS\.md[ \t]*$/m.test(readFileSync(claudePath, "utf8"))) {
    const text = readFileSync(claudePath, "utf8")
    writeFileSync(claudePath, `${text}${text.endsWith("\n") || text === "" ? "" : "\n"}@AGENTS.md\n`)
    created.push("CLAUDE.md (@AGENTS.md import added)")
  } else {
    kept.push("CLAUDE.md")
  }

  installSkills(top, assets, skillDirs)
  for (const dir of skillDirs) created.push(`${dir}/ (${INSTALLED_SKILLS.join(", ")})`)

  // the CLI itself, pinned
  let dependency = "none: no package.json, so the hook and the context files use a pinned npx"
  if (pm) {
    const pkgPath = join(top, "package.json")
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
    const listed = pkg.devDependencies?.usecontextual ?? pkg.dependencies?.usecontextual
    if (listed) {
      dependency = `already in package.json (${listed})`
    } else if (install) {
      try {
        execFileSync(pm, [...ADD_EXACT_DEV[pm], `usecontextual@${version}`], { cwd: top, stdio: ["ignore", "ignore", "pipe"] })
        dependency = `added usecontextual@${version} as a dev dependency with ${pm}`
      } catch (e) {
        dependency = `couldn't install it with ${pm} (${String(e.stderr ?? e.message).trim().split("\n").pop()}). Run: ${pm} ${ADD_EXACT_DEV[pm].join(" ")} usecontextual@${version}`
      }
    } else {
      const indent = readFileSync(pkgPath, "utf8").match(/^(\s+)"/m)?.[1] ?? "  "
      pkg.devDependencies = { ...(pkg.devDependencies ?? {}), usecontextual: version }
      writeFileSync(pkgPath, `${JSON.stringify(pkg, null, indent)}\n`)
      dependency = `added usecontextual ${version} to package.json; run ${pm} install`
    }
  }

  const hook = installHook({ top, line: hookLine({ hasPackageJson: Boolean(pm), version }) })
  return { top, cli, skillDirs, created, kept, dependency, hook, packageManager: pm }
}

export class InitError extends Error {}
