# Package change rules

Keep scope to primitives, tokens, exports, tests, and package documentation. Add no app routes or product workflows. Preserve autonomous Git ownership and unrelated work.

A new primitive updates its component, `src/index.ts`, `src/manifest.ts`, package exports, and focused tests together. For public API, theme, telemetry, build, or publication changes inspect those layers plus CSS entries, `src/telemetry.ts`, `scripts/build.mjs`, and the publish workflow; update or explicitly clear every affected layer.

Keep semantic tokens and the shadcn HSL bridge. Change root `DESIGN.md` and CSS together when token meaning changes. Its YAML token front matter and ordered rationale sections remain compatible with the design.md format. The Stitch reference-board prompt contains no color/font values or theme instructions; those belong in the canonical design source. Do not vendor upstream workflow skills or promote downloaded designs without checking package scope.

Package work requires `bun run typecheck`, `bun test`, and `bun run build`. Any `DESIGN.md` change requires a fresh `bun run design:lint`; design/token/Stitch changes cannot waive that gate. Before publishing, also run `bun run package:smoke` and `bun run pack:verify`. Shared primitive changes affecting consumers require the parent's `./scripts/verify-all-web-ui-integration.sh --full` and actual affected consumer verification.

Root-owned research exports belong in the parent's `docs/research/`, while analyzed source remains here. Check schema/counts, duplicate intent, URL restrictions, real paths, and line ranges for evidence-only exports. Use the owning codebase-memory index; never mix child sources in a root aggregate index. Documentation-only restructuring with unchanged package/design contracts needs path/parity checks; it does not require publication or a remote design mutation.
