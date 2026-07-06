'use client';

import * as React from 'react';

import { cn } from '../lib/cn';

export type ScrollAreaProps = React.HTMLAttributes<HTMLDivElement>;

export interface ScrollBarProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal';
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('relative overflow-auto', className)} {...props}>
      {children}
    </div>
  )
);
ScrollArea.displayName = 'ScrollArea';

const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(
  ({ className, orientation = 'vertical', ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      data-orientation={orientation}
      className={cn(
        'pointer-events-none absolute rounded-full bg-border',
        orientation === 'vertical' && 'right-1 top-1 h-[calc(100%-0.5rem)] w-1',
        orientation === 'horizontal' && 'bottom-1 left-1 h-1 w-[calc(100%-0.5rem)]',
        className
      )}
      {...props}
    />
  )
);
ScrollBar.displayName = 'ScrollBar';

export { ScrollArea, ScrollBar };
