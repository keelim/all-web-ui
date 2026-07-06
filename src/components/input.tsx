"use client";

import * as React from "react";
import { TextInput as AstryxTextInput } from "@astryxdesign/core/TextInput";

import { cn } from "../lib/cn";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "children"
> & {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const astryxInputTypes = new Set(["text", "password", "email"]);

function toInputValue(value: InputProps["value"] | InputProps["defaultValue"]) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value == null ? "" : String(value);
}

function getInputLabel({
  ariaLabel,
  placeholder,
  title
}: {
  ariaLabel: InputProps["aria-label"];
  placeholder: InputProps["placeholder"];
  title: InputProps["title"];
}) {
  if (typeof ariaLabel === "string" && ariaLabel.trim().length > 0) {
    return ariaLabel;
  }

  if (typeof title === "string" && title.trim().length > 0) {
    return title;
  }

  if (typeof placeholder === "string" && placeholder.trim().length > 0) {
    return placeholder;
  }

  return "Input";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      className,
      value,
      defaultValue,
      disabled,
      required,
      name,
      autoFocus,
      onChange,
      placeholder,
      size,
      type = "text",
    title,
    "aria-label": ariaLabel,
    readOnly,
    id,
    ...props
  },
    ref
  ) {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      toInputValue(defaultValue)
    );
    const isControlled = value !== undefined;
    const astryxType =
      type === "password" ? "password" : type === "email" ? "email" : "text";

    if (id || !astryxInputTypes.has(type) || readOnly) {
      return (
        <input
          ref={ref}
          id={id}
          className={cn("kui-input", className)}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          name={name}
          autoFocus={autoFocus}
          onChange={onChange}
          placeholder={placeholder}
          size={size}
          type={type}
          title={title}
          aria-label={ariaLabel}
          readOnly={readOnly}
          {...props}
        />
      );
    }

    return (
      <AstryxTextInput
        ref={ref}
        label={getInputLabel({ ariaLabel, placeholder, title })}
        isLabelHidden
        value={isControlled ? toInputValue(value) : uncontrolledValue}
        isDisabled={disabled}
        isRequired={required}
        hasAutoFocus={autoFocus}
        htmlName={name}
        onChange={(nextValue, event) => {
          if (!isControlled) {
            setUncontrolledValue(nextValue);
          }
          onChange?.(event);
        }}
        placeholder={placeholder}
        type={astryxType}
        className={cn("kui-input", className)}
        {...props}
      />
    );
  }
);
