import * as React from 'react';

import { cn } from '../lib/cn';

export type TableProps = React.ComponentPropsWithoutRef<'table'> & {
  containerClassName?: string;
  containerProps?: React.ComponentPropsWithoutRef<'div'>;
  containerRef?: React.Ref<HTMLDivElement>;
};

export const Table = React.forwardRef<HTMLTableElement, TableProps>(function Table(
  { className, containerClassName, containerProps, containerRef, ...props },
  ref
) {
  const { className: containerPropsClassName, ...restContainerProps } = containerProps ?? {};

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full overflow-auto', containerClassName, containerPropsClassName)}
      {...restContainerProps}
    >
      <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  );
});

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<'thead'>>(
  function TableHeader({ className, ...props }, ref) {
    return <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />;
  }
);

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<'tbody'>>(
  function TableBody({ className, ...props }, ref) {
    return <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
  }
);

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<'tfoot'>>(
  function TableFooter({ className, ...props }, ref) {
    return <tfoot ref={ref} className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)} {...props} />;
  }
);

export const TableRow = React.forwardRef<HTMLTableRowElement, React.ComponentPropsWithoutRef<'tr'>>(
  function TableRow({ className, ...props }, ref) {
    return <tr ref={ref} className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)} {...props} />;
  }
);

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ComponentPropsWithoutRef<'th'>>(
  function TableHead({ className, ...props }, ref) {
    return <th ref={ref} className={cn('h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0', className)} {...props} />;
  }
);

export const TableCell = React.forwardRef<HTMLTableCellElement, React.ComponentPropsWithoutRef<'td'>>(
  function TableCell({ className, ...props }, ref) {
    return <td ref={ref} className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)} {...props} />;
  }
);

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.ComponentPropsWithoutRef<'caption'>>(
  function TableCaption({ className, ...props }, ref) {
    return <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />;
  }
);
