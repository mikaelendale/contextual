#!/usr/bin/env node
import { runCli } from "../src/cli.js"

process.exitCode = runCli(process.argv.slice(2), {
  cwd: process.cwd(),
  out: (line) => process.stdout.write(`${line}\n`),
  err: (line) => process.stderr.write(`${line}\n`),
})
