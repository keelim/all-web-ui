import { OnboardingStepList } from '@keelim/all-web-ui';

const steps = [
  { id: 'profile', title: 'Complete your profile', description: 'Name, timezone and base currency.' },
  { id: 'connect', title: 'Connect an account', description: 'Import balances from a brokerage.' },
  { id: 'goals', title: 'Set allocation goals' },
  { id: 'alerts', title: 'Turn on alerts', optional: true },
];

export const Vertical = () => (
  <OnboardingStepList steps={steps} completedStepIds={['profile']} activeStepId="connect" style={{ maxWidth: 420 }} />
);

export const Horizontal = () => (
  <OnboardingStepList
    orientation="horizontal"
    steps={steps.map(({ id, title }) => ({ id, title }))}
    completedStepIds={['profile', 'connect']}
    activeStepId="goals"
  />
);
