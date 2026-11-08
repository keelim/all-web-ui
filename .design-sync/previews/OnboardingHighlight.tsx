import { OnboardingHighlight } from '@keelim/all-web-ui';

const stack = { display: 'flex', flexDirection: 'column' as const, gap: 'var(--kui-space-3)', maxWidth: 440 };

export const Tones = () => (
  <div style={stack}>
    <OnboardingHighlight marker="1" title="Pick a benchmark" description="Returns are compared against it on every chart." />
    <OnboardingHighlight tone="accent" marker="★" title="New: drift alerts" description="Get notified when a holding leaves its band." />
    <OnboardingHighlight tone="success" marker="✓" title="Account connected" description="Balances will refresh every hour." />
    <OnboardingHighlight tone="warning" marker="!" title="Verify your email" description="Reports are paused until you confirm." />
  </div>
);
