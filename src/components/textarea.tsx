"use client";

import * as React from "react";
import { TextArea as AstryxTextArea } from "@astryxdesign/core/TextArea";

import { cn } from "../lib/cn";

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

function toTextareaValue(value: TextareaProps["value"] | TextareaProps["defaultValue"]) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value == null ? "" : String(value);
}

function getTextareaLabel({
  ariaLabel,
  placeholder,
  title
}: {
  ariaLabel: TextareaProps["aria-label"];
  placeholder: TextareaProps["placeholder"];
  title: TextareaProps["title"];
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

  return "Textarea";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
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
      rows,
      title,
      "aria-label": ariaLabel,
      readOnly,
      spellCheck,
      ...props
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      toTextareaValue(defaultValue)
    );
    const isControlled = value !== undefined;
    const hasSpellCheck =
      spellCheck === undefined
        ? undefined
        : spellCheck === true || spellCheck === "true";

    if (readOnly) {
      return (
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          name={name}
          autoFocus={autoFocus}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          title={title}
          aria-label={ariaLabel}
          readOnly={readOnly}
          spellCheck={spellCheck}
          {...props}
        />
      );
    }

    return (
      <AstryxTextArea
        ref={ref}
        label={getTextareaLabel({ ariaLabel, placeholder, title })}
        isLabelHidden
        value={isControlled ? toTextareaValue(value) : uncontrolledValue}
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
        rows={rows}
        hasSpellCheck={hasSpellCheck}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
