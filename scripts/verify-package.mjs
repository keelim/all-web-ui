#!/usr/bin/env node
// Verifies the public package contract against built dist artifacts and npm pack output.

import { spawn } from 'node:child_process';
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile
} from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const distDir = resolve(repoRoot, 'dist');
const packageJsonPath = resolve(repoRoot, 'package.json');
const packageName = '@keelim/all-web-ui';
const cssSideEffectsGlob = './dist/**/*.css';

export async function verifyPackageDist() {
  const packageJson = await readJson(packageJsonPath);
  const failures = [];

  await verifyExportTargets(packageJson, failures);
  await verifyCssContract(packageJson, failures);
  await verifyManifestExports(packageJson, failures);
  await verifyDependencyContract(packageJson, failures);
  await verifyTreeShakingContract(packageJson, failures);
  await verifyRelativeModuleSpecifiers(failures);

  if (failures.length > 0) {
    fail(`dist contract failed:\n${failures.map((failure) => `  - ${failure}`).join('\n')}`);
  }

  console.log('[package-verify] dist contract OK');
}

async function verifyPackContents() {
  const packageJson = await readJson(packageJsonPath);
  await verifyPackageDist();

  const result = await runCommand('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: repoRoot
  });
  const packs = JSON.parse(result.stdout || '[]');
  const pack = packs[0];
  if (!pack?.files) {
    fail('npm pack did not return file metadata');
  }

  const files = new Set(pack.files.map((entry) => normalizePath(entry.path)));
  const required = new Set(['package.json', 'README.md']);
  for (const target of collectPackageTargets(packageJson)) {
    if (target.startsWith('./dist/')) {
      required.add(target.slice(2));
    }
  }

  const missing = [...required].filter((file) => !files.has(file));
  const unexpected = [...files].filter((file) => !isAllowedPackedFile(file));

  if (missing.length > 0 || unexpected.length > 0) {
    const details = [
      ...missing.map((file) => `missing ${file}`),
      ...unexpected.map((file) => `unexpected ${file}`)
    ];
    fail(`npm pack contents failed:\n${details.map((detail) => `  - ${detail}`).join('\n')}`);
  }

  console.log(`[package-verify] npm pack dry-run OK (${files.size} files)`);
}

async function verifyConsumerSmoke() {
  await verifyPackageDist();

  const tempDir = await mkdtemp(join(tmpdir(), 'all-web-ui-smoke-'));
  try {
    await mkdir(resolve(tempDir, 'node_modules', '@keelim'), { recursive: true });
    await symlink(repoRoot, resolve(tempDir, 'node_modules', '@keelim', 'all-web-ui'), 'dir');

    await writeFile(
      resolve(tempDir, 'runtime-smoke.mjs'),
      [
        "import { Button, componentManifest, createTelemetryEmitter } from '@keelim/all-web-ui';",
        "import { Button as SubpathButton } from '@keelim/all-web-ui/button';",
        "import { componentManifest as ManifestSubpath } from '@keelim/all-web-ui/manifest';",
        "if (Button !== SubpathButton) throw new Error('root and subpath Button exports diverged');",
        "if (!Array.isArray(componentManifest) || componentManifest.length !== ManifestSubpath.length) throw new Error('manifest export mismatch');",
        "const emitter = createTelemetryEmitter({ optIn: false });",
        "const result = emitter.emit({ type: 'onboarding.step.viewed', payload: { tourId: 'tour', stepId: 'step', stepIndex: 0 } });",
        "if (result.reason !== 'opt-out') throw new Error('telemetry smoke failed');"
      ].join('\n'),
      'utf8'
    );
    await runCommand(process.execPath, ['runtime-smoke.mjs'], { cwd: tempDir });

    const packageJson = await readJson(packageJsonPath);
    const importLines = collectTypedExportSubpaths(packageJson).map((subpath, index) => {
      const specifier = subpath === '.' ? packageName : `${packageName}/${subpath.slice(2)}`;
      return `import * as Entry${index} from '${specifier}'; void Entry${index};`;
    });
    await writeFile(
      resolve(tempDir, 'type-smoke.ts'),
      [
        "import { Button, type ButtonProps } from '@keelim/all-web-ui';",
        "import { Button as ButtonSubpath } from '@keelim/all-web-ui/button';",
        "const props: ButtonProps = { variant: 'primary' };",
        'void Button;',
        'void ButtonSubpath;',
        'void props;',
        ...importLines
      ].join('\n'),
      'utf8'
    );
    await writeFile(
      resolve(tempDir, 'tsconfig.json'),
      `${JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2022',
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            jsx: 'react-jsx',
            strict: true,
            skipLibCheck: false,
            noEmit: true
          },
          include: ['type-smoke.ts']
        },
        null,
        2
      )}\n`,
      'utf8'
    );

    const tscBin = resolve(repoRoot, 'node_modules', '.bin', process.platform === 'win32' ? 'tsc.cmd' : 'tsc');
    await runCommand(tscBin, ['-p', 'tsconfig.json'], { cwd: tempDir });

    await verifySubpathBundleIsolation(tempDir);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }

  console.log('[package-verify] consumer smoke OK');
}

async function verifySubpathBundleIsolation(tempDir) {
  if (!globalThis.Bun?.build) {
    console.log('[package-verify] bundle isolation skipped outside Bun');
    return;
  }

  const entrypoint = resolve(tempDir, 'bundle-smoke.ts');
  await writeFile(
    entrypoint,
    [
      "import { Button } from '@keelim/all-web-ui/button';",
      "console.log(Button);"
    ].join('\n'),
    'utf8'
  );

  const result = await Bun.build({
    entrypoints: [entrypoint],
    target: 'browser',
    format: 'esm',
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    minify: false,
    write: false
  });

  if (!result.success) {
    fail(`subpath bundle failed:\n${result.logs.map((log) => String(log)).join('\n')}`);
  }

  const bundleText = await result.outputs[0].text();
  const forbiddenSignatures = [
    'kui-accordion',
    'kui-calendar',
    'kui-dropdown-menu',
    'kui-metric-card',
    'kui-tooltip'
  ];
  const leakedSignature = forbiddenSignatures.find((signature) => bundleText.includes(signature));
  if (leakedSignature) {
    fail(`button subpath bundle pulled unrelated component signature: ${leakedSignature}`);
  }
}

async function verifyReleaseVersion() {
  const packageJson = await readJson(packageJsonPath);
  if (process.env.GITHUB_EVENT_NAME !== 'release') {
    console.log('[package-verify] release version check skipped for non-release event');
    return;
  }

  const eventPath = process.env.GITHUB_EVENT_PATH;
  const event = eventPath && existsSync(eventPath) ? await readJson(eventPath) : {};
  const tagName = event.release?.tag_name || process.env.GITHUB_REF_NAME || '';
  const releaseName = event.release?.name || '';
  const accepted = new Set([packageJson.version, `v${packageJson.version}`]);

  if (!accepted.has(tagName) && !accepted.has(releaseName)) {
    fail(
      `release tag/name must match package version ${packageJson.version}; got tag=${tagName || '<empty>'} name=${releaseName || '<empty>'}`
    );
  }

  console.log(`[package-verify] release version OK (${packageJson.version})`);
}

async function verifyVersionNotPublished() {
  const packageJson = await readJson(packageJsonPath);
  const registry = packageJson.publishConfig?.registry ?? 'https://npm.pkg.github.com';
  const result = await runCommand(
    'npm',
    ['view', `${packageJson.name}@${packageJson.version}`, 'version', '--registry', registry, '--json'],
    { cwd: repoRoot, allowFailure: true }
  );
  const combinedOutput = `${result.stdout}\n${result.stderr}`;

  if (result.code === 0 && result.stdout.trim()) {
    fail(`${packageJson.name}@${packageJson.version} is already published to ${registry}`);
  }

  if (/(E404|404|not found|No match found)/i.test(combinedOutput)) {
    console.log(`[package-verify] version is not published (${packageJson.name}@${packageJson.version})`);
    return;
  }

  fail(`could not confirm publish availability:\n${combinedOutput.trim()}`);
}

async function verifyExportTargets(packageJson, failures) {
  const targets = collectPackageTargets(packageJson);
  for (const target of targets) {
    if (!target.startsWith('./')) {
      failures.push(`package target must be relative: ${target}`);
      continue;
    }

    const targetPath = resolve(repoRoot, target);
    if (!existsSync(targetPath)) {
      failures.push(`missing package target ${target}`);
    }
  }
}

async function verifyCssContract(packageJson, failures) {
  if (!Array.isArray(packageJson.sideEffects)) {
    failures.push('sideEffects must be an array');
    return;
  }

  if (!packageJson.sideEffects.includes(cssSideEffectsGlob)) {
    failures.push(`sideEffects must include ${cssSideEffectsGlob}`);
  }

  const manualCssEntries = packageJson.sideEffects.filter(
    (entry) => entry !== cssSideEffectsGlob && entry.endsWith('.css')
  );
  if (manualCssEntries.length > 0) {
    failures.push(`sideEffects must use the CSS glob instead of manual files: ${manualCssEntries.join(', ')}`);
  }

  const srcStylesDir = resolve(repoRoot, 'src', 'styles');
  const cssFiles = (await collectFiles(srcStylesDir)).filter((file) => file.endsWith('.css'));
  for (const sourceFile of cssFiles) {
    const styleRel = normalizePath(relative(srcStylesDir, sourceFile));
    const exportKey = `./${styleRel}`;
    const target = `./dist/styles/${styleRel}`;
    if (packageJson.exports?.[exportKey] !== target) {
      failures.push(`missing CSS export ${exportKey} -> ${target}`);
    }
    if (!existsSync(resolve(repoRoot, target))) {
      failures.push(`missing copied CSS asset ${target}`);
    }
  }
}

async function verifyManifestExports(packageJson, failures) {
  const manifestPath = resolve(distDir, 'manifest.js');
  if (!existsSync(manifestPath)) {
    failures.push('missing dist/manifest.js');
    return;
  }

  const manifestModule = await import(`${pathToFileURL(manifestPath).href}?verify=${Date.now()}`);
  const entries = manifestModule.componentManifest ?? [];
  for (const entry of entries.filter((item) => item.lifecycle === 'stable')) {
    const componentKey = nameToComponentKey(entry.name);
    const exportKey = entry.exportPath.replace(packageName, '.');
    const expected = {
      types: `./dist/components/${componentKey}.d.ts`,
      import: `./dist/components/${componentKey}.js`,
      default: `./dist/components/${componentKey}.js`
    };

    if (JSON.stringify(packageJson.exports?.[exportKey]) !== JSON.stringify(expected)) {
      failures.push(`manifest export drift for ${entry.exportPath}`);
    }

    if (!existsSync(resolve(repoRoot, 'src', 'components', `${componentKey}.tsx`))) {
      failures.push(`manifest component source missing for ${entry.exportPath}`);
    }
  }
}

async function verifyDependencyContract(packageJson, failures) {
  const externalPackages = new Set();
  const sourceFiles = (await collectFiles(resolve(repoRoot, 'src'))).filter((file) => /\.(ts|tsx)$/.test(file));
  const importPattern = /\b(?:import|export)\s+(?:type\s+)?(?:[^'"]*?\s+from\s*)?['"]([^'"]+)['"]/gs;

  for (const file of sourceFiles) {
    const text = await readFile(file, 'utf8');
    let match;
    while ((match = importPattern.exec(text)) !== null) {
      const specifier = match[1];
      if (specifier.startsWith('.') || specifier.startsWith('node:')) {
        continue;
      }

      externalPackages.add(packageNameFromSpecifier(specifier));
    }
  }

  for (const externalPackage of [...externalPackages].sort()) {
    if (externalPackage === 'react' || externalPackage === 'react-dom') {
      if (!packageJson.peerDependencies?.[externalPackage]) {
        failures.push(`${externalPackage} must be a peerDependency`);
      }
      if (!packageJson.devDependencies?.[externalPackage]) {
        failures.push(`${externalPackage} must be a devDependency for local tests`);
      }
      continue;
    }

    if (!packageJson.dependencies?.[externalPackage]) {
      failures.push(`${externalPackage} import is missing from dependencies`);
    }
  }

  if (packageJson.peerDependencies?.react !== '^19.0.0') {
    failures.push('react peerDependency must support the full React 19 major via ^19.0.0');
  }
  if (packageJson.peerDependencies?.['react-dom'] !== '^19.0.0') {
    failures.push('react-dom peerDependency must support the full React 19 major via ^19.0.0');
  }
}

async function verifyTreeShakingContract(packageJson, failures) {
  const indexPath = resolve(distDir, 'index.js');
  if (!existsSync(indexPath)) {
    failures.push('missing dist/index.js');
    return;
  }

  const indexJs = await readFile(indexPath, 'utf8');
  const nonReExportLines = indexJs
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('export '));
  if (nonReExportLines.length > 0) {
    failures.push('dist/index.js must remain re-export-only for tree-shaking');
  }

  if (packageJson.sideEffects.some((entry) => entry !== cssSideEffectsGlob)) {
    failures.push('sideEffects must stay CSS-only so JS subpath imports remain tree-shakable');
  }
}

async function verifyRelativeModuleSpecifiers(failures) {
  const moduleFiles = (await collectFiles(distDir)).filter((file) => file.endsWith('.js') || file.endsWith('.d.ts'));
  const relativeImportPattern = /\b(?:from\s*|import\s*)['"](\.\.?\/[^'"]+)['"]/g;

  for (const file of moduleFiles) {
    const text = await readFile(file, 'utf8');
    let match;
    while ((match = relativeImportPattern.exec(text)) !== null) {
      const specifier = match[1];
      if (!extname(specifier)) {
        failures.push(`${normalizePath(relative(repoRoot, file))} has extensionless relative specifier ${specifier}`);
      }
    }
  }
}

function collectPackageTargets(packageJson) {
  const targets = new Set();
  for (const key of ['main', 'module', 'types']) {
    if (packageJson[key]) {
      targets.add(packageJson[key]);
    }
  }

  collectExportTargets(packageJson.exports, targets);
  return targets;
}

function collectExportTargets(value, targets) {
  if (!value) return;
  if (typeof value === 'string') {
    targets.add(value);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectExportTargets(item, targets);
    return;
  }

  if (typeof value === 'object') {
    for (const item of Object.values(value)) collectExportTargets(item, targets);
  }
}

function collectTypedExportSubpaths(packageJson) {
  return Object.entries(packageJson.exports)
    .filter(([, value]) => typeof value === 'object' && value?.types)
    .map(([subpath]) => subpath);
}

async function collectFiles(root) {
  const results = [];
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const entryPath = resolve(root, entry.name);
    if (entry.isDirectory()) {
      results.push(...await collectFiles(entryPath));
      continue;
    }

    if (entry.isFile()) {
      results.push(entryPath);
    }
  }

  return results;
}

function isAllowedPackedFile(file) {
  return file === 'package.json' || file === 'README.md' || file.startsWith('dist/');
}

function nameToComponentKey(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function packageNameFromSpecifier(specifier) {
  if (specifier.startsWith('@')) {
    return specifier.split('/').slice(0, 2).join('/');
  }

  return specifier.split('/')[0];
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

function normalizePath(path) {
  return path.split(sep).join('/');
}

async function runCommand(command, args, options = {}) {
  return await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? repoRoot,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk;
      if (options.inheritOutput) process.stdout.write(chunk);
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
      if (options.inheritOutput) process.stderr.write(chunk);
    });
    child.on('error', rejectPromise);
    child.on('close', (code) => {
      const result = { code, stdout, stderr };
      if (code === 0 || options.allowFailure) {
        resolvePromise(result);
        return;
      }

      rejectPromise(new Error(`${command} ${args.join(' ')} failed with exit code ${code}\n${stdout}${stderr}`));
    });
  });
}

function fail(message) {
  console.error(`[package-verify] FAIL: ${message}`);
  process.exit(1);
}

async function main() {
  const command = process.argv[2] ?? 'dist';
  if (command === 'dist') {
    await verifyPackageDist();
  } else if (command === 'pack') {
    await verifyPackContents();
  } else if (command === 'smoke') {
    await verifyConsumerSmoke();
  } else if (command === 'release-version') {
    await verifyReleaseVersion();
  } else if (command === 'publish-version') {
    await verifyVersionNotPublished();
  } else {
    fail(`unknown command: ${command}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
