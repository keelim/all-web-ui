import { Skeleton } from '@keelim/all-web-ui';

export const CardLoading = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kui-space-3)', maxWidth: 320 }}>
    <Skeleton style={{ height: 20, width: '60%' }} />
    <Skeleton style={{ height: 14, width: '90%' }} />
    <Skeleton style={{ height: 14, width: '75%' }} />
    <Skeleton style={{ height: 96, width: '100%' }} />
  </div>
);
