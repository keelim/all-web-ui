import { EmptyState } from '@keelim/all-web-ui';

export const WithTitle = () => (
  <EmptyState title="No holdings yet" description="Connect a brokerage account to see your positions here." />
);

export const DescriptionOnly = () => <EmptyState description="No alerts in the last 30 days." />;
