import {
  Button,
  Field,
  FieldLabel,
  Input,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Switch,
} from '@keelim/all-web-ui';

export const FilterPanel = () => (
  <div style={{ minHeight: 520 }}>
  <Sheet defaultOpen>
    <SheetTrigger asChild>
      <Button variant="secondary">Filters</Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Filter holdings</SheetTitle>
        <SheetDescription>Narrow the table to the positions you care about.</SheetDescription>
      </SheetHeader>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--kui-space-4)', padding: 'var(--kui-space-4) 0' }}>
        <Field>
          <FieldLabel>Symbol contains</FieldLabel>
          <Input placeholder="e.g. VT" />
        </Field>
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button variant="ghost">Reset</Button>
        </SheetClose>
        <Button>Apply filters</Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
  </div>
);
