import * as React from 'react';
import {
  Table as AstryxTable,
  TableBody as AstryxTableBody,
  TableCell as AstryxTableCell,
  TableFooter as AstryxTableFooter,
  TableHeader as AstryxTableHeader,
  TableHeaderCell as AstryxTableHeaderCell,
  TableRow as AstryxTableRow
} from '@astryxdesign/core/Table';

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
        <AstryxTable
          ref={ref}
          className={cn('w-full caption-bottom text-sm', className)}
          {...(props as React.ComponentProps<typeof AstryxTable>)}
        />
    </div>
  );
});

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<'thead'>>(
  function TableHeader({ className, ...props }, ref) {
    return (
      <AstryxTableHeader
        ref={ref}
        className={cn('[&_tr]:border-b', className)}
        {...(props as React.ComponentProps<typeof AstryxTableHeader>)}
      />
    );
  }
);

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<'tbody'>>(
  function TableBody({ className, ...props }, ref) {
    return (
      <AstryxTableBody
        ref={ref}
        className={cn('[&_tr:last-child]:border-0', className)}
        {...(props as React.ComponentProps<typeof AstryxTableBody>)}
      />
    );
  }
);

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<'tfoot'>>(
  function TableFooter({ className, ...props }, ref) {
    return (
      <AstryxTableFooter
        ref={ref}
        className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
        {...(props as React.ComponentProps<typeof AstryxTableFooter>)}
      />
    );
  }
);

export const TableRow = React.forwardRef<HTMLTableRowElement, React.ComponentPropsWithoutRef<'tr'>>(
  function TableRow({ className, ...props }, ref) {
    return (
      <AstryxTableRow
        ref={ref}
        className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
        {...(props as React.ComponentProps<typeof AstryxTableRow>)}
      />
    );
  }
);

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ComponentPropsWithoutRef<'th'>>(
  function TableHead({ className, ...props }, ref) {
    return (
      <AstryxTableHeaderCell
        ref={ref}
        className={cn('h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0', className)}
        {...(props as React.ComponentProps<typeof AstryxTableHeaderCell>)}
      />
    );
  }
);

export const TableCell = React.forwardRef<HTMLTableCellElement, React.ComponentPropsWithoutRef<'td'>>(
  function TableCell({ className, ...props }, ref) {
    return (
      <AstryxTableCell
        ref={ref}
        className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
        {...(props as React.ComponentProps<typeof AstryxTableCell>)}
      />
    );
  }
);

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.ComponentPropsWithoutRef<'caption'>>(
  function TableCaption({ className, ...props }, ref) {
    return <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />;
  }
);
