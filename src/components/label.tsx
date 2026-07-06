"use client";

import * as React from "react";
import { FieldLabel as AstryxFieldLabel } from "@astryxdesign/core/Field";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/cn";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

export type LabelProps = React.ComponentPropsWithoutRef<"label"> &
  VariantProps<typeof labelVariants>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, className, htmlFor, id, ...props }, ref) => {
    const hasOnlyAstryxSupportedProps = Object.keys(props).length === 0;
    const hasTextLabel = typeof children === "string" || typeof children === "number";

    if (
      className === undefined &&
      typeof htmlFor === "string" &&
      hasTextLabel &&
      hasOnlyAstryxSupportedProps
    ) {
      return (
        <AstryxFieldLabel
          ref={ref}
          inputID={htmlFor}
          label={String(children)}
          labelID={id}
        />
      );
    }

    return (
      <label
        ref={ref}
        className={cn(labelVariants(), className)}
        htmlFor={htmlFor}
        id={id}
        {...props}
      >
        {children}
      </label>
    );
  }
);
Label.displayName = "Label";

export { Label };
