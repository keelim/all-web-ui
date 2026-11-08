import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldLabel,
  Input,
} from '@keelim/all-web-ui';

export const EditGoal = () => (
  <div style={{ minHeight: 480 }}>
  <Dialog defaultOpen>
    <DialogTrigger asChild>
      <Button variant="secondary">Edit goal</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit retirement goal</DialogTitle>
        <DialogDescription>Changes apply to projections from the next sync.</DialogDescription>
      </DialogHeader>
      <Field>
        <FieldLabel>Target amount</FieldLabel>
        <Input defaultValue="$1,200,000" />
      </Field>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <Button>Save goal</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  </div>
);
