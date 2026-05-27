import * as React from 'react';

import { cn } from '../lib/cn';

export type MetricCardProps<T extends React.ElementType = 'section'> = {
  as?: T;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className'>;

export function MetricCard<T extends React.ElementType = 'section'>({
  as,
  padding = 'md',
  className,
  ...props
}: MetricCardProps<T>) {
  const Component = as ?? 'section';

  return <Component className={cn('kui-metric-card', `kui-metric-card--padding-${padding}`, className)} {...props} />;
}

export type MetricValueProps<T extends React.ElementType = 'strong'> = {
  as?: T;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className'>;

export function MetricValue<T extends React.ElementType = 'strong'>({
  as,
  size = 'lg',
  className,
  ...props
}: MetricValueProps<T>) {
  const Component = as ?? 'strong';

  return <Component className={cn('kui-metric-value', `kui-metric-value--${size}`, className)} {...props} />;
}

export type DataNumberProps<T extends React.ElementType = 'span'> = {
  as?: T;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className'>;

export function DataNumber<T extends React.ElementType = 'span'>({ as, className, ...props }: DataNumberProps<T>) {
  const Component = as ?? 'span';

  return <Component className={cn('kui-data-number', className)} {...props} />;
}
