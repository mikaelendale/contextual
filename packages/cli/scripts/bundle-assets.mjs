// Runs before `npm pack` and `npm publish` (the prepack script). Copies what
// init and update lay down into assets/, so the package carries it: the
// templates, the three agent skills and the presets. The originals stay at the
// repo root; assets/ is ignored by git.
import { cpSync, existsSync, readdirSync, rmSync, statSync } from "node:fs"
import { fileURLToPath } from "node:url"

const repo = fileURLToPath(new URL("../../../", import.meta.url))
const out = fileURLToPath(new URL("../assets/", import.meta.url))

rmSync(out, { recursive: true, force: true })
cpSync(`${repo}templates`, `${out}templates`, { recursive: true })
for (const name of ["contextual-setup", "contextual-next", "contextual-sync"]) {
  cpSync(`${repo}skills/${name}`, `${out}skills/${name}`, { recursive: true })
}
if (existsSync(`${repo}presets`)) {
  for (const name of readdirSync(`${repo}presets`)) {
    if (statSync(`${repo}presets/${name}`).isDirectory()) cpSync(`${repo}presets/${name}`, `${out}presets/${name}`, { recursive: true })
  }
}
console.log("bundled templates, skills and presets into assets/")
