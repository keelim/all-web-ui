import { ScrollArea } from '@keelim/all-web-ui';

const events = [
  'Rebalanced VTI → BND',
  'Dividend received: VXUS',
  'Drift alert: AAPL underweight',
  'Account synced: Brokerage IRA',
  'Goal updated: Retirement 2050',
  'Deposit: $1,500',
  'Report exported: Q3 summary',
  'Login from new device',
];

export const ActivityFeed = () => (
  <ScrollArea style={{ height: 180, width: 300, border: '1px solid var(--kui-color-border)', borderRadius: 'var(--kui-radius-md)' }}>
    <div style={{ padding: 'var(--kui-space-3)' }}>
      {events.map((event) => (
        <p key={event} className="type-body-sm" style={{ padding: 'var(--kui-space-2) 0', borderBottom: '1px solid var(--kui-color-border)' }}>
          {event}
        </p>
      ))}
    </div>
  </ScrollArea>
);
