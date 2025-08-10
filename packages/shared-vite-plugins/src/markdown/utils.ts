import fsp from 'node:fs/promises';

import { PluginContext } from 'rollup';

const PATTERN = /export (?:const|let) (.*?)\s*(?:=|:)/g;

export async function getExports(filePath: string): Promise<string[]> {
  const content = await fsp.readFile(filePath, 'utf8');

  const matches = [...content.matchAll(PATTERN)];

  return matches.map((match) => match[1]);
}

export async function resolveMaybeTsx(
  context: PluginContext,
  id: string,
  importer?: string
) {
  let result = await context.resolve(id, importer);

  if (result === null) {
    result = await context.resolve(`${id}x`, importer);
  }

  return result;
}
