import { RadioGroup, RadioGroupItem } from '@keelim/all-web-ui';

export const Vertical = () => (
  <RadioGroup aria-label="Rebalance frequency" defaultValue="monthly">
    <RadioGroupItem value="weekly">Weekly</RadioGroupItem>
    <RadioGroupItem value="monthly">Monthly</RadioGroupItem>
    <RadioGroupItem value="quarterly">Quarterly</RadioGroupItem>
    <RadioGroupItem value="never" disabled>Never (locked by policy)</RadioGroupItem>
  </RadioGroup>
);

export const Horizontal = () => (
  <RadioGroup aria-label="Chart range" defaultValue="1y" orientation="horizontal">
    <RadioGroupItem value="1m">1M</RadioGroupItem>
    <RadioGroupItem value="6m">6M</RadioGroupItem>
    <RadioGroupItem value="1y">1Y</RadioGroupItem>
    <RadioGroupItem value="all">All</RadioGroupItem>
  </RadioGroup>
);
