// design-sync only: builds cfg.cssEntry (.design-sync/generated/styles.compiled.css).
//
// 1. dist/styles/styles.css ships unresolved @import specifiers (npm packages +
//    a relative sibling) because scripts/build.mjs copies src/styles/ verbatim
//    and consumers resolve them with their own bundler. Inline each one.
// 2. Append a Tailwind v4 layer compiled from tailwind.input.css (classes used
//    in dist/ only), standing in for the consumer app's own Tailwind build.
//
// Needs `bun run build` (dist/) and the converter deps in .ds-sync/ with
// tailwindcss + @tailwindcss/cli, reachable via the gitignored symlink
// .design-sync/node_modules -> ../.ds-sync/node_modules.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const here = import.meta.dirname;
const root = resolve(here, '..');
const src = resolve(root, 'dist/styles/styles.css');
const outDir = resolve(here, 'generated');
const out = resolve(outDir, 'styles.compiled.css');
const tailwindOut = resolve(outDir, 'tailwind.css');
const tailwindBin = resolve(here, 'node_modules/.bin/tailwindcss');

const map = {
  '@astryxdesign/core/reset.css': resolve(root, 'node_modules/@astryxdesign/core/src/reset.css'),
  '@astryxdesign/core/astryx.css': resolve(root, 'node_modules/@astryxdesign/core/dist/astryx.css'),
  '@astryxdesign/theme-neutral/theme.css': resolve(root, 'node_modules/@astryxdesign/theme-neutral/dist/theme.css'),
  './spacing.css': resolve(dirname(src), 'spacing.css'),
};

if (!existsSync(tailwindBin)) {
  throw new Error(`missing ${tailwindBin}: install tailwindcss@4 @tailwindcss/cli in .ds-sync and link .design-sync/node_modules`);
}
mkdirSync(outDir, { recursive: true });

let text = readFileSync(src, 'utf8');
let replaced = 0;
for (const [specifier, filePath] of Object.entries(map)) {
  const re = new RegExp(`@import\\s+['"]${specifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"];?`);
  if (re.test(text)) {
    text = text.replace(re, `/* inlined: ${specifier} */\n${readFileSync(filePath, 'utf8')}`);
    replaced++;
  }
}
const leftover = text.match(/@import\s+[^;]+;/g);
if (leftover) {
  throw new Error(`unmapped @import(s) in dist/styles/styles.css: ${leftover.join(' ')} - extend the map`);
}

execFileSync(tailwindBin, ['-i', resolve(here, 'tailwind.input.css'), '-o', tailwindOut], { cwd: here, stdio: 'inherit' });
const tailwind = readFileSync(tailwindOut, 'utf8');

writeFileSync(out, `${text}\n/* design-sync: Tailwind layer (tailwind.input.css) */\n${tailwind}`);
console.log(`inlined ${replaced}/${Object.keys(map).length} imports + Tailwind layer (${Math.round(tailwind.length / 1024)} KB) -> ${out}`);
