import * as React from 'react';

import { Card as AstryxCard } from '@astryxdesign/core/Card';
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
  const classNames = cn('kui-panel', `kui-panel--${variant}`, padded && 'kui-panel--padded', className);

  if (!as) {
    return (
      <AstryxCard
        ref={ref as React.Ref<HTMLDivElement>}
        padding={0}
        variant={variant === 'soft' ? 'muted' : 'default'}
        className={classNames}
        {...(props as Omit<React.ComponentProps<typeof AstryxCard>, 'padding' | 'variant' | 'className'>)}
      />
    );
  }

  return React.createElement(as, {
    ref: ref as React.ComponentPropsWithRef<T>['ref'],
    className: classNames,
    ...props
  } as React.ComponentPropsWithRef<T>);
}

const PanelRoot = React.forwardRef(PanelInner as React.ForwardRefRenderFunction<unknown, PanelProps>);
PanelRoot.displayName = 'Panel';

export const Panel = PanelRoot as PolymorphicComponent<'div', PanelOwnProps>;
