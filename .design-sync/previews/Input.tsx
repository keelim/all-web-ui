import { Input } from '@keelim/all-web-ui';

const stack = { display: 'flex', flexDirection: 'column' as const, gap: 'var(--kui-space-3)', maxWidth: 320 };

export const Default = () => (
  <div style={stack}>
    <Input aria-label="Watchlist symbol" placeholder="AAPL" />
    <Input aria-label="Email" type="email" defaultValue="ops@keelim.dev" />
  </div>
);

export const Disabled = () => (
  <div style={stack}>
    <Input aria-label="Account ID" defaultValue="ACC-20931" disabled />
  </div>
);
