/*
 * Where the files the CLI lays down come from. The published package carries
 * copies in `assets/` (made by scripts/bundle-assets.mjs before packing); in
 * this repo the CLI reads the originals at the repo root.
 */

import { existsSync } from "node:fs"
import { fileURLToPath } from "node:url"

const packaged = fileURLToPath(new URL("../assets/", import.meta.url))
const repo = fileURLToPath(new URL("../../../", import.meta.url))

/**
 * The folder holding `templates/`, `skills/` and `presets/`. Inside the
 * Contextual repo that's the repo root, so a stale assets/ from an earlier pack
 * never shadows an edit; in an installed package it's assets/.
 */
export function assetRoot() {
  if (existsSync(`${repo}packages/cli/src/assets.js`) && existsSync(`${repo}templates`)) return repo
  if (existsSync(`${packaged}templates`)) return packaged
  throw new Error("can't find Contextual's templates: the package is missing its assets/ folder")
}

/** The skills init and update install into a project. contextual-plan runs in a chat, not in the repo. */
export const INSTALLED_SKILLS = ["contextual-setup", "contextual-next", "contextual-sync"]

export const PRESETS = ["next", "laravel-inertia-react"]
