"use client"

import * as React from "react"

import { cn } from "../lib/cn"
import { buttonVariants } from "./button"

type AlertDialogContextValue = {
  descriptionId: string
  open: boolean
  setOpen: (open: boolean) => void
  titleId: string
  triggerRef: React.MutableRefObject<HTMLElement | null>
}

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(null)

function useAlertDialogContext(componentName: string) {
  const context = React.useContext(AlertDialogContext)

  if (!context) {
    throw new Error(`${componentName} must be used inside AlertDialog`)
  }

  return context
}

type AlertDialogButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
}

const AlertDialog = ({
  children,
  defaultOpen = false,
  onOpenChange,
  open,
}: React.PropsWithChildren<{
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}>) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isOpen = open ?? uncontrolledOpen
  const triggerRef = React.useRef<HTMLElement | null>(null)
  const reactId = React.useId()
  const titleId = `kui-alert-dialog-title-${reactId}`
  const descriptionId = `kui-alert-dialog-description-${reactId}`

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) {
        setUncontrolledOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)

      if (!nextOpen) {
        triggerRef.current?.focus()
      }
    },
    [onOpenChange, open]
  )

  const contextValue = React.useMemo(
    () => ({ descriptionId, open: isOpen, setOpen, titleId, triggerRef }),
    [descriptionId, isOpen, setOpen, titleId]
  )

  return <AlertDialogContext.Provider value={contextValue}>{children}</AlertDialogContext.Provider>
}

const AlertDialogTrigger = React.forwardRef<HTMLButtonElement, AlertDialogButtonProps>(
  ({ asChild, children, onClick, type = "button", ...props }, ref) => {
    const context = useAlertDialogContext("AlertDialogTrigger")

    const setRefs = (node: HTMLButtonElement | null) => {
      context.triggerRef.current = node
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }

    const triggerProps = {
      "aria-expanded": context.open,
      "aria-haspopup": "dialog" as const,
      "aria-hidden": context.open ? true : undefined,
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          context.setOpen(true)
        }
      },
    }

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement

      return React.cloneElement(child as React.ReactElement<any>, {
        ...props,
        ...triggerProps,
        ref: setRefs,
      } as any)
    }

    return (
      <button ref={setRefs} type={type} {...props} {...triggerProps}>
        {children}
      </button>
    )
  }
)
AlertDialogTrigger.displayName = "AlertDialogTrigger"

function AlertDialogPortal({ children }: React.PropsWithChildren) {
  return <>{children}</>
}

export type AlertDialogProps = React.ComponentPropsWithoutRef<typeof AlertDialog>
export type AlertDialogTriggerProps = React.ComponentPropsWithoutRef<typeof AlertDialogTrigger>
export type AlertDialogPortalProps = React.ComponentPropsWithoutRef<typeof AlertDialogPortal>
export type AlertDialogOverlayProps = React.HTMLAttributes<HTMLDivElement>
export type AlertDialogContentProps = React.HTMLAttributes<HTMLDivElement> & {
  accessibleTitle?: React.ReactNode
  accessibleDescription?: React.ReactNode
}
export type AlertDialogHeaderProps = React.HTMLAttributes<HTMLDivElement>
export type AlertDialogFooterProps = React.HTMLAttributes<HTMLDivElement>
export type AlertDialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>
export type AlertDialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>
export type AlertDialogActionProps = AlertDialogButtonProps
export type AlertDialogCancelProps = AlertDialogButtonProps

const AlertDialogOverlay = React.forwardRef<HTMLDivElement, AlertDialogOverlayProps>(
  ({ className, ...props }, ref) => (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      data-state="open"
      {...props}
      ref={ref}
    />
  )
)
AlertDialogOverlay.displayName = "AlertDialogOverlay"

const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  (
    {
      className,
      children,
      accessibleTitle = "Alert dialog",
      accessibleDescription = "Review this message before choosing an action.",
      ...props
    },
    ref
  ) => {
    const context = useAlertDialogContext("AlertDialogContent")
    const needsHiddenTitle =
      !props["aria-label"] &&
      !props["aria-labelledby"] &&
      !hasAccessibleAlertDialogChild(children, AlertDialogTitle)
    const needsHiddenDescription =
      !props["aria-describedby"] && !hasAccessibleAlertDialogChild(children, AlertDialogDescription)

    React.useEffect(() => {
      if (!context.open) {
        return
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          context.setOpen(false)
        }
      }

      document.addEventListener("keydown", handleKeyDown)

      return () => {
        document.removeEventListener("keydown", handleKeyDown)
      }
    }, [context])

    React.useLayoutEffect(() => {
      if (!context.open) {
        return
      }

      document.querySelector<HTMLElement>("[data-alert-dialog-cancel]")?.focus()
    }, [context.open])

    if (!context.open) {
      return null
    }

    return (
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <div
          ref={ref}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={
            props["aria-label"] ? undefined : props["aria-labelledby"] ?? context.titleId
          }
          aria-describedby={props["aria-describedby"] ?? context.descriptionId}
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
            className
          )}
          data-state="open"
          {...props}
        >
          {needsHiddenTitle ? (
            <AlertDialogTitle className="sr-only">{accessibleTitle}</AlertDialogTitle>
          ) : null}
          {needsHiddenDescription ? (
            <AlertDialogDescription className="sr-only">
              {accessibleDescription}
            </AlertDialogDescription>
          ) : null}
          {children}
        </div>
      </AlertDialogPortal>
    )
  }
)
AlertDialogContent.displayName = "AlertDialogContent"

const AlertDialogHeader = ({ className, ...props }: AlertDialogHeaderProps) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({ className, ...props }: AlertDialogFooterProps) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
  ({ className, id, ...props }, ref) => {
    const context = React.useContext(AlertDialogContext)

    return (
      <h2 ref={ref} id={id ?? context?.titleId} className={cn("text-lg font-semibold", className)} {...props} />
    )
  }
)
AlertDialogTitle.displayName = "AlertDialogTitle"

const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  AlertDialogDescriptionProps
>(({ className, id, ...props }, ref) => {
  const context = React.useContext(AlertDialogContext)

  return (
    <p
      ref={ref}
      id={id ?? context?.descriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
AlertDialogDescription.displayName = "AlertDialogDescription"

const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ asChild, className, children, onClick, type = "button", ...props }, ref) => {
    const context = useAlertDialogContext("AlertDialogAction")
    const actionProps = {
      className: cn(buttonVariants(), className),
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          context.setOpen(false)
        }
      },
    }

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{ className?: string }>

      return React.cloneElement(child as React.ReactElement<any>, {
        ...props,
        ...actionProps,
        className: cn(actionProps.className, child.props.className),
        ref,
      } as any)
    }

    return (
      <button ref={ref} type={type} {...props} {...actionProps}>
        {children}
      </button>
    )
  }
)
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  ({ asChild, className, children, onClick, type = "button", ...props }, ref) => {
    const context = useAlertDialogContext("AlertDialogCancel")
    const cancelProps = {
      className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
      "data-alert-dialog-cancel": "",
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          context.setOpen(false)
        }
      },
    }

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{ className?: string }>

      return React.cloneElement(child as React.ReactElement<any>, {
        ...props,
        ...cancelProps,
        className: cn(cancelProps.className, child.props.className),
        ref,
      } as any)
    }

    return (
      <button ref={ref} type={type} {...props} {...cancelProps}>
        {children}
      </button>
    )
  }
)
AlertDialogCancel.displayName = "AlertDialogCancel"

function hasAccessibleAlertDialogChild(children: React.ReactNode, target: React.ElementType): boolean {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) {
      return false
    }

    return child.type === target || hasAccessibleAlertDialogChild(child.props.children, target)
  })
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
