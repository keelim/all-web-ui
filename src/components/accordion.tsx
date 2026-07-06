'use client';

import * as React from 'react';
import {
  CollapsibleGroup as AstryxCollapsibleGroup,
  useCollapsible
} from '@astryxdesign/core/Collapsible';
import { ChevronDown } from 'lucide-react';

import { cn } from '../lib/cn';

type AccordionValue = string | string[];

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: AccordionValue;
  value?: AccordionValue;
  onValueChange?: (value: AccordionValue) => void;
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  forceMount?: boolean;
}

const AccordionRootContext = React.createContext<Pick<AccordionProps, 'type' | 'collapsible'> | null>(null);
const AccordionItemContext = React.createContext<{ value: string } | null>(null);

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { type = 'single', collapsible = false, defaultValue, value, onValueChange, children, ...props },
  ref
) {
  return (
    <AccordionRootContext.Provider value={{ type, collapsible }}>
      <div ref={ref} {...props}>
        <AstryxCollapsibleGroup
          type={type}
          defaultValue={defaultValue}
          value={value}
          onChange={(next) => onValueChange?.(next)}
        >
          {children}
        </AstryxCollapsibleGroup>
      </div>
    </AccordionRootContext.Provider>
  );
});
Accordion.displayName = 'Accordion';

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, ...props }, ref) => (
    <AccordionItemContext.Provider value={{ value }}>
      <div ref={ref} className={cn('border-b', className)} {...props} />
    </AccordionItemContext.Provider>
  )
);
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const root = React.useContext(AccordionRootContext);
    const item = React.useContext(AccordionItemContext);
    const { isOpen, toggle } = useCollapsible({ isCollapsible: true, value: item?.value });
    const state = isOpen ? 'open' : 'closed';

    return (
      <h3 className="flex">
        <button
          ref={ref}
          type="button"
          aria-expanded={isOpen}
          data-state={state}
          className={cn(
            'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
            className
          )}
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented && (root?.collapsible || !isOpen || root?.type === 'multiple')) {
              toggle();
            }
          }}
          {...props}
        >
          {children}
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
        </button>
      </h3>
    );
  }
);
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, forceMount, ...props }, ref) => {
    const item = React.useContext(AccordionItemContext);
    const { isOpen } = useCollapsible({ isCollapsible: true, value: item?.value });
    const [hasRendered, setHasRendered] = React.useState(Boolean(forceMount || isOpen));
    const state = isOpen ? 'open' : 'closed';

    React.useEffect(() => {
      if (isOpen) {
        setHasRendered(true);
      }
    }, [isOpen]);

    return (
      <div
        ref={ref}
        data-state={state}
        className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
        {...props}
      >
        {hasRendered || forceMount ? <div className={cn('pb-4 pt-0', className)}>{children}</div> : null}
      </div>
    );
  }
);
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
