# Package setup and checks

Use mise 2026.10.8 or newer with the pinned Bun 1.4.4. Review `mise.toml` before trusting it in a new checkout, then run:

```sh
mise trust
mise install --locked
mise run doctor
mise run install
mise run verify
```

`mise run` defaults to the read-only doctor; check tasks never install missing tools or dependencies. Each `install`, `lint`, `test`, and `build` task runs the version-checking doctor first, including when invoked on its own. `lint` runs the existing TypeScript static check, `test` runs the component/contract suite, and `build` emits and verifies `dist`. `install` is an explicit frozen Bun dependency installation; in the parent workspace, use the root hydration flow below instead.

Both verification and release CI install tools from this config and lock with mise 2026.10.8, then use the same tasks. Refresh tool download metadata explicitly with `mise lock --platform linux-x64,macos-arm64` and review the diff; keep version upgrades separate. The release-only npm publication lane retains its existing Node 22 setup and registry authentication; an exact verified Node patch pin remains separate work.

Within the parent workspace, normal hydration runs from its root; avoid rewriting independent lockfiles as a side effect. `bun run build` generates and verifies `dist`. Before an authorized publish, run `bun run package:smoke` and `bun run pack:verify`; `prepublishOnly` also enforces those checks. Do not publish merely to verify documentation.

For canonical design changes, run `bun run design:lint`. The command may need tool/package access; report an unavailable prerequisite instead of claiming lint success. Design-source edits do not authorize remote Stitch changes.

Consumers import `@keelim/all-web-ui/styles.css` once, then `themes/finance.css` or `themes/admin-bw.css` where needed. Spacing-only users may import `spacing.css`. The provider has no database initialization, product development server, or user-account setup.
