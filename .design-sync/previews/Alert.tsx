import { Alert } from '@keelim/all-web-ui';

const stack = { display: 'flex', flexDirection: 'column' as const, gap: 'var(--kui-space-3)', maxWidth: 480 };

export const Info = () => (
  <div style={stack}>
    <Alert>Market data is delayed by 15 minutes outside trading hours.</Alert>
  </div>
);

export const Destructive = () => (
  <div style={stack}>
    <Alert variant="destructive">Brokerage sync failed. Reconnect your account to resume updates.</Alert>
  </div>
);
