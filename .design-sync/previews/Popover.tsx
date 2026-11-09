import { Button, Popover, PopoverContent, PopoverTrigger } from '@keelim/all-web-ui';

export const DriftInfo = () => (
  <Popover defaultOpen>
    <PopoverTrigger asChild>
      <Button variant="secondary">What is drift?</Button>
    </PopoverTrigger>
    <PopoverContent>
      <p className="type-label">Allocation drift</p>
      <p className="type-body-sm fg-2">
        How far each holding has moved from its target weight since the last rebalance.
      </p>
    </PopoverContent>
  </Popover>
);
