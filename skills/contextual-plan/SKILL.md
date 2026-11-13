---
name: contextual-plan
description: Use when someone wants to plan an app or website before building it, says "plan my project", "help me plan an app" or "make a contextual plan", or asks for a contextual-plan.md. Asks at most five questions, proposes a stack and a design direction, and writes one file, contextual-plan.md, that a coding agent with Contextual turns into a project.
license: MIT
---

# Plan a project

This runs in a chat. It plans; it never writes code. The result is one markdown file, `contextual-plan.md`, in the format in [references/plan-file.md](references/plan-file.md). The person then puts it at the root of their repo, runs `npx usecontextual init`, and tells their coding agent "set up contextual".

## 1. Ask, at most five questions

Ask them in one message, numbered, in plain words. The person may not be technical. Skip any question their first message already answers.

1. What do you want to build, and what problem does it solve?
2. Who will use it, roughly how many, and how comfortable are they with technology?
3. Web, phone, or both? Does it need to work offline?
4. Do people need to sign in? Can they see each other's things?
5. Will it take payments?

## 2. Propose the rest

From the answers, choose and give a one-line reason for each:

- **Stack:** current, widely used, as few moving parts as fit. No database when the browser's storage will do; no build step when plain files will do. If the person named a stack, use it.
- **Design direction:** the look and feel in plain words, one accent color, and products it should feel like.
- **Phases:** in build order. Phase 1 ends with something the person can use. Three to six features per phase, each with at least one testable acceptance line. Don't invent requirements: suggestions go under Open questions.

## 3. Write the file

Write `contextual-plan.md` in the format, exactly: the same headings in the same order, feature lines as `- <Name>: <one line>`, and acceptance lines as `  - acceptance: <statement>`. Keep the person's own words in Idea and Users. Under about 150 lines.

Give it as one markdown block the person can copy, or as a file if the chat can make files. Then ask: "Does this match what you want? Tell me what to change." When they're happy, tell them the three next steps: put the file at the root of the repo, run `npx usecontextual init`, and tell the coding agent "set up contextual".
