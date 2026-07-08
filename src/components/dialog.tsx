'use client';

import * as React from 'react';
import { IconButton as AstryxIconButton } from '@astryxdesign/core/IconButton';
import { X } from 'lucide-react';

import { cn } from '../lib/cn';

type DialogContextValue = {
  contentId: string;
  descriptionId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext(componentName: string) {
  const context = React.useContext(DialogContext);

  if (!context) {
    throw new Error(`${componentName} must be used inside Dialog`);
  }

  return context;
}

export type DialogProps = React.PropsWithChildren<{
  defaultOpen?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}>;
export type DialogTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};
export type DialogPortalProps = React.PropsWithChildren;
export type DialogCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};
export type DialogOverlayProps = React.HTMLAttributes<HTMLDivElement>;
export type DialogContentProps = React.HTMLAttributes<HTMLDivElement> & {
  accessibleTitle?: React.ReactNode;
  closeLabel?: string;
};
export type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>;
export type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
export type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

function Dialog({ children, defaultOpen = false, onOpenChange, open }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const reactId = React.useId();
  const titleId = `kui-dialog-title-${reactId}`;
  const descriptionId = `kui-dialog-description-${reactId}`;
  const contentId = `kui-dialog-content-${reactId}`;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);

      if (!nextOpen) {
        triggerRef.current?.focus();
        window.requestAnimationFrame(() => triggerRef.current?.focus());
      }
    },
    [onOpenChange, open]
  );

  const contextValue = React.useMemo(
    () => ({ contentId, descriptionId, open: isOpen, setOpen, titleId, triggerRef }),
    [contentId, descriptionId, isOpen, setOpen, titleId]
  );

  return <DialogContext.Provider value={contextValue}>{children}</DialogContext.Provider>;
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  function DialogTrigger({ asChild, children, onClick, type = 'button', ...props }, ref) {
    const context = useDialogContext('DialogTrigger');

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

function DialogPortal({ children }: DialogPortalProps) {
  return <>{children}</>;
}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  function DialogClose({ asChild, children, onClick, type = 'button', ...props }, ref) {
    const context = useDialogContext('DialogClose');
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

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-state="open"
      className={cn(
        'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      {...props}
    />
  )
);
DialogOverlay.displayName = 'DialogOverlay';

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, accessibleTitle = 'Dialog', closeLabel = 'Close', ...props }, ref) => {
    const context = useDialogContext('DialogContent');
    const needsHiddenTitle =
      !props['aria-label'] &&
      !props['aria-labelledby'] &&
      !hasAccessibleDialogChild(children, DialogTitle);
    const hasDescription = hasAccessibleDialogChild(children, DialogDescription);

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
      <DialogPortal>
        <DialogOverlay />
        <div
          ref={ref}
          id={context.contentId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={
            props['aria-label'] ? undefined : props['aria-labelledby'] ?? context.titleId
          }
          aria-describedby={
            props['aria-describedby'] ?? (hasDescription ? context.descriptionId : undefined)
          }
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
            className
          )}
          data-state="open"
          {...props}
        >
          {needsHiddenTitle ? (
            <DialogTitle className="sr-only">{accessibleTitle}</DialogTitle>
          ) : null}
          {children}
          <DialogClose asChild>
            <AstryxIconButton
              label={closeLabel}
              icon={<X aria-hidden="true" focusable="false" className="h-4 w-4" />}
              variant="ghost"
              size="sm"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            />
          </DialogClose>
        </div>
      </DialogPortal>
    );
  }
);
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: DialogFooterProps) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, id, ...props }, ref) => {
    const context = React.useContext(DialogContext);

    return (
      <h2
        ref={ref}
        id={id ?? context?.titleId}
        className={cn('text-lg font-semibold leading-none tracking-tight', className)}
        {...props}
      />
    );
  }
);
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, id, ...props }, ref) => {
    const context = React.useContext(DialogContext);

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
DialogDescription.displayName = 'DialogDescription';

function hasAccessibleDialogChild(children: React.ReactNode, target: React.ElementType): boolean {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) {
      return false;
    }

    return child.type === target || hasAccessibleDialogChild(child.props.children, target);
  });
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
