import { Button, Input, MetricCard, MetricValue, Panel } from '@keelim/all-web-ui';

const stack = { display: 'flex', flexDirection: 'column' as const, gap: 'var(--kui-space-4)' };

export const PortfolioSummary = () => (
  <Panel as="section" style={{ ...stack, maxWidth: 400 }} aria-labelledby="panel-preview-title">
    <div>
      <h2 id="panel-preview-title" className="type-h3">Portfolio summary</h2>
      <p className="type-body-sm fg-2">Latest synced account value.</p>
    </div>
    <MetricCard>
      <MetricValue>12.4%</MetricValue>
    </MetricCard>
    <Input aria-label="Watchlist symbol" placeholder="AAPL" />
    <Button type="button">Add symbol</Button>
  </Panel>
);

export const Variants = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--kui-space-3)' }}>
    <Panel variant="elevated"><p className="type-label">Elevated</p><p className="type-body-sm fg-2">Default surface</p></Panel>
    <Panel variant="default"><p className="type-label">Default</p><p className="type-body-sm fg-2">Flat border</p></Panel>
    <Panel variant="soft"><p className="type-label">Soft</p><p className="type-body-sm fg-2">Muted fill</p></Panel>
  </div>
);
