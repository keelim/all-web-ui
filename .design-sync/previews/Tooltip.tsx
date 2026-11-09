import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@keelim/all-web-ui';

export const IconHint = () => (
  <TooltipProvider>
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <Button variant="secondary">Refresh</Button>
      </TooltipTrigger>
      <TooltipContent>Last synced 2 minutes ago</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
