# Building with @keelim/all-web-ui

Shared React primitives for keelim finance and admin web apps. Components are Astryx-based wrappers with shadcn-style names; import everything from `window.AllWebUI` (e.g. `const { Panel, Button, MetricCard } = AllWebUI`).

## Setup

- No root provider is needed. The finance light theme is the default and ships in `styles.css`; there is no dark or admin-bw theme in this bundle, so don't add `.dark`, `.admin-bw-theme` or `data-kui-theme` wrappers.
- `Tooltip` must sit inside `<TooltipProvider>`. `Toast` needs `<ToastProvider>` with a `<ToastViewport />` sibling.
- Overlays (`Dialog`, `AlertDialog`, `Sheet`, `DropdownMenu`, `Popover`, `Select`) take `defaultOpen` / `open`; triggers use `asChild` around a `Button`.
- Brand fonts (Pretendard, JetBrains Mono) are not bundled; text renders in the system sans fallback via `--font-sans`.

## Styling idiom

Use components for controls and surfaces; use inline `style` with tokens for your own layout glue. Tailwind utilities only resolve where the library itself uses them, so don't write your own `flex`, `p-4`, `gap-2` classes.

| Need | Use |
|---|---|
| Spacing | `var(--kui-space-1)` … `var(--kui-space-16)` (0.25rem steps: 1,2,3,4,5,6,8,10,12,16) |
| Text colour | `var(--kui-color-text)`, `var(--kui-color-muted)`, `var(--kui-color-accent)` |
| Surfaces / lines | `var(--kui-color-bg)`, `var(--kui-color-surface)`, `var(--kui-color-surface-soft)`, `var(--kui-color-border)` |
| Market direction | `var(--kui-color-up)` (red), `var(--kui-color-down)` (blue), `var(--kui-color-flat)` — Korean convention: up is red |
| Radius / shadow | `var(--kui-radius-sm)`, `var(--kui-radius-md)`, `var(--kui-radius-lg)`, `var(--kui-shadow-card)`, `var(--kui-shadow-soft)`, `var(--kui-shadow-panel)` |
| Type classes | `type-display-xl`, `type-display-lg`, `type-h1`…`type-h4`, `type-body-lg`, `type-body`, `type-body-sm`, `type-caption`, `type-label`, `type-overline`, `type-numeric`, `type-ticker`, `type-code` |
| Text colour classes | `fg-1`, `fg-2` (muted), `fg-accent`, `fg-up`, `fg-down`, `fg-flat` |

Numbers: wrap figures in `DataNumber` (inline) or `MetricValue` (`size` sm/md/lg/xl) for tabular digits. `Panel` (`variant` elevated/default/soft, polymorphic `as`) is the standard surface; `MetricCard` is the KPI tile. `Badge` uses `tone` default/muted/accent/success/warning/danger/info.

## Known component defects (avoid or accept)

These render incorrectly in this release and in Tailwind consumer apps — stale shadcn classes land on Astryx roots:
- `Checkbox`, `Switch`: the row collapses and labels overlap. Prefer `RadioGroup` for choices.
- `Slider`: the track collapses to a thumb. `Progress`: the fill is hidden.
- `Alert`, `Toast`: rendered with a double frame. `Avatar` ignores `size` above 40px.
- `Calendar` single mode: the selected day has no highlight (range mode is fine).
- `OnboardingTour` / `OnboardingHighlight`: eyebrow, title and description run on one line.

## Where the truth lives

Read `styles.css` and its `_ds_bundle.css` import for every token and class; each component's `<Name>.d.ts` is its prop contract and `<Name>.prompt.md` shows usage.

## Example

```jsx
const { Panel, MetricCard, MetricValue, Badge, Button } = AllWebUI;

<Panel as="section" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kui-space-4)', maxWidth: 400 }}>
  <div>
    <h2 className="type-h3">Portfolio summary</h2>
    <p className="type-body-sm fg-2">Latest synced account value.</p>
  </div>
  <MetricCard>
    <p className="type-overline fg-2">YTD return</p>
    <MetricValue>12.4%</MetricValue>
    <Badge tone="success">On target</Badge>
  </MetricCard>
  <Button>Rebalance</Button>
</Panel>
```
