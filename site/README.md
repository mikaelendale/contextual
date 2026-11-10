# Contextual

The teaser site for Contextual: an open source context structure that gives AI coding agents persistent memory of your project. It works with Claude Code and Codex.

Built with Next.js 16, Tailwind CSS 4, shadcn/ui and [Paper Shaders](https://shaders.paper.design).

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Settings

| Variable | What it does |
| --- | --- |
| `SITE_URL` | The public address, `https://contextual.mikaelen.site`. It makes the canonical link and the share-card links absolute. Vercel fills this in on its own. |
| `NEXT_PUBLIC_CHANNEL_URL` | Your channel link. When it's set, "Stay tuned to the channel" becomes a link and the header shows "Join the channel". |
| `VISITS_NAMESPACE` | The name of the visit counter on [Abacus](https://jasoncameron.dev/abacus/). Required in production: use something hard to guess, because the counter itself is public. Without it, production shows no counter. Development uses its own counter. |

On Vercel, set the project's Root Directory to `site`.

## Where things are

| Path | What it is |
| --- | --- |
| `app/page.tsx` | The page |
| `components/sky.tsx` | The hero sky, its motion and the constellation |
| `components/live-dither.tsx` | Paper's image dithering, patched for slow, live grain with a colour ramp |
| `public/dither/` | Greyscale images the dithering turns into the sky and the cards |
| `app/opengraph-image.png`, `app/twitter-image.png` | The share card (1200×630) |
| `app/icon.tsx`, `app/apple-icon.tsx` | The browser and home screen icons |

Product marks: the Claude Code mark is from [simple-icons](https://simpleicons.org) (CC0), and the Codex mark is from [Lobe Icons](https://github.com/lobehub/lobe-icons) (MIT). Both marks belong to their owners.
