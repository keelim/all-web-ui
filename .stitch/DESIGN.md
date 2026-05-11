# Design System: all-web-ui

**Project ID:** local shared package; no Stitch project is bound yet.

## 1. Visual Theme & Atmosphere

all-web-ui is a restrained, work-focused interface system for finance and admin
surfaces. The default mood is quiet, precise, and scan-friendly: mostly white
paper surfaces, dark ink text, subtle borders, compact status colors, and soft
elevation. It should feel like a durable operations tool rather than a landing
page.

The alternate admin theme is stricter and more monochrome. It uses near-black
surfaces, white rules, and high-contrast text for dense internal consoles.

## 2. Color Palette & Roles

- Paper White (#ffffff): default page and card surface for finance screens.
- Deep Ink (hsl(222.2 84% 4.9%)): primary readable text on light surfaces.
- Slate Rule (hsl(214.3 31.8% 91.4%)): borders, input strokes, and quiet
  separation.
- Soft Slate Wash (rgb(15 23 42 / 0.04)): muted fills for ghost buttons,
  secondary panels, code chips, and inactive states.
- Primary Ink Action (hsl(222.2 47.4% 11.2%)): default primary button and
  strong action color in the finance theme.
- Korean Market Up Red (hsl(2 78% 55%)): 상승 and gain indicators.
- Korean Market Down Blue (hsl(214 85% 45%)): 하락 and loss indicators.
- Success Green (hsl(142.1 76.2% 24%)): success text and positive status
  messages.
- Warning Amber (hsl(25 90% 32%)): warning text and caution states.
- Info Blue (hsl(221 83% 32%)): informational callouts.
- Admin Black (#050505): background for the admin black-and-white theme.
- Admin White (#f7f7f7): foreground text for monochrome admin surfaces.

Dark mode keeps the same semantic roles while reversing the base surface:
near-black backgrounds, light foreground text, brighter market red/blue values,
and heavier black shadows.

## 3. Typography Rules

Use Pretendard or system sans-serif for interface text, JetBrains Mono or system
monospace for numeric and code-like values. Finance numbers should use tabular
figures so prices, rates, and counts align vertically.

Headings are confident but not editorial. Use compact heading sizes inside
panels and dashboards. Reserve display-scale type for real first-screen
experiences in consuming apps, not for library examples or internal docs.

Body copy should prioritize legibility at repeated-use density: 14 to 17px
equivalent sizes, generous line height for paragraphs, and short labels for
controls.

## 4. Component Stylings

* **Buttons:** Softly rounded rectangular actions with 44px-ish minimum height.
  Primary actions use the ink action color with light text; secondary actions
  stay transparent with a border; ghost actions sit on a faint wash. Disabled
  buttons fade rather than changing layout.
* **Cards and Panels:** Panels use large but controlled radius, a thin border,
  and soft shadows. Elevated panels may use a slightly stronger background in
  the admin theme, but components should remain theme-token driven.
* **Inputs and Forms:** Inputs are full-width by default, softly rounded, filled
  with the muted surface wash, and focus with an accent border plus a subtle
  ring.
* **Badges:** Badges are pill-shaped and compact. Status badges should use the
  semantic success, warning, danger, info, muted, or accent palette rather than
  arbitrary colors.
* **Loading and Empty States:** Loading panels use the same panel geometry and
  spacing contract. Empty states should be dashed, quiet, and compact rather
  than illustrative.

## 5. Layout Principles

Use a predictable spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, and 64px
equivalents. Toolbars and dense panels should use the smaller steps; page-level
bands and dashboard grids can use the larger steps.

Prefer dense but organized layouts for SaaS, finance, admin, and workflow
surfaces. Avoid decorative cards nested inside larger cards. Repeated items may
be cards; page sections should be full-width bands or unframed layouts owned by
the consuming app.

For Stitch prompts, describe all-web-ui as:

> A quiet finance/admin design system with paper-white surfaces, deep ink text,
> subtle slate borders, soft panel shadows, Pretendard typography, tabular
> numeric values, Korean market red for up and blue for down, and restrained
> shadcn-compatible controls.
