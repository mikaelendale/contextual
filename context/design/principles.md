# Design principles

> The website these notes describe moved to a separate, private repository on 13 November 2026. This repo has no UI now; the notes stay as a record.

## Look and feel
The site. Calm and centred, with lots of space and one strong picture per section: a hot orange sky in live, visible 2px grain. These values were read from the site at setup (`site/app/globals.css`) and can be changed.

## Color
| Token | Value | Use for |
|---|---|---|
| `background` | `#f7f5f2` | The page |
| `foreground` | `#17171b` | Body text, 16.4:1 on the background |
| `muted-foreground` | `#6c6c74` | Supporting text, 4.8:1 |
| `faint` | `#a4a4ab` | Decoration only, 2.3:1: never text people need to read |
| `brand` | `#f24d00` | Display accents and large italic headings only, 3.3:1 |
| `brand-ink` | `#c43c00` | Small orange text, 4.8:1 |
| `brand-deep` | `#db3300` | The deep end of gradients |
| `brand-soft` | `#ffe7d6` | Soft fills behind a highlighted row |
| `danger` | `#b42318` | Error messages, 6.0:1 on the background |
| Field border | `#86868e` | Outlines of inputs, selects and text areas, 3.6:1 on white; `brand-ink` when focused, 5.3:1 |
| Dither ramp | `#c43000` → `#ff6a14` → `#fff4ea` | The grain on the sky, the cards and the plates |

Fills are gradients, not flat colors.

## Type
- Inter for everything, including labels, commands and file names. No monospace anywhere.
- Newsreader, light, for headings: section headings at `clamp(2.2rem, 1.5rem + 2.3vw, 3.2rem)`, with the second line in orange italic. One size per heading level.
- Body 16 to 18px at 1.65 line height; labels 12 to 14px.

## Spacing
Sections are 1240px wide at most, with 20px side gutters (32px from 640px up). Sections have an even gap of `clamp(4.5rem, 9vw, 8rem)` above and below; only the hero fills the first screen.

## Shape and depth
Plates have a 22px radius, panels 14px, buttons and chips are full pills. Plates cast a soft orange shadow; panels a light one. Cards don't lift on hover.

## Motion
The grain re-rolls slowly, each pixel about every 2 seconds. Headline words blur in once. A figure plays its story once when it comes into view, says which step it's on, holds while pointed at, and has a Replay button. With reduced motion everything shows its finished state.

## Icons
Phosphor icons, at 14 to 16px, regular weight, fill weight for marks such as the GitHub logo. Product marks come from their owners' published sets (simple-icons, Lobe Icons).

## Words
Plain and specific: what something does, not how good it is. Sentence case. Buttons say what they do ("Copy", "Replay"). No badges above headings, and decorative labels only on hover.
