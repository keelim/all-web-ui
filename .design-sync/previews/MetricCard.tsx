import { DataNumber, MetricCard, MetricValue } from '@keelim/all-web-ui';

export const KpiRow = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--kui-space-3)', maxWidth: 820 }}>
    <MetricCard>
      <p className="type-overline fg-2">Total value</p>
      <MetricValue>$248,310</MetricValue>
      <p className="type-caption fg-up">+2.1% today</p>
    </MetricCard>
    <MetricCard>
      <p className="type-overline fg-2">YTD return</p>
      <MetricValue>12.4%</MetricValue>
      <p className="type-caption fg-up">vs 9.8% benchmark</p>
    </MetricCard>
    <MetricCard>
      <p className="type-overline fg-2">Cash</p>
      <MetricValue>$8,920</MetricValue>
      <p className="type-caption fg-down">-3.6% this week</p>
    </MetricCard>
  </div>
);

export const ValueSizes = () => (
  <MetricCard style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--kui-space-4)', maxWidth: 560 }}>
    <MetricValue size="sm">1.2%</MetricValue>
    <MetricValue size="md">1.2%</MetricValue>
    <MetricValue size="lg">1.2%</MetricValue>
    <MetricValue size="xl">1.2%</MetricValue>
  </MetricCard>
);

export const InlineNumber = () => (
  <p className="type-body" style={{ maxWidth: 420 }}>
    Your portfolio holds <DataNumber>18</DataNumber> positions worth <DataNumber>$248,310.42</DataNumber>.
  </p>
);
