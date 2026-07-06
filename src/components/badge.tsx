import * as React from 'react';
import { Badge as AstryxBadge } from '@astryxdesign/core/Badge';
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

type AstryxBadgeVariant = React.ComponentProps<typeof AstryxBadge>['variant'];

function toAstryxBadgeVariant(tone: BadgeProps['tone'], variant: BadgeProps['variant']): AstryxBadgeVariant {
  if (tone === 'success') {
    return 'success';
  }

  if (tone === 'warning') {
    return 'warning';
  }

  if (tone === 'info') {
    return 'info';
  }

  if (tone === 'danger' || variant === 'destructive') {
    return 'error';
  }

  return 'neutral';
}

export function Badge({ className, tone, variant, children, ...props }: BadgeProps) {
  return (
    <AstryxBadge
      label={children}
      variant={toAstryxBadgeVariant(tone, variant)}
      className={cn(badgeVariants({ tone, variant }), className)}
      {...(props as Omit<React.ComponentProps<typeof AstryxBadge>, 'label' | 'variant' | 'className'>)}
    />
  );
}
