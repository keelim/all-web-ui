import { Input, Label } from '@keelim/all-web-ui';

export const WithInput = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kui-space-2)', maxWidth: 320 }}>
    <Label htmlFor="label-preview-email">Notification email</Label>
    <Input id="label-preview-email" type="email" placeholder="you@company.com" />
  </div>
);
