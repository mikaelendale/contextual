# Deslop

The same file in every Contextual project. Don't edit it in your repo: `usecontextual update` replaces it. Rules for this project's own look go in `principles.md`.

Read this before any UI work. When the work is done, run the checklist at the bottom and record the result in the feature's `log.md`.

## Never ship these

**Color and effects**
- Purple, violet or blue-to-purple gradients. Gradient text.
- Glows, neon shadows and glass blur used as decoration.
- Heavy drop shadows on flat content. Borders separate things; shadows are for things that float, like menus and dialogs.
- Decorative blobs, orbs and blurred shapes behind content.

**Layout**
- Everything centered, with no clear hierarchy. Center only short, single-purpose screens such as sign-in.
- The row of three cards, each with an icon, a heading and two lines of text.
- Cards inside cards.
- Fully rounded pills on every element. Pills are for tags and statuses, not buttons, inputs and cards.
- Pill badges above headlines ("New", "Introducing…", "Now with AI").
- Spacing values outside the project's spacing scale. Equal things spaced unequally.

**Icons and images**
- Emoji used as icons.
- Mixed icon sets, sizes or stroke widths on one screen.
- Stock illustrations, 3D shapes or abstract art standing in for the product.

**Words**
- Filler copy: "Build faster", "Supercharge your workflow", "Unlock", "Seamless", "Effortless", "Revolutionize", "Next-level", lorem ipsum.
- Fake testimonials, fake logos, fake metrics, fake user counts.
- Headings that say nothing ("Features", "Why choose us") where a specific one fits.
- Exclamation marks and hype in buttons, labels and errors.
- Errors that don't say what to do next ("Something went wrong").

**Controls and states**
- More than one primary button on a screen.
- Lists, tables and async actions with no empty, loading or error state.
- Buttons that show nothing while a request runs, or that send it twice when pressed twice.
- Controls that only work on hover, with no keyboard or touch equivalent.
- Disabled controls with no reason shown.

## Checklist (after every UI task)

1. Every screen you changed passes the list above.
2. Colors, type sizes, spacing, radius and shadows all come from `principles.md`.
3. Each screen has one primary action.
4. Every list, table and async action has an empty, a loading and an error state, and you have seen each one on screen.
5. Every control works with the keyboard and shows a visible focus ring.
6. Body text has a contrast ratio of at least 4.5:1 against its background.
7. At 375px wide nothing overflows, overlaps or scrolls sideways.
8. Every heading, button and message says something specific to this product.

Record the result in the log entry as one of these:

- `Deslop: pass (<how you checked>)`: every item passed. Say how you saw the screens: a screenshot path, or the tool you used, such as `Playwright screenshots at 375px and 1280px`.
- `Deslop: fixed <what>`: you found problems and fixed them.
- `Deslop: not verified <reason>`: you couldn't render the UI, so you couldn't run the checklist. Say why. The next session that can render it runs the checklist.
- `Deslop: not UI`: the task didn't touch the UI.

Never write `pass` for a screen you haven't seen. Anything you couldn't fix goes under Open questions in the feature's `notes.md`.
