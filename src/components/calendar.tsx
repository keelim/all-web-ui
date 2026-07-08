'use client';

import * as React from 'react';
import { Calendar as AstryxCalendar } from '@astryxdesign/core/Calendar';

import { cn } from '../lib/cn';
import { Button } from './button';

type LegacyDateRange = {
  from?: Date;
  to?: Date;
};

type ISODateString = `${number}${number}${number}${number}-${number}${number}-${number}${number}`;
type DateRange = {
  end: ISODateString;
  start: ISODateString;
};
type CalendarValue = ISODateString | DateRange;

export type CalendarProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
  captionLayout?: unknown;
  classNames?: unknown;
  components?: unknown;
  dateConstraints?: ReadonlyArray<(date: Date) => boolean>;
  defaultSelected?: Date | LegacyDateRange;
  defaultValue?: CalendarValue;
  focusDate?: ISODateString;
  formatters?: unknown;
  handleRef?: React.Ref<{ navigateTo: (date: ISODateString) => void }>;
  hasOutsideDays?: boolean;
  hasVariableRowCount?: boolean;
  hasWeekNumbers?: boolean;
  max?: ISODateString;
  min?: ISODateString;
  mode?: 'single' | 'range';
  month?: Date;
  numberOfMonths?: 1 | 2;
  onChange?: (value: CalendarValue, valueAsDate?: Date) => void;
  onFocusDateChange?: (focusDate: ISODateString) => void;
  onMonthChange?: (month: Date) => void;
  onSelect?: (value: Date | LegacyDateRange | undefined) => void;
  selected?: Date | LegacyDateRange;
  showOutsideDays?: boolean;
  value?: CalendarValue;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
  xstyle?: unknown;
};

export type CalendarDayButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  date?: Date;
  day?: { date: Date };
  modifiers?: {
    focused?: boolean;
    range_end?: boolean;
    range_middle?: boolean;
    range_start?: boolean;
    selected?: boolean;
  };
};

function Calendar({
  buttonVariant: _buttonVariant,
  captionLayout: _captionLayout,
  className,
  classNames: _classNames,
  components: _components,
  defaultSelected,
  defaultValue,
  formatters: _formatters,
  hasOutsideDays,
  mode = 'single',
  month,
  onChange,
  onFocusDateChange,
  onMonthChange,
  onSelect,
  selected,
  showOutsideDays = true,
  value,
  ...props
}: CalendarProps) {
  const focusDate = props.focusDate ?? dateToISO(month);
  const resolvedValue = value ?? legacySelectionToValue(selected);
  const resolvedDefaultValue = defaultValue ?? legacySelectionToValue(defaultSelected);

  const handleFocusDateChange = React.useCallback(
    (nextFocusDate: ISODateString) => {
      onFocusDateChange?.(nextFocusDate);
      onMonthChange?.(isoToDate(nextFocusDate));
    },
    [onFocusDateChange, onMonthChange]
  );

  const handleChange = React.useCallback(
    (nextValue: ISODateString | DateRange, valueAsDate?: Date) => {
      onChange?.(nextValue, valueAsDate);

      if (mode === 'range') {
        onSelect?.(asLegacyRange(nextValue as DateRange));
        return;
      }

      onSelect?.(valueAsDate ?? isoToDate(nextValue as ISODateString));
    },
    [mode, onChange, onSelect]
  );

  const calendarProps = {
    ...props,
    className: cn('bg-background group/calendar p-3', className),
    defaultValue: resolvedDefaultValue,
    focusDate,
    hasOutsideDays: hasOutsideDays ?? showOutsideDays,
    mode,
    onChange: handleChange,
    onFocusDateChange: handleFocusDateChange,
    value: resolvedValue,
  } as any;

  return <AstryxCalendar {...calendarProps} />;
}

function CalendarDayButton({
  className,
  date,
  day,
  modifiers = {},
  ...props
}: CalendarDayButtonProps) {
  const buttonDate = date ?? day?.date;

  return (
    <Button
      className={cn('astryx-calendar-day', className)}
      data-day={buttonDate?.toLocaleDateString()}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-range-start={modifiers.range_start}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      size="icon"
      variant="ghost"
      {...props}
    />
  );
}

function legacySelectionToValue(selection: Date | LegacyDateRange | undefined) {
  if (!selection) return undefined;
  if (selection instanceof Date) return dateToISO(selection);
  const { from, to } = selection;
  if (!from || !to) return undefined;

  return {
    start: dateToISO(from),
    end: dateToISO(to),
  } satisfies DateRange;
}

function asLegacyRange(range: DateRange): LegacyDateRange {
  return {
    from: isoToDate(range.start),
    to: isoToDate(range.end),
  };
}

function dateToISO(date: Date): ISODateString;
function dateToISO(date: undefined): undefined;
function dateToISO(date: Date | undefined): ISODateString | undefined;
function dateToISO(date: Date | undefined): ISODateString | undefined {
  if (!date) return undefined;

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-') as ISODateString;
}

function isoToDate(iso: ISODateString) {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export { Calendar, CalendarDayButton };
