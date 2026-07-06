"use client";

import * as React from "react";
import { ProgressBar as AstryxProgressBar } from "@astryxdesign/core/ProgressBar";

import { cn } from "../lib/cn";

export type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number | null;
  max?: number;
  "aria-label"?: string;
  isIndeterminate?: boolean;
};

function normalizeProgressValue(value: number | null | undefined, max: number) {
  if (value == null || !Number.isFinite(value)) {
    return undefined;
  }

  return Math.min(max, Math.max(0, value));
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, "aria-label": ariaLabel, ...props }, ref) => {
    return (
      <AstryxProgressBar
        ref={ref}
        label={ariaLabel ?? "Progress"}
        isLabelHidden
        value={normalizeProgressValue(value, max)}
        max={max}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        {...props}
      />
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
