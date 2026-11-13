# Agent feedback
status: in-progress
phase: 2
covers: packages/cli/src/feedback.js, packages/cli/test/feedback.test.js, templates/agent-feedback-block.md, site/app/agent/**, site/lib/feedback/**, site/db/**, docs/agent-feedback.md
depends-on: foundation, check, site

## What it does
Coding agents report problems with Contextual itself, for a person to review and send. A second managed block in `AGENTS.md` asks the agent to note them while it works, and `usecontextual feedback` turns one note into a prefilled form on the site, with the draft in the link's fragment so nothing reaches a server until the person presses Send. The owner turns it on and off, and it never runs in CI. It follows Next.js's `experimental.agentFeedback`.

## Acceptance
- [x] `init` asks once whether to turn agent feedback on; when nobody can answer, it stays off
- [x] `usecontextual feedback on` adds the feedback block to `AGENTS.md` and `feedback off` removes it, leaving the rest of the file unchanged
- [x] The state lives in `context/.meta.json`, and `update` keeps the block in step with it
- [x] The block limits only what gets reported, never how the agent works or verifies its work
- [x] `usecontextual feedback` takes the agent's fields as flags: harness, model, skill, category, severity, what happened, what it expected, a suggested change, and the Contextual file involved
- [x] It adds the Contextual version, the OS, the package manager, the harness folders present, `check`'s error and warning counts, and the number of features as a bucket (1-5, 6-20, 21+)
- [x] It builds the link to https://contextual.mikaelen.site/agent/feedback with every field in the fragment, never the query string, and opens the default browser, or prints the link when it can't
- [x] Each text field is capped at 600 characters; when the link is still too long, the longest field is trimmed and the output says so
- [x] It removes code, absolute paths, URLs, secrets and the project's names from the text, names a Contextual file only by its generic path, and says what it removed
- [x] It sends nothing itself, and does nothing in CI or when feedback is off
- [ ] /agent/feedback reads the fragment into an editable form, shows exactly what will be sent with a short privacy note, and saves nothing until Send
- [ ] On Send, the server validates and caps every field, drops honeypot and flood submissions, stores no IP address, and writes one row to Neon
- [ ] A list page behind a secret shows the reports, with filters for harness, category and severity, and escapes all text
- [ ] The database URL comes only from an environment variable, and CI fails if a connection string is ever committed
- [ ] A docs page says what is collected, what never is, and how to turn it off, and the README says it in three lines
