import { Textarea } from '@keelim/all-web-ui';

export const Default = () => (
  <div style={{ maxWidth: 360 }}>
    <Textarea aria-label="Trade note" placeholder="Why are you rebalancing this position?" rows={4} />
  </div>
);

export const Filled = () => (
  <div style={{ maxWidth: 360 }}>
    <Textarea
      aria-label="Audit summary"
      rows={4}
      defaultValue="Rotated 2 stale API keys and removed 1 inactive admin. No policy violations found."
    />
  </div>
);
