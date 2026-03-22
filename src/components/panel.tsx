import * as React from 'react';

import { cn } from '../lib/cn';

export type PanelProps<T extends React.ElementType = 'div'> = {
  as?: T;
  variant?: 'default' | 'elevated' | 'soft';
  padded?: boolean;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className'>;

export function Panel<T extends React.ElementType = 'div'>({
  as,
  variant = 'elevated',
  padded = true,
  className,
  ...props
}: PanelProps<T>) {
  const Component = as ?? 'div';
  return <Component className={cn('kui-panel', `kui-panel--${variant}`, padded && 'kui-panel--padded', className)} {...props} />;
}
