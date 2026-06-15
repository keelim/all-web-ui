# all-web-ui Agent Guidance

## Scope

all-web-ui is an autonomous shared React UI package for keelim web apps. Keep
changes scoped to reusable primitives, theme tokens, package exports, tests, and
docs. Do not add app routes or product-specific workflows here.

## Stitch Skills

The project is prepared for `google-labs-code/stitch-skills` through
`DESIGN.md`, `.stitch/DESIGN.md`, and `.stitch/README.md`.

- Use root `DESIGN.md` as the canonical design-system source when prompting
  Stitch or another coding agent.
- Keep `DESIGN.md` compatible with the `google-labs-code/design.md` concept:
  YAML token front matter first, then ordered markdown rationale sections.
- Treat `.stitch/DESIGN.md` as a compatibility pointer, not a second source of
  truth.
- Store downloaded Stitch HTML/screenshots under `.stitch/designs/`.
- Treat `stitch-design`, `design-md`, `react:components`, and `shadcn-ui` as
  workflow references, not vendored source.
- Convert Stitch output into durable package primitives only when the result
  belongs in this shared library.
- Keep `.stitch/component-reference-board.prompt.md` reference-only. Do not put
  color tokens, font tokens, hex/HSL values, or theme instructions there; encode
  durable token semantics in root `DESIGN.md` and CSS token files.
- When mutating or verifying a remote Stitch design system, treat
  `get_project.designTheme.designMd` parity with root `DESIGN.md` as the success
  criterion. Do not mark `.stitch/metadata.json` as synced just because
  create/upload/apply calls succeeded.

## Package Contract

New shared primitives must update all contract surfaces:

- `src/components/<name>.tsx`
- `src/index.ts`
- `src/manifest.ts`
- `package.json` exports
- focused tests under `tests/`

Use `--kui-*` theme variables and the existing shadcn HSL bridge instead of
hardcoded component colors.

When token semantics change, update `DESIGN.md` and the CSS token files
together so agent prompts and package styles do not drift.

Any change to `DESIGN.md` must include a fresh `bun run design:lint` result
before the work is called complete. Do not treat design.md lint as optional for
design-token, Stitch, or visual-identity edits.

For public API, theme, telemetry, build, or publishing contract changes, inspect
the coupled contract layers together: `src/index.ts`, `package.json` exports,
`src/manifest.ts`, theme CSS entries, `src/telemetry.ts`, `scripts/build.mjs`,
and `.github/workflows/publish-package.yml`. If one layer changes, update or
explicitly clear the related layers so package consumers do not get drift.

## Research Exports

When producing `all-web-ui` improvement or research artifacts from the
`keelim-maestro` root, keep the analyzed source of truth in this child repo and
write root-owned artifacts under
`/Users/keelim/Desktop/keelim-maestro/docs/research/...`. Do not place root
research exports in this package unless the user explicitly asks.

For evidence-only exports, validate item count/schema, URL bans, duplicate
intent, actual file-path existence, and line-number ranges before calling the
saved artifact complete.

## Verification

Run these before calling package work complete:

```bash
bun run typecheck
bun test
bun run build
```

Run this whenever `DESIGN.md` changes:

```bash
bun run design:lint
```

When a shared primitive change should affect consumers, also verify from the
workspace root with:

```bash
./scripts/verify-all-web-ui-integration.sh --full
```

## CodeGraph Search

When working from the `keelim-maestro` workspace root, use the root dispatcher
instead of a root aggregate graph:

```bash
bun run cg -- context all-web-ui "<task>"
bun run cg -- query all-web-ui <symbol>
bun run cg -- files all-web-ui --max-depth 2
```

If an AI starts inside this repo directly, first check `/Users/keelim/Desktop/keelim-maestro`
for the dispatcher and prefer its child-targeted `--path` calls. Do not initialize
or rely on a workspace-root `.codegraph/` that mixes child repositories.
