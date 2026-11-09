import { LoadingStatus } from '@keelim/all-web-ui';

export const Inline = () => <LoadingStatus label="Loading holdings…" />;

export const PanelWithSteps = () => (
  <LoadingStatus
    variant="panel"
    tone="accent"
    label="Syncing accounts"
    caption="This usually takes under a minute."
    steps={['Connecting to brokerage', 'Importing positions', 'Calculating returns']}
    activeStep={1}
    style={{ maxWidth: 420 }}
  />
);

export const PanelMuted = () => (
  <LoadingStatus variant="panel" tone="muted" label="Preparing report" style={{ maxWidth: 420 }} />
);
