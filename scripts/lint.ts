import fsp from 'node:fs/promises';
import path from 'node:path';

import { yarn } from './process';

const BUILD_SCRIPT = 'build:no-emit';
const STYLELINT_PATTERN = `'**/*.{css,scss}`;

// Only check files that ESLint prettier plugin doesn't check.
const PRETTIER_PATTERN = '**.{json,css,scss,md}';

async function hasScript(filePath: string, name: string): Promise<boolean> {
  type Package = {
    scripts?: Record<string, string>;
  };

  const content = await fsp.readFile(filePath, 'utf8');
  const packageInfo = JSON.parse(content) as Package;

  return packageInfo.scripts?.[name] !== undefined;
}

async function buildAllPackages() {
  const packagesDir = path.join(import.meta.dirname, '../packages');
  const packageNames = await fsp.readdir(packagesDir);

  await Promise.all(
    packageNames.map(async (name) => {
      const cwd = path.join(packagesDir, name);

      try {
        if (await hasScript(path.join(cwd, 'package.json'), BUILD_SCRIPT)) {
          await yarn([BUILD_SCRIPT], cwd);
        }
      } catch (error: unknown) {
        throw new Error(`Build failed on '${name}' package`, { cause: error });
      }
    })
  );
}

async function main() {
  try {
    const fix = process.argv[2] == '--fix';

    if (fix) {
      await yarn([
        'eslint',
        '--cache',
        '--cache-location',
        '.eslintcache',
        '--fix',
      ]);

      await yarn(['stylelint', '--cache', STYLELINT_PATTERN, '--fix']);
      await yarn(['prettier', '--cache', '--write', PRETTIER_PATTERN]);
    } else {
      await Promise.all([
        yarn(['eslint', '--cache', '--cache-location', '.eslintcache']),
        yarn(['stylelint', '--cache', STYLELINT_PATTERN]),
        yarn(['prettier', '--cache', '--check', PRETTIER_PATTERN]),
        buildAllPackages(),
      ]);
    }
  } catch (error: unknown) {
    console.error(`Lint failed:\n${error}`);
  }
}

void main();
