import * as React from 'react';

import { cn } from '../lib/cn';

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'default' | 'muted' | 'accent' | 'danger' | 'success';
};

export function Badge({ className, tone = 'muted', ...props }: BadgeProps) {
  return <span className={cn('kui-badge', `kui-badge--${tone}`, className)} {...props} />;
}
