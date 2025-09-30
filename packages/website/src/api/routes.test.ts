import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, test } from 'vitest';

const IGNORE_ROUTES = new Set(['sitemap']);

const API_PATH = path.dirname(fileURLToPath(import.meta.url));

async function findAllFileRoutes(): Promise<string[]> {
  async function worker(dirPath: string): Promise<string[]> {
    const entries = await fsp.readdir(dirPath, { withFileTypes: true });
    const result: string[] = [];

    for (const entry of entries) {
      const filePath = path.join(dirPath, entry.name);

      if (entry.isDirectory() && !IGNORE_ROUTES.has(entry.name)) {
        result.push(...(await worker(filePath)));
      } else if (filePath.endsWith('route.ts')) {
        result.push(filePath);
      }
    }

    return result;
  }

  const paths = await worker(API_PATH);

  return paths.map((filePath) =>
    filePath.slice(API_PATH.length + 1, -3).replaceAll('\\', '/')
  );
}

async function findActualImportedRoutes(): Promise<Iterable<string>> {
  const content = await fsp.readFile(path.join(API_PATH, 'routes.ts'), 'utf8');

  return content.matchAll(/import '.\/(.+route)';/g).map((match) => match[1]);
}

test('all routes', async () => {
  const expectedRoutes = await findAllFileRoutes();
  const actualRoutes = await findActualImportedRoutes();

  expect(new Set(actualRoutes)).toEqual(new Set(expectedRoutes));
});
