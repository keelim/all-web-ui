"use client"

import * as React from "react"
import { Text as AstryxText } from "@astryxdesign/core/Text"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "../lib/cn"

const AstryxTextRuntime = AstryxText as unknown as React.ElementType

type SelectContextValue = {
  disabled?: boolean
  open: boolean
  selectedLabel?: React.ReactNode
  setOpen: (open: boolean) => void
  setSelectedLabel: (label: React.ReactNode) => void
  setValue: (value: string, label: React.ReactNode) => void
  value?: string
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

function useSelectContext(componentName: string) {
  const context = React.useContext(SelectContext)

  if (!context) {
    throw new Error(`${componentName} must be used inside Select`)
  }

  return context
}

function getTextLabel(children: React.ReactNode, fallback: string) {
  if (typeof children === "string" || typeof children === "number") {
    return String(children)
  }

  return fallback
}

export type SelectValueChangeHandler = {
  bivarianceHack(value: string): void
}["bivarianceHack"]

export type SelectProps = React.PropsWithChildren<{
  defaultOpen?: boolean
  defaultValue?: string
  disabled?: boolean
  name?: string
  onOpenChange?: (open: boolean) => void
  onValueChange?: SelectValueChangeHandler
  open?: boolean
  required?: boolean
  value?: string
}>
export type SelectGroupProps = React.HTMLAttributes<HTMLDivElement>
export type SelectValueProps = React.HTMLAttributes<HTMLSpanElement> & {
  placeholder?: React.ReactNode
}
export type SelectTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>
export type SelectScrollUpButtonProps = React.ButtonHTMLAttributes<HTMLDivElement>
export type SelectScrollDownButtonProps = React.ButtonHTMLAttributes<HTMLDivElement>
export type SelectContentProps = React.HTMLAttributes<HTMLDivElement> & {
  position?: "item-aligned" | "popper"
}
export type SelectLabelProps = React.HTMLAttributes<HTMLDivElement>
export type SelectItemProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> & {
  disabled?: boolean
  onSelect?: (event: Event) => void
  value: string
}
export type SelectSeparatorProps = React.HTMLAttributes<HTMLDivElement>

const Select = ({
  children,
  defaultOpen = false,
  defaultValue,
  disabled,
  onOpenChange,
  onValueChange,
  open,
  value,
}: SelectProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const [selectedLabel, setSelectedLabel] = React.useState<React.ReactNode>()
  const isOpen = open ?? uncontrolledOpen
  const selectedValue = value ?? uncontrolledValue

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) {
        setUncontrolledOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [onOpenChange, open]
  )

  const setValue = React.useCallback(
    (nextValue: string, nextLabel: React.ReactNode) => {
      if (value === undefined) {
        setUncontrolledValue(nextValue)
      }
      setSelectedLabel(nextLabel)
      onValueChange?.(nextValue)
      setOpen(false)
    },
    [onValueChange, setOpen, value]
  )

  const contextValue = React.useMemo(
    () => ({
      disabled,
      open: isOpen,
      selectedLabel,
      setOpen,
      setSelectedLabel,
      setValue,
      value: selectedValue,
    }),
    [disabled, isOpen, selectedLabel, selectedValue, setOpen, setValue]
  )

  return <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>
}

const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ className, ...props }, ref) => <div ref={ref} className={className} {...props} />
)
SelectGroup.displayName = "SelectGroup"

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder, ...props }, ref) => {
    const { selectedLabel, value } = useSelectContext("SelectValue")

    return (
    <AstryxTextRuntime ref={ref} as="span" {...props}>
      {selectedLabel ?? value ?? placeholder}
    </AstryxTextRuntime>
    )
  }
)
SelectValue.displayName = "SelectValue"

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, disabled, onClick, onKeyDown, type = "button", ...props }, ref) => {
    const context = useSelectContext("SelectTrigger")
    const isDisabled = disabled ?? context.disabled

    return (
      <button
        ref={ref}
        type={type}
        role="combobox"
        aria-expanded={context.open}
        aria-haspopup="listbox"
        disabled={isDisabled}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          className
        )}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(event)
          if (!event.defaultPrevented && !isDisabled) {
            context.setOpen(!context.open)
          }
        }}
      onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => {
          onKeyDown?.(event)
          if (event.defaultPrevented || isDisabled) {
            return
          }

          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            context.setOpen(true)
          } else if (event.key === "Escape") {
            context.setOpen(false)
          }
        }}
        {...props}
      >
        {children}
        <ChevronDown aria-hidden="true" focusable="false" className="h-4 w-4 opacity-50" />
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

const SelectScrollUpButton = React.forwardRef<
  HTMLDivElement,
  SelectScrollUpButtonProps
>(({ className, "aria-label": ariaLabel = "Scroll options up", ...props }, ref) => (
  <div
    ref={ref}
    aria-label={ariaLabel}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp aria-hidden="true" focusable="false" className="h-4 w-4" />
  </div>
))
SelectScrollUpButton.displayName = "SelectScrollUpButton"

const SelectScrollDownButton = React.forwardRef<
  HTMLDivElement,
  SelectScrollDownButtonProps
>(({ className, "aria-label": ariaLabel = "Scroll options down", ...props }, ref) => (
  <div
    ref={ref}
    aria-label={ariaLabel}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown aria-hidden="true" focusable="false" className="h-4 w-4" />
  </div>
))
SelectScrollDownButton.displayName = "SelectScrollDownButton"

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, position = "popper", ...props }, ref) => {
    const { open } = useSelectContext("SelectContent")

    if (!open) {
      return null
    }

    return (
      <div
        ref={ref}
        role="listbox"
        data-state="open"
        data-position={position}
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-32 overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <div
          className={cn(
            "p-1",
            position === "popper" &&
              "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)"
          )}
        >
          {children}
        </div>
        <SelectScrollDownButton />
      </div>
    )
  }
)
SelectContent.displayName = "SelectContent"

const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, ...props }, ref) => (
    <AstryxTextRuntime
      ref={ref}
      as="div"
      className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
      {...props}
    />
  )
)
SelectLabel.displayName = "SelectLabel"

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, disabled, onClick, onKeyDown, onSelect, value, ...props }, ref) => {
    const context = useSelectContext("SelectItem")
    const isSelected = context.value === value
    const label = getTextLabel(children, value)

    React.useEffect(() => {
      if (isSelected) {
        context.setSelectedLabel(children)
      }
    }, [children, context, isSelected])

    const commitSelection = (nativeEvent: Event) => {
      if (disabled) {
        return
      }

      onSelect?.(nativeEvent)
      context.setValue(value, children)
    }

    return (
    <AstryxTextRuntime
      ref={ref}
      as="div"
      role="option"
        aria-disabled={disabled ? "true" : undefined}
        aria-selected={isSelected}
        tabIndex={disabled ? undefined : -1}
        className={cn(
          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground focus:ring-2 focus:ring-ring focus:ring-offset-1 data-disabled:pointer-events-none data-disabled:opacity-50",
          disabled && "pointer-events-none opacity-50",
          className
        )}
        data-disabled={disabled ? "" : undefined}
      onClick={(event: React.MouseEvent<HTMLDivElement>) => {
          onClick?.(event)
          if (!event.defaultPrevented) {
            commitSelection(event.nativeEvent)
          }
        }}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
          onKeyDown?.(event)
          if (event.defaultPrevented) {
            return
          }

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            commitSelection(event.nativeEvent)
          }
        }}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {isSelected ? <Check aria-hidden="true" focusable="false" className="h-4 w-4" /> : null}
        </span>
        {children ?? label}
    </AstryxTextRuntime>
    )
  }
)
SelectItem.displayName = "SelectItem"

const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
  )
)
SelectSeparator.displayName = "SelectSeparator"

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
