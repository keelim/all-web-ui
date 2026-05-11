# all-web-ui Agent Guidance

## Scope

all-web-ui is an autonomous shared React UI package for keelim web apps. Keep
changes scoped to reusable primitives, theme tokens, package exports, tests, and
docs. Do not add app routes or product-specific workflows here.

## Stitch Skills

The project is prepared for `google-labs-code/stitch-skills` through
`.stitch/DESIGN.md` and `.stitch/README.md`.

- Use `.stitch/DESIGN.md` as the design-system source when prompting Stitch.
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

## Verification

Run these before calling package work complete:

```bash
bun run typecheck
bun test
bun run build
```

When a shared primitive change should affect consumers, also verify from the
workspace root with:

```bash
./scripts/verify-all-web-ui-integration.sh --full
```
