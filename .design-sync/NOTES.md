# design-sync notes — @keelim/all-web-ui

## Setup

- Shape: `package` (no Storybook in this repo).
- Entry: `dist/index.js`, built with `bun run build`. Run it with node on `PATH` too
  (`scripts/build.mjs` spawns `tsc` via `node`); mise installs live under
  `~/.local/share/mise/installs/{node,bun}/<ver>/bin`.
- `--node-modules ./node_modules` (single-package repo, no monorepo hoisting).
- Component count: **138** exported PascalCase symbols — mostly compound sub-parts. The
  **37 top-level compositions** have authored previews in `.design-sync/previews/`
  (sub-parts fold into their parent; `MetricValue`/`DataNumber` live in `MetricCard.tsx`).
- Converter deps in `.ds-sync/`: `esbuild ts-morph @types/react playwright@1.60.0
  tailwindcss@4.2.2 @tailwindcss/cli@4.2.2`. playwright 1.60.0 pins chromium 1223, which
  is in `~/Library/Caches/ms-playwright/` on this machine — no browser download needed.
- `ln -sfn ../.ds-sync/node_modules .design-sync/node_modules` (gitignored) — `build-css.mjs`
  finds the Tailwind CLI through it.

## cssEntry — `.design-sync/build-css.mjs` (run before every build)

`node .design-sync/build-css.mjs` writes `.design-sync/generated/styles.compiled.css`
(`cfg.cssEntry`). It replaces the old `.ds-sync/inline-css.mjs`, which lived in the
gitignored staging dir and was lost on a fresh clone.

1. `dist/styles/styles.css` ships unresolved `@import`s (consumers' bundlers resolve them):
   `@astryxdesign/core/reset.css`, `@astryxdesign/core/astryx.css`,
   `@astryxdesign/theme-neutral/theme.css`, `./spacing.css`. The script inlines them and
   **fails loudly on any unmapped `@import`** (extend its `map`).
2. It appends a **Tailwind v4 layer** compiled from `.design-sync/tailwind.input.css`
   (`source(none)` + `@source '../dist'`, so only classes the library uses). The input
   mirrors `keelim-vercel/app/globals.css`: the `@theme` colour/radius mapping onto the
   shadcn HSL vars that `styles.css` defines, plus its `@layer base` (border colour, body
   bg/fg, `html { font-family: var(--font-sans) }`). Plugins are omitted.

Why (user decision, 2026-11-08): the shadcn-style compound parts (Dialog/Sheet/Select/
Toast/Table/Card* layout, `sr-only`, …) are styled only by Tailwind classes, and no shipped
stylesheet applied `--font-sans` — without this layer every card rendered in browser-default
serif with unpositioned overlays. Consumers get both from their own Tailwind build.

Cascade order matches the consumer: keelim-vercel imports all-web-ui `styles.css` first and
Tailwind last, so Tailwind's layers are declared after `reset`/`astryx-base`/`astryx-theme`
and win. Keep that order — it is what consumers render.

## Fonts — accepted substitutes

`--font-sans` names Pretendard / Pretendard Variable / Apple SD Gothic Neo / Figtree;
mono names JetBrains Mono / Roboto Mono. None ship in the repo. **User accepted system-font
substitutes** (2026-08-16); previews now render in the system sans fallback. To ship real
fonts, add them via `cfg.extraFonts`.

## Component defects found by the render check (user-deferred, 2026-11-08)

Stale shadcn/Radix classNames survive on Astryx component roots; once Tailwind resolves
them (as in Tailwind consumer apps) they break layout. Previews show the real rendering,
graded `needs-work`, and were **explicitly deferred by the user** — the fix belongs in
`src/components/*` (separate request), not in previews:

- `Checkbox` (`h-4 w-4 border border-primary rounded-sm` on the CheckboxInput root) and
  `Switch` (`h-[24px] w-[44px]`): row collapses, labels overlap.
- `Slider` (`relative flex items-center`): track collapses to a thumb.
- `Progress` (`h-4 overflow-hidden rounded-full bg-secondary`): fill hidden.
- `Alert` (alertVariants on Banner) and `Toast` (toastVariants): double frame.
- `Avatar` (`h-10 w-10`): `size` > 40 ignored, initials clipped (Sizes cell).
- `Calendar` single mode: selected day is `aria-selected` but Tailwind preflight resets the
  button background (Range cell is fine).
- Graded good with a note: `OnboardingTour` / `OnboardingHighlight` — Astryx `Text`
  forces `display:inline` over `.kui-onboarding-*` rules, so eyebrow/title/description run
  on one line.

Once the source is fixed, re-sync: those components' sources change, so the driver
re-captures them; re-grade.

## Preview authoring notes

- Layout glue in previews is inline `style` with `var(--kui-space-*)` tokens — don't use
  Tailwind utilities in previews (only library-used classes exist).
- Overlays use `cfg.overrides.<Name> = {cardMode: "single", viewport}` and `defaultOpen`.
  `Dialog`/`AlertDialog`/`Sheet` previews wrap in a `minHeight` div: the capture viewport
  follows content height, and the fixed/centred content was cut off without it.
- `Table` uses `cardMode: "column"`. Calendar previews pin `month` to Nov 2026 so renders
  are date-independent.
- Changing `cfg.overrides` trips `[CONFIG_STALE]` on `preview-rebuild.mjs`; run a full
  `package-build.mjs` first.

## Guidelines — none shipped (`guidelinesGlob: []`)

The converter's default `guidelinesGlob` includes `docs/*.md`. Since a339afc those are the
repo's operating guides (architecture, standards, operations, …), not design guidance,
and the remote project was synced without a `guidelines/` dir. `guidelinesGlob: []` keeps
local builds at parity with the remote (`auxSha` match, 2026-11-10). If real design
guidance is added later, point the glob at it explicitly.

## Known render warns

- `[TOKENS_MISSING]`: `--x-*` vars (`--x-borderWidth`, `--x-gap`, `--x-marginInline`, …)
  are a style-system prop bag set inline at render time — expected.
- `[FONT_MISSING]`: accepted substitutes (see Fonts).
- `--kui-radius-full` is referenced but not defined in the bundle (likely only in
  `themes/finance.css`, which is not in the `styles.css` closure) — kept out of conventions.

## Environment gotchas (this machine)

- The Claude Code sandbox blocks loopback `listen()`: `package-validate.mjs` render check and
  `package-capture.mjs` need the sandbox off (or `sandbox.network.allowLocalBinding: true`).
- npm inside the sandbox can't write `~/.npm/_cacache`; pass `--cache <dir under the repo>`.
- Commits are SSH-signed (`gpg.format=ssh`); a non-interactive session hangs in
  `ssh-keygen -Y sign` — commit from a terminal with the key/agent available.

## Re-sync risks

- `build-css.mjs` hard-codes the four `@import` targets; it now errors on unmapped imports,
  but a changed *target path* inside `@astryxdesign/*` would only fail at read time.
- `tailwind.input.css` copies keelim-vercel's `@theme`/`@layer base`. If the consumer's
  globals.css changes (new colour tokens, plugins), the sync drifts from what consumers
  render — diff it on each re-sync.
- The Tailwind layer only contains classes found in `dist/`. Conventions tell the design
  agent not to rely on arbitrary utilities; keep it that way.
- Deferred defects above: the 8 `needs-work` components ship with honest broken renders.
- Grades are anchored by the uploaded `_ds_sync.json`; a fresh machine carries them forward
  only through that anchor (`.design-sync/.cache/` is local).
