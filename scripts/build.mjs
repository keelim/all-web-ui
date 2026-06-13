import { cp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { verifyPackageDist } from './verify-package.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const distDir = resolve(repoRoot, 'dist');
const tscBin = resolve(repoRoot, 'node_modules', '.bin', process.platform === 'win32' ? 'tsc.cmd' : 'tsc');

await removeDistDir();

await new Promise((resolvePromise, rejectPromise) => {
  const child = spawn(tscBin, ['-p', 'tsconfig.build.json'], {
    cwd: repoRoot,
    stdio: 'inherit'
  });

  child.on('exit', (code) => {
    if (code === 0) {
      resolvePromise();
      return;
    }

    rejectPromise(new Error(`tsc build failed with exit code ${code ?? 'unknown'}`));
  });

  child.on('error', rejectPromise);
});

await cp(resolve(repoRoot, 'src', 'styles'), resolve(distDir, 'styles'), { recursive: true });

await rewriteRelativeJsSpecifiers(distDir);
await verifyPackageDist();

async function removeDistDir() {
  await rm(distDir, { recursive: true, force: true });
}

async function rewriteRelativeJsSpecifiers(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      await rewriteRelativeJsSpecifiers(entryPath);
      continue;
    }

    if (!entry.isFile() || (!entry.name.endsWith('.js') && !entry.name.endsWith('.d.ts'))) {
      continue;
    }

    const original = await readFile(entryPath, 'utf8');
    const rewritten = original
      .replace(
        /((?:import|export)\s[^'"]*?from\s*['"])(\.\.?\/[^'"]+)(['"])/g,
        (_, prefix, specifier, suffix) => `${prefix}${withJsExtension(specifier)}${suffix}`
      )
      .replace(
        /(\bimport\s*['"])(\.\.?\/[^'"]+)(['"])/g,
        (_, prefix, specifier, suffix) => `${prefix}${withJsExtension(specifier)}${suffix}`
      );

    if (rewritten !== original) {
      await writeFile(entryPath, rewritten);
    }
  }
}

function withJsExtension(specifier) {
  if (extname(specifier)) {
    return specifier;
  }

  return `${specifier}.js`;
}
