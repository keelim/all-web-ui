# design-sync notes — @keelim/all-web-ui

## Setup

- Shape: `package` (no Storybook in this repo).
- Entry: `dist/index.js` (built via `bun run build`); `dist/` was already built and current at sync time.
- `--node-modules ./node_modules` (single-package repo, no monorepo hoisting).
- Component count: **138** exported PascalCase symbols — most are compound sub-parts
  (e.g. `AccordionItem`, `AccordionTrigger`, `DialogContent`, `AlertDialogAction`), not
  separate top-level UI. There are ~35 top-level compositions.

## cssEntry — generated, not the raw repo file

`dist/styles/styles.css` ships **unresolved** `@import` specifiers by design —
`scripts/build.mjs` just copies `src/styles/` into `dist/styles/` verbatim and expects the
*consuming app's own bundler* (Vite/webpack/PostCSS) to resolve:

- `@astryxdesign/core/reset.css`
- `@astryxdesign/core/astryx.css`
- `@astryxdesign/theme-neutral/theme.css`
- `./spacing.css` (this one *is* a real sibling file, just needed inlining like the rest)

design-sync needs a fully self-contained stylesheet, so `.ds-sync/inline-css.mjs` (staged
alongside the other converter scripts, NOT part of the repo's own build) inlines these four
imports into `.design-sync/generated/styles.compiled.css`, which `cfg.cssEntry` points at.

**Re-sync must re-run `node .ds-sync/inline-css.mjs` before `package-build.mjs`** whenever
`dist/styles/styles.css` or the resolved `@astryxdesign/*` packages change — the generated
file is gitignored-adjacent scratch, not re-derived automatically by the driver.

## Fonts — accepted substitutes

`--font-sans` etc. reference `"Pretendard"`, `"Pretendard Variable"`, `"JetBrains Mono"`,
`"Roboto Mono"`, `"Apple SD Gothic Neo"`, `"Figtree"`. None of these ship as files or
`@font-face` rules anywhere in the repo (checked `src/`, no `preview-head.html`, no font
loader in JS) — the host app is expected to provide them itself.

**User explicitly accepted rendering with system-font substitutes** (2026-08-16) rather than
sourcing these from a public registry or wiring `runtimeFontPrefixes`. If the real fonts
should ship, add them via `cfg.extraFonts` on a future sync.

## Guidelines — none shipped (`guidelinesGlob: []`)

The converter's default `guidelinesGlob` includes `docs/*.md`. Since a339afc those are the
repo's operating guides (architecture, standards, operations, …), not design guidance,
and the remote project was synced without a `guidelines/` dir. `guidelinesGlob: []` keeps
local builds at parity with the remote (`auxSha` match, 2026-11-10). If real design
guidance is added later, point the glob at it explicitly.

## Known render warns

- `[TOKENS_MISSING]`: `--x-borderWidth`, `--x-gap`, `--x-marginInline`, `--x-counterReset`,
  `--x-gridAutoRows`, `--x-gridTemplateColumns`, `--x---_tab-indicator-bottom`,
  `--x-layout-content-width`, and similar `--x-*` vars are a style-system prop bag set
  inline by JS at render time (not in any shipped stylesheet) — expected per the validator's
  own note, not chased.

## Verification scope — this sync

**No Playwright/Chromium installed.** User declined the ~200MB download twice (once for the
render check, once for absolute-grading screenshots via `package-capture.mjs`, which also
hard-requires `playwright`). Consequence:

- `package-validate.mjs` ran with `--no-render-check` — previews were never visually verified.
- **No preview authoring was done.** All 138 components ship as the floor card (functional,
  crash-safe render via `.d.ts` props; typographic "preview not yet authored" fallback).
- This is a legitimate, supported state per the skill (floor cards are never a failure), but
  it means the DS pane in claude.ai/design will show plain floor cards, not curated example
  compositions, until a future re-sync installs Playwright and authors previews for the ~35
  top-level compositions (leaf/compound parts fold into their parent's preview, per the
  skill's guidance — don't author all 138 separately).

## Re-sync risks

- The generated `cssEntry` (`.design-sync/generated/styles.compiled.css`) can silently go
  stale if `dist/styles/styles.css` changes shape (new/removed `@import`) without updating
  `.ds-sync/inline-css.mjs`'s `map` — re-check it by hand on a re-sync, the script has no
  drift detection.
- Font substitutes were accepted without exploring whether these families are open-source
  (Pretendard and JetBrains Mono both are) and could be sourced from a public registry —
  revisit if the DS pane's fallback-font rendering turns out to matter for review.
- No component was authored or visually confirmed to render correctly at all — the whole
  bundle is unverified beyond `package-validate.mjs`'s structural checks (bundle syntax,
  `.d.ts` parse, CSS import closure). A future sync's first job should be installing
  Playwright and running the full render check before authoring anything.
