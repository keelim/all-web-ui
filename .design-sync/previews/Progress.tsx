import { Progress } from '@keelim/all-web-ui';

const stack = { display: 'flex', flexDirection: 'column' as const, gap: 'var(--kui-space-4)', maxWidth: 320 };

export const Values = () => (
  <div style={stack}>
    <Progress aria-label="Import progress" value={25} />
    <Progress aria-label="Goal progress" value={68} />
    <Progress aria-label="Sync complete" value={100} />
  </div>
);

export const Indeterminate = () => (
  <div style={stack}>
    <Progress aria-label="Loading holdings" isIndeterminate />
  </div>
);
