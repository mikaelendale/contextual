# Skills

| Skill | Runs in | Job | Build step |
|---|---|---|---|
| `contextual-plan` | Any AI chat, plus a copy-paste prompt for the site | Plans the project and outputs `contextual-plan.md` | 4 |
| `contextual-setup` | The coding agent | Writes the context: from a plan file, from questions, or from existing code | 2 (path 3 in step 5) |
| `contextual-next` | The coding agent | Builds the next planned feature on its own branch | 2 |
| `contextual-sync` | The coding agent | Brings the context back in line with the code, and finishes merged features | 2 |

Each skill gets its own folder here with a `SKILL.md`. The rules for those files are in section 7.1 of [the spec](../docs/spec.md).
