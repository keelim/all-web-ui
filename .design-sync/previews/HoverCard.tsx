import { Avatar, HoverCard, HoverCardContent, HoverCardTrigger } from '@keelim/all-web-ui';

export const AdvisorProfile = () => (
  <HoverCard defaultOpen>
    <HoverCardTrigger asChild>
      <a href="#" className="type-label">@jiwoo.kim</a>
    </HoverCardTrigger>
    <HoverCardContent>
      <div style={{ display: 'flex', gap: 'var(--kui-space-3)' }}>
        <Avatar name="Jiwoo Kim" />
        <div>
          <p className="type-label">Jiwoo Kim</p>
          <p className="type-body-sm fg-2">Financial advisor · 12 clients</p>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
);
