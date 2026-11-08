import { Button, OnboardingTour } from '@keelim/all-web-ui';

const steps = [
  { id: 'connect', title: 'Connect an account', description: 'Link a brokerage or bank account to import balances.' },
  { id: 'goals', title: 'Set allocation goals', description: 'Choose target weights for each asset class.' },
  { id: 'alerts', title: 'Turn on drift alerts', description: 'Get notified when a position moves past its band.', optional: true },
];

export const InProgress = () => (
  <OnboardingTour
    title="Set up your portfolio"
    description="Three short steps and your dashboard is ready."
    steps={steps}
    completedStepIds={['connect']}
    activeStepId="goals"
    actions={
      <>
        <Button variant="ghost" size="sm">Skip for now</Button>
        <Button size="sm">Continue</Button>
      </>
    }
    style={{ maxWidth: 520 }}
  />
);

export const JustStarted = () => (
  <OnboardingTour
    title="Welcome to the admin console"
    steps={[
      { id: 'invite', title: 'Invite your team' },
      { id: 'roles', title: 'Assign roles' },
      { id: 'audit', title: 'Run the first audit' },
    ]}
    activeStepId="invite"
    actions={<Button size="sm">Start</Button>}
    style={{ maxWidth: 520 }}
  />
);
