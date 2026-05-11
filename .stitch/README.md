# Stitch Workflow for all-web-ui

This directory adapts the `google-labs-code/stitch-skills` workflow to
all-web-ui. The upstream repository is an Agent Skills collection for Stitch MCP;
this package should consume its workflow shape, not vendor its source.

## Local Contract

- `.stitch/DESIGN.md` is the promptable design-system source for Stitch work.
- `.stitch/designs/` is the landing area for downloaded Stitch HTML and
  screenshots.
- `src/components/*`, `src/styles/*`, `src/index.ts`, `src/manifest.ts`, and
  `package.json` remain the package contract for consumers.
- Do not add app pages, routing, or mock product flows to this package. Convert
  only reusable primitives, tokens, or docs that belong in a shared UI library.

## Relevant Upstream Skills

- `stitch-design`: use for prompt enhancement, screen generation/editing, and
  keeping prompts aligned to `.stitch/DESIGN.md`.
- `design-md`: use when a Stitch project has enough screens to refresh this
  design system document from real generated assets.
- `react:components`: use when converting downloaded Stitch HTML/screenshots
  into React components. For all-web-ui, adapt its Vite/app assumptions to this
  package's `src/components` primitive model.
- `shadcn-ui`: use as a compatibility reference. all-web-ui already owns copied
  Radix/shadcn-style primitives, so new shared primitives must preserve local
  token classes and package exports.

## Conversion Rules

1. Start from `.stitch/DESIGN.md` before asking Stitch for new screens.
2. Save generated screen assets under `.stitch/designs/`.
3. Convert only durable primitives or token updates into `src/`.
4. Avoid hardcoded hex colors in components; map styles through `--kui-*` and
   shadcn bridge variables.
5. Add every new primitive to `src/index.ts`, `src/manifest.ts`, `package.json`
   exports, and tests.
6. Verify the package locally with `bun run typecheck`, `bun test`, and
   `bun run build`.
7. For consumer-facing primitive changes, run the root
   `scripts/verify-all-web-ui-integration.sh --full` from the workspace root
   when the sibling repos are available.

## Skill Installation Note

Do not install upstream Stitch skills globally as part of package changes.
Agents may install or invoke them in their own environment when they need Stitch
MCP access, but this repository should stay independently cloneable and should
not depend on a global Agent Skills installation.
