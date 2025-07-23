import { execFile } from 'node:child_process';
import fsp from 'node:fs/promises';
import path from 'node:path';

const BUILD_SCRIPT = 'build:no-emit';
const STYLELINT_PATTERN = `'**/*.{css,scss}`;

// Only check files that ESLint prettier plugin doesn't check.
const PRETTIER_PATTERN = '**.{json,css,scss,md}';

function execFileAsync(file: string, args: string[], cwd?: string) {
  return new Promise((resolve, reject) => {
    execFile(file, args, { cwd, shell: true }, (error, stdout, stderr) => {
      if (error) {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject(error);
      } else {
        resolve(`${stdout}\n${stderr}`);
      }
    });
  });
}

function yarn(args: string[], cwd?: string) {
  return execFileAsync('yarn', args, cwd);
}

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

      if (await hasScript(path.join(cwd, 'package.json'), BUILD_SCRIPT)) {
        await yarn([BUILD_SCRIPT], cwd);
      }
    })
  );
}

async function main() {
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
}

void main();
