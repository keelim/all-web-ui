import * as React from 'react';

import { cn } from '../lib/cn';
import type { PolymorphicComponent, PolymorphicProps, PolymorphicRef } from '../lib/polymorphic';

type PanelOwnProps = {
  variant?: 'default' | 'elevated' | 'soft';
  padded?: boolean;
};

export type PanelProps<T extends React.ElementType = 'div'> = PolymorphicProps<T, PanelOwnProps>;

function PanelInner<T extends React.ElementType = 'div'>({
  as,
  variant = 'elevated',
  padded = true,
  className,
  ...props
}: PanelProps<T>, ref: PolymorphicRef<T>) {
  const Component = as ?? 'div';
  return (
    <Component
      ref={ref as React.ComponentPropsWithRef<T>['ref']}
      className={cn('kui-panel', `kui-panel--${variant}`, padded && 'kui-panel--padded', className)}
      {...props}
    />
  );
}

const PanelRoot = React.forwardRef(PanelInner as React.ForwardRefRenderFunction<unknown, PanelProps>);
PanelRoot.displayName = 'Panel';

export const Panel = PanelRoot as PolymorphicComponent<'div', PanelOwnProps>;
