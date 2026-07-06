'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '../lib/cn';

type SheetContextValue = {
  descriptionId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
};

const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheetContext(componentName: string) {
  const context = React.useContext(SheetContext);

  if (!context) {
    throw new Error(`${componentName} must be used inside Sheet`);
  }

  return context;
}

export type SheetProps = React.PropsWithChildren<{
  defaultOpen?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}>;
export type SheetTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};
export type SheetCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};
export type SheetPortalProps = React.PropsWithChildren;
export type SheetOverlayProps = React.HTMLAttributes<HTMLDivElement>;
export type SheetHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export type SheetFooterProps = React.HTMLAttributes<HTMLDivElement>;
export type SheetTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
export type SheetDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

function Sheet({ children, defaultOpen = false, onOpenChange, open }: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const reactId = React.useId();
  const titleId = `kui-sheet-title-${reactId}`;
  const descriptionId = `kui-sheet-description-${reactId}`;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);

      if (!nextOpen) {
        triggerRef.current?.focus();
      }
    },
    [onOpenChange, open]
  );

  const contextValue = React.useMemo(
    () => ({ descriptionId, open: isOpen, setOpen, titleId, triggerRef }),
    [descriptionId, isOpen, setOpen, titleId]
  );

  return <SheetContext.Provider value={contextValue}>{children}</SheetContext.Provider>;
}

const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
  function SheetTrigger({ asChild, children, onClick, type = 'button', ...props }, ref) {
    const context = useSheetContext('SheetTrigger');

    const setRefs = (node: HTMLButtonElement | null) => {
      context.triggerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const triggerProps = {
      'aria-expanded': context.open,
      'aria-haspopup': 'dialog' as const,
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          context.setOpen(true);
        }
      },
    };

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement;

      return React.cloneElement(child as React.ReactElement<any>, {
        ...props,
        ...triggerProps,
        ref: setRefs,
      } as any);
    }

    return (
      <button ref={setRefs} type={type} {...props} {...triggerProps}>
        {children}
      </button>
    );
  }
);

const SheetClose = React.forwardRef<HTMLButtonElement, SheetCloseProps>(
  function SheetClose({ asChild, children, onClick, type = 'button', ...props }, ref) {
    const context = useSheetContext('SheetClose');
    const closeProps = {
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          context.setOpen(false);
        }
      },
    };

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement;

      return React.cloneElement(child as React.ReactElement<any>, {
        ...props,
        ...closeProps,
        ref,
      } as any);
    }

    return (
      <button ref={ref} type={type} {...props} {...closeProps}>
        {children}
      </button>
    );
  }
);

function SheetPortal({ children }: SheetPortalProps) {
  return <>{children}</>;
}

const SheetOverlay = React.forwardRef<HTMLDivElement, SheetOverlayProps>(
  function SheetOverlay({ className, ...props }, ref) {
    return <div className={cn('fixed inset-0 z-50 bg-black/80', className)} {...props} ref={ref} />;
  }
);

export const sheetVariants = cva('fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out', {
  variants: {
    side: {
      top: 'inset-x-0 top-0 border-b',
      bottom: 'inset-x-0 bottom-0 border-t',
      left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
      right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
    },
  },
  defaultVariants: {
    side: 'right',
  },
});

export interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sheetVariants> {
  accessibleTitle?: React.ReactNode;
  closeLabel?: string;
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  function SheetContent(
    { side = 'right', className, children, accessibleTitle = 'Sheet', closeLabel = 'Close', ...props },
    ref
  ) {
    const context = useSheetContext('SheetContent');
    const needsHiddenTitle =
      !props['aria-label'] &&
      !props['aria-labelledby'] &&
      !hasAccessibleSheetChild(children, SheetTitle);
    const hasDescription = hasAccessibleSheetChild(children, SheetDescription);

    React.useEffect(() => {
      if (!context.open) {
        return;
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          context.setOpen(false);
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [context]);

    if (!context.open) {
      return null;
    }

    return (
      <SheetPortal>
        <SheetOverlay />
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={
            props['aria-label'] ? undefined : props['aria-labelledby'] ?? context.titleId
          }
          aria-describedby={
            props['aria-describedby'] ?? (hasDescription ? context.descriptionId : undefined)
          }
          className={cn(sheetVariants({ side }), className)}
          data-state="open"
          {...props}
        >
          {needsHiddenTitle ? <SheetTitle className="sr-only">{accessibleTitle}</SheetTitle> : null}
          {children}
          <SheetClose
            aria-label={closeLabel}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X aria-hidden="true" focusable="false" className="h-4 w-4" />
            <span className="sr-only">{closeLabel}</span>
          </SheetClose>
        </div>
      </SheetPortal>
    );
  }
);

function SheetHeader({ className, ...props }: SheetHeaderProps) {
  return <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />;
}

function SheetFooter({ className, ...props }: SheetFooterProps) {
  return (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      {...props}
    />
  );
}

const SheetTitle = React.forwardRef<HTMLHeadingElement, SheetTitleProps>(
  function SheetTitle({ className, id, ...props }, ref) {
    const context = React.useContext(SheetContext);

    return (
      <h2
        ref={ref}
        id={id ?? context?.titleId}
        className={cn('text-lg font-semibold text-foreground', className)}
        {...props}
      />
    );
  }
);

const SheetDescription = React.forwardRef<HTMLParagraphElement, SheetDescriptionProps>(
  function SheetDescription({ className, id, ...props }, ref) {
    const context = React.useContext(SheetContext);

    return (
      <p
        ref={ref}
        id={id ?? context?.descriptionId}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
      />
    );
  }
);

function hasAccessibleSheetChild(children: React.ReactNode, target: React.ElementType): boolean {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) {
      return false;
    }

    return child.type === target || hasAccessibleSheetChild(child.props.children, target);
  });
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
