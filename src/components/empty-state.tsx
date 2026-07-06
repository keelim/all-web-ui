import * as React from 'react';
import { EmptyState as AstryxEmptyState } from '@astryxdesign/core/EmptyState';

import { cn } from '../lib/cn';

export type EmptyStateProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description: string;
};

export function EmptyState({ className, title, description, ...props }: EmptyStateProps) {
  return (
    <AstryxEmptyState
      title={title ?? description}
      description={title ? description : undefined}
      className={cn('kui-empty-state', className)}
      {...(props as Omit<React.ComponentProps<typeof AstryxEmptyState>, 'title' | 'description' | 'className'>)}
    />
  );
}
