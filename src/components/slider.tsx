"use client";

import * as React from "react";
import { Slider as AstryxSlider } from "@astryxdesign/core/Slider";

import { cn } from "../lib/cn";

export type SliderProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
  thumbLabels?: string[];
  "aria-label"?: string;
  disabled?: boolean;
  max?: number;
  min?: number;
  orientation?: "horizontal" | "vertical";
  step?: number;
};

function toSliderArray(value: number[] | undefined) {
  return value && value.length > 0 ? value : [0];
}

function toSingleValue(value: number[]) {
  return value[0] ?? 0;
}

function toRangeValue(value: number[]): [number, number] {
  const start = value[0] ?? 0;
  const end = value[1] ?? start;

  return [start, end];
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

function syncSliderThumbLabels(
  root: HTMLDivElement | null,
  thumbLabels: string[] | undefined
) {
  if (!root || !thumbLabels?.length) {
    return;
  }

  const thumbs = root.querySelectorAll<HTMLElement>('[role="slider"]');
  thumbLabels.forEach((thumbLabel, index) => {
    if (thumbLabel) {
      thumbs[index]?.setAttribute("aria-label", thumbLabel);
    }
  });
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      onValueCommit,
      thumbLabels,
      disabled,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      toSliderArray(defaultValue)
    );
    const isControlled = value !== undefined;
    const currentValue = toSliderArray(isControlled ? value : uncontrolledValue);
    const isRange = currentValue.length > 1;
    const label = ariaLabel ?? (!isRange ? thumbLabels?.[0] : undefined) ?? "Slider";
    const sliderRef = React.useRef<HTMLDivElement | null>(null);
    const setSliderRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        sliderRef.current = node;
        setForwardedRef(ref, node);
        syncSliderThumbLabels(node, thumbLabels);
      },
      [ref, thumbLabels]
    );

    React.useLayoutEffect(() => {
      syncSliderThumbLabels(sliderRef.current, thumbLabels);
    }, [thumbLabels, currentValue]);

    const sharedProps = {
      ...props,
      ref: setSliderRef,
      label,
      isLabelHidden: true,
      isDisabled: disabled,
      className: cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )
    };

    if (currentValue.length > 1) {
      return (
        <AstryxSlider
          {...sharedProps}
          value={toRangeValue(currentValue)}
          onChange={(nextValue: [number, number]) => {
            const nextValues = [...nextValue];

            if (!isControlled) {
              setUncontrolledValue(nextValues);
            }
            onValueChange?.(nextValues);
          }}
          onChangeEnd={(nextValue: [number, number]) => {
            onValueCommit?.([...nextValue]);
          }}
        />
      );
    }

    return (
      <AstryxSlider
        {...sharedProps}
        value={toSingleValue(currentValue)}
        onChange={(nextValue: number) => {
          const nextValues = [nextValue];

          if (!isControlled) {
            setUncontrolledValue(nextValues);
          }
          onValueChange?.(nextValues);
        }}
        onChangeEnd={(nextValue: number) => {
          onValueCommit?.([nextValue]);
        }}
      />
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
