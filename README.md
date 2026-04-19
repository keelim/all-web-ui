# all-web-ui

Shared UI primitives and theme tokens for the keelim web apps.

## Exports

- `all-web-ui`
- `all-web-ui/styles.css`
- `all-web-ui/themes/admin-bw.css`
- `all-web-ui/themes/finance.css`
- `all-web-ui/button`
- `all-web-ui/input`
- `all-web-ui/panel`
- `all-web-ui/badge`
- `all-web-ui/loading-status`
- `all-web-ui/empty-state`
- `all-web-ui/card`
- `all-web-ui/calendar`
- `all-web-ui/table`
- `all-web-ui/tabs`
- `all-web-ui/tooltip`
- `all-web-ui/sheet`
- `all-web-ui/dropdown-menu`
- `all-web-ui/breadcrumb`
- `all-web-ui/accordion`
- `all-web-ui/alert`
- `all-web-ui/alert-dialog`
- `all-web-ui/avatar`
- `all-web-ui/checkbox`
- `all-web-ui/dialog`
- `all-web-ui/hover-card`
- `all-web-ui/label`
- `all-web-ui/popover`
- `all-web-ui/progress`
- `all-web-ui/radio-group`
- `all-web-ui/scroll-area`
- `all-web-ui/select`
- `all-web-ui/skeleton`
- `all-web-ui/slider`
- `all-web-ui/switch`
- `all-web-ui/textarea`
- `all-web-ui/toast`
- `all-web-ui/manifest`

## Usage

```tsx
import 'all-web-ui/styles.css';
import 'all-web-ui/themes/admin-bw.css';
import { Button, Panel } from 'all-web-ui';
```

## Build

```bash
bun run build
```

This emits a `dist/` directory with JS, type declarations, and theme CSS so the package can move toward a versioned shared-package workflow.

`bun install` also runs the package `prepare` hook so the local sibling-repo workflow can regenerate `dist/` before app consumers resolve package exports.

The workspace is currently in a mixed migration state: some consumers still use direct sibling source imports, while package-export adoption is being rolled out incrementally at adapter/layout boundaries.

## Ownership

`all-web-ui` owns the shared shadcn-compatible primitive layer for the web apps. Downstream `components/ui/*` files in consumer repos should be temporary re-export shims or app-specific composites, not independent generic primitive implementations.

The `componentManifest` export records the lifecycle status for shared primitives. New primitive exports should be added to both `package.json` and the manifest before consumer migration.
