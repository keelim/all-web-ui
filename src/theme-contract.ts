export const kuiThemeIds = ['finance', 'admin-bw'] as const;

export type KuiThemeId = (typeof kuiThemeIds)[number];

export const kuiThemeScopeNames = ['finance', 'finance-dark', 'admin-bw'] as const;

export type KuiThemeScopeName = (typeof kuiThemeScopeNames)[number];

export const kuiThemeSelectors = {
  finance: ['.theme-finance', '.kui-theme-finance', "[data-kui-theme='finance']"],
  'finance-dark': [
    '.theme-finance.dark',
    '.kui-theme-finance.dark',
    "[data-kui-theme='finance'].dark",
    "[data-kui-theme='finance'][data-theme='dark']"
  ],
  'admin-bw': ['.theme-admin-bw', '.kui-theme-admin-bw', '.admin-bw-theme', "[data-kui-theme='admin-bw']"]
} as const satisfies Record<KuiThemeScopeName, readonly string[]>;

export const requiredThemeTokenNames = [
  '--kui-color-bg',
  '--kui-color-surface',
  '--kui-color-surface-soft',
  '--kui-color-surface-strong',
  '--kui-color-border',
  '--kui-color-text',
  '--kui-color-muted',
  '--kui-color-accent',
  '--kui-color-accent-ink',
  '--kui-color-danger-bg',
  '--kui-color-danger-border',
  '--kui-color-danger-text',
  '--kui-color-success-bg',
  '--kui-color-success-border',
  '--kui-color-success-text',
  '--kui-color-warning-bg',
  '--kui-color-warning-border',
  '--kui-color-warning-text',
  '--kui-color-info-bg',
  '--kui-color-info-border',
  '--kui-color-info-text',
  '--kui-color-up',
  '--kui-color-up-soft',
  '--kui-color-down',
  '--kui-color-down-soft',
  '--kui-color-flat',
  '--kui-panel-elevated-bg',
  '--kui-metric-card-bg',
  '--kui-metric-card-highlight',
  '--kui-metric-card-shadow',
  '--kui-metric-value-shadow',
  '--kui-radius-sm',
  '--kui-radius-md',
  '--kui-radius-lg',
  '--radius',
  '--kui-shadow-card',
  '--kui-shadow-soft',
  '--kui-shadow-panel',
  '--font-sans',
  '--font-mono',
  '--font-display',
  '--font-numeric',
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--popover',
  '--popover-foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--muted',
  '--muted-foreground',
  '--accent',
  '--accent-foreground',
  '--destructive',
  '--destructive-foreground',
  '--success',
  '--success-foreground',
  '--border',
  '--input',
  '--ring'
] as const;

export type RequiredThemeTokenName = (typeof requiredThemeTokenNames)[number];

export const themeTokenContract = {
  required: requiredThemeTokenNames,
  selectors: kuiThemeSelectors
} as const;

export function isKuiThemeId(value: unknown): value is KuiThemeId {
  return typeof value === 'string' && (kuiThemeIds as readonly string[]).includes(value);
}
