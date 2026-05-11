---
version: alpha
name: all-web-ui
description: Shared finance and admin UI primitives for keelim web apps.
colors:
  primary: "#0f172a"
  on-primary: "#f8fafc"
  foreground: "#020817"
  muted-foreground: "#64748b"
  background: "#ffffff"
  surface: "#ffffff"
  surface-soft: "#f8fafc"
  surface-strong: "#e2e8f0"
  border: "#e2e8f0"
  accent: "#0f172a"
  accent-foreground: "#f8fafc"
  danger: "#b91c1c"
  danger-soft: "#fee2e2"
  success: "#166534"
  success-soft: "#dcfce7"
  warning: "#92400e"
  warning-soft: "#fef3c7"
  info: "#1d4ed8"
  info-soft: "#dbeafe"
  market-up: "#b91c1c"
  market-up-soft: "#fff1f2"
  market-down: "#1d4ed8"
  market-down-soft: "#eff6ff"
  admin-background: "#050505"
  admin-surface: "#121212"
  admin-foreground: "#f7f7f7"
  admin-muted: "#c0c0c0"
typography:
  display-xl:
    fontFamily: Pretendard
    fontSize: 72px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: 0em
  h1:
    fontFamily: Pretendard
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: 0em
  h2:
    fontFamily: Pretendard
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0em
  body:
    fontFamily: Pretendard
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: Pretendard
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  label:
    fontFamily: Pretendard
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0em
  caption:
    fontFamily: Pretendard
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0em
  numeric:
    fontFamily: JetBrains Mono
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0em
    fontFeature: "'tnum', 'zero'"
rounded:
  sm: 8px
  md: 10px
  lg: 12px
  xl: 16px
  full: 999px
spacing:
  0: 0px
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  10: 40px
  12: 48px
  16: 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
  button-ghost:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
  input:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 16px
    height: 48px
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: 24px
  badge-muted:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 8px
  page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
  button-ghost-hover:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
  badge-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 8px
  badge-success:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 8px
  badge-warning:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 8px
  badge-info:
    backgroundColor: "{colors.info-soft}"
    textColor: "{colors.info}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 8px
  market-up-chip:
    backgroundColor: "{colors.market-up-soft}"
    textColor: "{colors.market-up}"
    typography: "{typography.numeric}"
    rounded: "{rounded.full}"
    padding: 8px
  market-down-chip:
    backgroundColor: "{colors.market-down-soft}"
    textColor: "{colors.market-down}"
    typography: "{typography.numeric}"
    rounded: "{rounded.full}"
    padding: 8px
  admin-shell:
    backgroundColor: "{colors.admin-background}"
    textColor: "{colors.admin-foreground}"
    typography: "{typography.body}"
  admin-panel:
    backgroundColor: "{colors.admin-surface}"
    textColor: "{colors.admin-foreground}"
    rounded: "{rounded.xl}"
    padding: 24px
  admin-caption:
    backgroundColor: "{colors.admin-surface}"
    textColor: "{colors.admin-muted}"
    typography: "{typography.caption}"
---

# DESIGN.md

## Overview

all-web-ui is a restrained, work-focused interface system for finance and admin
surfaces. It should feel precise, durable, and easy to scan during repeated
work. The default finance theme uses paper-white surfaces, deep ink text,
subtle slate borders, compact status colors, and soft panel elevation.

The admin black-and-white theme is stricter and denser. It uses near-black
surfaces, white rules, and high-contrast foreground text for internal console
work. Both themes share the same component contract: reusable React primitives,
`--kui-*` CSS variables, and a shadcn-compatible semantic HSL bridge.

## Colors

- **Primary (#0f172a):** Ink-like action and emphasis color for the finance
  theme.
- **Foreground (#020817):** Main readable text on light surfaces.
- **Muted Foreground (#64748b):** Captions, metadata, placeholders, and less
  important controls.
- **Background and Surface (#ffffff):** Paper-white layout and card surfaces.
- **Surface Soft (#f8fafc):** Quiet fills for inputs, ghost actions, soft
  panels, and code-like chips.
- **Border (#e2e8f0):** Default rule and input stroke.
- **Market Up (#b91c1c):** Korean finance convention for 상승 and gains.
- **Market Down (#1d4ed8):** Korean finance convention for 하락 and losses.
- **Admin Background (#050505):** Near-black admin console foundation.
- **Admin Foreground (#f7f7f7):** High-contrast text for monochrome admin
  surfaces.

## Typography

Use Pretendard or system sans-serif for interface text. Use JetBrains Mono or a
system monospace fallback for numeric, code-like, and ticker values. Finance
numbers should use tabular figures so prices, rates, and counts align
vertically.

Headings should be confident but not editorial. Use compact heading sizes inside
panels and dashboards. Reserve display-scale type for true first-screen
experiences in consuming apps, not for package examples or internal docs.

## Layout

Use a predictable spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, and 64px.
Toolbars and dense panels should use the smaller steps; page-level bands and
dashboard grids can use the larger steps.

Prefer dense but organized layouts for SaaS, finance, admin, and workflow
surfaces. Do not nest UI cards inside larger decorative cards. Repeated items
may be cards; page sections should be full-width bands or unframed layouts
owned by the consuming app.

## Elevation & Depth

Use borders first and shadows second. Finance panels may use a low, soft shadow
for separation. Admin panels should stay flatter, using stronger borders and
near-black surfaces before decorative depth.

Avoid decorative gradient orbs, background blobs, and one-note palettes. The
system should read as operational and durable, not atmospheric.

## Shapes

Controls and panels use controlled radius values. Primitive controls should
stay visually compatible with shadcn/Radix expectations while preserving the
local `kui` class contract. Keep cards at 8 to 12px radius unless the existing
component already uses a larger token for panel geometry.

## Components

Buttons use 44px-ish minimum height, strong focus affordance, and the semantic
variant classes already exported by `src/components/button.tsx`. Primary
buttons use the ink action color with light text; secondary buttons stay quiet
with border treatment; ghost buttons sit on a soft surface wash.

Inputs are full-width by default, softly rounded, filled with the muted surface
wash, and focused with an accent border plus subtle ring.

Panels use a thin border, tokenized radius, theme-aware surface, and soft
elevation. Badges are compact pills and must use semantic status colors rather
than ad hoc component hex values.

Loading and empty states should stay compact and useful. They inherit the same
panel geometry and tokenized status language rather than introducing
illustrative or marketing-style visuals.

## Do's and Don'ts

Do use `--kui-*` tokens and shadcn semantic variables when changing shared
styles. Do keep new primitives package-level and reusable. Do update
`src/index.ts`, `src/manifest.ts`, package exports, and focused tests when a
primitive is added.

Do not hardcode component colors that bypass this design system. Do not add app
routes, demo flows, or product-specific workflows to this package. Do not treat
Stitch output as production code until it has been reduced to a durable
primitive or token update.
