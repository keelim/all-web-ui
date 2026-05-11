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
