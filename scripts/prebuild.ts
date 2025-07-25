import path from 'node:path';

import { yarn } from './process';

const PACKAGES = [['shared'], ['shared-schedule', 'data']];

async function runBuild(packageName: string) {
  const cwd = path.join('packages', packageName);

  await yarn(['build:no-emit'], cwd);
}

async function main() {
  for (const group of PACKAGES) {
    await Promise.all(group.map((packageName) => runBuild(packageName)));
  }
}

void main();
