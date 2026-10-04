# Package setup and checks

Use the pinned Bun from `mise.toml`. For an independent checkout, prepare GitHub Packages access through an environment token and `@keelim` registry mapping, then run:

```sh
bun install --frozen-lockfile
bun run typecheck
bun test
bun run build
```

Within the parent workspace, normal hydration runs from its root; avoid rewriting independent lockfiles as a side effect. `bun run build` generates and verifies `dist`. Before an authorized publish, run `bun run package:smoke` and `bun run pack:verify`; `prepublishOnly` also enforces those checks. Do not publish merely to verify documentation.

For canonical design changes, run `bun run design:lint`. The command may need tool/package access; report an unavailable prerequisite instead of claiming lint success. Design-source edits do not authorize remote Stitch changes.

Consumers import `@keelim/all-web-ui/styles.css` once, then `themes/finance.css` or `themes/admin-bw.css` where needed. Spacing-only users may import `spacing.css`. The provider has no database initialization, product development server, or user-account setup.
