import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/cn';

export const buttonVariants = cva('kui-button', {
  variants: {
    variant: {
      default: 'kui-button--primary',
      primary: 'kui-button--primary',
      destructive: 'kui-button--danger',
      danger: 'kui-button--danger',
      outline: 'kui-button--secondary',
      secondary: 'kui-button--secondary',
      ghost: 'kui-button--ghost',
      link: 'kui-button--ghost'
    },
    size: {
      default: 'kui-button--md',
      md: 'kui-button--md',
      sm: 'kui-button--sm',
      lg: 'kui-button--lg',
      icon: 'kui-button--sm'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { asChild = false, className, variant, size, type = 'button', ...props },
  ref
) {
  const Component = asChild ? Slot : 'button';
  const componentProps = asChild ? props : { type, ...props };

  return <Component ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...componentProps} />;
});
