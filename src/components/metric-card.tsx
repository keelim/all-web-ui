import * as React from 'react';

import { cn } from '../lib/cn';
import type { PolymorphicComponent, PolymorphicProps, PolymorphicRef } from '../lib/polymorphic';

type MetricCardOwnProps = {
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

export type MetricCardProps<T extends React.ElementType = 'section'> = PolymorphicProps<T, MetricCardOwnProps>;

function MetricCardInner<T extends React.ElementType = 'section'>({
  as,
  padding = 'md',
  className,
  ...props
}: MetricCardProps<T>, ref: PolymorphicRef<T>) {
  const Component = as ?? 'section';

  return (
    <Component
      ref={ref as React.ComponentPropsWithRef<T>['ref']}
      className={cn('kui-metric-card', `kui-metric-card--padding-${padding}`, className)}
      {...props}
    />
  );
}

type MetricValueOwnProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

export type MetricValueProps<T extends React.ElementType = 'strong'> = PolymorphicProps<T, MetricValueOwnProps>;

function MetricValueInner<T extends React.ElementType = 'strong'>({
  as,
  size = 'lg',
  className,
  ...props
}: MetricValueProps<T>, ref: PolymorphicRef<T>) {
  const Component = as ?? 'strong';

  return (
    <Component
      ref={ref as React.ComponentPropsWithRef<T>['ref']}
      className={cn('kui-metric-value', `kui-metric-value--${size}`, className)}
      {...props}
    />
  );
}

type DataNumberOwnProps = object;

export type DataNumberProps<T extends React.ElementType = 'span'> = PolymorphicProps<T, DataNumberOwnProps>;

function DataNumberInner<T extends React.ElementType = 'span'>(
  { as, className, ...props }: DataNumberProps<T>,
  ref: PolymorphicRef<T>
) {
  const Component = as ?? 'span';

  return <Component ref={ref as React.ComponentPropsWithRef<T>['ref']} className={cn('kui-data-number', className)} {...props} />;
}

const MetricCardRoot = React.forwardRef(MetricCardInner as React.ForwardRefRenderFunction<unknown, MetricCardProps>);
MetricCardRoot.displayName = 'MetricCard';

const MetricValueRoot = React.forwardRef(MetricValueInner as React.ForwardRefRenderFunction<unknown, MetricValueProps>);
MetricValueRoot.displayName = 'MetricValue';

const DataNumberRoot = React.forwardRef(DataNumberInner as React.ForwardRefRenderFunction<unknown, DataNumberProps>);
DataNumberRoot.displayName = 'DataNumber';

export const MetricCard = MetricCardRoot as PolymorphicComponent<'section', MetricCardOwnProps>;
export const MetricValue = MetricValueRoot as PolymorphicComponent<'strong', MetricValueOwnProps>;
export const DataNumber = DataNumberRoot as PolymorphicComponent<'span', DataNumberOwnProps>;
