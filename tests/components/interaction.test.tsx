import { afterEach, describe, expect, it, mock } from 'bun:test';
import * as React from 'react';
import '../dom-setup';

const { cleanup, fireEvent, render, screen, waitFor } = await import('@testing-library/react');
const {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Calendar,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toast,
  ToastAction,
  ToastClose,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} = await import('../../src');

afterEach(() => {
  cleanup();
  document.body.replaceChildren();
  document.body.removeAttribute('data-scroll-locked');
  document.body.removeAttribute('data-aria-hidden');
  document.body.removeAttribute('aria-hidden');
  document.body.style.cssText = '';
  document.documentElement.style.cssText = '';
  document.documentElement.removeAttribute('data-scroll-locked');
  document.documentElement.removeAttribute('data-aria-hidden');
  document.documentElement.removeAttribute('aria-hidden');
});

function ControlledCheckbox({
  disabled = false,
  initialChecked = false,
  onChange = mock()
}: {
  disabled?: boolean;
  initialChecked?: boolean | 'indeterminate';
  onChange?: (checked: boolean | 'indeterminate') => void;
}) {
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>(initialChecked);
  return (
    <Checkbox
      aria-label="Accept terms"
      checked={checked}
      disabled={disabled}
      onCheckedChange={(next) => {
        setChecked(next);
        onChange(next);
      }}
    />
  );
}

function ControlledRadioGroup({ onChange = mock() }: { onChange?: (value: string) => void }) {
  const [value, setValue] = React.useState('daily');
  return (
    <RadioGroup
      aria-label="Digest cadence"
      orientation="horizontal"
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onChange(next);
      }}
    >
      <RadioGroupItem aria-label="Daily" value="daily" />
      <RadioGroupItem aria-label="Weekly" value="weekly" />
      <RadioGroupItem aria-label="Monthly" value="monthly" />
    </RadioGroup>
  );
}

function ControlledSlider({ onChange = mock() }: { onChange?: (value: number[]) => void }) {
  const [value, setValue] = React.useState([40]);
  return (
    <Slider
      aria-label="Allocation"
      max={100}
      min={0}
      step={10}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onChange(next);
      }}
    />
  );
}

function ControlledSwitch({
  disabled = false,
  onChange = mock()
}: {
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  const [checked, setChecked] = React.useState(false);
  return (
    <Switch
      aria-label="Email alerts"
      checked={checked}
      disabled={disabled}
      onCheckedChange={(next) => {
        setChecked(next);
        onChange(next);
      }}
    />
  );
}

function ControlledToast({ onAction = mock() }: { onAction?: () => void }) {
  const [open, setOpen] = React.useState(true);
  return (
    <ToastProvider>
      <Toast open={open} onOpenChange={setOpen} variant="destructive">
        <ToastTitle>Sync failed</ToastTitle>
        <ToastAction altText="Retry sync" onClick={onAction}>
          Retry
        </ToastAction>
        <ToastClose aria-label="Dismiss sync failed" />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}

function keyOptions(key: string) {
  return {
    key,
    code: key === ' ' ? 'Space' : key
  };
}

function pressKey(target: Document | Element, key: string) {
  fireEvent.keyDown(target, keyOptions(key));
  fireEvent.keyUp(target, keyOptions(key));
}

function activateWithKeyboard(target: HTMLElement, key: ' ' | 'Enter' = 'Enter') {
  pressKey(target, key);
  fireEvent.click(target);
}

async function waitForFocus(target: Element) {
  await waitFor(() => expect(document.activeElement).toBe(target));
}

describe('all-web-ui DOM interaction contracts', () => {
  it('opens and closes Accordion content from keyboard toggles', async () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="overview">
          <AccordionTrigger>Overview</AccordionTrigger>
          <AccordionContent>Quarterly metrics</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole('button', { name: /overview/i });

    expect(trigger.getAttribute('data-state')).toBe('closed');
    expect(screen.queryByText('Quarterly metrics')).toBeNull();
    trigger.focus();
    activateWithKeyboard(trigger, 'Enter');
    await waitFor(() => expect(trigger.getAttribute('data-state')).toBe('open'));
    const content = screen.getByText('Quarterly metrics').closest('[data-state]') as HTMLElement;
    expect(content.getAttribute('data-state')).toBe('open');

    activateWithKeyboard(trigger, ' ');
    await waitFor(() => expect(trigger.getAttribute('data-state')).toBe('closed'));
    expect(content.getAttribute('data-state')).toBe('closed');
  });

  it('keeps AlertDialog title, focus, cancel, Escape, and action flows working', async () => {
    const onAction = mock();

    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete report</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete report?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onAction}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    fireEvent.click(screen.getByRole('button', { name: /delete report/i }));
    const dialog = await screen.findByRole('alertdialog', { name: /delete report\?/i });
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /cancel/i }));

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());

    fireEvent.click(screen.getByRole('button', { name: /delete report/i }));
    fireEvent.click(await screen.findByRole('button', { name: /delete/i }));
    expect(onAction).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
  });

  it('shows Avatar fallback when the image cannot load', async () => {
    render(
      <Avatar>
        <AvatarImage alt="Keelim profile" src="/missing-avatar.png" />
        <AvatarFallback>KL</AvatarFallback>
      </Avatar>
    );

    expect(screen.queryByRole('img', { name: /keelim profile/i })).toBeNull();
    expect(await screen.findByText('KL')).toBeTruthy();
  });

  it('selects Calendar dates and exposes focused day state', async () => {
    const onSelect = mock();

    render(
      <Calendar
        mode="single"
        month={new Date(2026, 5, 1)}
        onSelect={onSelect}
        selected={new Date(2026, 5, 12)}
      />
    );

    const selected = document.querySelector('button[data-selected-single="true"]') as HTMLButtonElement;
    expect(selected).toBeTruthy();
    expect(selected.getAttribute('data-day')).toBe(new Date(2026, 5, 12).toLocaleDateString());

    fireEvent.focus(selected);
    await waitFor(() => expect(selected.closest('[data-focused]')).toBeTruthy());
    pressKey(selected, 'ArrowRight');
    const nextDay = document.querySelector(`button[data-day="${new Date(2026, 5, 13).toLocaleDateString()}"]`) as HTMLButtonElement;
    await waitForFocus(nextDay);

    const target = document.querySelector(`button[data-day="${new Date(2026, 5, 15).toLocaleDateString()}"]`) as HTMLButtonElement;
    fireEvent.click(target);
    expect(onSelect).toHaveBeenCalled();
  });

  it('toggles Checkbox checked and indeterminate states from click and Space', async () => {
    const onChange = mock();

    render(<ControlledCheckbox initialChecked="indeterminate" onChange={onChange} />);

    const checkbox = screen.getByRole('checkbox', { name: /accept terms/i });
    expect(checkbox.getAttribute('aria-checked')).toBe('mixed');

    fireEvent.click(checkbox);
    expect(checkbox.getAttribute('aria-checked')).toBe('true');
    expect(onChange).toHaveBeenLastCalledWith(true);

    checkbox.focus();
    activateWithKeyboard(checkbox, ' ');
    expect(checkbox.getAttribute('aria-checked')).toBe('false');
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('does not call Checkbox change handlers when disabled', async () => {
    const onChange = mock();

    render(<ControlledCheckbox disabled onChange={onChange} />);

    fireEvent.click(screen.getByRole('checkbox', { name: /accept terms/i }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('opens Dialog, exposes title linkage, closes, and restores trigger focus', async () => {
    render(
      <Dialog>
        <DialogTrigger>Edit profile</DialogTrigger>
        <DialogContent>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Change the shared account metadata.</DialogDescription>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole('button', { name: /edit profile/i });
    fireEvent.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: /edit profile/i });
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
    expect(screen.getByRole('button', { name: /close/i })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it('opens HoverCard from hover and keyboard focus, then closes on unhover and blur', async () => {
    render(
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild>
          <button type="button">Revenue owner</button>
        </HoverCardTrigger>
        <HoverCardContent>Owns shared revenue reporting.</HoverCardContent>
      </HoverCard>
    );

    const trigger = screen.getByText('Revenue owner');
    fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
    fireEvent.mouseEnter(trigger);
    const content = (await screen.findByText(/shared revenue reporting/i)).closest('[data-state]') as HTMLElement;
    expect(content.getAttribute('data-state')).toBe('open');
    fireEvent.pointerLeave(trigger, { pointerType: 'mouse' });
    fireEvent.mouseLeave(trigger);
    await waitFor(() => expect(content.getAttribute('data-state')).toBe('closed'));

    trigger.focus();
    fireEvent.focus(trigger);
    expect(document.activeElement).toBe(trigger);
    await waitFor(() => expect(trigger.getAttribute('data-state')).toBe('open'));
    expect(await screen.findByText(/shared revenue reporting/i)).toBeTruthy();
    fireEvent.blur(trigger);
    await waitFor(() => expect(trigger.getAttribute('data-state')).toBe('closed'));
  });

  it('opens Popover, keeps trigger focus, and closes on Escape and outside click', async () => {
    render(
      <div>
        <Popover>
          <PopoverTrigger>Filters</PopoverTrigger>
          <PopoverContent>Saved filter controls</PopoverContent>
        </Popover>
        <button type="button">Outside</button>
      </div>
    );

    const trigger = screen.getByRole('button', { name: /filters/i });
    trigger.focus();
    activateWithKeyboard(trigger, 'Enter');
    expect(await screen.findByText(/saved filter controls/i)).toBeTruthy();
    expect(trigger.getAttribute('data-state')).toBe('open');

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByText(/saved filter controls/i)).toBeNull());

    fireEvent.click(trigger);
    expect(await screen.findByText(/saved filter controls/i)).toBeTruthy();
    fireEvent.pointerDown(screen.getByRole('button', { name: /outside/i }));
    fireEvent.click(screen.getByRole('button', { name: /outside/i }));
    await waitFor(() => expect(screen.queryByText(/saved filter controls/i)).toBeNull());
  });

  it('renders Progress aria values and indicator transforms for boundaries', () => {
    const { rerender } = render(<Progress aria-label="Sync progress" value={0} />);

    const progress = screen.getByRole('progressbar', { name: /sync progress/i });
    expect(progress.getAttribute('aria-valuenow')).toBe('0');
    expect(progress.querySelector('[style*="translateX(-100%)"]')).toBeTruthy();

    rerender(<Progress aria-label="Sync progress" value={45} />);
    expect(progress.getAttribute('aria-valuenow')).toBe('45');
    expect(progress.querySelector('[style*="translateX(-55%)"]')).toBeTruthy();

    rerender(<Progress aria-label="Sync progress" value={100} />);
    expect(progress.getAttribute('aria-valuenow')).toBe('100');
    expect(progress.querySelector('[style*="translateX(-0%)"]')).toBeTruthy();
  });

  it('moves RadioGroup selection with arrow keys and Space', async () => {
    const onChange = mock();

    render(<ControlledRadioGroup onChange={onChange} />);

    const daily = screen.getByRole('radio', { name: /daily/i });
    const weekly = screen.getByRole('radio', { name: /weekly/i });
    daily.focus();
    expect(document.activeElement).toBe(daily);
    fireEvent.keyDown(daily, { key: 'ArrowRight' });
    await waitFor(() => expect(weekly.getAttribute('aria-checked')).toBe('true'));
    expect(onChange).toHaveBeenLastCalledWith('weekly');

    fireEvent.keyDown(weekly, { key: 'ArrowRight' });
    const monthly = screen.getByRole('radio', { name: /monthly/i });
    expect(monthly.getAttribute('aria-checked')).toBe('true');

    fireEvent.keyDown(monthly, { key: 'ArrowLeft' });
    expect(weekly.getAttribute('aria-checked')).toBe('true');

    monthly.focus();
    activateWithKeyboard(monthly, ' ');
    expect(monthly.getAttribute('aria-checked')).toBe('true');
    expect(onChange).toHaveBeenLastCalledWith('monthly');
  });

  it('opens Select from keyboard, skips disabled items, and commits selection', async () => {
    render(
      <Select defaultValue="alpha">
        <SelectTrigger aria-label="Workspace">
          <SelectValue placeholder="Pick workspace" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="alpha">Alpha</SelectItem>
          <SelectItem disabled value="blocked">Blocked</SelectItem>
          <SelectItem value="beta">Beta</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByRole('combobox', { name: /workspace/i });
    trigger.focus();
    pressKey(trigger, 'ArrowDown');
    await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'));
    await screen.findByRole('listbox');
    const blocked = screen.getByRole('option', { name: /blocked/i });
    const beta = screen.getByRole('option', { name: /beta/i });
    expect(blocked.getAttribute('aria-disabled')).toBe('true');
    expect(blocked.getAttribute('tabindex')).toBeNull();

    beta.focus();
    fireEvent.focus(beta);
    await waitForFocus(beta);
    pressKey(beta, 'Enter');
    await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('false'));
    expect(trigger.textContent).toContain('Beta');
  });

  it('updates Slider value from keyboard controls', async () => {
    const onChange = mock();

    render(<ControlledSlider onChange={onChange} />);

    const slider = screen.getByRole('slider');
    expect(slider.getAttribute('aria-valuenow')).toBe('40');
    slider.focus();

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(slider.getAttribute('aria-valuenow')).toBe('50');
    expect(onChange).toHaveBeenLastCalledWith([50]);

    fireEvent.keyDown(slider, { key: 'Home' });
    expect(slider.getAttribute('aria-valuenow')).toBe('0');

    fireEvent.keyDown(slider, { key: 'End' });
    expect(slider.getAttribute('aria-valuenow')).toBe('100');
  });

  it('toggles custom Switch from click and keyboard while respecting disabled', async () => {
    const onChange = mock();
    const disabledChange = mock();

    render(
      <>
        <ControlledSwitch onChange={onChange} />
        <ControlledSwitch disabled onChange={disabledChange} />
      </>
    );

    const [enabled, disabled] = screen.getAllByRole('switch', { name: /email alerts/i });
    expect(enabled.getAttribute('aria-checked')).toBe('false');

    fireEvent.click(enabled);
    expect(enabled.getAttribute('aria-checked')).toBe('true');
    expect(onChange).toHaveBeenLastCalledWith(true);

    enabled.focus();
    activateWithKeyboard(enabled, ' ');
    expect(enabled.getAttribute('aria-checked')).toBe('false');
    expect(onChange).toHaveBeenLastCalledWith(false);

    fireEvent.click(disabled);
    expect(disabledChange).not.toHaveBeenCalled();
  });

  it('renders Toast action, close, destructive variant, and viewport position contract', async () => {
    const onAction = mock();

    render(<ControlledToast onAction={onAction} />);

    const toast = screen.getByRole('listitem');
    expect(toast.className).toContain('destructive');
    expect(screen.getByRole('list').className).toContain('sm:right-0');

    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(onAction).toHaveBeenCalledTimes(1);

    cleanup();
    render(<ControlledToast />);

    fireEvent.click(screen.getByRole('button', { name: /dismiss sync failed/i }));
    await waitFor(() => expect(screen.queryByRole('listitem')).toBeNull());
  });

  it('opens DropdownMenu and selects enabled items while exposing disabled state', async () => {
    const onItem = mock();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onItem}>Archive</DropdownMenuItem>
          <DropdownMenuItem disabled>Disabled action</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByRole('button', { name: /actions/i });
    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);
    expect(await screen.findByRole('menu')).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: /disabled action/i }).getAttribute('aria-disabled')).toBe('true');

    fireEvent.keyDown(document.activeElement ?? trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement ?? trigger, { key: 'Enter' });
    expect(onItem).toHaveBeenCalledTimes(1);
  });

  it('tracks DropdownMenu checkbox and radio item state changes', async () => {
    const onChecked = mock();
    const onRadio = mock();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={false} onCheckedChange={onChecked}>
            Pinned
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value="day" onValueChange={onRadio}>
            <DropdownMenuRadioItem value="day">Daily</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="week">Weekly</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByRole('button', { name: /actions/i });

    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);
    fireEvent.click(await screen.findByRole('menuitemcheckbox', { name: /pinned/i }));
    expect(onChecked).toHaveBeenCalledWith(true);

    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);
    fireEvent.click(await screen.findByRole('menuitemradio', { name: /weekly/i }));
    expect(onRadio).toHaveBeenCalledWith('week');
  });

  it('opens DropdownMenu submenus by keyboard', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Export</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>CSV</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByRole('button', { name: /actions/i });

    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);
    const exportItem = await screen.findByRole('menuitem', { name: /export/i });
    expect(exportItem.getAttribute('aria-haspopup')).toBe('menu');
    exportItem.focus();
    fireEvent.keyDown(exportItem, { key: 'ArrowRight' });
    await waitFor(() => expect(exportItem.getAttribute('data-state')).toBe('open'));
    expect(await screen.findByRole('menuitem', { name: /csv/i })).toBeTruthy();
  });

  it('opens Sheet with accessible title/description, side classes, close, and Escape behavior', async () => {
    const { rerender } = render(
      <Sheet>
        <SheetTrigger>Open right sheet</SheetTrigger>
        <SheetContent side="right">
          <SheetTitle>Account settings</SheetTitle>
          <SheetDescription>Update account defaults.</SheetDescription>
        </SheetContent>
      </Sheet>
    );

    fireEvent.click(screen.getByRole('button', { name: /open right sheet/i }));
    const rightDialog = await screen.findByRole('dialog', { name: /account settings/i });
    expect(rightDialog.className).toContain('right-0');
    expect(rightDialog.getAttribute('aria-describedby')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

    rerender(
      <Sheet>
        <SheetTrigger>Open left sheet</SheetTrigger>
        <SheetContent side="left">
          <SheetTitle>Account settings</SheetTitle>
          <SheetDescription>Update account defaults.</SheetDescription>
        </SheetContent>
      </Sheet>
    );
    fireEvent.click(screen.getByRole('button', { name: /open left sheet/i }));
    expect(await screen.findByRole('dialog')).toHaveProperty('className', expect.stringContaining('left-0'));
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

    for (const side of ['top', 'bottom'] as const) {
      cleanup();
      render(
        <Sheet>
          <SheetTrigger>Open {side} sheet</SheetTrigger>
          <SheetContent side={side}>
            <SheetTitle>{side} panel</SheetTitle>
            <SheetDescription>{side} description</SheetDescription>
          </SheetContent>
        </Sheet>
      );
      fireEvent.click(screen.getByRole('button', { name: new RegExp(`open ${side} sheet`, 'i') }));
      const dialog = await screen.findByRole('dialog', { name: new RegExp(`${side} panel`, 'i') });
      expect(dialog.className).toContain(side === 'top' ? 'top-0' : 'bottom-0');
    }
  });

  it('moves Tabs selection by click and ArrowRight while skipping disabled tabs', async () => {
    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="Report sections">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger disabled value="blocked">
            Blocked
          </TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent forceMount value="overview">Overview content</TabsContent>
        <TabsContent forceMount value="blocked">Blocked content</TabsContent>
        <TabsContent forceMount value="details">Details content</TabsContent>
      </Tabs>
    );

    const overview = screen.getByRole('tab', { name: /overview/i });
    const details = screen.getByRole('tab', { name: /details/i });

    expect(overview.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('Overview content')).toBeTruthy();

    overview.focus();
    pressKey(overview, 'ArrowRight');
    await waitFor(() => expect(details.getAttribute('aria-selected')).toBe('true'));
    expect(screen.getByText('Blocked content').closest('[role="tabpanel"]')?.getAttribute('data-state')).toBe('inactive');
    expect(screen.getByText('Details content').closest('[role="tabpanel"]')?.getAttribute('data-state')).toBe('active');

    fireEvent.mouseDown(overview, { button: 0, ctrlKey: false });
    fireEvent.click(overview);
    await waitFor(() => expect(overview.getAttribute('aria-selected')).toBe('true'));
  });

  it('opens Tooltip from hover and focus with aria-describedby linkage', async () => {
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Margin</TooltipTrigger>
          <TooltipContent>Net revenue after costs.</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByText('Margin');
    fireEvent.pointerMove(trigger, { pointerType: 'mouse' });
    fireEvent.mouseMove(trigger);
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip.textContent).toContain('Net revenue after costs.');
    await waitFor(() => expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id));

    fireEvent.pointerLeave(trigger, { pointerType: 'mouse' });
    fireEvent.mouseLeave(trigger);
    fireEvent.blur(trigger);
    await waitFor(() => expect(trigger.getAttribute('data-state')).toBe('closed'));

    trigger.focus();
    fireEvent.focus(trigger);
    expect(document.activeElement).toBe(trigger);
    expect(await screen.findByRole('tooltip')).toBeTruthy();
  });
});
