# Skills

| Skill | Runs in | Job | Build step |
|---|---|---|---|
| `contextual-plan` | Any AI chat, plus a copy-paste prompt for the site | Plans the project and outputs `contextual-plan.md` | 4 |
| `contextual-setup` | The coding agent | Writes the context: from a plan file, from questions, or from existing code | 2 (path 3 in step 5) |
| `contextual-next` | The coding agent | Builds the next planned feature on its own branch | 2 |
| `contextual-sync` | The coding agent | Brings the context back in line with the code, and finishes merged features | 2 |

`usecontextual init` copies each skill folder into a project's `.agents/skills/` and `.claude/skills/` (why both: [docs/harnesses.md](../docs/harnesses.md)).

## How a skill folder is laid out

```
contextual-next/
  SKILL.md          short: the steps, in order (about 40 lines)
  references/       detail for one step, read only when that step comes up
  assets/           the templates the skill creates files from
```

- `SKILL.md` has frontmatter on line 1 with `name`, `description` and `license` only, and a description that starts with the trigger phrases.
- Every file in `assets/` is an exact copy of a template: `assets/feature-<file>` comes from `templates/feature/<file>`, and any other asset from `templates/<file>`. `contextual-setup/references/plan-file.md` is a copy of `docs/plan-file.md`. Edit the original and copy it over; the tests in `packages/cli/test/skills.test.js` catch drift.
