import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'bun:test';

import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuTrigger,
  EmptyState,
  Input,
  LoadingStatus,
  Panel,
  Sheet,
  SheetTrigger,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tabs,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  componentManifest
} from '../src';

describe('all-web-ui exports', () => {
  it('renders shared primitives with stable class contracts', () => {
    expect(renderToStaticMarkup(<Button variant="primary">저장</Button>)).toContain('kui-button--primary');
    expect(renderToStaticMarkup(<Button variant="default">저장</Button>)).toContain('kui-button--primary');
    expect(renderToStaticMarkup(<Input placeholder="입력" />)).toContain('kui-input');
    expect(renderToStaticMarkup(<Panel as="section">내용</Panel>)).toContain('kui-panel--elevated');
    expect(renderToStaticMarkup(<Badge tone="accent">강조</Badge>)).toContain('kui-badge--accent');
    expect(renderToStaticMarkup(<Badge variant="secondary">보조</Badge>)).toContain('kui-badge--muted');
    expect(renderToStaticMarkup(<EmptyState description="비어 있음" />)).toContain('kui-empty-state');
  });

  it('exports shadcn-compatible primitives and manifest entries', () => {
    expect(renderToStaticMarkup(<Card><CardContent>카드</CardContent></Card>)).toContain('kui-panel');
    expect(renderToStaticMarkup(<Table><TableBody><TableRow><TableCell>셀</TableCell></TableRow></TableBody></Table>)).toContain('<table');
    expect(renderToStaticMarkup(<Tabs defaultValue="a"><TabsList><TabsTrigger value="a">A</TabsTrigger></TabsList></Tabs>)).toContain('role="tablist"');
    expect(renderToStaticMarkup(<TooltipProvider><Tooltip><TooltipTrigger>도움말</TooltipTrigger></Tooltip></TooltipProvider>)).toContain('도움말');
    expect(renderToStaticMarkup(<Sheet><SheetTrigger>열기</SheetTrigger></Sheet>)).toContain('열기');
    expect(renderToStaticMarkup(<DropdownMenu><DropdownMenuTrigger>메뉴</DropdownMenuTrigger></DropdownMenu>)).toContain('메뉴');
    expect(renderToStaticMarkup(<Breadcrumb><BreadcrumbList><BreadcrumbItem>홈</BreadcrumbItem></BreadcrumbList></Breadcrumb>)).toContain('aria-label="breadcrumb"');
    expect(componentManifest.some((entry) => entry.exportPath === 'all-web-ui/button' && entry.lifecycle === 'stable')).toBe(true);
  });

  it('exposes shared spacing css as a package export', () => {
    const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    const spacingCss = readFileSync(new URL('../src/styles/spacing.css', import.meta.url), 'utf8');

    expect(packageJson.exports['./spacing.css']).toBe('./dist/styles/spacing.css');
    expect(packageJson.sideEffects).toContain('./dist/styles/spacing.css');
    expect(spacingCss).toContain('--space-4: 1rem;');
    expect(spacingCss).toContain('--kui-space-4: var(--space-4);');
  });

  it('ships light and dark semantic theme tokens for shared primitives', () => {
    const financeCss = readFileSync(new URL('../src/styles/themes/finance.css', import.meta.url), 'utf8');
    const adminCss = readFileSync(new URL('../src/styles/themes/admin-bw.css', import.meta.url), 'utf8');
    const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

    expect(packageJson.sideEffects).toContain('./dist/styles/themes/finance.css');
    expect(packageJson.sideEffects).toContain('./dist/styles/themes/admin-bw.css');
    expect(financeCss).toContain("[data-theme='dark']");
    expect(financeCss).toContain('--kui-color-bg: hsl(222.2 84% 4.9%);');
    expect(financeCss).toContain('--background: 222.2 84% 4.9%;');
    expect(financeCss).toContain('--popover: 222.2 84% 5.8%;');
    expect(adminCss).toContain('.admin-bw-theme');
    expect(adminCss).toContain('--background: 0 0% 2%;');
    expect(adminCss).toContain('--popover: 0 0% 7%;');
    expect(adminCss).toContain('--ring: 0 0% 97%;');
  });

  it('renders panel loading markup with progress steps', () => {
    const html = renderToStaticMarkup(
      <LoadingStatus
        label="동기화 중"
        caption="진행 상황 확인"
        variant="panel"
        steps={['준비', '처리', '완료']}
        activeStep={1}
      />
    );

    expect(html).toContain('data-loading-variant="panel"');
    expect(html).toContain('kui-loading-panel__step is-active');
    expect(html).toContain('진행 상황 확인');
  });
});
