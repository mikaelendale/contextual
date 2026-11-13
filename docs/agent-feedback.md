# Agent feedback

When it's on, your coding agent notes problems it hits with Contextual itself, such as rules that conflict or a `check` false alarm, and before its final answer it can open one prefilled form for you. You read the form, change or delete anything, and press Send, or close the tab and nothing is sent. It follows Next.js's `experimental.agentFeedback`.

## How it works

1. A second managed block in `AGENTS.md`, between `<!-- contextual-feedback:start -->` and `<!-- contextual-feedback:end -->`, asks the agent to keep short notes while it works, without stopping its work, and to report at most once per session, only when a problem was meaningful or recurring. The block limits only what gets reported; it changes nothing about how the agent works or checks its work.
2. Before its final answer, the agent runs `usecontextual feedback` with its notes as flags. The CLI checks the values, takes things out of the text (below), adds a few facts of its own, and builds a link to `https://contextual.mikaelen.site/agent/feedback`.
3. The whole report is in the link's fragment, the part after `#`. Browsers never send the fragment to a server, so the draft doesn't reach the site, or any log, until you press Send.
4. The CLI opens the link in your default browser, or prints it when it can't. It never sends anything itself.
5. The page reads the fragment into a form you can edit, shows exactly what will be sent, and stores nothing until you press Send. The server then checks every field again and stores one row.

## What is collected

From the agent, as you reviewed it:

| Field | Values |
|---|---|
| Agent | `claude-code`, `codex`, `opencode`, `antigravity`, `other` |
| Model | as the agent reports it, up to 64 characters |
| Skill in use | `setup`, `next`, `sync`, `none` |
| Kind of problem | `conflicting-rules`, `unclear-skill-step`, `check-false-alarm`, `check-miss`, `hook-friction`, `template-gap`, `token-cost`, `structure-preference` |
| How much it got in the way | `blocked`, `worked-around`, `annoyance`, `idea` |
| What happened, what it expected, a change that would help | up to 600 characters each |
| The Contextual file involved | a generic path, such as `context/features/<feature>/log.md` |

Added by the CLI: the Contextual version, the operating system (`linux`, `macos`, `windows`), the package manager, which agent folders exist (`.agents`, `.claude` and the like), the number of errors and warnings `check` reports, and the number of features as a bucket (`1-5`, `6-20`, `21+`).

The server stores those with the date.

## What is never collected

- Anything about your project: its code, file contents, its name or the repo's, feature names, paths outside Contextual's own files.
- Secrets, links, or anything from your machine beyond the facts above.
- Your IP address. The rate limit keeps a keyed hash of it in memory for a few minutes, made with a secret that changes whenever the server restarts, and never writes it anywhere.
- Anything at all when you close the tab without pressing Send.

The block tells the agent to leave these out. The CLI takes them out again before building the link: code blocks, links, absolute paths, things that look like tokens or passwords, and the project's and features' names. It names a Contextual file only by its generic path, and says what it removed. The form shows you the result before you send it.

## Turning it on and off

- `usecontextual init` asks once. With nobody at a terminal to answer, as in CI, it stays off.
- `usecontextual feedback on` adds the block to `AGENTS.md`; `usecontextual feedback off` removes it and leaves the rest of the file as it was. The choice is stored as `"feedback"` in `context/.meta.json`, and `update` keeps the block in step with it.
- It never runs in CI. When it's off, `usecontextual feedback` opens nothing.

## For the agent

```bash
usecontextual feedback --harness claude-code --model "<model>" --skill next --category hook-friction --severity worked-around \
  --happened "<what happened>" --expected "<what you expected>" --suggestion "<a change that would help>" --file context/status/main.md
```

`usecontextual feedback --help` lists every field and value. Pass `--print` to print the link instead of opening it. Each text is cut to 600 characters, and when the link would still be longer than 4,000 characters the longest text is trimmed further, and the output says so.

## Running the site's side

The form, the Send endpoint and the owner's list live in `site/`. They need two environment variables, set in the host's settings and never committed:

| Name | What it is |
|---|---|
| `DATABASE_URL` | The Neon connection string. The table comes from `site/db/migrations/0001_agent_feedback.sql` |
| `FEEDBACK_REPORTS_SECRET` | A long random secret that opens `/agent/feedback/reports`, the owner's list |

For trying the form against a local or preview copy of the site, `USECONTEXTUAL_FEEDBACK_URL` points the CLI's link there instead.
