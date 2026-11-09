import { Button } from '@keelim/all-web-ui';

const row = { display: 'flex', flexWrap: 'wrap' as const, gap: 'var(--kui-space-2)', alignItems: 'center' };

export const Variants = () => (
  <div style={row}>
    <Button>Save changes</Button>
    <Button variant="secondary">Export CSV</Button>
    <Button variant="ghost">Cancel</Button>
    <Button variant="destructive">Delete account</Button>
  </div>
);

export const Sizes = () => (
  <div style={row}>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
);

export const Disabled = () => (
  <div style={row}>
    <Button disabled>Syncing…</Button>
    <Button variant="secondary" disabled>Export CSV</Button>
  </div>
);
