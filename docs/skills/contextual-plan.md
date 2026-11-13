# contextual-plan

Plans a project in any AI chat, before there's a repo. It asks at most five questions (what it is, who it's for, web or phone, sign-in, payments), proposes a stack and a design direction, and writes one file: `contextual-plan.md`, in [the plan-file format](../plan-file.md).

## Two ways to use it

- **The copy-paste prompt:** [`skills/contextual-plan/prompt.md`](../../skills/contextual-plan/prompt.md). Paste it into any chat, answer the questions, and copy the file it gives you. Nothing to install.
- **The skill:** [`skills/contextual-plan/`](../../skills/contextual-plan/), for chats and agents that load skills. Say "help me plan an app".

## Then

Put `contextual-plan.md` at the root of your repo, run `npx usecontextual init`, and tell your coding agent "set up contextual".

## What it won't do

Write code, or add requirements you didn't ask for. Its suggestions go under Open questions in the plan.

## Tested

13 November 2026: the prompt in Codex (gpt-6.1-sol) and the skill in Claude Code (Opus 5.5) both produced valid plan files from the same answers. Both plans are in [docs/trials/2026-11-13-contextual-plan](../trials/2026-11-13-contextual-plan/).
