"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "../lib/cn"
import { buttonVariants } from "./button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

export type AlertDialogProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root>
export type AlertDialogTriggerProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>
export type AlertDialogPortalProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Portal>
export type AlertDialogOverlayProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
export type AlertDialogContentProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> & {
  accessibleTitle?: React.ReactNode
  accessibleDescription?: React.ReactNode
}
export type AlertDialogHeaderProps = React.HTMLAttributes<HTMLDivElement>
export type AlertDialogFooterProps = React.HTMLAttributes<HTMLDivElement>
export type AlertDialogTitleProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
export type AlertDialogDescriptionProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
export type AlertDialogActionProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
export type AlertDialogCancelProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  AlertDialogOverlayProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(({ className, children, accessibleTitle = "Alert dialog", accessibleDescription = "Review this message before choosing an action.", ...props }, ref) => {
  const needsHiddenTitle =
    !props["aria-label"] &&
    !props["aria-labelledby"] &&
    !hasAccessibleAlertDialogChild(children, AlertDialogTitle)
  const needsHiddenDescription =
    !props["aria-describedby"] &&
    !hasAccessibleAlertDialogChild(children, AlertDialogDescription)

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        {...props}
      >
        {needsHiddenTitle ? <AlertDialogTitle className="sr-only">{accessibleTitle}</AlertDialogTitle> : null}
        {needsHiddenDescription ? (
          <AlertDialogDescription className="sr-only">{accessibleDescription}</AlertDialogDescription>
        ) : null}
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  )
})
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: AlertDialogHeaderProps) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: AlertDialogFooterProps) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  AlertDialogTitleProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  AlertDialogDescriptionProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  AlertDialogActionProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  AlertDialogCancelProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

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
