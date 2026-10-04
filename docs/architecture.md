# Shared UI architecture

This package owns reusable React primitives and theme contracts. Product routes, financial workflows, authentication, and persistence belong to consuming applications.

`src/components` uses common class helpers and semantic CSS tokens. `src/index.ts` and package subpath exports expose components; `src/manifest.ts` exposes lifecycle, style, and theme metadata. `src/theme-contract.ts` defines theme identifiers and required token names. Telemetry validates events and hands them to a caller-supplied sink; the package does not run an analytics backend.

A consumer installs the exact published release, supplies compatible React/React DOM peers, imports component CSS once, scopes a finance or admin theme around its shell, and renders exported primitives through its local adapters. Only props, callbacks, tokens, and optional events cross this boundary; product state remains in the application.

The build copies CSS and emits JavaScript and declarations into `dist`, then validates export targets and package integrity. GitHub Packages distributes the package. `keelim-vercel` and `rich/web` consume it independently; a local workspace link is a separate installation path.

Root `DESIGN.md` supplies machine-readable tokens and human design rationale to design tools. `.stitch/DESIGN.md` is a compatibility pointer. Downloaded design artifacts are inputs to review, not automatically public package components.
