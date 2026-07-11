import { kuiThemeSelectors, type KuiThemeScopeName } from './theme-contract';

export type ComponentLifecycle = 'experimental' | 'stable' | 'deprecated' | 'removed';

export type ComponentStyleImport = '@keelim/all-web-ui/styles.css';

export type ComponentThemeStyleImport =
  | '@keelim/all-web-ui/themes/finance.css'
  | '@keelim/all-web-ui/themes/admin-bw.css';

export type ComponentThemeScope = {
  name: KuiThemeScopeName;
  styleImport: ComponentThemeStyleImport;
  selectors: readonly string[];
  required: boolean;
};

export type ComponentManifestEntry = {
  name: string;
  exportPath: string;
  lifecycle: ComponentLifecycle;
  styleImports: readonly ComponentStyleImport[];
  themeScopes: readonly ComponentThemeScope[];
  replacement?: string;
  removalTarget?: string;
};

export const sharedComponentStyleImports = ['@keelim/all-web-ui/styles.css'] as const satisfies readonly ComponentStyleImport[];

export const sharedComponentThemeScopes = [
  {
    name: 'finance',
    styleImport: '@keelim/all-web-ui/themes/finance.css',
    selectors: kuiThemeSelectors.finance,
    required: false
  },
  {
    name: 'finance-dark',
    styleImport: '@keelim/all-web-ui/themes/finance.css',
    selectors: kuiThemeSelectors['finance-dark'],
    required: false
  },
  {
    name: 'admin-bw',
    styleImport: '@keelim/all-web-ui/themes/admin-bw.css',
    selectors: kuiThemeSelectors['admin-bw'],
    required: false
  }
] as const satisfies readonly ComponentThemeScope[];

const componentManifestEntries = [
  { name: 'Accordion', exportPath: '@keelim/all-web-ui/accordion', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Alert', exportPath: '@keelim/all-web-ui/alert', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'AlertDialog', exportPath: '@keelim/all-web-ui/alert-dialog', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Avatar', exportPath: '@keelim/all-web-ui/avatar', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Badge', exportPath: '@keelim/all-web-ui/badge', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Breadcrumb', exportPath: '@keelim/all-web-ui/breadcrumb', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Button', exportPath: '@keelim/all-web-ui/button', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Calendar', exportPath: '@keelim/all-web-ui/calendar', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Card', exportPath: '@keelim/all-web-ui/card', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Checkbox', exportPath: '@keelim/all-web-ui/checkbox', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Dialog', exportPath: '@keelim/all-web-ui/dialog', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'DropdownMenu', exportPath: '@keelim/all-web-ui/dropdown-menu', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'EmptyState', exportPath: '@keelim/all-web-ui/empty-state', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Field', exportPath: '@keelim/all-web-ui/field', lifecycle: 'experimental', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'HoverCard', exportPath: '@keelim/all-web-ui/hover-card', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Input', exportPath: '@keelim/all-web-ui/input', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Label', exportPath: '@keelim/all-web-ui/label', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'LoadingStatus', exportPath: '@keelim/all-web-ui/loading-status', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'MetricCard', exportPath: '@keelim/all-web-ui/metric-card', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Onboarding', exportPath: '@keelim/all-web-ui/onboarding', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Panel', exportPath: '@keelim/all-web-ui/panel', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Popover', exportPath: '@keelim/all-web-ui/popover', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Progress', exportPath: '@keelim/all-web-ui/progress', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'RadioGroup', exportPath: '@keelim/all-web-ui/radio-group', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'ScrollArea', exportPath: '@keelim/all-web-ui/scroll-area', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Select', exportPath: '@keelim/all-web-ui/select', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Sheet', exportPath: '@keelim/all-web-ui/sheet', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Skeleton', exportPath: '@keelim/all-web-ui/skeleton', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Slider', exportPath: '@keelim/all-web-ui/slider', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Switch', exportPath: '@keelim/all-web-ui/switch', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Table', exportPath: '@keelim/all-web-ui/table', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Tabs', exportPath: '@keelim/all-web-ui/tabs', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Textarea', exportPath: '@keelim/all-web-ui/textarea', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Tooltip', exportPath: '@keelim/all-web-ui/tooltip', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes },
  { name: 'Toast', exportPath: '@keelim/all-web-ui/toast', lifecycle: 'stable', styleImports: sharedComponentStyleImports, themeScopes: sharedComponentThemeScopes }
] as const satisfies readonly ComponentManifestEntry[];

export const componentManifest = Object.freeze(
  componentManifestEntries.map((entry) => Object.freeze(entry))
) as readonly ComponentManifestEntry[];
