import { Checkbox } from '@keelim/all-web-ui';

const stack = { display: 'flex', flexDirection: 'column' as const, gap: 'var(--kui-space-3)' };

export const States = () => (
  <div style={stack}>
    <Checkbox>Email me a weekly summary</Checkbox>
    <Checkbox defaultChecked>Include dividends</Checkbox>
    <Checkbox checked="indeterminate">Select all accounts</Checkbox>
    <Checkbox disabled>Sync closed accounts</Checkbox>
  </div>
);
