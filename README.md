# all-web-ui

Shared UI primitives and theme tokens for keelim web apps.

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
- `@keelim/all-web-ui/metric-card`
- `@keelim/all-web-ui/onboarding`
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
- `@keelim/all-web-ui/telemetry`
- `@keelim/all-web-ui/theme-contract`

## Consumer Quick Start

This follows the same shape as the Astryx getting-started flow: install the
package, add global theme CSS, import the first component from a subpath, then
use the package manifest as the local component reference. Do not add
`@astryxdesign/*` packages for the default consumer rollout.

### Install

`@keelim/all-web-ui` is published to GitHub Packages. Consumer repos need an
npm token that can read the `@keelim` scope and an `.npmrc` registry mapping:

```ini
@keelim:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Install the exact released version expected by the current consumer lockfiles:

```bash
bun add @keelim/all-web-ui@0.1.4
```

The package expects React and React DOM `^19.0.0` peer dependencies. If a
consumer sees duplicate React, invalid hook call, or Radix primitive runtime
errors after install, check React 19 alignment in the app lockfile before
debugging component code.

Current consumer mapping:

| Consumer | Package | Global CSS | Theme CSS |
| --- | --- | --- | --- |
| `keelim-vercel` | `@keelim/all-web-ui@0.1.4` | `@keelim/all-web-ui/styles.css` | `@keelim/all-web-ui/themes/finance.css` |
| `rich/web` | `@keelim/all-web-ui@0.1.4` | `@keelim/all-web-ui/styles.css` | `@keelim/all-web-ui/themes/admin-bw.css` |

### Add Theme CSS

Import shared component CSS once in the app shell, then import the theme CSS
that matches the surface.

```tsx
// keelim-vercel/app/layout.tsx
import '@keelim/all-web-ui/styles.css';
import '@keelim/all-web-ui/themes/finance.css';
```

```tsx
// rich/web/src/app/layout.tsx
import '@keelim/all-web-ui/styles.css';
import '@keelim/all-web-ui/themes/admin-bw.css';
```

`styles.css` provides the component layer and default finance light tokens.
Import `themes/finance.css` when a consumer scopes finance light or dark mode
outside the global `styles.css` default; it maps selectors to the same semantic
shadcn variables used by shared primitives:

| Consumer strategy | Supported selector |
| --- | --- |
| Finance class strategy | `.theme-finance`, `.kui-theme-finance` |
| Finance data strategy | `[data-kui-theme='finance']` |
| Finance shell class dark state | `.theme-finance.dark`, `.kui-theme-finance.dark`, `[data-kui-theme='finance'].dark` |
| Finance shell data dark state | `[data-kui-theme='finance'][data-theme='dark']` |

Admin surfaces import `themes/admin-bw.css` and wrap the relevant area in
`.admin-bw-theme`, `.theme-admin-bw`, `.kui-theme-admin-bw`, or
`[data-kui-theme='admin-bw']`. Spacing-only consumers can import
`@keelim/all-web-ui/spacing.css` without taking on color theme.

Keep theme wrapper classes on the smallest app shell that needs the theme.
Nested consumer apps should import shared component CSS once, then scope each
optional theme wrapper around its own surface.

### Add The First Component

Consumer app code should use shared primitives through allowed app boundaries:
the root layout, `components/shared/**`, `lib/ui-adapters/**`, or
`components/ui/*` re-export shims. Keep generic `components/ui/*` files as
temporary shims around `@keelim/all-web-ui/*`, not independent Radix/shadcn
forks.

```tsx
import { Button } from '@keelim/all-web-ui/button';
import { Input } from '@keelim/all-web-ui/input';
import { MetricCard, MetricValue } from '@keelim/all-web-ui/metric-card';
import { Panel } from '@keelim/all-web-ui/panel';

export function PortfolioSummary() {
  return (
    <Panel as="section" className="kui-stack-md" aria-labelledby="portfolio-summary-title">
      <div>
        <h2 id="portfolio-summary-title" className="type-h3">Portfolio summary</h2>
        <p className="type-body-sm fg-2">Latest synced account value.</p>
      </div>

      <MetricCard>
        <MetricValue>12.4%</MetricValue>
      </MetricCard>

      <Input aria-label="Watchlist symbol" placeholder="AAPL" />
      <Button type="button">Add symbol</Button>
    </Panel>
  );
}
```

```tsx
import { Button } from '@keelim/all-web-ui/button';
import { Panel } from '@keelim/all-web-ui/panel';

export function AdminConsoleShell() {
  return (
    <main className="admin-bw-theme">
      <Panel as="section">
        <Button variant="secondary">Run audit</Button>
      </Panel>
    </main>
  );
}
```

### Explore The Manifest

Astryx uses its CLI as the component and token reference. In this package, use
`@keelim/all-web-ui/manifest` and `@keelim/all-web-ui/theme-contract` for the
same local contract surface. `componentManifest` records component lifecycle,
export paths, required style imports, and optional theme scopes. The
`theme-contract` subpath records canonical theme ids, selectors, and required
`--kui-*`/shadcn bridge tokens.

Add a direct Astryx pilot only when that is explicitly requested. Keep it in a
removable sandbox, install `@astryxdesign/core`,
`@astryxdesign/theme-neutral`, and `@astryxdesign/cli` there, and smoke-test
only Astryx `Button`/`VStack` before deciding whether anything belongs in this
shared package.

## Verification

```bash
bun run typecheck
bun test
bun run build
```

This emits a `dist/` directory with JS, type declarations, and theme CSS for
the `@keelim/all-web-ui` GitHub Packages release.

`bun run build` validates generated package exports, copied CSS assets,
declaration files, dependency classifications, and relative ESM specifiers.
Run `bun run design:lint` whenever `DESIGN.md`, theme tokens, or Stitch-facing
design contracts change. Before publishing, run `bun run package:smoke` and
`bun run pack:verify`; local `npm publish` is guarded by `prepublishOnly`.

Consumers should install the exact published version from
`https://npm.pkg.github.com` and import scoped package exports such as
`@keelim/all-web-ui/button`.

## Stitch Workflow

This repo is prepared to use
[`google-labs-code/stitch-skills`](https://github.com/google-labs-code/stitch-skills)
without vendoring upstream skills.

Root `DESIGN.md` follows the
[`google-labs-code/design.md`](https://github.com/google-labs-code/design.md)
concept: YAML front matter machine-readable tokens plus ordered markdown
sections for design rationale.

Use `DESIGN.md` as the design-system source for Stitch prompts and
`.stitch/designs/` for downloaded Stitch HTML/screenshots. `.stitch/DESIGN.md`
is only a compatibility pointer back to the canonical root file.

When converting Stitch output, keep the result inside the package contract:
shared primitives, `--kui-*` tokens, shadcn-compatible semantic variables,
exports, manifest entries, and focused tests. See `.stitch/README.md` and
`AGENTS.md` for the agent workflow.

## Ownership

`@keelim/all-web-ui` owns the shared shadcn-compatible primitive layer for web
apps. Downstream `components/ui/*` files in consumer repos should be temporary
re-export shims or app-specific composites, not independent generic primitive
implementations.

The frozen `componentManifest` export records lifecycle status, component
export paths, required style imports, and optional theme scopes for shared
primitives. The `theme-contract` subpath owns the canonical theme ids,
selectors, and required `--kui-*`/shadcn bridge token list used by both
telemetry context and manifest metadata.

New primitive exports should be added to `src/index.ts`, `package.json`, and
`src/manifest.ts` before consumer migration. `bun test` includes
manifest/package export parity checks; missing package export, missing
component source file, or manifest entry absent from `DESIGN.md` is expected to
fail before release.
