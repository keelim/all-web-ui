"use client"

import * as React from "react"
import { Toast as AstryxToast } from "@astryxdesign/core/Toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "../lib/cn"

type ToastProviderProps = React.PropsWithChildren<{
  duration?: number
  label?: string
  swipeDirection?: "up" | "down" | "left" | "right"
  swipeThreshold?: number
}>

const ToastProvider = ({ children }: ToastProviderProps) => <>{children}</>
ToastProvider.displayName = "ToastProvider"

const ToastViewport = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    role="list"
    className={cn(
      "fixed top-0 z-100 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = "ToastViewport"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-(--radix-toast-swipe-end-x) data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full sm:data-[state=open]:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type ToastRootProps = Omit<React.HTMLAttributes<HTMLLIElement>, "onChange"> &
  VariantProps<typeof toastVariants> & {
    defaultOpen?: boolean
    duration?: number
    forceMount?: boolean
    onOpenChange?: (open: boolean) => void
    open?: boolean
  }

type ToastCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  onToastClose?: () => void
}

function isToastElement(
  child: React.ReactNode,
  component: React.ComponentType<any>
): child is React.ReactElement {
  return React.isValidElement(child) && child.type === component
}

function normalizeToastType(variant: VariantProps<typeof toastVariants>["variant"]) {
  return variant === "destructive" ? "error" : "info"
}

function ensureMatchMedia() {
  if (typeof window === "undefined") {
    return
  }

  const targetWindow = window as Omit<Window, "matchMedia"> & {
    matchMedia?: Window["matchMedia"]
  }
  if (targetWindow.matchMedia) {
    return
  }

  targetWindow.matchMedia = () => ({
    addEventListener: () => undefined,
    addListener: () => undefined,
    dispatchEvent: () => false,
    matches: false,
    media: "",
    onchange: null,
    removeEventListener: () => undefined,
    removeListener: () => undefined,
  })
}

const Toast = React.forwardRef<HTMLLIElement, ToastRootProps>(
  (
    {
      children,
      className,
      defaultOpen = true,
      duration = 5000,
      forceMount,
      onOpenChange,
      open,
      variant,
      ...props
    },
    ref
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
    const rootRef = React.useRef<HTMLLIElement | null>(null)
    const isOpen = open ?? uncontrolledOpen

    React.useImperativeHandle(ref, () => rootRef.current as HTMLLIElement)

    const dismiss = React.useCallback(() => {
      if (open === undefined) {
        setUncontrolledOpen(false)
      }
      onOpenChange?.(false)
    }, [onOpenChange, open])

    React.useLayoutEffect(() => {
      const root = rootRef.current
      if (!root) {
        return
      }

      const defaultCloseButtons = root.querySelectorAll<HTMLButtonElement>(
        'button[aria-label="Dismiss notification"]'
      )
      const astryxCloseButton = defaultCloseButtons.item(defaultCloseButtons.length - 1)

      if (!astryxCloseButton) {
        return
      }

      astryxCloseButton.setAttribute("aria-hidden", "true")
      astryxCloseButton.setAttribute("tabindex", "-1")
    })

    if (!isOpen && !forceMount) {
      return null
    }

    ensureMatchMedia()

    const content: React.ReactNode[] = []
    const controls: React.ReactNode[] = []

    React.Children.toArray(children).forEach((child) => {
      if (isToastElement(child, ToastAction) || isToastElement(child, ToastClose)) {
        controls.push(
          isToastElement(child, ToastClose)
            ? React.cloneElement(child as React.ReactElement<ToastCloseProps>, {
                onToastClose: dismiss,
              })
            : child
        )
        return
      }

      content.push(child)
    })

    return (
      <li
        ref={rootRef}
        role="listitem"
        data-state={isOpen ? "open" : "closed"}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        <AstryxToast
          type={normalizeToastType(variant)}
          body={<div className="grid gap-1">{content}</div>}
          endContent={
            controls.length > 0 ? (
              <div className="flex items-center gap-2">{controls}</div>
            ) : undefined
          }
          isAutoHide={false}
          autoHideDuration={duration}
          onDismiss={dismiss}
        />
      </li>
    )
  }
)
Toast.displayName = "Toast"

const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { altText?: string; asChild?: boolean }
>(({ altText: _altText, asChild, children, className, type = "button", ...props }, ref) => {
  const mergedClassName = cn(
    "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 hover:group-[.destructive]:border-destructive/30 hover:group-[.destructive]:bg-destructive hover:group-[.destructive]:text-destructive-foreground focus:group-[.destructive]:ring-destructive",
    className
  )

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<{ className?: string }>

    return React.cloneElement(child as React.ReactElement<any>, {
      ...props,
      className: cn(mergedClassName, child.props.className),
      ref,
    } as any)
  }

  return (
    <button ref={ref} type={type} className={mergedClassName} {...props}>
      {children}
    </button>
  )
})
ToastAction.displayName = "ToastAction"

const ToastClose = React.forwardRef<
  HTMLButtonElement,
  ToastCloseProps
>(
  (
    {
      className,
      "aria-label": ariaLabel = "Dismiss notification",
      onClick,
      onToastClose,
      type = "button",
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      className={cn(
        "absolute right-2 top-2 rounded-md p-1 text-foreground/60 opacity-100 transition-opacity hover:text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring group-[.destructive]:text-destructive-foreground hover:group-[.destructive]:text-destructive-foreground focus:group-[.destructive]:ring-destructive-foreground focus:group-[.destructive]:ring-offset-destructive",
        className
      )}
      toast-close=""
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          onToastClose?.()
        }
      }}
      {...props}
    >
      <X aria-hidden="true" focusable="false" className="h-4 w-4" />
    </button>
  )
)
ToastClose.displayName = "ToastClose"

const ToastTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
))
ToastDescription.displayName = "ToastDescription"

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  toastVariants,
}
