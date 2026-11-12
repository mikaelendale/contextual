# The setup questions (path 2)

Ask these in one message, numbered, in plain words. The person may not be technical, so don't ask about frameworks or databases. Say they can answer in a sentence each, and that "not sure" is a fine answer.

1. What do you want to build, and what problem does it solve? Two or three sentences in your own words.
2. Who will use it? Just you, a small group, or the public? How comfortable are they with technology?
3. Where will people use it: in a web browser, as a phone app, or both? Does it need to work offline?
4. Do people need to sign in? If so, can they see each other's things, or only their own?
5. Will it take payments?

## After the answers

You write the rest of the plan. Don't make the person design it:

- **Stack:** pick tools that fit the answers and are widely used, current and simple. Prefer fewer moving parts: no database when the browser's own storage will do, no build step when plain files will do. Give a one-line reason for each choice.
- **Design direction:** propose one in plain words from what the product is for and who uses it: calm or lively, dense or roomy, one accent color.
- **Phases:** split the idea into phases in build order. Phase 1 ends with something the person can use, even if it's small. Give each feature at least one testable acceptance line (see the table in plan-file.md).
- **Open questions:** anything the answers left open, and anything you'd suggest adding. Don't put new requirements in the phases.

Then show the whole plan and ask: "Does this match what you want? Tell me what to change, or say go ahead."
