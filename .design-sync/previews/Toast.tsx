import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@keelim/all-web-ui';

export const Notifications = () => (
  <ToastProvider>
    <Toast defaultOpen duration={1000000}>
      <ToastTitle>Sync complete</ToastTitle>
      <ToastDescription>4 accounts updated a moment ago.</ToastDescription>
      <ToastClose />
    </Toast>
    <Toast defaultOpen duration={1000000} variant="destructive">
      <ToastTitle>Brokerage sync failed</ToastTitle>
      <ToastDescription>Reconnect Brokerage IRA to resume updates.</ToastDescription>
      <ToastAction altText="Reconnect the account">Reconnect</ToastAction>
    </Toast>
    <ToastViewport />
  </ToastProvider>
);
