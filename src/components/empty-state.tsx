import * as React from 'react';

import { cn } from '../lib/cn';

export type EmptyStateProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description: string;
};

export function EmptyState({ className, title, description, ...props }: EmptyStateProps) {
  return (
    <div className={cn('kui-empty-state', className)} {...props}>
      {title ? <p className="kui-empty-state__title">{title}</p> : null}
      <p className="kui-empty-state__description">{description}</p>
    </div>
  );
}
