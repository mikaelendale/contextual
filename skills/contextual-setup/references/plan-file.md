# The plan file

`contextual-plan.md` is the whole plan for a project in one markdown file. Three things can write it:

- the `contextual-plan` chat skill, or its copy-paste prompt, in any AI chat
- the person, by hand, starting from `templates/contextual-plan.md`
- `contextual-setup`, which writes the person's answers in this format when there is no plan file

During setup the file moves to `context/idea.md`, unchanged. After that the agent never edits it, so it always shows what the person first asked for.

A complete example is `example/context/idea.md` in the Contextual repo: https://github.com/mikaelendale/contextual/blob/main/example/context/idea.md

## Format

The same headings, in the same order, every time. Don't add, rename or reorder them. Detail that fits nowhere else goes under the closest heading.

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

## What goes under each heading

| Heading | What it holds | Setup turns it into |
|---|---|---|
| `# <Project name>` | The product's name | The heading of `AGENTS.md` |
| Idea | Two to six sentences, in the person's words: what it is and the problem it solves | The one-line description in `AGENTS.md` |
| Users | Who uses it, roughly how many, how technical they are | `architecture.md` (roles), `design/principles.md` (tone of the words) |
| Platform | Web, mobile or both, plus must-haves such as offline use | `stack/overview.md` |
| Stack | One line per layer: `- <Layer>: <choice>`, with a reason when there is one | `stack/_index.md`, `overview.md`, `requirements.md`, `deploy.md`; a preset when one matches |
| Design direction | The look and feel in plain words, any colors or fonts already chosen, products it should feel like | `design/principles.md` |
| Phases | Phases in build order, each a list of features with acceptance lines | `build-plan.md`, and one `features/<feature>/README.md` per feature, status `planned` |
| Open questions | What the person hasn't decided yet | "Blocked / needs a human" in `status/main.md` |

`idea.md` keeps all of it, so nothing is lost when a section maps loosely.

## Phases

- Number them from 1, in the order they get built: `### Phase 1 — <name>`.
- The first phase should end with something a person can use, even if it is small.
- Three to six features per phase is typical.

## Feature lines

```markdown
- Link preview: show the page title, description and image for each link
  - acceptance: a saved link shows the page's title and image within 5 seconds
  - acceptance: if the page can't be fetched, the link still shows its URL and no broken image
```

- The name comes before the colon: one to three words. What it does comes after, in one line.
- The feature's folder is the name in kebab-case: `Link preview` becomes `features/link-preview/`. Names must be unique across all phases.
- Write features in build order within a phase. The README's `depends-on:` is worked out from that order and from what each feature needs.
- If a feature needs more than five acceptance lines, it is probably two features.

## Acceptance lines

Every feature has at least one. Each acceptance line becomes a checkbox in the feature's README, and the feature ships when every box is ticked.

An acceptance line is testable: someone with the app in front of them can say yes or no.

| Not testable | Testable |
|---|---|
| Search is fast | Results update as you type, from the second character |
| Good error handling | An invalid URL shows an error under the field and nothing is saved |
| Secure invites | An invite link expires after 7 days |

## Rules for whoever writes it

- Plain words, no code.
- Name real tools in Stack, current versions if known. "Not decided" is a fine answer; put the question under Open questions too.
- Don't invent requirements the person didn't ask for. Suggest them under Open questions.
- Keep it under about 150 lines. It is read during setup, then only when someone needs the original intent.
