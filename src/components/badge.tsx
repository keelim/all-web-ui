import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/cn';

export const badgeVariants = cva('kui-badge', {
  variants: {
    variant: {
      default: 'kui-badge--accent',
      secondary: 'kui-badge--muted',
      destructive: 'kui-badge--danger',
      outline: 'kui-badge--default'
    },
    tone: {
      default: 'kui-badge--default',
      muted: 'kui-badge--muted',
      accent: 'kui-badge--accent',
      danger: 'kui-badge--danger',
      success: 'kui-badge--success',
      warning: 'kui-badge--warning',
      info: 'kui-badge--info'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ tone, variant }), className)} {...props} />;
}
