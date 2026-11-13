/* Small wrappers around the git commands the CLI needs. They never change a repo. */

import { execFileSync } from "node:child_process"
import { isAbsolute, resolve } from "node:path"

/** Runs git in `cwd` and returns its trimmed output, or null when it fails. */
export function git(cwd, args) {
  try {
    return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim()
  } catch {
    return null
  }
}

/** The top folder of the work tree, or null outside a git repo. */
export function repoTop(cwd) {
  return git(cwd, ["rev-parse", "--show-toplevel"])
}

/**
 * The default branch's name: the remote's HEAD when there is one; else a local
 * main or master; else the current branch when it's called main or master (a
 * new repo with no commits yet); else init.defaultBranch; else main.
 */
export function defaultBranch(cwd) {
  const remote = git(cwd, ["symbolic-ref", "--quiet", "--short", "refs/remotes/origin/HEAD"])
  if (remote) return remote.replace(/^origin\//, "")
  for (const name of ["main", "master"]) if (git(cwd, ["rev-parse", "--verify", "--quiet", `refs/heads/${name}`])) return name
  const current = git(cwd, ["branch", "--show-current"])
  if (current === "main" || current === "master") return current
  return git(cwd, ["config", "--get", "init.defaultBranch"]) || "main"
}

/** The folder git runs hooks from, absolute. Right in plain repos, worktrees and with core.hooksPath. */
export function hooksDir(cwd) {
  const path = git(cwd, ["rev-parse", "--git-path", "hooks"])
  if (!path) return null
  return isAbsolute(path) ? path : resolve(cwd, path)
}

/** core.hooksPath as configured, or null. */
export function hooksPathSetting(cwd) {
  return git(cwd, ["config", "--get", "core.hooksPath"])
}

/** Paths staged for the next commit, relative to the repo top, with forward slashes. */
export function stagedFiles(cwd) {
  const out = git(cwd, ["diff", "--cached", "--name-only", "--no-renames", "-z"])
  return out ? out.split("\0").filter(Boolean) : []
}
