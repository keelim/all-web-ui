export type ComponentLifecycle = 'stable' | 'deprecated' | 'removed';

export type ComponentManifestEntry = {
  name: string;
  exportPath: string;
  lifecycle: ComponentLifecycle;
  replacement?: string;
  removalTarget?: string;
};

export const componentManifest: ComponentManifestEntry[] = [
  { name: 'Accordion', exportPath: 'all-web-ui/accordion', lifecycle: 'stable' },
  { name: 'Alert', exportPath: 'all-web-ui/alert', lifecycle: 'stable' },
  { name: 'AlertDialog', exportPath: 'all-web-ui/alert-dialog', lifecycle: 'stable' },
  { name: 'Avatar', exportPath: 'all-web-ui/avatar', lifecycle: 'stable' },
  { name: 'Badge', exportPath: 'all-web-ui/badge', lifecycle: 'stable' },
  { name: 'Breadcrumb', exportPath: 'all-web-ui/breadcrumb', lifecycle: 'stable' },
  { name: 'Button', exportPath: 'all-web-ui/button', lifecycle: 'stable' },
  { name: 'Calendar', exportPath: 'all-web-ui/calendar', lifecycle: 'stable' },
  { name: 'Card', exportPath: 'all-web-ui/card', lifecycle: 'stable' },
  { name: 'Checkbox', exportPath: 'all-web-ui/checkbox', lifecycle: 'stable' },
  { name: 'Dialog', exportPath: 'all-web-ui/dialog', lifecycle: 'stable' },
  { name: 'DropdownMenu', exportPath: 'all-web-ui/dropdown-menu', lifecycle: 'stable' },
  { name: 'EmptyState', exportPath: 'all-web-ui/empty-state', lifecycle: 'stable' },
  { name: 'HoverCard', exportPath: 'all-web-ui/hover-card', lifecycle: 'stable' },
  { name: 'Input', exportPath: 'all-web-ui/input', lifecycle: 'stable' },
  { name: 'Label', exportPath: 'all-web-ui/label', lifecycle: 'stable' },
  { name: 'LoadingStatus', exportPath: 'all-web-ui/loading-status', lifecycle: 'stable' },
  { name: 'Panel', exportPath: 'all-web-ui/panel', lifecycle: 'stable' },
  { name: 'Popover', exportPath: 'all-web-ui/popover', lifecycle: 'stable' },
  { name: 'Progress', exportPath: 'all-web-ui/progress', lifecycle: 'stable' },
  { name: 'RadioGroup', exportPath: 'all-web-ui/radio-group', lifecycle: 'stable' },
  { name: 'ScrollArea', exportPath: 'all-web-ui/scroll-area', lifecycle: 'stable' },
  { name: 'Select', exportPath: 'all-web-ui/select', lifecycle: 'stable' },
  { name: 'Sheet', exportPath: 'all-web-ui/sheet', lifecycle: 'stable' },
  { name: 'Skeleton', exportPath: 'all-web-ui/skeleton', lifecycle: 'stable' },
  { name: 'Slider', exportPath: 'all-web-ui/slider', lifecycle: 'stable' },
  { name: 'Switch', exportPath: 'all-web-ui/switch', lifecycle: 'stable' },
  { name: 'Table', exportPath: 'all-web-ui/table', lifecycle: 'stable' },
  { name: 'Tabs', exportPath: 'all-web-ui/tabs', lifecycle: 'stable' },
  { name: 'Textarea', exportPath: 'all-web-ui/textarea', lifecycle: 'stable' },
  { name: 'Tooltip', exportPath: 'all-web-ui/tooltip', lifecycle: 'stable' },
  { name: 'Toast', exportPath: 'all-web-ui/toast', lifecycle: 'stable' }
];
