'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { useTooltip } from '@astryxdesign/core/Tooltip';

import { cn } from '../lib/cn';

type Side = 'top' | 'right' | 'bottom' | 'left';
type Align = 'start' | 'center' | 'end';

export interface TooltipProviderProps {
  children?: React.ReactNode;
  delayDuration?: number;
}

export interface TooltipProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
}

export interface TooltipTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export type TooltipPortalProps = React.HTMLAttributes<HTMLDivElement>;

export interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: Side;
  align?: Align;
  sideOffset?: number;
  portalProps?: TooltipPortalProps;
}

const TooltipDelayContext = React.createContext<number | undefined>(undefined);
const noopRef = () => {};

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

function toPlacement(side: Side | undefined) {
  if (side === 'bottom') return 'below';
  if (side === 'top') return 'above';
  if (side === 'left') return 'start';
  if (side === 'right') return 'end';
  return side;
}

function toAlignment(align: Align | undefined) {
  return align;
}

function getPart<T>(children: React.ReactNode, type: React.ComponentType<T>) {
  return React.Children.toArray(children).find(
    (child): child is React.ReactElement<T> => React.isValidElement(child) && child.type === type
  );
}

export function TooltipProvider({ children, delayDuration }: TooltipProviderProps) {
  return <TooltipDelayContext.Provider value={delayDuration}>{children}</TooltipDelayContext.Provider>;
}

export function Tooltip({ children, open, defaultOpen, onOpenChange, delayDuration }: TooltipProps) {
  const trigger = getPart(children, TooltipTrigger);
  const content = getPart(children, TooltipContent);
  const providerDelay = React.useContext(TooltipDelayContext);
  const [isOpen, setIsOpen] = React.useState(Boolean(defaultOpen));
  const currentOpen = open ?? isOpen;
  const tooltip = useTooltip({
    delay: delayDuration ?? providerDelay,
    isOpen: open,
    isDefaultOpen: defaultOpen,
    onShow: () => {
      setIsOpen(true);
      onOpenChange?.(true);
    },
    onHide: () => {
      setIsOpen(false);
      onOpenChange?.(false);
    },
    placement: toPlacement(content?.props.side),
    alignment: toAlignment(content?.props.align),
  });

  if (!trigger) {
    return <>{children}</>;
  }

  const triggerProps = trigger.props;
  const state = currentOpen ? 'open' : 'closed';
  const triggerNode =
    triggerProps.asChild && React.isValidElement(triggerProps.children) ? (
      React.cloneElement(triggerProps.children, {
        ref: (node: HTMLElement | null) => {
          tooltip.ref(node);
          setRef((triggerProps.children as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref, node);
        },
        'aria-describedby': tooltip.describedBy,
        'data-state': state,
        className: cn((triggerProps.children.props as { className?: string }).className, triggerProps.className),
      } as Partial<React.HTMLAttributes<HTMLElement>>)
    ) : (
      <button
        type="button"
        {...triggerProps}
        ref={(node) => {
          tooltip.ref(node);
          setRef(triggerProps.ref, node);
        }}
        aria-describedby={tooltip.describedBy}
        data-state={state}
      />
    );

  const tooltipNode = content
    ? tooltip.renderTooltip(
        <div
          className={cn(
            'rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
            content.props.className
          )}
          {...content.props}
        >
          {content.props.children}
        </div>,
        { placement: toPlacement(content.props.side), alignment: toAlignment(content.props.align) }
      )
    : null;

  return (
    <>
      {triggerNode}
      {tooltipNode && typeof document !== 'undefined' ? createPortal(tooltipNode, document.body) : tooltipNode}
    </>
  );
}

export const TooltipTrigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ asChild, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, { ref } as Partial<React.HTMLAttributes<HTMLElement>>);
    }

    return (
      <button ref={ref} type="button" {...props}>
        {children}
      </button>
    );
  }
);
TooltipTrigger.displayName = 'TooltipTrigger';

export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
);
TooltipContent.displayName = 'TooltipContent';

void noopRef;
