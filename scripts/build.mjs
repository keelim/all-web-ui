import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const distDir = resolve(repoRoot, 'dist');

await removeDistDir();

await new Promise((resolvePromise, rejectPromise) => {
  const child = spawn('bunx', ['tsc', '-p', 'tsconfig.build.json'], {
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

await mkdir(resolve(distDir, 'styles', 'themes'), { recursive: true });
await cp(resolve(repoRoot, 'src', 'styles', 'styles.css'), resolve(distDir, 'styles', 'styles.css'));
await cp(resolve(repoRoot, 'src', 'styles', 'themes', 'admin-bw.css'), resolve(distDir, 'styles', 'themes', 'admin-bw.css'));
await cp(resolve(repoRoot, 'src', 'styles', 'themes', 'finance.css'), resolve(distDir, 'styles', 'themes', 'finance.css'));

await rewriteRelativeJsSpecifiers(distDir);

async function removeDistDir() {
  await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn('/bin/rm', ['-rf', distDir], {
      cwd: repoRoot,
      stdio: 'inherit'
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolvePromise();
        return;
      }

      rejectPromise(new Error(`dist cleanup failed with exit code ${code ?? 'unknown'}`));
    });

    child.on('error', rejectPromise);
  });
}

async function rewriteRelativeJsSpecifiers(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      await rewriteRelativeJsSpecifiers(entryPath);
      continue;
    }

    if (!entry.isFile() || extname(entry.name) !== '.js') {
      continue;
    }

    const original = await readFile(entryPath, 'utf8');
    const rewritten = original.replace(
      /((?:import|export)\s[^'"]*?from\s*['"])(\.\.?\/[^'"]+)(['"])/g,
      (_, prefix, specifier, suffix) => {
        if (extname(specifier)) {
          return `${prefix}${specifier}${suffix}`;
        }

        return `${prefix}${specifier}.js${suffix}`;
      }
    );

    if (rewritten !== original) {
      await writeFile(entryPath, rewritten);
    }
  }
}
