import * as React from 'react';
import { Button as AstryxButton } from '@astryxdesign/core/Button';
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

type AstryxButtonVariant = React.ComponentProps<typeof AstryxButton>['variant'];
type AstryxButtonSize = React.ComponentProps<typeof AstryxButton>['size'];

function toAstryxVariant(variant: ButtonProps['variant']): AstryxButtonVariant {
  if (variant === 'secondary' || variant === 'outline') {
    return 'secondary';
  }

  if (variant === 'ghost' || variant === 'link') {
    return 'ghost';
  }

  if (variant === 'danger' || variant === 'destructive') {
    return 'destructive';
  }

  return 'primary';
}

function toAstryxSize(size: ButtonProps['size']): AstryxButtonSize {
  if (size === 'sm' || size === 'icon') {
    return 'sm';
  }

  if (size === 'lg') {
    return 'lg';
  }

  return 'md';
}

function getButtonLabel({
  ariaLabel,
  children,
  title
}: {
  ariaLabel: ButtonProps['aria-label'];
  children: ButtonProps['children'];
  title: ButtonProps['title'];
}) {
  if (typeof ariaLabel === 'string' && ariaLabel.trim().length > 0) {
    return ariaLabel;
  }

  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }

  if (typeof title === 'string' && title.trim().length > 0) {
    return title;
  }

  return 'Button';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    asChild = false,
    className,
    variant,
    size,
    type = 'button',
    children,
    disabled,
    title,
    'aria-label': ariaLabel,
    ...props
  },
  ref
) {
  const classNames = cn(buttonVariants({ variant, size }), className);

  if (asChild) {
    if (!React.isValidElement(children)) {
      return null;
    }

    return React.cloneElement(children, {
      ref,
      className: cn((children.props as { className?: string }).className, classNames),
      title,
      'aria-label': ariaLabel,
      ...props,
    } as Partial<React.HTMLAttributes<HTMLElement>>);
  }

  return (
    <AstryxButton
      ref={ref}
      type={type}
      label={getButtonLabel({ ariaLabel, children, title })}
      variant={toAstryxVariant(variant)}
      size={toAstryxSize(size)}
      isDisabled={disabled}
      className={classNames}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </AstryxButton>
  );
});
