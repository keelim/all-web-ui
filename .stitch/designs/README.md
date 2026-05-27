# Stitch Design Artifacts

This directory stores downloaded Stitch HTML and screenshot references. These
files are not package source. Convert only durable primitives, token updates, or
documentation changes into `src/`, `DESIGN.md`, and package contract files.

## Current Final Reference

- Screen: `all-web-ui Component Reference Board`
- Screen ID: `d5193357b37444b3b631544bec61e8c3`
- HTML: `component-reference-board-d5193357b37444b3b631544bec61e8c3.html`
- Screenshot: `component-reference-board-d5193357b37444b3b631544bec61e8c3.png`

## Acceptance Checklist

Before treating a Stitch board as the current reference, verify:

- The generation prompt describes layout, content, and structure only.
- The generation prompt does not include colors, fonts, hex values, radius
  tokens, or theme values already owned by the Stitch design system.
- Required board sections are present: compact header, actions, form controls,
  feedback, data display, overlays, navigation primitives, finance examples,
  and admin examples.
- Finance examples include dense metrics, market status chips, compact table,
  and loading state.
- Admin examples include monochrome console, settings row, confirmation dialog
  preview, and status alert.
- Generated text, names, metrics, and dates are reference-only placeholders.
- Final HTML and screenshot are saved here with the final screen ID in the file
  name.
- `.stitch/metadata.json` records the screen ID, local paths, and any
  `outputComponents` or refine-prompt notes needed by future agents.

If a generated board misses a required section, prefer a targeted Stitch edit or
refine prompt over regenerating from scratch.
