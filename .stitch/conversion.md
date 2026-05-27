# Stitch to all-web-ui Conversion Playbook

Use this guide when converting Stitch output into the shared package. Upstream
Stitch skills often assume an application target; all-web-ui is a package of
reusable primitives and tokens.

## Boundaries

- Treat downloaded Stitch HTML and screenshots as design references only.
- Convert only reusable primitives, token updates, or documentation changes.
- Do not create app routes, `App.tsx`, `src/data/mockData.ts`, `site/public`
  pages, navigation wiring, or product workflows.
- Keep generated example text and fabricated metrics out of production source.

## Conversion Steps

1. Start from root `DESIGN.md` and `.stitch/metadata.json`.
2. Compare the Stitch artifact against existing primitives in `src/components`.
3. Name a primitive candidate only when it is reusable across finance/admin
   consumers and does not encode one app workflow.
4. Map generated styles into `--kui-*` variables and the existing shadcn HSL
   bridge. Do not copy generated hex values into components.
5. Update the full package contract for any new primitive:
   `src/components/<name>.tsx`, `src/index.ts`, `src/manifest.ts`,
   `package.json` exports, focused tests, and `DESIGN.md`.
6. Keep consumer migrations separate unless the user explicitly asks for them.
7. Verify with `bun run design:lint`, `bun run typecheck`, `bun test`, and
   `bun run build`; use the workspace integration verifier for consumer-facing
   primitive changes.

## Mapping Notes

- Stitch Tailwind config values are hints for theme semantics, not source of
  truth.
- Prefer existing primitives before adding a new component.
- If a Stitch section maps to app-specific state, keep it in documentation or a
  consumer migration note instead of adding package code.
- If a primitive candidate appears repeatedly in `rich/web` drift, document the
  migration candidates before changing consumers.
