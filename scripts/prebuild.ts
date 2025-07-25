import path from 'node:path';

import { yarn } from './process';

const PACKAGES = ['shared', 'data', 'shared-schedule'];

async function runBuild(packageName: string) {
  try {
    const cwd = path.join('packages', packageName);

    await yarn(['prebuild'], cwd);
  } catch (error: unknown) {
    throw new Error(`Build failed on ${packageName} package`, { cause: error });
  }
}

async function main() {
  for (const packageName of PACKAGES) {
    console.log(`> Building ${packageName}`);
    await runBuild(packageName);
  }
}

void main();
