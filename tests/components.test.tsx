import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'bun:test';
import './dom-setup';

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
  DataNumber,
  MetricCard,
  MetricValue,
  OnboardingHighlight,
  OnboardingStepList,
  OnboardingTour,
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
  componentManifest,
  createTelemetryEmitter,
  noopTelemetrySink,
  serializeTelemetryEvent,
  telemetryEventVersion,
  validateTelemetryEvent,
  type TelemetryEvent
} from '../src';

function manifestNameToDesignKey(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function manifestEntryToPackageSubpath(exportPath: string) {
  return exportPath.replace('@keelim/all-web-ui', '.');
}

function packageExportForComponent(componentKey: string) {
  return {
    types: `./dist/components/${componentKey}.d.ts`,
    import: `./dist/components/${componentKey}.js`,
    default: `./dist/components/${componentKey}.js`
  };
}

type StitchScreenMetadata = {
  id: string;
  sourceScreen: string;
  title: string;
  deviceType: string;
  width: string;
  height: string;
  htmlFileName: string;
  screenshotFileName?: string;
};

function readDesignComponentKeys(designMd: string) {
  const frontMatterMatch = designMd.match(/^---\n([\s\S]*?)\n---/);
  expect(frontMatterMatch).not.toBeNull();

  const frontMatter = frontMatterMatch?.[1] ?? '';
  const componentsStart = frontMatter.indexOf('components:\n');
  expect(componentsStart).toBeGreaterThanOrEqual(0);

  const componentsBlock = frontMatter.slice(componentsStart + 'components:\n'.length);
  return new Set([...componentsBlock.matchAll(/^  ([a-z0-9-]+):$/gm)].map((match) => match[1]));
}

describe('all-web-ui exports', () => {
  it('renders shared primitives with stable class contracts', () => {
    expect(renderToStaticMarkup(<Button variant="primary">저장</Button>)).toContain('kui-button--primary');
    expect(renderToStaticMarkup(<Button variant="default">저장</Button>)).toContain('kui-button--primary');
    expect(renderToStaticMarkup(<Input placeholder="입력" />)).toContain('kui-input');
    expect(renderToStaticMarkup(<Panel as="section">내용</Panel>)).toContain('kui-panel--elevated');
    expect(renderToStaticMarkup(<MetricCard><MetricValue>12.4%</MetricValue></MetricCard>)).toContain('kui-metric-card--padding-md');
    expect(renderToStaticMarkup(<MetricValue size="xl">1,204</MetricValue>)).toContain('kui-metric-value--xl');
    expect(renderToStaticMarkup(<DataNumber>3.1415</DataNumber>)).toContain('kui-data-number');
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
    expect(componentManifest.some((entry) => entry.exportPath === '@keelim/all-web-ui/button' && entry.lifecycle === 'stable')).toBe(true);
    expect(componentManifest.some((entry) => entry.exportPath === '@keelim/all-web-ui/metric-card' && entry.lifecycle === 'stable')).toBe(true);
  });

  it('exposes shared spacing css as a package export', () => {
    const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    const spacingCss = readFileSync(new URL('../src/styles/spacing.css', import.meta.url), 'utf8');

    expect(packageJson.exports['./spacing.css']).toBe('./dist/styles/spacing.css');
    expect(packageJson.exports['./metric-card'].import).toBe('./dist/components/metric-card.js');
    expect(packageJson.exports['./onboarding'].import).toBe('./dist/components/onboarding.js');
    expect(packageJson.exports['./telemetry'].import).toBe('./dist/telemetry.js');
    expect(packageJson.sideEffects).toEqual(['./dist/**/*.css']);
    expect(spacingCss).toContain('--space-4: 1rem;');
    expect(spacingCss).toContain('--kui-space-4: var(--space-4);');
  });

  it('validates and serializes opt-in telemetry events without a default sink', () => {
    const event = {
      type: 'onboarding.step.viewed',
      payload: {
        tourId: 'first-run',
        stepId: 'profile',
        stepIndex: 0
      },
      context: {
        app: 'keelim-vercel',
        surface: 'tool-home',
        theme: 'finance'
      }
    } satisfies Omit<TelemetryEvent<'onboarding.step.viewed'>, 'version'>;
    const validation = validateTelemetryEvent(event);
    const emitted: TelemetryEvent[] = [];
    const optOutEmitter = createTelemetryEmitter({
      optIn: false,
      sink: {
        enabled: true,
        emit: (payload) => emitted.push(payload)
      }
    });
    const optInEmitter = createTelemetryEmitter({
      optIn: true,
      sink: {
        enabled: true,
        emit: (payload) => emitted.push(payload)
      }
    });
    const invalidValidation = validateTelemetryEvent({
      type: 'onboarding.step.viewed',
      payload: {
        tourId: 'first-run',
        stepId: 'profile',
        stepIndex: 'zero'
      }
    });

    expect(validation.ok).toBe(true);
    expect(JSON.parse(serializeTelemetryEvent(event))).toEqual({
      ...event,
      version: telemetryEventVersion
    });
    expect(noopTelemetrySink.enabled).toBe(false);
    expect(optOutEmitter.emit(event)).toEqual({ emitted: false, reason: 'opt-out' });
    expect(emitted).toEqual([]);
    expect(optInEmitter.emit(event)).toEqual({ emitted: true });
    expect(emitted[0]?.type).toBe('onboarding.step.viewed');
    expect(invalidValidation.ok).toBe(false);
  });

  it('renders onboarding steps, tour, and highlight primitives across themes', () => {
    const steps = [
      {
        id: 'profile',
        title: 'Profile',
        description: 'Confirm the workspace profile.'
      },
      {
        id: 'interests',
        title: 'Interests',
        description: 'Pick the finance areas to prioritize.',
        optional: true
      }
    ];
    const financeHtml = renderToStaticMarkup(
      <OnboardingTour
        title="Start with the right tool"
        description="A short guided path for finance workflows."
        steps={steps}
        activeStepId="profile"
        theme="finance"
        actions={<Button variant="secondary">Skip</Button>}
      >
        <OnboardingHighlight marker="1" tone="accent" title="Recommended first step">
          Profile data shapes the default recommendations.
        </OnboardingHighlight>
      </OnboardingTour>
    );
    const adminHtml = renderToStaticMarkup(
      <div className="admin-bw-theme">
        <OnboardingStepList
          orientation="horizontal"
          steps={steps}
          activeStepId="interests"
          completedStepIds={['profile']}
        />
        <OnboardingHighlight tone="warning" title="Empty state">
          Add a profile to unlock guided setup.
        </OnboardingHighlight>
      </div>
    );

    expect(financeHtml).toContain('kui-onboarding-tour--finance');
    expect(financeHtml).toContain('data-onboarding-theme="finance"');
    expect(financeHtml).toContain('data-step-state="active"');
    expect(financeHtml).toContain('kui-onboarding-highlight--accent');
    expect(adminHtml).toContain('admin-bw-theme');
    expect(adminHtml).toContain('kui-onboarding-steps--horizontal');
    expect(adminHtml).toContain('data-step-state="complete"');
    expect(adminHtml).toContain('kui-onboarding-highlight--warning');
  });

  it('keeps Stitch MCP metadata tied to remote lanes and local artifacts', () => {
    const metadata = JSON.parse(readFileSync(new URL('../.stitch/metadata.json', import.meta.url), 'utf8'));
    const prompt = readFileSync(new URL('../.stitch/component-reference-board.prompt.md', import.meta.url), 'utf8');
    const designMd = readFileSync(new URL('../DESIGN.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
    const localDesignMdSha256 = createHash('sha256').update(designMd).digest('hex');
    const referenceBoard = metadata.localArtifacts.canonicalComponentReferenceBoard;
    const staleAssetIds = metadata.designSystems.staleLocalReferences.map((entry: { assetId: string }) => entry.assetId);
    const allScreenGroups = Object.values(metadata.screenGroups).flat() as StitchScreenMetadata[];
    const serializedCurrentAndAlternates = JSON.stringify({
      current: metadata.designSystems.current,
      alternates: metadata.designSystems.alternates
    });

    expect(metadata.schemaVersion).toBe(2);
    expect(metadata.project.id).toBe('3340586322886510921');
    expect(metadata.project.canonicalDesignSource).toBe('../DESIGN.md');
    expect(metadata.project.compatibilityDesignSource).toBe('.stitch/DESIGN.md');
    expect(metadata.project.remoteSource.designSystems).toBe('stitch_list_design_systems');
    expect(metadata.project.remoteSource.screens).toBe('stitch_list_screens');

    expect(metadata.designSystems.current.status).toBe('remote-current');
    expect(metadata.designSystems.current.displayName).toBe('all-web-ui');
    expect(metadata.designSystems.current.assetName).toBe('assets/b710cd5d4e5c45ffa898c221f7bfb4e1');
    expect(metadata.designSystems.current.assetId).toBe('b710cd5d4e5c45ffa898c221f7bfb4e1');
    expect(metadata.designSystems.current.localDesignMdSha256).toBe(localDesignMdSha256);
    expect(metadata.designSystems.current.matchesLocalDesignMd).toBe(false);
    expect(metadata.designSystems.current.remoteDesignMdSha256).toBe('2cb350030b47db5ea585c5bdf627e8077e51b667639ff1fed62fa30e67d0407f');
    expect(metadata.designSystems.current.remoteDesignMdSha256).not.toBe(localDesignMdSha256);
    expect(metadata.designSystems.current.remoteDesignMdSha256Status).toContain('stitch_list_design_systems');
    expect(metadata.designSystems.latestUpload.status).toBe('remote-uploaded');
    expect(metadata.designSystems.latestUpload.assetName).toBe('assets/4ec2002f915a4324b9e5c96fce002e5f');
    expect(metadata.designSystems.latestUpload.sourceScreen).toBe('projects/3340586322886510921/screens/1536177765000794144');
    expect(metadata.designSystems.latestUpload.localDesignMdSha256).toBe(localDesignMdSha256);
    expect(metadata.designSystems.latestUpload.remoteDesignMdSha256).toBe('55c66363378a7f0e576c80249d03ca5ce43cd2827333765314957c40c4ae367a');
    expect(metadata.designSystems.latestUpload.matchesLocalDesignMd).toBe(false);

    expect(staleAssetIds).toEqual([
      '7fc8f56dd0184c9c8ccacd823fd7286c',
      '348ee718b02b439b82ce6221b0b7a2cc',
      'b0556649d1a94d698c1f9efcc44367a4'
    ]);
    for (const staleAssetId of staleAssetIds) {
      expect(serializedCurrentAndAlternates).not.toContain(staleAssetId);
    }

    expect(metadata.screenGroups.sourceOfTruth.some((screen: StitchScreenMetadata) => screen.title === 'DESIGN.md')).toBe(true);
    expect(metadata.screenGroups.sourceOfTruth.some((screen: StitchScreenMetadata) => screen.id === '1536177765000794144')).toBe(true);
    expect(metadata.screenGroups.componentLibrary.some((screen: StitchScreenMetadata) => screen.id === referenceBoard.id)).toBe(true);
    expect(metadata.screenGroups.consumerReferences.some((screen: StitchScreenMetadata) => screen.title.includes('Finance'))).toBe(true);
    expect(metadata.screenGroups.workspaceMaps.some((screen: StitchScreenMetadata) => screen.title.includes('Workspace Map'))).toBe(true);

    for (const screen of allScreenGroups) {
      expect(screen.id).toBeTruthy();
      expect(screen.sourceScreen).toContain(`/screens/${screen.id}`);
      expect(screen.title).toBeTruthy();
      expect(screen.deviceType).toBeTruthy();
      expect(screen.width).toBeTruthy();
      expect(screen.height).toBeTruthy();
      expect(screen.htmlFileName).toContain('/files/');
    }

    expect(referenceBoard.status).toBe('canonical-local-reference');
    expect(referenceBoard.id).toBe('d5193357b37444b3b631544bec61e8c3');
    expect(referenceBoard.localHtml).toContain(referenceBoard.id);
    expect(referenceBoard.localScreenshot).toContain(referenceBoard.id);
    expect(existsSync(new URL(`../${referenceBoard.localHtml}`, import.meta.url))).toBe(true);
    expect(existsSync(new URL(`../${referenceBoard.localScreenshot}`, import.meta.url))).toBe(true);
    expect(prompt).toContain('layout, content');
    expect(prompt).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(prompt).not.toContain('hsl(');
  });

  it('keeps local validation commands deterministic in the Bun workspace', () => {
    const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    const buildScript = readFileSync(new URL('../scripts/build.mjs', import.meta.url), 'utf8');
    const stylesCss = readFileSync(new URL('../src/styles/styles.css', import.meta.url), 'utf8');

    expect(packageJson.scripts['design:lint']).toBe('bun x @google/design.md lint DESIGN.md');
    expect(packageJson.scripts.prepublishOnly).toContain('bun run package:smoke');
    expect(packageJson.scripts.prepublishOnly).toContain('bun run pack:verify');
    expect(packageJson.peerDependencies.react).toBe('^19.0.0');
    expect(packageJson.peerDependencies['react-dom']).toBe('^19.0.0');
    expect(buildScript).toContain("node_modules', '.bin'");
    expect(buildScript).not.toContain("spawn('bunx'");
    expect(stylesCss).not.toContain('letter-spacing: -');
    expect(stylesCss).not.toContain('letter-spacing: 0.');
  });

  it('ships light and dark semantic theme tokens for shared primitives', () => {
    const financeCss = readFileSync(new URL('../src/styles/themes/finance.css', import.meta.url), 'utf8');
    const adminCss = readFileSync(new URL('../src/styles/themes/admin-bw.css', import.meta.url), 'utf8');
    const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

    expect(packageJson.exports['./themes/finance.css']).toBe('./dist/styles/themes/finance.css');
    expect(packageJson.exports['./themes/admin-bw.css']).toBe('./dist/styles/themes/admin-bw.css');
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

  it('keeps the Stitch DESIGN.md component catalog aligned with stable exports', () => {
    const designMd = readFileSync(new URL('../DESIGN.md', import.meta.url), 'utf8');
    const indexTs = readFileSync(new URL('../src/index.ts', import.meta.url), 'utf8');
    const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    const designComponentKeys = readDesignComponentKeys(designMd);
    const stableComponents = componentManifest.filter((entry) => entry.lifecycle === 'stable');
    const stableComponentKeys = stableComponents.map((entry) => manifestNameToDesignKey(entry.name));
    const missingComponentKeys = stableComponentKeys.filter((key) => !designComponentKeys.has(key));

    expect(missingComponentKeys).toEqual([]);
    expect(designComponentKeys.has('button-accent')).toBe(true);
    expect(designComponentKeys.has('badge-success')).toBe(true);
    expect(designComponentKeys.has('market-up-chip')).toBe(true);
    expect(designComponentKeys.has('market-down-chip')).toBe(true);
    expect(designComponentKeys.has('admin-shell')).toBe(true);

    for (const entry of stableComponents) {
      const componentKey = manifestNameToDesignKey(entry.name);
      const packageSubpath = manifestEntryToPackageSubpath(entry.exportPath);

      expect(existsSync(new URL(`../src/components/${componentKey}.tsx`, import.meta.url))).toBe(true);
      expect(packageJson.exports[packageSubpath]).toEqual(packageExportForComponent(componentKey));
      expect(indexTs).toMatch(new RegExp(`from ['"]\\./components/${componentKey}['"]`));
      expect(designMd).toContain(entry.exportPath);
    }
  });
});
