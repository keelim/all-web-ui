'use client';

import * as React from 'react';
import { Check, ChevronRight, Circle } from 'lucide-react';

import { cn } from '../lib/cn';

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

type DropdownMenuRadioGroupContextValue = {
  onValueChange?: (value: string) => void;
  value?: string;
};

type DropdownMenuSubContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);
const DropdownMenuRadioGroupContext =
  React.createContext<DropdownMenuRadioGroupContextValue | null>(null);
const DropdownMenuSubContext = React.createContext<DropdownMenuSubContextValue | null>(null);

function useDropdownMenuContext(componentName: string) {
  const context = React.useContext(DropdownMenuContext);

  if (!context) {
    throw new Error(`${componentName} must be used inside DropdownMenu`);
  }

  return context;
}

function useDropdownMenuSubContext(componentName: string) {
  const context = React.useContext(DropdownMenuSubContext);

  if (!context) {
    throw new Error(`${componentName} must be used inside DropdownMenuSub`);
  }

  return context;
}

function focusMenuItem(currentTarget: HTMLElement, direction: 'first' | 'next' | 'previous') {
  const menu = currentTarget.closest('[role="menu"]') ?? document.querySelector('[role="menu"]');
  const items = Array.from(
    menu?.querySelectorAll<HTMLElement>(
      '[role^="menuitem"]:not([aria-disabled="true"]):not([disabled])'
    ) ?? []
  );

  if (items.length === 0) {
    return;
  }

  const currentIndex = items.indexOf(currentTarget);
  const nextIndex =
    direction === 'first'
      ? 0
      : direction === 'next'
        ? (Math.max(currentIndex, 0) + 1) % items.length
        : (currentIndex - 1 + items.length) % items.length;

  items[nextIndex]?.focus();
}

export type DropdownMenuProps = React.PropsWithChildren<{
  defaultOpen?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}>;
export type DropdownMenuTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};
export type DropdownMenuGroupProps = React.HTMLAttributes<HTMLDivElement>;
export type DropdownMenuPortalProps = React.PropsWithChildren;
export type DropdownMenuSubProps = React.PropsWithChildren<{
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}>;
export type DropdownMenuRadioGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  onValueChange?: (value: string) => void;
  value?: string;
};
export type DropdownMenuSubTriggerProps = React.HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean;
  inset?: boolean;
};
export type DropdownMenuSubContentProps = React.HTMLAttributes<HTMLDivElement>;
export type DropdownMenuContentProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: 'center' | 'end' | 'start';
  sideOffset?: number;
};
export type DropdownMenuItemProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> & {
  disabled?: boolean;
  inset?: boolean;
  onSelect?: (event: Event) => void;
};
export type DropdownMenuCheckboxItemProps = DropdownMenuItemProps & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};
export type DropdownMenuRadioItemProps = DropdownMenuItemProps & {
  value: string;
};
export type DropdownMenuLabelProps = React.HTMLAttributes<HTMLDivElement> & { inset?: boolean };
export type DropdownMenuSeparatorProps = React.HTMLAttributes<HTMLDivElement>;
export type DropdownMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>;

export function DropdownMenu({
  children,
  defaultOpen = false,
  onOpenChange,
  open,
}: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [onOpenChange, open]
  );

  return (
    <DropdownMenuContext.Provider value={{ open: isOpen, setOpen }}>
      {children}
    </DropdownMenuContext.Provider>
  );
}

export const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(function DropdownMenuTrigger(
  { asChild, children, className, onClick, onKeyDown, onPointerDown, type = 'button', ...props },
  ref
) {
  const context = useDropdownMenuContext('DropdownMenuTrigger');

  const triggerProps = {
    'aria-expanded': context.open,
    'aria-haspopup': 'menu' as const,
    className,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        context.setOpen(true);
      }
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) {
        return;
      }

      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        context.setOpen(true);
        focusMenuItem(event.currentTarget, 'first');
      } else if (event.key === 'Escape') {
        context.setOpen(false);
      }
    },
    onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(event);
      if (!event.defaultPrevented) {
        context.setOpen(true);
      }
    },
  };

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<{ className?: string }>;

    return React.cloneElement(child as React.ReactElement<any>, {
      ...props,
      ...triggerProps,
      className: cn(child.props.className, className),
      ref,
    } as any);
  }

  return (
    <button ref={ref} type={type} {...props} {...triggerProps}>
      {children}
    </button>
  );
});

export const DropdownMenuGroup = React.forwardRef<HTMLDivElement, DropdownMenuGroupProps>(
  function DropdownMenuGroup(props, ref) {
    return <div ref={ref} role="group" {...props} />;
  }
);

export function DropdownMenuPortal({ children }: DropdownMenuPortalProps) {
  return <>{children}</>;
}

export function DropdownMenuSub({ children, defaultOpen = false, onOpenChange, open }: DropdownMenuSubProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [onOpenChange, open]
  );

  return (
    <DropdownMenuSubContext.Provider value={{ open: isOpen, setOpen }}>
      {children}
    </DropdownMenuSubContext.Provider>
  );
}

export function DropdownMenuRadioGroup({
  children,
  onValueChange,
  value,
  ...props
}: DropdownMenuRadioGroupProps) {
  return (
    <DropdownMenuRadioGroupContext.Provider value={{ onValueChange, value }}>
      <div role="group" {...props}>
        {children}
      </div>
    </DropdownMenuRadioGroupContext.Provider>
  );
}

export const DropdownMenuSubTrigger = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSubTriggerProps
>(function DropdownMenuSubTrigger(
  { className, disabled, inset, children, onClick, onKeyDown, ...props },
  ref
) {
  const context = useDropdownMenuSubContext('DropdownMenuSubTrigger');

  return (
    <div
      ref={ref}
      role="menuitem"
      aria-disabled={disabled ? 'true' : undefined}
      aria-haspopup="menu"
      data-state={context.open ? 'open' : 'closed'}
      tabIndex={disabled ? undefined : -1}
      className={cn(
        'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:ring-2 focus:ring-ring focus:ring-offset-1 data-[state=open]:bg-accent',
        inset && 'pl-8',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) {
          context.setOpen(true);
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || disabled) {
          return;
        }

        if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          context.setOpen(true);
        }
      }}
      {...props}
    >
      {children}
      <ChevronRight aria-hidden="true" focusable="false" className="ml-auto h-4 w-4" />
    </div>
  );
});

export const DropdownMenuSubContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSubContentProps
>(function DropdownMenuSubContent({ className, ...props }, ref) {
  const context = useDropdownMenuSubContext('DropdownMenuSubContent');

  if (!context.open) {
    return null;
  }

  return (
    <div
      ref={ref}
      role="menu"
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg',
        className
      )}
      {...props}
    />
  );
});

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(function DropdownMenuContent(
  { className, onKeyDown, sideOffset: _sideOffset = 4, ...props },
  ref
) {
  const context = useDropdownMenuContext('DropdownMenuContent');
  const localRef = React.useRef<HTMLDivElement | null>(null);

  React.useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

  React.useEffect(() => {
    localRef.current?.focus();

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.key !== 'ArrowDown') {
        return;
      }

      const menu = localRef.current;
      if (!menu || menu.contains(document.activeElement)) {
        return;
      }

      event.preventDefault();
      focusMenuItem(menu, 'first');
    };

    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, []);

  if (!context.open) {
    return null;
  }

  return (
    <div
      ref={localRef}
      role="menu"
      tabIndex={-1}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        className
      )}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) {
          return;
        }

        if (event.key === 'ArrowDown') {
          event.preventDefault();
          focusMenuItem(event.currentTarget, 'first');
        } else if (event.key === 'Escape') {
          context.setOpen(false);
        }
      }}
      {...props}
    />
  );
});

export const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function DropdownMenuItem({ className, disabled, inset, onClick, onKeyDown, onSelect, ...props }, ref) {
    const context = useDropdownMenuContext('DropdownMenuItem');

    const selectItem = (event: Event) => {
      if (disabled) {
        return;
      }

      onSelect?.(event);
      context.setOpen(false);
    };

    return (
      <div
        ref={ref}
        role="menuitem"
        aria-disabled={disabled ? 'true' : undefined}
        tabIndex={disabled ? undefined : -1}
        className={cn(
          'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground focus:ring-2 focus:ring-ring focus:ring-offset-1 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          inset && 'pl-8',
          disabled && 'pointer-events-none opacity-50',
          className
        )}
        data-disabled={disabled ? '' : undefined}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            selectItem(event.nativeEvent);
          }
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) {
            return;
          }

          if (event.key === 'ArrowDown') {
            event.preventDefault();
            focusMenuItem(event.currentTarget, 'next');
          } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            focusMenuItem(event.currentTarget, 'previous');
          } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectItem(event.nativeEvent);
          }
        }}
        {...props}
      />
    );
  }
);

export const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuCheckboxItemProps
>(function DropdownMenuCheckboxItem(
  { className, children, checked = false, disabled, onCheckedChange, onClick, ...props },
  ref
) {
  return (
    <DropdownMenuItem
      ref={ref}
      role="menuitemcheckbox"
      aria-checked={checked}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground focus:ring-2 focus:ring-ring focus:ring-offset-1 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) {
          onCheckedChange?.(!checked);
        }
      }}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked ? <Check aria-hidden="true" focusable="false" className="h-4 w-4" /> : null}
      </span>
      {children}
    </DropdownMenuItem>
  );
});

export const DropdownMenuRadioItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuRadioItemProps
>(function DropdownMenuRadioItem({ className, children, disabled, onClick, value, ...props }, ref) {
  const radioContext = React.useContext(DropdownMenuRadioGroupContext);
  const checked = radioContext?.value === value;

  return (
    <DropdownMenuItem
      ref={ref}
      role="menuitemradio"
      aria-checked={checked}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground focus:ring-2 focus:ring-ring focus:ring-offset-1 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) {
          radioContext?.onValueChange?.(value);
        }
      }}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked ? (
          <Circle aria-hidden="true" focusable="false" className="h-2 w-2 fill-current" />
        ) : null}
      </span>
      {children}
    </DropdownMenuItem>
  );
});

export const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  function DropdownMenuLabel({ className, inset, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
        {...props}
      />
    );
  }
);

export const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps
>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return <div ref={ref} role="separator" className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />;
});

export function DropdownMenuShortcut({ className, ...props }: DropdownMenuShortcutProps) {
  return <span className={cn('ml-auto text-xs tracking-widest opacity-60', className)} {...props} />;
}
