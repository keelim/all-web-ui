# all-web-ui

Shared UI primitives and theme tokens for the keelim web apps.

## Exports

- `@keelim/all-web-ui`
- `@keelim/all-web-ui/styles.css`
- `@keelim/all-web-ui/spacing.css`
- `@keelim/all-web-ui/themes/admin-bw.css`
- `@keelim/all-web-ui/themes/finance.css`
- `@keelim/all-web-ui/button`
- `@keelim/all-web-ui/input`
- `@keelim/all-web-ui/panel`
- `@keelim/all-web-ui/badge`
- `@keelim/all-web-ui/loading-status`
- `@keelim/all-web-ui/empty-state`
- `@keelim/all-web-ui/card`
- `@keelim/all-web-ui/calendar`
- `@keelim/all-web-ui/table`
- `@keelim/all-web-ui/tabs`
- `@keelim/all-web-ui/tooltip`
- `@keelim/all-web-ui/sheet`
- `@keelim/all-web-ui/dropdown-menu`
- `@keelim/all-web-ui/breadcrumb`
- `@keelim/all-web-ui/accordion`
- `@keelim/all-web-ui/alert`
- `@keelim/all-web-ui/alert-dialog`
- `@keelim/all-web-ui/avatar`
- `@keelim/all-web-ui/checkbox`
- `@keelim/all-web-ui/dialog`
- `@keelim/all-web-ui/hover-card`
- `@keelim/all-web-ui/label`
- `@keelim/all-web-ui/popover`
- `@keelim/all-web-ui/progress`
- `@keelim/all-web-ui/radio-group`
- `@keelim/all-web-ui/scroll-area`
- `@keelim/all-web-ui/select`
- `@keelim/all-web-ui/skeleton`
- `@keelim/all-web-ui/slider`
- `@keelim/all-web-ui/switch`
- `@keelim/all-web-ui/textarea`
- `@keelim/all-web-ui/toast`
- `@keelim/all-web-ui/manifest`

## Usage

```tsx
import '@keelim/all-web-ui/styles.css';
import '@keelim/all-web-ui/themes/finance.css';
import { Button, Panel } from '@keelim/all-web-ui';
```

`styles.css` provides the component layer and the default finance light tokens.
Import `themes/finance.css` when a consumer uses `next-themes` class or
`data-theme` dark mode; it maps `.dark` and `[data-theme='dark']` to the same
semantic shadcn variables used by the shared primitives.

Admin surfaces should import `themes/admin-bw.css` and wrap the relevant area in
`.admin-bw-theme`, `.theme-admin-bw`, or `.kui-theme-admin-bw`. Spacing-only
consumers can import `@keelim/all-web-ui/spacing.css` without taking on a color theme.

## Build

```bash
bun run build
```

This emits a `dist/` directory with JS, type declarations, and theme CSS for the `@keelim/all-web-ui` GitHub Packages release.

`bun install` also runs the package `prepare` hook so the local workspace workflow can regenerate `dist/` before app consumers resolve package exports.

Consumers should install the exact published version from `https://npm.pkg.github.com` and import scoped package exports such as `@keelim/all-web-ui/button`.

## Stitch workflow

This repo is prepared to use the
[`google-labs-code/stitch-skills`](https://github.com/google-labs-code/stitch-skills)
workflow without vendoring the upstream skills. Root `DESIGN.md` follows the
[`google-labs-code/design.md`](https://github.com/google-labs-code/design.md)
concept: YAML front matter for machine-readable tokens plus ordered markdown
sections for design rationale.

Use `DESIGN.md` as the design-system source for Stitch prompts and
`.stitch/designs/` for downloaded Stitch HTML/screenshots. `.stitch/DESIGN.md`
is only a compatibility pointer back to the canonical root file.

When converting Stitch output, keep the result inside the package contract:
shared primitives, `--kui-*` tokens, shadcn-compatible semantic variables,
exports, manifest entries, and focused tests. See `.stitch/README.md` and
`AGENTS.md` for the agent workflow.

## Ownership

`@keelim/all-web-ui` owns the shared shadcn-compatible primitive layer for the web apps. Downstream `components/ui/*` files in consumer repos should be temporary re-export shims or app-specific composites, not independent generic primitive implementations.

The `componentManifest` export records the lifecycle status for shared primitives. New primitive exports should be added to both `package.json` and the manifest before consumer migration.
