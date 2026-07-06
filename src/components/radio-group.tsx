"use client";

import * as React from "react";
import {
  RadioList as AstryxRadioList,
  RadioListItem as AstryxRadioListItem
} from "@astryxdesign/core/RadioList";

import { cn } from "../lib/cn";

type AstryxRadioListProps = React.ComponentPropsWithoutRef<
  typeof AstryxRadioList
>;
type AstryxRadioListItemProps = React.ComponentPropsWithoutRef<
  typeof AstryxRadioListItem
>;

export type RadioGroupProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
};

export type RadioGroupItemProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
};

const RadioGroupContext = React.createContext<{
  value: string;
  disabled?: boolean;
} | null>(null);

function getRadioGroupLabel({
  ariaLabel,
  title
}: {
  ariaLabel: RadioGroupProps["aria-label"];
  title: RadioGroupProps["title"];
}) {
  if (typeof ariaLabel === "string" && ariaLabel.trim().length > 0) {
    return ariaLabel;
  }

  if (typeof title === "string" && title.trim().length > 0) {
    return title;
  }

  return "Radio group";
}

function getRadioItemLabel({
  ariaLabel,
  children,
  title,
  value
}: {
  ariaLabel: RadioGroupItemProps["aria-label"];
  children: RadioGroupItemProps["children"];
  title: RadioGroupItemProps["title"];
  value: RadioGroupItemProps["value"];
}) {
  if (typeof ariaLabel === "string" && ariaLabel.trim().length > 0) {
    return ariaLabel;
  }

  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (typeof title === "string" && title.trim().length > 0) {
    return title;
  }

  return value;
}

function syncRadioChecked(root: HTMLDivElement | null, value: string) {
  if (!root) {
    return;
  }

  const input = root.querySelector<HTMLInputElement>('input[type="radio"]');
  input?.setAttribute("aria-checked", String(input.value === value));
}

function moveRadioSelection(event: React.KeyboardEvent<HTMLElement>) {
  if (!["ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp"].includes(event.key)) {
    return undefined;
  }

  const currentTarget = event.currentTarget as HTMLElement;
  const root =
    currentTarget.matches('[role="radiogroup"]')
      ? currentTarget
      : currentTarget.querySelector<HTMLElement>('[role="radiogroup"]') ??
        currentTarget.closest('[role="radiogroup"]');
  const items = Array.from(
    root?.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]:not(:disabled):not([aria-disabled="true"])'
    ) ?? []
  );

  if (items.length === 0) {
    return undefined;
  }

  const activeIndex = items.indexOf(document.activeElement as HTMLInputElement);
  const checkedIndex = items.findIndex((item) => item.checked);
  const currentIndex = activeIndex >= 0 ? activeIndex : Math.max(checkedIndex, 0);
  const delta = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
  const nextItem = items[(currentIndex + delta + items.length) % items.length];

  event.preventDefault();
  nextItem.focus();
  return nextItem.value;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      value,
      defaultValue = "",
      disabled,
      onKeyDown,
      onValueChange,
      orientation = "vertical",
      title,
      "aria-label": ariaLabel,
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] =
      React.useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : uncontrolledValue;

    return (
      <RadioGroupContext.Provider value={{ value: currentValue, disabled }}>
        <div
          onKeyDown={(event) => {
            onKeyDown?.(event as React.KeyboardEvent<HTMLDivElement>);
            const nextValue = moveRadioSelection(event);

            if (nextValue !== undefined && nextValue !== currentValue) {
              if (!isControlled) {
                setUncontrolledValue(nextValue);
              }
              onValueChange?.(nextValue);
            }
          }}
        >
          <AstryxRadioList
            ref={ref}
            label={getRadioGroupLabel({ ariaLabel, title })}
            isLabelHidden
            value={currentValue}
            onChange={(nextValue) => {
              if (!isControlled) {
                setUncontrolledValue(nextValue);
              }
              onValueChange?.(nextValue);
            }}
            orientation={orientation}
            isDisabled={disabled}
            className={cn("grid gap-2", className)}
            {...(props as Omit<
              AstryxRadioListProps,
              | "label"
              | "isLabelHidden"
              | "value"
              | "onChange"
              | "orientation"
              | "isDisabled"
              | "className"
            >)}
          >
            {children}
          </AstryxRadioList>
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<HTMLDivElement, RadioGroupItemProps>(
  (
    {
      className,
      value,
      disabled,
      children,
      title,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(RadioGroupContext);
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const setRootRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        syncRadioChecked(node, context?.value ?? "");
      },
      [context?.value, ref]
    );

    React.useLayoutEffect(() => {
      syncRadioChecked(rootRef.current, context?.value ?? "");
    }, [context?.value]);

    return (
      <AstryxRadioListItem
        ref={setRootRef}
        value={value}
        label={getRadioItemLabel({ ariaLabel, children, title, value })}
        isDisabled={disabled ?? context?.disabled}
        className={className}
        {...(props as Omit<
          AstryxRadioListItemProps,
          "value" | "label" | "isDisabled" | "className"
        >)}
      />
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
