"use client";

import * as React from "react";
import { Switch as AstryxSwitch } from "@astryxdesign/core/Switch";

import { cn } from "../lib/cn";

type AstryxSwitchProps = React.ComponentPropsWithoutRef<typeof AstryxSwitch>;

export type SwitchProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "checked" | "defaultChecked" | "onChange" | "value" | "role" | "children"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: React.ReactNode;
};

function getSwitchLabel({
  ariaLabel,
  children,
  title
}: {
  ariaLabel: SwitchProps["aria-label"];
  children: SwitchProps["children"];
  title: SwitchProps["title"];
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

  return "Switch";
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

function syncSwitchState(input: HTMLInputElement | null, checked: boolean) {
  if (!input) {
    return;
  }

  input.setAttribute("aria-checked", String(checked));
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      checked,
      defaultChecked = false,
      disabled,
      onClick,
      onCheckedChange,
      children,
      title,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const [uncontrolledChecked, setUncontrolledChecked] =
      React.useState(defaultChecked);
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : uncontrolledChecked;
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const ignoreNextChangeRef = React.useRef(false);
    const setInputRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        setForwardedRef(ref, node);
        syncSwitchState(node, isChecked);
      },
      [ref, isChecked]
    );

    React.useLayoutEffect(() => {
      syncSwitchState(inputRef.current, isChecked);
    }, [isChecked]);

    return (
      <div
        onClickCapture={(event) => {
          onClick?.(event as unknown as React.MouseEvent<HTMLInputElement>);
          ignoreNextChangeRef.current = event.defaultPrevented;
        }}
      >
        <AstryxSwitch
          ref={setInputRef}
          label={getSwitchLabel({ ariaLabel, children, title })}
          isLabelHidden={
            typeof children !== "string" && typeof children !== "number"
          }
          value={isChecked}
          isDisabled={disabled}
          className={cn(
            "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center",
            className
          )}
          onChange={(nextChecked) => {
            if (ignoreNextChangeRef.current) {
              ignoreNextChangeRef.current = false;
              syncSwitchState(inputRef.current, isChecked);
              return;
            }

            if (!isControlled) {
              setUncontrolledChecked(nextChecked);
            }
            onCheckedChange?.(nextChecked);
          }}
          {...(props as Omit<
            AstryxSwitchProps,
            | "label"
            | "isLabelHidden"
            | "value"
            | "isDisabled"
            | "className"
            | "onChange"
          >)}
        />
      </div>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
