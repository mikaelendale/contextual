# Link preview
status: planned
phase: 2
covers: src/features/link-preview/**
depends-on: links

## What it does
Each link shows its page's title, description and image. Saving a link never waits for its preview.

## Acceptance
- [ ] A saved link shows its page's title and image within 5 seconds.
- [ ] If the page can't be fetched, the link still shows its URL and no broken image.
- [ ] Saving a link never waits for its preview.
