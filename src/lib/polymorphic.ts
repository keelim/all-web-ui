import * as React from 'react';

export type PolymorphicProps<T extends React.ElementType, Props = object> = Props & {
  as?: T;
  className?: string;
} & Omit<React.ComponentPropsWithRef<T>, keyof Props | 'as' | 'className'>;

export type PolymorphicRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>['ref'];

export type PolymorphicComponent<DefaultElement extends React.ElementType, Props = object> = <
  T extends React.ElementType = DefaultElement
>(
  props: PolymorphicProps<T, Props>
) => React.ReactElement | null;
