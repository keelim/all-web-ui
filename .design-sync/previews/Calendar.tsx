import { Calendar } from '@keelim/all-web-ui';

export const SingleDate = () => (
  <Calendar mode="single" month={new Date(2026, 10, 1)} defaultValue="2026-11-12" />
);

export const Range = () => (
  <Calendar
    mode="range"
    month={new Date(2026, 10, 1)}
    defaultSelected={{ from: new Date(2026, 10, 9), to: new Date(2026, 10, 13) }}
  />
);
