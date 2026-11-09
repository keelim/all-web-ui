import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@keelim/all-web-ui';

export const FirstOpen = () => (
  <Accordion type="single" collapsible defaultValue="sync" style={{ maxWidth: 480 }}>
    <AccordionItem value="sync">
      <AccordionTrigger>How often do balances sync?</AccordionTrigger>
      <AccordionContent>Linked accounts refresh every hour during market hours and once overnight.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="fees">
      <AccordionTrigger>Are there any fees?</AccordionTrigger>
      <AccordionContent>No. Tracking is free for up to 10 linked accounts.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="export">
      <AccordionTrigger>Can I export my data?</AccordionTrigger>
      <AccordionContent>Yes, download any report as CSV from the Reports page.</AccordionContent>
    </AccordionItem>
  </Accordion>
);

export const AllClosed = () => (
  <Accordion type="multiple" style={{ maxWidth: 480 }}>
    <AccordionItem value="security">
      <AccordionTrigger>Security</AccordionTrigger>
      <AccordionContent>Two-factor authentication and session controls.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="notifications">
      <AccordionTrigger>Notifications</AccordionTrigger>
      <AccordionContent>Email and push preferences.</AccordionContent>
    </AccordionItem>
  </Accordion>
);
