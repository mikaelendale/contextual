# Tests — Contextual plan

## Automated
None of its own. `plan.test.js` checks the format against the example's `idea.md`, and `skills.test.js` checks the reference copy.

## How a person reaches it
Paste `skills/contextual-plan/prompt.md` into any AI chat, or say "help me plan an app" where the skill is installed.

## How the agent checks it
1. Run the prompt in a chat with a sample idea, answering its questions.
2. Check the result with the plan parser (`readPlanFile` in `packages/cli/src/plan.js`).
3. Run setup on it.

## What proves it works
The parser finds no problems, and setup accepts the plan unchanged.

## Last result
2026-11-13 · trials: valid plans from the prompt in Codex and from the skill in Claude Code (`docs/trials/2026-11-13-contextual-plan/`).
