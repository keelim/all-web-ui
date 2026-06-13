'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';

import { cn } from '../lib/cn';

function moveRadioSelection(event: React.KeyboardEvent<HTMLElement>) {
  if (!['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(event.key)) return;

  const root = event.currentTarget.closest('[role="radiogroup"]');
  const items = Array.from(root?.querySelectorAll<HTMLElement>('[role="radio"]:not([data-disabled])') ?? []);
  if (items.length === 0) return;

  const activeIndex = items.indexOf(document.activeElement as HTMLElement);
  const checkedIndex = items.findIndex((item) => item.getAttribute('aria-checked') === 'true');
  const currentIndex = activeIndex >= 0 ? activeIndex : Math.max(checkedIndex, 0);
  const delta = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
  const nextItem = items[(currentIndex + delta + items.length) % items.length];

  event.preventDefault();
  nextItem.focus();
  nextItem.click();
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, onKeyDown, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      {...props}
      className={cn('grid gap-2', className)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        moveRadioSelection(event);
      }}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, onKeyDown, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      {...props}
      ref={ref}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        moveRadioSelection(event);
      }}
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
