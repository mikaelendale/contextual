#!/usr/bin/env node
import { readFileSync } from "node:fs"

import { runCli } from "../src/cli.js"

/** Exit code for a bug in usecontextual itself (sysexits' EX_SOFTWARE), so a crash is never mistaken for findings. */
const CRASHED = 70

try {
  process.exitCode = runCli(process.argv.slice(2), {
    cwd: process.cwd(),
    out: (line) => process.stdout.write(`${line}\n`),
    err: (line) => process.stderr.write(`${line}\n`),
  })
} catch (error) {
  const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"))
  process.stderr.write(
    `usecontextual ${version} stopped on an unexpected error, on ${process.platform} with Node ${process.version}. ` +
      `This is a bug in usecontextual, not in your project. Please report it at https://github.com/mikaelendale/contextual/issues with this output:\n` +
      `${error?.stack ?? error}\n`,
  )
  process.exitCode = CRASHED
}
