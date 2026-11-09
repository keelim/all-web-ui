import { Badge } from '@keelim/all-web-ui';

const row = { display: 'flex', flexWrap: 'wrap' as const, gap: 'var(--kui-space-2)', alignItems: 'center' };

export const Tones = () => (
  <div style={row}>
    <Badge tone="default">Default</Badge>
    <Badge tone="muted">Muted</Badge>
    <Badge tone="accent">Accent</Badge>
    <Badge tone="success">Synced</Badge>
    <Badge tone="warning">Pending</Badge>
    <Badge tone="danger">Failed</Badge>
    <Badge tone="info">Beta</Badge>
  </div>
);

export const Variants = () => (
  <div style={row}>
    <Badge>Default</Badge>
    <Badge variant="secondary">Secondary</Badge>
    <Badge variant="outline">Outline</Badge>
    <Badge variant="destructive">Destructive</Badge>
  </div>
);

export const InContext = () => (
  <div style={{ ...row, gap: 'var(--kui-space-3)' }}>
    <span className="type-label">AAPL</span>
    <span className="type-numeric">$189.42</span>
    <Badge tone="success">+1.8%</Badge>
  </div>
);
