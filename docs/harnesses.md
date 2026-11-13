# Where each harness reads skills and rules

Checked on 12 November 2026 against each harness's official docs (links at the end). These change often: check again before every release, and update this file and the README's "Tested with" table.

Versions installed on the machine the skills were tested on: Claude Code 2.1.322, Codex CLI 0.167.2, OpenCode 2.2.7, Antigravity CLI 1.5.6.

## Skills

| Harness | Project skill folder | Also searches | Same skill name in two places | Explicit call |
|---|---|---|---|---|
| Claude Code | `.claude/skills/<name>/SKILL.md` | The same folder in every parent directory up to the repo root. Folders lower down load when a file there is first read. The docs don't mention `.agents/skills/` | Enterprise beats personal, and personal (`~/.claude/skills/`) beats project | `/<name>` |
| Codex | `.agents/skills/<name>/SKILL.md` | Every directory from the working directory up to the repo root; `~/.agents/skills/` for the user. `.codex/skills/` is no longer listed. The docs don't mention `.claude/skills/` | Not merged: "both can appear in skill selectors" | `$<name>`, or `/skills` |
| Antigravity | `.agents/skills/<name>/SKILL.md` | Each parent folder up to the repo root. The old `.agent/skills/` (and `_agents/`, `_agent/`) still work. The docs don't mention `.claude/skills/` | The workspace beats `~/.gemini/config/`. In the CLI, `~/.gemini/antigravity-cli/skills/` and `~/.gemini/skills/` beat everything | `/<name>` |
| OpenCode | `.opencode/skills/`, plus `.claude/skills/` and `.agents/skills/` for compatibility | From the working directory up to the project root | The source registered later wins. The order is `.claude/skills/`, then `.agents/skills/`, then `~/.config/opencode/skills/`, then `.opencode/skills/`. So the `.agents` copy beats the `.claude` copy | `@<name>`; the model calls its `skill` tool |

## Skill files

From the [Agent Skills specification](https://agentskills.io/specification), which all four follow:

- A skill is a folder with a `SKILL.md`. Optional folders: `references/` (docs the agent reads when it needs them), `assets/` (templates and other static files) and `scripts/` (code it runs).
- `name`: 1–64 characters, lowercase letters, digits and hyphens, no hyphen at the start or end and no two in a row, equal to the folder name. `description`: 1–1,024 characters, saying what the skill does and when to use it. Optional: `license`, `compatibility` (up to 500 characters), `metadata`, and `allowed-tools` (experimental).
- Loading happens in three stages. Every skill's name and description load at startup. The whole `SKILL.md` loads when the skill is chosen, and the spec recommends under 500 lines and under 5,000 tokens. Other files load only when `SKILL.md` sends the agent to them.
- Reference other files by relative path from the skill folder, one level deep.

What each harness adds:

- **Claude Code** reads frontmatter only when the opening `---` is on line 1. A field it doesn't know is ignored, and malformed YAML loads the skill with no fields. `description` plus `when_to_use` is cut at 1,536 characters in the skill list. Symlinked skill folders work.
- **Codex** requires `name` and `description`. With many skills installed, it shortens descriptions first and may leave some skills out, with a warning. The list gets about 2% of the context window, or 8,000 characters. Symlinked skill folders work.
- **Antigravity** requires only `description`; `name` defaults to the folder name.
- **OpenCode** takes the skill's ID from its path, not from `name`. Version 2 doesn't enforce the name rules. A skill with no `description` isn't offered to the model. Files next to `SKILL.md` are not loaded until the skill tells the agent to read them.

## Rules files

| Harness | Reads |
|---|---|
| Claude Code | `CLAUDE.md`. It reads `AGENTS.md` only when there's no `CLAUDE.md` (version 2.1.277 or later). A `CLAUDE.md` line `@AGENTS.md` imports it |
| Codex | `AGENTS.md` (or `AGENTS.override.md`) in each directory from the project root down to the working directory, joined in that order, 32 KiB in total by default |
| Antigravity | `AGENTS.md` and `GEMINI.md`, `.agents/AGENTS.md`, and `.agents/rules/*.md`, in the workspace and each parent up to the repo root. All of them are combined |
| OpenCode | Version 2: `AGENTS.md` only, from the workspace up to the project root, combined. Version 1 also fell back to `CLAUDE.md` when there was no `AGENTS.md` |

## What Contextual installs, and why

- **Two copies of each skill:** `.agents/skills/<name>/` for Codex, Antigravity and OpenCode, and `.claude/skills/<name>/` for Claude Code, whose docs don't mention `.agents/skills/`.
- **Copies, not symlinks.** Claude Code and Codex follow symlinks, but Antigravity's and OpenCode's skill docs don't say. Git also checks symlinks out as plain text files on Windows by default.
- **Byte-identical copies.** OpenCode reads both folders and keeps the `.agents` copy, so a stale `.claude` copy would go unnoticed there. `check` compares them.
- **In the repo only, never at user level.** In Claude Code a personal skill with the same name beats the project's, and in the Antigravity CLI the user-level folders beat the workspace. Either way, a stale user-level copy would win silently. Codex shows both copies and can't pick one.
- **Frontmatter has `name`, `description` and `license` only, starting on line 1.** The description starts with the trigger phrases, because Codex shortens descriptions when many skills are installed.
- **`SKILL.md` stays short.** Detail goes in `references/` and templates in `assets/`, one level deep, and `SKILL.md` names the file to read at the step that needs it.

## Changes since the check on 10 November 2026

- Codex no longer lists `.codex/skills/` as a skill folder. `.agents/skills/` is its only repo location.
- Antigravity's docs no longer give a retirement date for workflows. They say workflows are deprecated, "a new workflows system is on the way", and current workflows "keep working for now".
- New detail that supports installing in the repo only: Claude Code's personal skills beat project skills, and the Antigravity CLI's user folders beat the workspace.

## Sources

- Claude Code: https://code.claude.com/docs/en/skills and https://code.claude.com/docs/en/memory
- Codex: https://learn.chatgpt.com/docs/build-skills and https://learn.chatgpt.com/docs/agent-configuration/agents-md (developers.openai.com/codex redirects to these)
- Antigravity: https://antigravity.google/docs/skills, https://antigravity.google/docs/customization-discovery, https://antigravity.google/docs/rules and https://antigravity.google/docs/migration/workflows-to-skills
- OpenCode: https://opencode.ai/docs/skills/, https://opencode.ai/docs/instructions/ (version 2) and https://opencode.ai/docs/rules/ (version 1)
- Agent Skills specification: https://agentskills.io/specification
