---
version: alpha
name: all-web-ui
description: Shared finance and admin UI primitives for keelim web apps.
colors:
  primary: "hsl(222.2 47.4% 11.2%)"
  on-primary: "hsl(210 40% 98%)"
  foreground: "hsl(222.2 84% 4.9%)"
  muted-foreground: "hsl(215.4 16.3% 46.9%)"
  background: "#ffffff"
  surface: "#ffffff"
  surface-soft: "#f8fafc"
  surface-strong: "#e2e8f0"
  border: "hsl(214.3 31.8% 91.4%)"
  accent: "hsl(222.2 47.4% 11.2%)"
  accent-foreground: "hsl(210 40% 98%)"
  danger: "#b91c1c"
  danger-soft: "#fee2e2"
  danger-border: "hsl(0 84.2% 80%)"
  success: "#166534"
  success-soft: "#dcfce7"
  success-border: "hsl(142.1 70% 78%)"
  warning: "#92400e"
  warning-soft: "#fef3c7"
  warning-border: "hsl(38 92% 70%)"
  info: "#1d4ed8"
  info-soft: "#dbeafe"
  info-border: "hsl(214 85% 80%)"
  market-up: "#b91c1c"
  market-up-soft: "#fff1f2"
  market-down: "#1d4ed8"
  market-down-soft: "#eff6ff"
  market-flat: "#475569"
  market-flat-soft: "#f1f5f9"
  admin-background: "#050505"
  admin-surface: "#121212"
  admin-surface-soft: "#1f1f1f"
  admin-surface-strong: "#2a2a2a"
  admin-border: "#4a4a4a"
  admin-foreground: "#f7f7f7"
  admin-muted: "#c0c0c0"
  admin-accent: "#ffffff"
  admin-accent-foreground: "#000000"
typography:
  display-xl:
    fontFamily: Pretendard
    fontSize: 72px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: 0em
  display-lg:
    fontFamily: Pretendard
    fontSize: 52px
    fontWeight: 700
    lineHeight: 1.08
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
  h3:
    fontFamily: Pretendard
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0em
  h4:
    fontFamily: Pretendard
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0em
  body-lg:
    fontFamily: Pretendard
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.65
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
  overline:
    fontFamily: Pretendard
    fontSize: 11px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0em
  numeric:
    fontFamily: JetBrains Mono
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0em
    fontFeature: "'tnum', 'zero'"
  ticker:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0em
    fontFeature: "'tnum', 'zero'"
  code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: 0em
rounded:
  sm: 0.85rem
  md: 1.15rem
  lg: 1.5rem
  xl: 1.5rem
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
  accordion:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
  alert:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
  alert-dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
  avatar:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
  badge:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 8px
  breadcrumb:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted-foreground}"
  button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
  calendar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: 24px
  checkbox:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
  dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
  dropdown-menu:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
  empty-state:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: 24px
  hover-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
  input:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 16px
    height: 48px
  label:
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
  loading-status:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: 24px
  metric-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.numeric}"
    rounded: "{rounded.xl}"
    padding: 16px
  onboarding:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: 24px
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: 24px
  popover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
  progress:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
  radio-group:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
  scroll-area:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
  select:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    height: 44px
  sheet:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
  skeleton:
    backgroundColor: "{colors.surface-strong}"
    rounded: "{rounded.md}"
  slider:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.primary}"
  switch:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
  table:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
  tabs:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
  textarea:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
  tooltip:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
    rounded: "{rounded.sm}"
  toast:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
  badge-success:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 8px
  alert-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 16px
  alert-warning:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 16px
  alert-info:
    backgroundColor: "{colors.info-soft}"
    textColor: "{colors.info}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 16px
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
  market-flat-chip:
    backgroundColor: "{colors.market-flat-soft}"
    textColor: "{colors.market-flat}"
    typography: "{typography.numeric}"
    rounded: "{rounded.full}"
    padding: 8px
  admin-shell:
    backgroundColor: "{colors.admin-background}"
    textColor: "{colors.admin-foreground}"
    typography: "{typography.body}"
  admin-console-panel:
    backgroundColor: "{colors.admin-surface}"
    textColor: "{colors.admin-muted}"
    typography: "{typography.numeric}"
    rounded: "{rounded.md}"
    padding: 16px
  admin-subtle-panel:
    backgroundColor: "{colors.admin-surface-soft}"
    textColor: "{colors.admin-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 16px
  admin-selected-row:
    backgroundColor: "{colors.admin-surface-strong}"
    textColor: "{colors.admin-foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 8px
  admin-primary-button:
    backgroundColor: "{colors.admin-accent}"
    textColor: "{colors.admin-accent-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
---

# DESIGN.md

## Overview

all-web-ui is a restrained, work-focused interface system for finance and admin
surfaces. It should feel precise, durable, and easy to scan during repeated
work. The default finance theme uses paper-white surfaces, deep ink text,
subtle slate borders, compact status colors, and soft panel elevation. Its
material should feel like a dependable console surface: quiet paper, crisp
rules, tabular data, and controls that hold their shape under repeated use.

The admin black-and-white theme is stricter and denser. It uses near-black
surfaces, white rules, and high-contrast foreground text for internal console
work. Both themes share the same component contract: reusable React primitives,
`--kui-*` CSS variables, and a shadcn-compatible semantic HSL bridge.

## Web Platform Contract

all-web-ui targets the current web consumers of this shared package:
`keelim-vercel` and `rich/web`. Treat those consumers as the compatibility
baseline before adding broader platform claims. Historical or absent workspaces
should not be listed as active consumers until they return to this checkout and
the integration verifier covers them again. This package does not own app
routes, product workflows, native mobile shells, or React Native primitives.

Consumers should choose the smallest style surface that matches their use case:

- Finance app surfaces import `@keelim/all-web-ui/styles.css` plus
  `@keelim/all-web-ui/themes/finance.css`.
- Admin console surfaces import `@keelim/all-web-ui/styles.css` plus
  `@keelim/all-web-ui/themes/admin-bw.css`, then scope the console with
  `.admin-bw-theme`, `.theme-admin-bw`, or `.kui-theme-admin-bw`.
- Spacing-only consumers import `@keelim/all-web-ui/spacing.css` without
  taking on a color theme.

Finance dark mode is selector-driven for Next/shadcn consumers. Preserve
`.dark`, `[data-theme='dark']`, `.theme-dark`, `.kui-theme-dark`,
`.theme-finance.dark`, and `.kui-theme-finance.dark` as equivalent dark-mode
entry points. Components should continue to read semantic shadcn variables such
as `--background`, `--foreground`, `--card`, `--popover`, `--border`, and
`--ring` through the theme bridge instead of branching per consumer.

## Runtime Parity Notes

Use the YAML front matter for schema-supported, machine-readable tokens. Keep
runtime-only behavior in this prose when the CSS contract is richer than the
design.md schema. The current parity decisions are:

| Area | Classification | Resolution |
| --- | --- | --- |
| Finance light colors | intentional divergence with note | YAML keeps lint-safe opaque semantic colors; CSS owns alpha fills, HSL bridge values, and status border roles. |
| Radius tokens | intentional semantic fallback | `rounded.sm`, `rounded.md`, and `rounded.lg` mirror `--kui-radius-*`; `rounded.full` stays a design semantic that components may render with `var(--kui-radius-full, 999px)` fallback rather than a required runtime token. |
| Typography tracking | update CSS | Runtime typography uses `letter-spacing: 0` to match the YAML token contract. |
| Shadows and metric gradients | update DESIGN prose only | Shadow and gradient values stay CSS runtime details documented under Elevation & Depth. |
| Breakpoints | update DESIGN prose only | Component-specific responsive behavior stays in CSS and is summarized under Layout. |
| Finance dark and admin BW overlays | intentional divergence with note | Theme overlays are selector-scoped CSS skins; the YAML catalog records shared semantic roles rather than every theme override. |

### Runtime Token Tables

The following tables are the exact runtime token roles exposed by the shipped
CSS. Keep these prose tables synchronized when CSS changes add a token that the
portable YAML front matter cannot express safely.

| Shared surface role | CSS token | YAML token |
| --- | --- | --- |
| Background | `--kui-color-bg` | `colors.background` |
| Surface | `--kui-color-surface` | `colors.surface` |
| Soft surface wash | `--kui-color-surface-soft` | `colors.surface-soft` fallback; CSS may use alpha ink wash. |
| Strong surface wash | `--kui-color-surface-strong` | `colors.surface-strong` fallback; CSS may use alpha ink wash. |
| Border | `--kui-color-border` | `colors.border` |
| Foreground text | `--kui-color-text` | `colors.foreground` |
| Muted text | `--kui-color-muted` | `colors.muted-foreground` |
| Accent fill | `--kui-color-accent` | `colors.accent` |
| Accent ink | `--kui-color-accent-ink` | `colors.accent-foreground` |

| Status role | Background token | Border token | Text token |
| --- | --- | --- | --- |
| Danger | `--kui-color-danger-bg` | `--kui-color-danger-border` | `--kui-color-danger-text` |
| Success | `--kui-color-success-bg` | `--kui-color-success-border` | `--kui-color-success-text` |
| Warning | `--kui-color-warning-bg` | `--kui-color-warning-border` | `--kui-color-warning-text` |
| Info | `--kui-color-info-bg` | `--kui-color-info-border` | `--kui-color-info-text` |

| Market role | Primary token | Soft token | Use |
| --- | --- | --- | --- |
| Up | `--kui-color-up` | `--kui-color-up-soft` | 상승, gains, positive deltas. |
| Down | `--kui-color-down` | `--kui-color-down-soft` | 하락, losses, negative deltas. |
| Flat | `--kui-color-flat` | use `--kui-color-surface-soft` unless a chip needs `colors.market-flat-soft` | Unchanged, paused, or unavailable movement. |

| Admin BW role | CSS token |
| --- | --- |
| Background | `--kui-color-bg` |
| Surface | `--kui-color-surface` |
| Soft surface | `--kui-color-surface-soft` |
| Strong surface | `--kui-color-surface-strong` |
| Border | `--kui-color-border` |
| Text | `--kui-color-text` |
| Muted text | `--kui-color-muted` |
| Accent fill | `--kui-color-accent` |
| Accent ink | `--kui-color-accent-ink` |
| Status roles | `--kui-color-*-bg`, `--kui-color-*-border`, and `--kui-color-*-text` |
| Market roles | `--kui-color-up`, `--kui-color-down`, `--kui-color-flat`, and soft variants |
| Panel depth | `--kui-shadow-panel`, `--kui-metric-card-bg`, `--kui-metric-card-highlight` |

## Colors

- **Primary (hsl(222.2 47.4% 11.2%)):** Ink-like action and emphasis color for the finance
  theme.
- **Foreground (hsl(222.2 84% 4.9%)):** Main readable text on light surfaces.
- **Muted Foreground (hsl(215.4 16.3% 46.9%)):** Captions, metadata,
  placeholders, and less important controls.
- **Background and Surface (#ffffff):** Paper-white layout and card surfaces.
- **Surface Soft (#f8fafc):** Quiet fills for inputs, ghost actions, soft
  panels, and code-like chips; CSS may render this as an alpha ink wash.
- **Border (hsl(214.3 31.8% 91.4%)):** Default rule and input stroke.
- **Status pairs:** Danger, success, warning, and info each have soft
  background, border, and text roles in CSS; YAML records the same semantic
  roles for agent use.
- **Market Up (#b91c1c):** Korean finance convention for 상승 and gains.
- **Market Down (#1d4ed8):** Korean finance convention for 하락 and losses.
- **Market Flat (#475569):** Neutral unchanged or unavailable movement state;
  use `--kui-color-flat` for runtime text and combine it with a soft surface
  fill when a chip needs a background.
- **Admin Background (#050505):** Near-black admin console foundation.
- **Admin Foreground (#f7f7f7):** High-contrast text for monochrome admin
  surfaces.

## Typography

Use Pretendard or system sans-serif for interface text. Use JetBrains Mono or a
system monospace fallback for numeric, code-like, and ticker values. Finance
numbers should use tabular figures so prices, rates, and counts align
vertically.

Text must remain readable across desktop, tablet, and mobile web viewports.
Primitive text should not depend on one app shell width, one locale, or one font
loading path. Long labels and Korean/English mixed strings must wrap or truncate
inside their owning component without overlapping adjacent controls.

Headings should be confident but not editorial. Use compact heading sizes inside
panels and dashboards. Reserve display-scale type for true first-screen
experiences in consuming apps, not for package examples or internal docs.
Typography utilities keep `letter-spacing: 0` across display, heading, label,
caption, badge, and numeric classes so text does not tighten unpredictably
across Korean/English mixed strings.

Runtime typography utilities include `type-display-xl`, `type-display-lg`,
`type-h1`, `type-h2`, `type-h3`, `type-h4`, `type-body-lg`, `type-body`,
`type-body-sm`, `type-caption`, `type-overline`, `type-ticker`, `type-code`,
`kui-data-number`, and `kui-metric-value--sm/md/lg/xl`. Treat the YAML
typography keys as the portable source for these families; component-specific
sizes such as `MetricValue` variants remain runtime class contracts.

## Layout

Use a predictable spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, and 64px.
Toolbars and dense panels should use the smaller steps; page-level bands and
dashboard grids can use the larger steps.

Prefer dense but organized layouts for SaaS, finance, admin, and workflow
surfaces. Do not nest UI cards inside larger decorative cards. Repeated items
may be cards; page sections should be full-width bands or unframed layouts
owned by the consuming app.

Primitive layouts should be stable under mouse, keyboard, and touch input. Use
explicit dimensions or responsive constraints for controls, grids, tab lists,
tables, and toolbars so hover states, loading text, icons, and dynamic labels do
not resize the surrounding layout. Mobile and narrow desktop views should keep
primary actions reachable without depending on hover-only affordances.

Component-level responsive behavior lives in CSS. The loading panel exposes the
current package breakpoints: inline progress dots appear from 640px, loading
steps become a two-column grid from 640px, and the same steps expand to four
columns from 1280px. New primitives should document any additional package
breakpoints here before consumers depend on them.

## Elevation & Depth

Use borders first and shadows second. Finance panels may use a low, soft shadow
for separation. Admin panels should stay flatter, using stronger borders and
near-black surfaces before decorative depth.

Runtime shadow values stay in CSS because they are richer than the portable
YAML token families: `--kui-shadow-card`, `--kui-shadow-soft`, and
`--kui-shadow-panel` define the base depth ramp. `MetricCard` is the only
primitive that intentionally uses a surface gradient and highlight line for
data emphasis; admin BW may also use a restrained panel gradient on dark
surfaces. Do not promote these gradients into decorative page backgrounds.

Avoid decorative gradient orbs, background blobs, and one-note palettes. The
system should read as operational and durable, not atmospheric.

## Shapes

Controls and panels use controlled radius values. Primitive controls should
stay visually compatible with shadcn/Radix expectations while preserving the
local `kui` class contract. The shipped `--kui-radius-*` runtime uses
0.85rem, 1.15rem, and 1.5rem for small, medium, and large geometry.
`rounded.xl` in the YAML catalog intentionally aliases the large panel radius
so Stitch and other design.md consumers do not invent a separate extra-large
curve.
`rounded.full` is a semantic pill/circle value. It may be rendered through
`var(--kui-radius-full, 999px)` in component CSS, but consumers should not
assume `--kui-radius-full` is a required theme token until the CSS runtime
declares it.

## Components

Buttons use 44px-ish minimum height, strong focus affordance, and the semantic
variant classes already exported by `src/components/button.tsx`. Primary
buttons use the ink action color with light text; secondary buttons stay quiet
with border treatment; ghost buttons sit on a soft surface wash.

Controls must support keyboard navigation, pointer interaction, and touch
interaction through the existing Radix/shadcn primitive behavior. Keep
`focus-visible` rings and disabled states visible in both finance and admin
themes. Icon buttons need an accessible name supplied by the consuming app.

Inputs are full-width by default, softly rounded, filled with the muted surface
wash, and focused with an accent border plus subtle ring.

Panels use a thin border, tokenized radius, theme-aware surface, and soft
elevation. Badges are compact pills and must use semantic status colors rather
than ad hoc component hex values.

Loading and empty states should stay compact and useful. They inherit the same
panel geometry and tokenized status language rather than introducing
illustrative or marketing-style visuals.

Status alerts use semantic danger, warning, and info pairs from the YAML
catalog. Market movement chips keep the Korean finance color convention explicit
with separate up/down/flat token pairs. Admin shell examples use the admin
background, surface, foreground, and muted text roles together so monochrome
console references do not invent their own gray scale.

Metric cards are compact data-display surfaces for dashboard totals, rates,
balances, and other high-signal finance/admin metrics. Use `MetricCard` for
the bordered surface, `MetricValue` for the primary tabular figure, and
`DataNumber` for inline numeric cells or labels that need consistent tabular
alignment.

Onboarding primitives provide reusable steps, tour, and highlight surfaces for
first-run guidance in consuming apps. They remain opt-in package primitives and
should describe workflow state without owning app routes, persistence, or
external telemetry.

### Stitch Component Catalog

Stitch should treat `src/manifest.ts` as the package component inventory and
use the YAML `components:` block above as the machine-readable design catalog.
These are the stable package primitives Stitch may reference when generating
or restyling screens:

| Component | Export path | Stitch usage |
| --- | --- | --- |
| Accordion | `@keelim/all-web-ui/accordion` | Stacked disclosure for dense settings and reference panels. |
| Alert | `@keelim/all-web-ui/alert` | Inline status feedback with semantic tone and readable copy. |
| AlertDialog | `@keelim/all-web-ui/alert-dialog` | Blocking confirmation for destructive or irreversible actions. |
| Avatar | `@keelim/all-web-ui/avatar` | Compact identity marker with image and fallback text. |
| Badge | `@keelim/all-web-ui/badge` | Status, category, and compact metadata pill. |
| Breadcrumb | `@keelim/all-web-ui/breadcrumb` | Hierarchical navigation trail for console pages. |
| Button | `@keelim/all-web-ui/button` | Primary, secondary, ghost, danger, and icon command control. |
| Calendar | `@keelim/all-web-ui/calendar` | Date picker for filters, timelines, and scheduling. |
| Card | `@keelim/all-web-ui/card` | Repeated content container mapped to panel geometry. |
| Checkbox | `@keelim/all-web-ui/checkbox` | Binary selection in forms and tables. |
| Dialog | `@keelim/all-web-ui/dialog` | General modal for focused editing or inspection. |
| DropdownMenu | `@keelim/all-web-ui/dropdown-menu` | Compact contextual menu for secondary actions. |
| EmptyState | `@keelim/all-web-ui/empty-state` | Compact no-data or no-results feedback. |
| HoverCard | `@keelim/all-web-ui/hover-card` | Pointer preview for supplemental metadata only. |
| Input | `@keelim/all-web-ui/input` | Single-line data entry with soft filled surface. |
| Label | `@keelim/all-web-ui/label` | Accessible form label and compact descriptor. |
| LoadingStatus | `@keelim/all-web-ui/loading-status` | Inline or panel loading feedback with optional steps. |
| MetricCard | `@keelim/all-web-ui/metric-card` | Compact metric surface with tabular number helpers for finance/admin panels. |
| Onboarding | `@keelim/all-web-ui/onboarding` | Steps, tour, and highlight primitives for first-run guidance surfaces. |
| Panel | `@keelim/all-web-ui/panel` | Theme-aware grouped surface for dashboards and forms. |
| Popover | `@keelim/all-web-ui/popover` | Lightweight floating surface for filters and controls. |
| Progress | `@keelim/all-web-ui/progress` | Linear determinate progress with text nearby when meaning matters. |
| RadioGroup | `@keelim/all-web-ui/radio-group` | Single-choice form or filter option set. |
| ScrollArea | `@keelim/all-web-ui/scroll-area` | Bounded scrolling region for long lists or panels. |
| Select | `@keelim/all-web-ui/select` | Single-selection dropdown for bounded options. |
| Sheet | `@keelim/all-web-ui/sheet` | Edge panel for secondary work without page navigation. |
| Skeleton | `@keelim/all-web-ui/skeleton` | Layout-stable placeholder while data loads. |
| Slider | `@keelim/all-web-ui/slider` | Numeric range input for bounded tuning. |
| Switch | `@keelim/all-web-ui/switch` | Binary on/off setting with external text label. |
| Table | `@keelim/all-web-ui/table` | Dense semantic tabular data display. |
| Tabs | `@keelim/all-web-ui/tabs` | Compact switcher for sibling panels and modes. |
| Textarea | `@keelim/all-web-ui/textarea` | Multi-line notes, prompts, and descriptions. |
| Tooltip | `@keelim/all-web-ui/tooltip` | Short assistive label for compact controls. |
| Toast | `@keelim/all-web-ui/toast` | Transient save, sync, and background-event feedback. |

Variant examples in the YAML `components:` block, such as `button-accent`,
`badge-success`, `alert-danger`, and `market-flat-chip`, are design variants of
the stable primitives above. They are not package exports and should not be
generated as standalone component files unless `src/manifest.ts` and
`package.json` are updated first. Divider-like rules are border-token usage,
not a shipped `Divider` primitive.

## Accessibility & Motion

Use color as reinforcement, not the only state indicator. Status chips, market
movement, validation states, and destructive actions need text, iconography, or
component structure that still communicates meaning when color contrast,
theme, or locale changes.

Motion should be short and functional. Preserve Radix/shadcn transitions when
they communicate open, close, focus, or swipe state, but avoid decorative motion
that makes repeated admin or finance work harder. Consumers should be able to
honor `prefers-reduced-motion` without component rewrites.

The package runtime uses 160ms control transitions for border, background,
color, filter, opacity, and input focus rings. Loading affordances are bounded:
the spinner rotates over 0.9s and loading-panel dots pulse over 1.1s with short
staggered delays. Additional motion should describe state change or progress,
not atmosphere.

## Do's and Don'ts

Do use `--kui-*` tokens and shadcn semantic variables when changing shared
styles. Do keep new primitives package-level and reusable. Do update
`src/index.ts`, `src/manifest.ts`, package exports, and focused tests when a
primitive is added.

Do keep consumer compatibility evidence grounded in actual dependency/import
usage, not workspace membership alone. Do document any token-semantic change in
this file and the CSS token files in the same change.

Do treat getdesign.md and Stitch output as prompt/reference material. Before
changing shared code, audit the YAML catalog against the shipped CSS runtime,
classify each mismatch, and keep schema-unsafe runtime detail in prose. Do use
the smallest package surface that solves the reusable primitive need.

Do not hardcode component colors that bypass this design system. Do not add app
routes, demo flows, or product-specific workflows to this package. Do not
introduce a second design source under `.stitch/`; `.stitch/DESIGN.md` remains
a compatibility pointer to this file. Do not treat Stitch output as production
code until it has been reduced to a durable primitive, token update, or
documentation change that belongs in this shared package.
