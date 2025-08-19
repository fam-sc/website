import fsp from 'node:fs/promises';
import path from 'node:path';

import { createFont, woff2 } from 'fonteditor-core';

const PRESS_START_USAGE =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZАаБбВвГгҐґДдЕеЄєЖжЗзИиІіЇїЙйКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчШшЩщЬьЮюЯя: ';

function withExtension(path: string, ext: string) {
  const dotIndex = path.lastIndexOf('.');

  return `${path.slice(0, dotIndex)}.${ext}`;
}

function getOutputPath(dir: string, inputPath: string) {
  return withExtension(path.join(dir, path.basename(inputPath)), 'woff2');
}

function stringToCodePoints(text: string): Set<number> {
  const result = new Set<number>();

  for (const c of text) {
    const code = c.codePointAt(0);
    if (code !== undefined) {
      result.add(code);
    }
  }

  return result;
}

async function getConsolasUsage(): Promise<number[]> {
  const files = [path.join(import.meta.dirname, '../src/text/vscode1.md')];
  const result = new Set<number>();

  for (const filePath of files) {
    const content = await fsp.readFile(filePath, 'utf8');

    for (const point of stringToCodePoints(content)) {
      result.add(point);
    }
  }

  return [...result];
}

async function optimizeFont(filePath: string, usage: number[]) {
  const buffer = await fsp.readFile(filePath);

  const font = createFont(buffer, {
    type: 'ttf',
    subset: usage,
  });

  return font.write({
    toBuffer: true,
    type: 'woff2',
  });
}

async function optimizeFontToFile(
  filePath: string,
  outDir: string,
  usage: number[]
) {
  const outBuffer = await optimizeFont(filePath, usage);

  await fsp.writeFile(getOutputPath(outDir, filePath), outBuffer);
}

async function main() {
  const fontDirectory = path.join(import.meta.dirname, '../assets/fonts');

  const outDir = path.join(import.meta.dirname, '../public/fonts');

  await woff2.init();
  await fsp.mkdir(outDir, { recursive: true });

  const consolasUsage = await getConsolasUsage();
  const pressStartUsage = [...stringToCodePoints(PRESS_START_USAGE)];

  for (const entry of await fsp.readdir(fontDirectory)) {
    const filePath = path.join(fontDirectory, entry);

    if (entry.startsWith('Consolas')) {
      await optimizeFontToFile(filePath, outDir, consolasUsage);
    } else if (entry.startsWith('PressStart2P')) {
      await optimizeFontToFile(filePath, outDir, pressStartUsage);
    }
  }
}

void main();
