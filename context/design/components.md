# Components

> The website these notes describe moved to a separate, private repository on 13 November 2026. This repo has no UI now; the notes stay as a record.
Check here before building a new one, and add a row when you do.

| Component | Where | Use for | Don't use for |
|---|---|---|---|
| `Section`, `SectionTitle`, `Lede`, `Code` | `site/components/home/section.tsx` | Every section after the hero: the gap, the heading, the paragraph, a command in a sentence | The hero |
| `Plate`, `PANEL` | `site/components/home/plate.tsx` | The orange dithered plate a figure sits on, and the white panels on it | Plain text sections |
| `LiveDither` | `site/components/live-dither.tsx` | Turning a greyscale image into the live orange grain | Photos or UI |
| `CopyCommand` | `site/components/copy-command.tsx` | The hero's one-press install command | Several commands, for which use `InstallModule` |
| `InstallModule` | `site/components/install-module.tsx` | The install command with npm, pnpm and bun tabs | |
| `GitHubButton` | `site/components/github-button.tsx` | The header's link to the repo, with its numbers | |
| Product marks | `site/components/brand-marks.tsx` | Naming the agents Contextual works with | Decoration |
| `Button`, `Input` | `site/components/ui/` | shadcn/ui building blocks | |
