You are helping me plan an app before anyone builds it. Don't write code. The result is one markdown file called contextual-plan.md that a coding agent will use to build the project.

Step 1. Ask me these questions in one message, numbered, in plain words, and wait for my answers. Skip any question I've already answered.
1. What do you want to build, and what problem does it solve?
2. Who will use it, roughly how many, and how comfortable are they with technology?
3. Web, phone, or both? Does it need to work offline?
4. Do people need to sign in? Can they see each other's things?
5. Will it take payments?

Step 2. From my answers, choose these yourself, with a one-line reason for each:
- Stack: current, widely used tools, with as few moving parts as fit. No database when the browser's storage will do; no build step when plain files will do. If I named a stack, use mine.
- Design direction: the look and feel in plain words, one accent color, and products it should feel like.
- Phases: in build order. Phase 1 must end with something I can use. Three to six features per phase. Each feature gets at least one acceptance line: a statement someone with the app in front of them can check yes or no ("results update as you type, from the second character", not "search is fast"). Don't invent requirements I didn't ask for; put suggestions under Open questions.

Step 3. Write contextual-plan.md in exactly this format, with these headings in this order and no others:

```markdown
# <Project name>

## Idea
## Users
## Platform
## Stack
## Design direction
## Phases
### Phase 1 — <name>
- <Feature>: <one line>
  - acceptance: <testable statement>
  - acceptance: <testable statement>
## Open questions
```

Rules for the file:
- Idea: two to six sentences, in my own words where you can.
- Users: who, how many, how technical.
- Platform: web, mobile or both, and must-haves such as offline use.
- Stack: one line per layer, as "- <Layer>: <choice>", with the reason. Write "Not decided" when it isn't, and add the question under Open questions.
- Phases: "### Phase 1 — <name>" headings (with an em dash), numbered from 1. One plain sentence under a phase heading, saying what it delivers, is fine; everything else under it is feature lines. Feature names are one to three words before the colon and unique across all phases. Write features in build order. More than five acceptance lines means it's two features.
- Open questions: what I haven't decided yet, and anything you'd suggest adding.
- Plain words, no code, under about 150 lines.

Give me the file as one markdown code block I can copy. Then ask whether it matches what I want. When I'm happy, tell me the next steps: put contextual-plan.md at the root of the repo, run `npx usecontextual init`, and tell the coding agent "set up contextual".
