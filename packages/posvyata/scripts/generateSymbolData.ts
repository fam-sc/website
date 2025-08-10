import fsp from 'node:fs/promises';
import path from 'node:path';

import { getAttributeValue } from '@sc-fam/shared/html';
import { DefaultTreeAdapterTypes, parseFragment } from 'parse5';

import { SymbolData, SymbolDataMap } from '@/typography/types';

function findPathData(
  element: DefaultTreeAdapterTypes.Node
): string | undefined {
  if (element.nodeName === 'path') {
    return getAttributeValue(element, 'd');
  }

  if ('childNodes' in element) {
    for (const node of element.childNodes) {
      const result = findPathData(node);

      if (result !== undefined) {
        return result;
      }
    }
  }
}

async function processSymbol(filePath: string): Promise<SymbolData> {
  const content = await fsp.readFile(filePath, 'utf8');
  const fragment = parseFragment(content);
  const root = fragment.childNodes[0] as DefaultTreeAdapterTypes.Element;

  const data = findPathData(root);
  const width = getAttributeValue(root, 'width');
  const height = getAttributeValue(root, 'height');

  if (data === undefined || width === undefined || height === undefined) {
    throw new Error(`Invalid asset ${filePath}`);
  }

  return {
    path: data,
    width: Number.parseFloat(width),
    height: Number.parseFloat(height),
  };
}

function getSymbolName(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.');
  const base = fileName.slice(0, dotIndex);

  return base == 'colon' ? ':' : base;
}

async function main() {
  const assetDir = path.join(import.meta.dirname, '../assets/chars');
  const result: SymbolDataMap = {};

  for (const entry of await fsp.readdir(assetDir)) {
    const filePath = path.join(assetDir, entry);
    const symbolName = getSymbolName(entry);
    const symbolData = await processSymbol(filePath);

    result[symbolName] = symbolData;
  }

  const output = `import { SymbolDataMap } from './types';\n\nexport const symbolData: SymbolDataMap = ${JSON.stringify(result, undefined, 2)};`;

  await fsp.writeFile(
    path.join(import.meta.dirname, '../src/typography/data.ts'),
    output,
    'utf8'
  );
}

void main();
