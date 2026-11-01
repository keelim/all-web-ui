# MetricCard Consumer Migration Candidates

This note records likely `rich/web` follow-up targets for `MetricCard`,
`MetricValue`, and `DataNumber`. It is documentation only; this pass does not
migrate consumers.

## Direct Package Import Candidates

These files mostly use local `kui-metric-*` classes as reusable metric surfaces
or tabular numbers and should be good first candidates for importing
`@keelim/all-web-ui/metric-card`:

- `rich/web/src/features/today/components/today-day-trade-amount-panel.tsx`
- `rich/web/src/app/admin/money/quant/page.tsx`
- `rich/web/src/features/money/components/quality-screener-page-content.tsx`
- `rich/web/src/features/money/components/money-sentiment-page-content.tsx`
- `rich/web/src/features/money/support-funds/components/support-funds-page-content.tsx`

Recommended first target: `today-day-trade-amount-panel.tsx`, because it has a
small metric panel surface and lower workflow coupling than the larger money
screens.

## Needs App-Specific Wrapper

These files use metric cards inside broader app workflows or repeated local
layout constants. Consider a consumer-local wrapper around package primitives
before direct replacement:

- `rich/web/src/features/admin/components/profit-note-panel.tsx`
- `rich/web/src/features/money/components/money-dividend-page-content.tsx`
- `rich/web/src/features/money/components/money-decision-tree-page-content.tsx`
- `rich/web/src/features/tqqq-checklist/components/tqqq-checklist-page-content.tsx`
- `rich/web/src/features/work-triage/components/work-triage-page-content.tsx`

## CSS-Only Compatibility Hold

Keep these as compatibility surfaces until component imports have replaced the
feature-level class usage:

- `rich/web/src/app/globals.css`
- `rich/web/src/features/admin/components/admin-shell.tsx`

Before any migration, rerun the root integration verifier and compare the result
against `scripts/all-web-ui-rich-allowed-drift.txt` from the workspace root.
