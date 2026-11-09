import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from '@keelim/all-web-ui';

export const ConfirmDisconnect = () => (
  <div style={{ minHeight: 400 }}>
  <AlertDialog defaultOpen>
    <AlertDialogTrigger asChild>
      <Button variant="destructive">Disconnect account</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Disconnect Brokerage IRA?</AlertDialogTitle>
        <AlertDialogDescription>
          Historical balances stay in your reports, but new transactions will stop syncing.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Keep connected</AlertDialogCancel>
        <AlertDialogAction>Disconnect</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  </div>
);
