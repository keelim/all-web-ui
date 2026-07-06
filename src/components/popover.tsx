'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { usePopover } from '@astryxdesign/core/Popover';

import { cn } from '../lib/cn';

type Side = 'top' | 'right' | 'bottom' | 'left';
type Align = 'start' | 'center' | 'end';

export interface PopoverProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export type PopoverAnchorProps = React.HTMLAttributes<HTMLDivElement>;

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: Align;
  side?: Side;
  sideOffset?: number;
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

const Popover = ({ children, open, defaultOpen, onOpenChange, modal }: PopoverProps) => {
  const trigger = getPart(children, PopoverTrigger);
  const content = getPart(children, PopoverContent);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [localOpen, setLocalOpen] = React.useState(Boolean(defaultOpen));
  const popover = usePopover({
    hasAutoFocus: false,
    isModal: modal,
    dialogLabel: typeof content?.props.children === 'string' ? content.props.children : 'Popover',
    onShow: () => {
      if (open === undefined) setLocalOpen(true);
      onOpenChange?.(true);
    },
    onHide: () => {
      if (open === undefined) setLocalOpen(false);
      onOpenChange?.(false);
    },
  });
  const isOpen = open ?? localOpen;
  const setOpenState = React.useCallback(
    (next: boolean) => {
      if (open === undefined) {
        setLocalOpen(next);
      }
      onOpenChange?.(next);
      if (next) {
        popover.show({ skipAutoFocus: true });
      } else {
        popover.hide();
      }
    },
    [onOpenChange, open, popover]
  );

  React.useEffect(() => {
    if (defaultOpen) {
      setOpenState(true);
    }
  }, []);

  React.useEffect(() => {
    if (open === true && !isOpen) {
      setOpenState(true);
    }
    if (open === false && isOpen) {
      setOpenState(false);
    }
  }, [open, isOpen, setOpenState]);

  React.useEffect(() => {
    if (!isOpen || typeof document === 'undefined') {
      return;
    }

    const close = () => setOpenState(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (target && (triggerRef.current?.contains(target) || contentRef.current?.contains(target))) {
        return;
      }
      close();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpen, setOpenState]);

  if (!trigger) {
    return <>{children}</>;
  }

  const triggerProps = trigger.props;
  const state = isOpen ? 'open' : 'closed';
  const onTriggerClick = (event: React.MouseEvent<HTMLElement>) => {
    triggerProps.onClick?.(event as React.MouseEvent<HTMLButtonElement>);
    if (!event.defaultPrevented) {
      setOpenState(!isOpen);
    }
  };
  const triggerNode =
    triggerProps.asChild && React.isValidElement(triggerProps.children) ? (
      React.cloneElement(triggerProps.children, {
        ref: (node: HTMLElement | null) => {
          triggerRef.current = node;
          popover.triggerRef(node);
          setRef((triggerProps.children as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref, node);
        },
        ...popover.triggerProps,
        onClick: onTriggerClick,
        'data-state': state,
        className: cn((triggerProps.children.props as { className?: string }).className, triggerProps.className),
      } as Partial<React.HTMLAttributes<HTMLElement>>)
    ) : (
      <button
        type="button"
        {...triggerProps}
        {...popover.triggerProps}
        ref={(node) => {
          triggerRef.current = node;
          popover.triggerRef(node);
          setRef(triggerProps.ref, node);
        }}
        onClick={onTriggerClick}
        data-state={state}
      />
    );

  const popoverNode = isOpen && content
    ? popover.render(
        <div
          ref={contentRef}
          data-state={state}
          className={cn('w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md', content.props.className)}
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
      {popoverNode && typeof document !== 'undefined' ? createPortal(popoverNode, document.body) : popoverNode}
    </>
  );
};

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
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
PopoverTrigger.displayName = 'PopoverTrigger';

const PopoverAnchor = React.forwardRef<HTMLDivElement, PopoverAnchorProps>((props, ref) => <div ref={ref} {...props} />);
PopoverAnchor.displayName = 'PopoverAnchor';

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
);
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
