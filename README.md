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
