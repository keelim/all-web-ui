import { Slider } from '@keelim/all-web-ui';

export const Single = () => (
  <div style={{ maxWidth: 320 }}>
    <Slider aria-label="Equity allocation" defaultValue={[60]} max={100} step={5} />
  </div>
);

export const Range = () => (
  <div style={{ maxWidth: 320 }}>
    <Slider aria-label="Drift band" defaultValue={[20, 80]} max={100} thumbLabels={['Lower band', 'Upper band']} />
  </div>
);

export const Disabled = () => (
  <div style={{ maxWidth: 320 }}>
    <Slider aria-label="Cash buffer" defaultValue={[10]} max={100} disabled />
  </div>
);
