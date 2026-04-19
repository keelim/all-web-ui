import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '../lib/cn';

export const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'nav'> & { separator?: React.ReactNode }
>(function Breadcrumb({ ...props }, ref) {
  return <nav ref={ref} aria-label="breadcrumb" {...props} />;
});

export const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<'ol'>>(
  function BreadcrumbList({ className, ...props }, ref) {
    return <ol ref={ref} className={cn('flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5', className)} {...props} />;
  }
);

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<'li'>>(
  function BreadcrumbItem({ className, ...props }, ref) {
    return <li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} />;
  }
);

export const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> & { asChild?: boolean }
>(function BreadcrumbLink({ asChild, className, ...props }, ref) {
  const Component = asChild ? Slot : 'a';
  return <Component ref={ref} className={cn('transition-colors hover:text-foreground', className)} {...props} />;
});

export const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<'span'>>(
  function BreadcrumbPage({ className, ...props }, ref) {
    return <span ref={ref} role="link" aria-disabled="true" aria-current="page" className={cn('font-normal text-foreground', className)} {...props} />;
  }
);

export function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li role="presentation" aria-hidden="true" className={cn('[&>svg]:size-3.5', className)} {...props}>
      {children ?? <ChevronRight />}
    </li>
  );
}

export function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span role="presentation" aria-hidden="true" className={cn('flex h-9 w-9 items-center justify-center', className)} {...props}>
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More</span>
    </span>
  );
}
