'use client';

import * as React from 'react';
import {
  Tab as AstryxTab,
  TabList as AstryxTabList
} from '@astryxdesign/core/TabList';

import { cn } from '../lib/cn';

type TabsContextValue = {
  orientation: 'horizontal' | 'vertical';
  setValue: (value: string) => void;
  value: string;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(componentName: string) {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error(`${componentName} must be used inside Tabs`);
  }

  return context;
}

export type TabsProps = React.HTMLAttributes<HTMLDivElement> & {
  activationMode?: 'automatic' | 'manual';
  defaultValue?: string;
  dir?: 'ltr' | 'rtl';
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  value?: string;
};

export type TabsListProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> & {
  children?: React.ReactNode;
  hasDivider?: boolean;
  layout?: 'fill' | 'hug';
  size?: 'lg' | 'md' | 'sm';
};
export type TabsTriggerProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'value'
> & {
  asChild?: boolean;
  value: string;
};
export type TabsContentProps = React.HTMLAttributes<HTMLDivElement> & {
  forceMount?: boolean;
  value: string;
};

function getTextLabel(children: React.ReactNode, fallback: string) {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }

  return fallback;
}

function moveToSiblingTab(
  currentTab: HTMLElement,
  direction: 'first' | 'last' | 'next' | 'previous',
  setValue: (value: string) => void
) {
  const tabList = currentTab.closest('[role="tablist"]');
  const tabs = Array.from(
    tabList?.querySelectorAll<HTMLElement>(
      '[role="tab"][data-kui-tabs-trigger]:not([disabled]):not([aria-disabled="true"])'
    ) ?? []
  );
  const currentIndex = tabs.indexOf(currentTab);

  if (currentIndex === -1 || tabs.length === 0) {
    return;
  }

  const nextIndex =
    direction === 'first'
      ? 0
      : direction === 'last'
        ? tabs.length - 1
        : direction === 'next'
          ? (currentIndex + 1) % tabs.length
          : (currentIndex - 1 + tabs.length) % tabs.length;
  const nextTab = tabs[nextIndex];
  const nextValue = nextTab?.dataset.value;

  if (!nextTab || !nextValue) {
    return;
  }

  nextTab.focus();
  setValue(nextValue);
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    activationMode: _activationMode,
    defaultValue,
    dir: _dir,
    onValueChange,
    orientation = 'horizontal',
    value,
    ...props
  },
  ref
) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? value ?? '');
  const selectedValue = value ?? uncontrolledValue;

  const setValue = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setUncontrolledValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [onValueChange, value]
  );

  const contextValue = React.useMemo(
    () => ({ orientation, setValue, value: selectedValue }),
    [orientation, selectedValue, setValue]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div ref={ref} data-orientation={orientation} {...props} />
    </TabsContext.Provider>
  );
});

export const TabsList = React.forwardRef<HTMLElement, TabsListProps>(function TabsList(
  { className, layout, ...props },
  ref
) {
  const { orientation, setValue, value } = useTabsContext('TabsList');

  return (
    <AstryxTabList
      ref={ref}
      role="tablist"
      value={value}
      onChange={setValue}
      orientation={orientation}
      layout={layout ?? 'hug'}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className
      )}
      {...props}
    >
      {props.children}
    </AstryxTabList>
  );
});

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger(
    {
      asChild,
      children,
      className,
      disabled,
      onClick,
      onKeyDown,
      value,
      ...props
    },
    ref
  ) {
    const context = useTabsContext('TabsTrigger');
    const isSelected = context.value === value;
    const label = props['aria-label'] ?? getTextLabel(children, value);
    const triggerProps = {
      'aria-selected': isSelected,
      'data-kui-tabs-trigger': '',
      'data-state': isSelected ? 'active' : 'inactive',
      'data-value': value,
      disabled,
      role: 'tab',
      tabIndex: disabled ? -1 : isSelected ? 0 : -1,
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) {
          context.setValue(value);
        }
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event);

        if (event.defaultPrevented || disabled) {
          return;
        }

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          moveToSiblingTab(event.currentTarget, 'next', context.setValue);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          moveToSiblingTab(event.currentTarget, 'previous', context.setValue);
        } else if (event.key === 'Home') {
          event.preventDefault();
          moveToSiblingTab(event.currentTarget, 'first', context.setValue);
        } else if (event.key === 'End') {
          event.preventDefault();
          moveToSiblingTab(event.currentTarget, 'last', context.setValue);
        }
      },
    };

    const mergedClassName = cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      className
    );

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{
        className?: string;
      }>;

      return React.cloneElement(child as React.ReactElement<any>, {
        ...props,
        ...triggerProps,
        className: cn(mergedClassName, child.props.className),
        ref,
      } as any);
    }

    const hasPlainLabel = typeof children === 'string' || typeof children === 'number';

    return (
      <AstryxTab
        ref={ref}
        value={value}
        label={String(label)}
        isLabelHidden={!hasPlainLabel}
        endContent={!hasPlainLabel ? children : undefined}
        className={mergedClassName}
        {...props}
        {...triggerProps}
      />
    );
  }
);

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent({ className, forceMount, value, ...props }, ref) {
    const context = useTabsContext('TabsContent');
    const isSelected = context.value === value;

    if (!isSelected && !forceMount) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        data-state={isSelected ? 'active' : 'inactive'}
        data-orientation={context.orientation}
        hidden={!isSelected}
        className={cn(
          'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        {...props}
      />
    );
  }
);
