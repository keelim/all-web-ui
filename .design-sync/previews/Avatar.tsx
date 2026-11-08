import { Avatar } from '@keelim/all-web-ui';

const row = { display: 'flex', gap: 'var(--kui-space-3)', alignItems: 'center' };

export const Initials = () => (
  <div style={row}>
    <Avatar name="Jiwoo Kim" />
    <Avatar name="Alex Morgan" />
    <Avatar name="Sam Lee" />
  </div>
);

export const Sizes = () => (
  <div style={row}>
    <Avatar name="Jiwoo Kim" size={24} />
    <Avatar name="Jiwoo Kim" size={32} />
    <Avatar name="Jiwoo Kim" size={48} />
    <Avatar name="Jiwoo Kim" size={72} />
  </div>
);
