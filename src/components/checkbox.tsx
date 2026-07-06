"use client";

import * as React from "react";
import { CheckboxInput as AstryxCheckboxInput } from "@astryxdesign/core/CheckboxInput";

import { cn } from "../lib/cn";

type AstryxCheckboxProps = React.ComponentPropsWithoutRef<
  typeof AstryxCheckboxInput
>;

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "checked" | "defaultChecked" | "onChange" | "value" | "children"
> & {
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  children?: React.ReactNode;
};

function getCheckboxLabel({
  ariaLabel,
  children,
  title
}: {
  ariaLabel: CheckboxProps["aria-label"];
  children: CheckboxProps["children"];
  title: CheckboxProps["title"];
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

  return "Checkbox";
}

function setForwardedRef<T>(
  ref: React.ForwardedRef<T>,
  value: T | null
) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

function syncCheckboxState(
  input: HTMLInputElement | null,
  value: boolean | "indeterminate"
) {
  if (!input) {
    return;
  }

  input.indeterminate = value === "indeterminate";
  input.setAttribute(
    "aria-checked",
    value === "indeterminate" ? "mixed" : String(value)
  );
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checked,
      defaultChecked = false,
      disabled,
      onCheckedChange,
      children,
      title,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState<
      boolean | "indeterminate"
    >(defaultChecked);
    const isControlled = checked !== undefined;
    const value = isControlled ? checked : uncontrolledChecked;
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const setInputRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        setForwardedRef(ref, node);
        syncCheckboxState(node, value);
      },
      [ref, value]
    );

    React.useLayoutEffect(() => {
      syncCheckboxState(inputRef.current, value);
    }, [value]);

    return (
      <AstryxCheckboxInput
        ref={setInputRef}
        label={getCheckboxLabel({ ariaLabel, children, title })}
        isLabelHidden={typeof children !== "string" && typeof children !== "number"}
        value={value}
        isDisabled={disabled}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-primary",
          className
        )}
        onChange={(nextChecked) => {
          if (!isControlled) {
            setUncontrolledChecked(nextChecked);
          }
          onCheckedChange?.(nextChecked);
        }}
        {...(props as Omit<
          AstryxCheckboxProps,
          | "label"
          | "isLabelHidden"
          | "value"
          | "isDisabled"
          | "className"
          | "onChange"
        >)}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
