import { Switch } from '@keelim/all-web-ui';

const stack = { display: 'flex', flexDirection: 'column' as const, gap: 'var(--kui-space-3)' };

export const States = () => (
  <div style={stack}>
    <Switch defaultChecked>Drift alerts</Switch>
    <Switch>Dark mode</Switch>
    <Switch disabled>Auto-rebalance (Pro)</Switch>
  </div>
);
