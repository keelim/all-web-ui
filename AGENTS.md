# all-web-ui working guide

An autonomous React library supplying shared primitives, semantic themes, and integration contracts to keelim web applications. Product routes and workflows stay in the consumers.

## Project structure

```text
./
├── AGENTS.md → Working guide
├── CLAUDE.md → Same guide for Claude
├── docs/
│   ├── architecture.md → Components and data flow
│   ├── business-rules.md → Domain meaning and edge cases
│   ├── security.md → Access, credentials, and protected data
│   ├── standards.md → Change and verification rules
│   ├── engineering-notes.md → Operational traps
│   ├── operations.md → Setup and scoped commands
│   ├── contracts.md → Consumer inputs, outputs, and failures
│   └── tracking/
│       ├── status.md → Capabilities and verified scope
│       ├── findings.md → Unresolved issues
│       └── decisions/
│           ├── index.md → Decision index
│           ├── 0001-shared-primitives.md → Shared primitives with independent consumers
│           └── 0002-opt-in-telemetry.md → Caller-owned opt-in telemetry
├── src/
│   └── AGENTS.md → Public package implementation
├── scripts/
│   └── AGENTS.md → Build and packaging
└── tests/
    └── AGENTS.md → Component and contract tests
```

## Hard gates

1. Keep reusable presentation here and product behavior in the consuming repository.
2. Maintain exports, declarations, styles, manifest, and tests as one public contract.
3. Keep canonical design tokens and CSS synchronized; remote parity requires readback.
4. Telemetry stays opt-in; publication and remote design edits require authorization.

## Before work

Read `docs/standards.md`, `docs/engineering-notes.md`, and the closest module guide.

Before token/Stitch changes read `DESIGN.md` and `.stitch/README.md`. Before API or release work inspect `package.json`, `src/index.ts`, `src/manifest.ts`, `src/telemetry.ts`, `scripts/build.mjs`, and `.github/workflows/publish-package.yml`. For consumer changes read that owner’s guide and the parent shared-UI report.

## Problem routing

Immediately report exposed registry credentials, telemetry without consent, or unauthorized publication. Record other unresolved integration defects in `docs/tracking/findings.md` with affected exports and reproduction evidence.
