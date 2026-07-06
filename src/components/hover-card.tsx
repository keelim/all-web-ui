'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { useHoverCard } from '@astryxdesign/core/HoverCard';

import { cn } from '../lib/cn';

type Side = 'top' | 'right' | 'bottom' | 'left';
type Align = 'start' | 'center' | 'end';

export interface HoverCardProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
}

export interface HoverCardTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export type HoverCardPortalProps = React.HTMLAttributes<HTMLDivElement>;

export interface HoverCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: Align;
  side?: Side;
  sideOffset?: number;
  portalProps?: HoverCardPortalProps;
}

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

function getPart<T>(children: React.ReactNode, type: React.ComponentType<T>) {
  return React.Children.toArray(children).find(
    (child): child is React.ReactElement<T> => React.isValidElement(child) && child.type === type
  );
}

const HoverCard = ({ children, open, defaultOpen, onOpenChange, openDelay, closeDelay }: HoverCardProps) => {
  const trigger = getPart(children, HoverCardTrigger);
  const content = getPart(children, HoverCardContent);
  const [isOpen, setIsOpen] = React.useState(Boolean(defaultOpen));
  const currentOpen = open ?? isOpen;
  const setOpenState = React.useCallback(
    (next: boolean) => {
      setIsOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange]
  );
  const hoverCard = useHoverCard({
    delay: openDelay,
    hideDelay: closeDelay,
    isOpen: open,
    isDefaultOpen: defaultOpen,
    onShow: () => {
      setOpenState(true);
    },
    onHide: () => {
      setOpenState(false);
    },
    placement: toPlacement(content?.props.side),
    alignment: content?.props.align,
  });

  if (!trigger) {
    return <>{children}</>;
  }

  const triggerProps = trigger.props;
  const state = currentOpen ? 'open' : 'closed';
  const openHandlers = {
    onPointerEnter: () => setOpenState(true),
    onMouseEnter: () => setOpenState(true),
    onFocus: () => setOpenState(true),
    onPointerLeave: () => setOpenState(false),
    onMouseLeave: () => setOpenState(false),
    onBlur: () => setOpenState(false),
  };
  const triggerNode =
    triggerProps.asChild && React.isValidElement(triggerProps.children) ? (
      React.cloneElement(triggerProps.children, {
        ref: (node: HTMLElement | null) => {
          hoverCard.ref(node);
          setRef((triggerProps.children as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref, node);
        },
        'aria-describedby': hoverCard.describedBy,
        'data-state': state,
        className: cn((triggerProps.children.props as { className?: string }).className, triggerProps.className),
        ...openHandlers,
      } as Partial<React.HTMLAttributes<HTMLElement>>)
    ) : (
      <button
        type="button"
        {...triggerProps}
        ref={(node) => {
          hoverCard.ref(node);
          setRef(triggerProps.ref, node);
        }}
        aria-describedby={hoverCard.describedBy}
        data-state={state}
        {...openHandlers}
      />
    );

  const hoverNode = content
    ? hoverCard.renderHoverCard(
        <div
          data-state={state}
          className={cn('w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md', content.props.className)}
          {...content.props}
        >
          {content.props.children}
        </div>,
        { placement: toPlacement(content.props.side), alignment: content.props.align }
      )
    : null;

  return (
    <>
      {triggerNode}
      {hoverNode && typeof document !== 'undefined' ? createPortal(hoverNode, document.body) : hoverNode}
    </>
  );
};

const HoverCardTrigger = React.forwardRef<HTMLButtonElement, HoverCardTriggerProps>(
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
HoverCardTrigger.displayName = 'HoverCardTrigger';

const HoverCardContent = React.forwardRef<HTMLDivElement, HoverCardContentProps>(
  ({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
);
HoverCardContent.displayName = 'HoverCardContent';

export { HoverCard, HoverCardTrigger, HoverCardContent };
