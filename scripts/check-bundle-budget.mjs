#!/usr/bin/env node
// Static package bundle budget gate. Reads only dist build artifacts.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = resolve(dirname(fileURLToPath(import.meta.url)), 'bundle-budget.config.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const distDir = resolve(repoRoot, config.distDir ?? 'dist');

function main() {
  if (!existsSync(distDir)) {
    fail(`Dist directory not found: ${relative(repoRoot, distDir)}. Run bun run build first.`);
  }

  const files = findFiles(distDir).map((file) => ({
    file: relative(distDir, file),
    bytes: statSync(file).size
  }));

  const totals = {
    total: sum(files),
    js: sum(files.filter((entry) => entry.file.endsWith('.js'))),
    css: sum(files.filter((entry) => entry.file.endsWith('.css'))),
    dts: sum(files.filter((entry) => entry.file.endsWith('.d.ts')))
  };

  const violations = [
    ['total', totals.total, config.maxTotalBytes],
    ['javascript', totals.js, config.maxJavaScriptBytes],
    ['css', totals.css, config.maxCssBytes],
    ['declarations', totals.dts, config.maxDeclarationBytes]
  ].filter(([, actual, budget]) => actual > budget);

  for (const file of files) {
    if (file.bytes > config.maxFileBytes) {
      violations.push([file.file, file.bytes, config.maxFileBytes]);
    }
  }

  console.log('[bundle-budget] all-web-ui dist budget');
  printTable(
    ['Group', 'Size', 'Budget'],
    [
      ['total', formatBytes(totals.total), formatBytes(config.maxTotalBytes)],
      ['javascript', formatBytes(totals.js), formatBytes(config.maxJavaScriptBytes)],
      ['css', formatBytes(totals.css), formatBytes(config.maxCssBytes)],
      ['declarations', formatBytes(totals.dts), formatBytes(config.maxDeclarationBytes)]
    ]
  );

  console.log('\n[bundle-budget] largest files');
  printTable(
    ['File', 'Size'],
    files
      .sort((a, b) => b.bytes - a.bytes || a.file.localeCompare(b.file))
      .slice(0, 15)
      .map((entry) => [entry.file, formatBytes(entry.bytes)])
  );

  if (violations.length > 0) {
    console.error('\n[bundle-budget] Violations:');
    printTable(
      ['Scope', 'Size', 'Budget'],
      violations.map(([scope, actual, budget]) => [scope, formatBytes(actual), formatBytes(budget)])
    );
    process.exit(1);
  }

  console.log('\n[bundle-budget] OK');
}

function findFiles(root) {
  const results = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(path));
    } else if (entry.isFile()) {
      results.push(path);
    }
  }
  return results;
}

function sum(files) {
  return files.reduce((total, entry) => total + entry.bytes, 0);
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

function printTable(headers, rows) {
  const widths = headers.map((header, column) =>
    Math.max(header.length, ...rows.map((row) => String(row[column]).length))
  );
  const render = (cells) =>
    `| ${cells.map((cell, index) => String(cell).padEnd(widths[index])).join(' | ')} |`;
  console.log(render(headers));
  console.log(render(widths.map((width) => '-'.repeat(width))));
  for (const row of rows) console.log(render(row));
}

function fail(message) {
  console.error(`[bundle-budget] FAIL: ${message}`);
  process.exit(1);
}

main();
