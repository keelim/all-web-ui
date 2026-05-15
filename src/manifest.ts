export type ComponentLifecycle = 'stable' | 'deprecated' | 'removed';

export type ComponentManifestEntry = {
  name: string;
  exportPath: string;
  lifecycle: ComponentLifecycle;
  replacement?: string;
  removalTarget?: string;
};

export const componentManifest: ComponentManifestEntry[] = [
  { name: 'Accordion', exportPath: '@keelim/all-web-ui/accordion', lifecycle: 'stable' },
  { name: 'Alert', exportPath: '@keelim/all-web-ui/alert', lifecycle: 'stable' },
  { name: 'AlertDialog', exportPath: '@keelim/all-web-ui/alert-dialog', lifecycle: 'stable' },
  { name: 'Avatar', exportPath: '@keelim/all-web-ui/avatar', lifecycle: 'stable' },
  { name: 'Badge', exportPath: '@keelim/all-web-ui/badge', lifecycle: 'stable' },
  { name: 'Breadcrumb', exportPath: '@keelim/all-web-ui/breadcrumb', lifecycle: 'stable' },
  { name: 'Button', exportPath: '@keelim/all-web-ui/button', lifecycle: 'stable' },
  { name: 'Calendar', exportPath: '@keelim/all-web-ui/calendar', lifecycle: 'stable' },
  { name: 'Card', exportPath: '@keelim/all-web-ui/card', lifecycle: 'stable' },
  { name: 'Checkbox', exportPath: '@keelim/all-web-ui/checkbox', lifecycle: 'stable' },
  { name: 'Dialog', exportPath: '@keelim/all-web-ui/dialog', lifecycle: 'stable' },
  { name: 'DropdownMenu', exportPath: '@keelim/all-web-ui/dropdown-menu', lifecycle: 'stable' },
  { name: 'EmptyState', exportPath: '@keelim/all-web-ui/empty-state', lifecycle: 'stable' },
  { name: 'HoverCard', exportPath: '@keelim/all-web-ui/hover-card', lifecycle: 'stable' },
  { name: 'Input', exportPath: '@keelim/all-web-ui/input', lifecycle: 'stable' },
  { name: 'Label', exportPath: '@keelim/all-web-ui/label', lifecycle: 'stable' },
  { name: 'LoadingStatus', exportPath: '@keelim/all-web-ui/loading-status', lifecycle: 'stable' },
  { name: 'Panel', exportPath: '@keelim/all-web-ui/panel', lifecycle: 'stable' },
  { name: 'Popover', exportPath: '@keelim/all-web-ui/popover', lifecycle: 'stable' },
  { name: 'Progress', exportPath: '@keelim/all-web-ui/progress', lifecycle: 'stable' },
  { name: 'RadioGroup', exportPath: '@keelim/all-web-ui/radio-group', lifecycle: 'stable' },
  { name: 'ScrollArea', exportPath: '@keelim/all-web-ui/scroll-area', lifecycle: 'stable' },
  { name: 'Select', exportPath: '@keelim/all-web-ui/select', lifecycle: 'stable' },
  { name: 'Sheet', exportPath: '@keelim/all-web-ui/sheet', lifecycle: 'stable' },
  { name: 'Skeleton', exportPath: '@keelim/all-web-ui/skeleton', lifecycle: 'stable' },
  { name: 'Slider', exportPath: '@keelim/all-web-ui/slider', lifecycle: 'stable' },
  { name: 'Switch', exportPath: '@keelim/all-web-ui/switch', lifecycle: 'stable' },
  { name: 'Table', exportPath: '@keelim/all-web-ui/table', lifecycle: 'stable' },
  { name: 'Tabs', exportPath: '@keelim/all-web-ui/tabs', lifecycle: 'stable' },
  { name: 'Textarea', exportPath: '@keelim/all-web-ui/textarea', lifecycle: 'stable' },
  { name: 'Tooltip', exportPath: '@keelim/all-web-ui/tooltip', lifecycle: 'stable' },
  { name: 'Toast', exportPath: '@keelim/all-web-ui/toast', lifecycle: 'stable' }
];
