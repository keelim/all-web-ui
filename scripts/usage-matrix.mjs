#!/usr/bin/env node
// W1-webui-01 — Downstream usage matrix for @keelim/all-web-ui.
//
// Cross-references the component manifest (src/manifest.ts) and the root barrel
// exports (src/index.ts) against actual imports in downstream consumers
// (keelim-vercel, rich/web), producing a { component x consumer x count } matrix.
//
// Usage:
//   node scripts/usage-matrix.mjs            # write matrix JSON + print summary, exit 0
//   node scripts/usage-matrix.mjs --check    # additionally exit 1 on subpath drift
//
// Drift = a consumer imports `@keelim/all-web-ui/<subpath>` that is NOT declared
// in the manifest. Root-barrel identifier mismatches are reported as
// `unknownIdentifiers` (informational) but do NOT fail --check, to keep the gate
// stable against legitimate sub-component exports.

import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WORKSPACE_ROOT = resolve(REPO_ROOT, '..');
const PKG = '@keelim/all-web-ui';

/** @typedef {{ name: string, exportPath: string, lifecycle: string }} ManifestEntry */

/**
 * Parse src/manifest.ts for component entries.
 * @returns {{ names: Set<string>, subpaths: Set<string>, entries: ManifestEntry[] }}
 */
function parseManifest() {
  const text = readFileSync(join(REPO_ROOT, 'src', 'manifest.ts'), 'utf8');
  const entries = [];
  const re = /name:\s*'([^']+)'\s*,\s*exportPath:\s*'([^']+)'\s*,\s*lifecycle:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    entries.push({ name: m[1], exportPath: m[2], lifecycle: m[3] });
  }
  const names = new Set(entries.map((e) => e.name));
  // subpath suffix after the package name, e.g. '@keelim/all-web-ui/badge' -> 'badge'
  const subpaths = new Set(
    entries.map((e) => e.exportPath.startsWith(`${PKG}/`) ? e.exportPath.slice(PKG.length + 1) : '')
  );
  subpaths.delete('');
  return { names, subpaths, entries };
}

/**
 * Parse src/index.ts for the set of named exports (value + type identifiers).
 * @returns {Set<string>}
 */
function parseBarrelExports() {
  const text = readFileSync(join(REPO_ROOT, 'src', 'index.ts'), 'utf8');
  const ids = new Set();
  const blockRe = /export\s*\{([^}]*)\}\s*from/gs;
  let m;
  while ((m = blockRe.exec(text)) !== null) {
    for (const raw of m[1].split(',')) {
      let id = raw.trim();
      if (!id) continue;
      id = id.replace(/^type\s+/, '');
      const asMatch = id.match(/\bas\s+([A-Za-z0-9_$]+)$/);
      if (asMatch) id = asMatch[1];
      id = id.replace(/\s+/g, '');
      if (id) ids.add(id);
    }
  }
  return ids;
}

const IGNORE_DIRS = new Set(['node_modules', '.next', 'dist', '.git', '.turbo', 'coverage', 'build']);

/**
 * Recursively collect .ts/.tsx files under a directory (bounded, skips build dirs).
 * @param {string} dir
 * @param {string[]} out
 * @returns {string[]}
 */
function collectSourceFiles(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    if (ent.name.startsWith('.') && ent.name !== '.') continue;
    if (IGNORE_DIRS.has(ent.name)) continue;
    const full = join(dir, ent.name);
    if (ent.isDirectory()) {
      collectSourceFiles(full, out);
    } else if (/\.(tsx?|jsx?)$/.test(ent.name)) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Find imports of the package in a consumer directory.
 * @param {string} consumerDir
 * @returns {{ found: boolean, imports: Array<{ subpath: string, identifiers: string[] }> }}
 */
function findConsumerImports(consumerDir) {
  if (!existsSync(consumerDir)) return { found: false, imports: [] };
  const files = [];
  for (const sub of ['app', 'src', 'components', 'lib']) {
    collectSourceFiles(join(consumerDir, sub), files);
  }
  // de-dup
  const unique = [...new Set(files)];
  const importRe = new RegExp(
    `import\\s+(?:type\\s+)?(?:\\{([^}]*)\\}|[A-Za-z0-9_$]+|\\*\\s+as\\s+[A-Za-z0-9_$]+)?\\s*(?:,\\s*\\{([^}]*)\\})?\\s*from\\s*['"]${PKG.replace(/[/\\]/g, '\\$&')}([^'"]*)['"]`,
    'g'
  );
  const sideEffectRe = new RegExp(`import\\s*['"]${PKG.replace(/[/\\]/g, '\\$&')}([^'"]*)['"]`, 'g');
  const imports = [];
  for (const file of unique) {
    let text;
    try {
      text = readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    if (!text.includes(PKG)) continue;
    let m;
    while ((m = importRe.exec(text)) !== null) {
      const subpath = (m[3] || '').replace(/^\//, '');
      const idents = `${m[1] || ''},${m[2] || ''}`
        .split(',')
        .map((s) => s.replace(/^type\s+/, '').replace(/\bas\b.*$/, '').trim())
        .filter(Boolean);
      imports.push({ subpath, identifiers: idents });
    }
    while ((m = sideEffectRe.exec(text)) !== null) {
      imports.push({ subpath: (m[1] || '').replace(/^\//, ''), identifiers: [] });
    }
  }
  return { found: true, imports };
}

function main() {
  const check = process.argv.includes('--check');
  const { names, subpaths } = parseManifest();
  const barrelExports = parseBarrelExports();
  const known = new Set([...names, ...barrelExports]);

  const consumers = {
    'keelim-vercel': join(WORKSPACE_ROOT, 'keelim-vercel'),
    'rich/web': join(WORKSPACE_ROOT, 'rich', 'web')
  };

  /** @type {Record<string, Record<string, number>>} */
  const matrix = {};
  /** @type {Record<string, string[]>} */
  const unknownIdentifiers = {};
  /** @type {Array<{ consumer: string, subpath: string }>} */
  const subpathDrift = [];
  /** @type {Array<{ consumer: string, subpath: string }>} */
  const styleImports = [];
  const seenStyle = new Set();
  const missingConsumers = [];

  for (const [consumer, dir] of Object.entries(consumers)) {
    const { found, imports } = findConsumerImports(dir);
    if (!found) {
      missingConsumers.push(consumer);
      continue;
    }
    for (const imp of imports) {
      if (imp.subpath) {
        if (imp.subpath.endsWith('.css')) {
          // Stylesheet/theme entrypoints are not component-manifest entries.
          const key = `${consumer}:${imp.subpath}`;
          if (!seenStyle.has(key)) {
            seenStyle.add(key);
            styleImports.push({ consumer, subpath: imp.subpath });
          }
        } else if (!subpaths.has(imp.subpath)) {
          subpathDrift.push({ consumer, subpath: imp.subpath });
        }
      }
      for (const id of imp.identifiers) {
        matrix[id] ??= {};
        matrix[id][consumer] = (matrix[id][consumer] || 0) + 1;
        if (!known.has(id)) {
          (unknownIdentifiers[consumer] ??= []).push(id);
        }
      }
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    package: PKG,
    manifestComponentCount: names.size,
    barrelExportCount: barrelExports.size,
    consumers: Object.keys(consumers),
    missingConsumers,
    matrix,
    unknownIdentifiers,
    styleImports,
    subpathDrift
  };

  const outDir = join(REPO_ROOT, 'dist');
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, 'usage-matrix.json');
  writeFileSync(outFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  const usedComponents = Object.keys(matrix).length;
  console.log(`[usage-matrix] manifest=${names.size} barrel=${barrelExports.size} usedIdentifiers=${usedComponents}`);
  if (missingConsumers.length) {
    console.log(`[usage-matrix] consumers not found (skipped): ${missingConsumers.join(', ')}`);
  }
  console.log(`[usage-matrix] wrote ${outFile}`);

  if (check) {
    if (subpathDrift.length > 0) {
      console.error('[usage-matrix] DRIFT: consumers import subpaths not in manifest:');
      for (const d of subpathDrift) console.error(`  - ${d.consumer}: ${PKG}/${d.subpath}`);
      process.exit(1);
    }
    console.log('[usage-matrix] --check OK (no subpath drift)');
  }
}

main();
