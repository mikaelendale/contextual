# Tests — Manage tasks

## Automated
None yet.

## How a person reaches it
Open the app. Every task in the list has a checkbox, an Edit button and a Delete button.

## How the agent checks it
1. `yarn dev` and open http://localhost:3000.
2. Tick "Sleep".
3. Click Edit on "Repeat", type "Repeat daily", and click Save.
4. Click Edit on "Eat", then Cancel.
5. Click Delete on "Eat".

## What proves it works
"Sleep" is ticked. "Repeat" now reads "Repeat daily" and focus is on its Edit button. "Eat" keeps its name after Cancel, then disappears after Delete, with focus on the heading, which reads "2 tasks remaining".

## Last result
Not run yet. At setup, 2026-11-13, the code was only read.
