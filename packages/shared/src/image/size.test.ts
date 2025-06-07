import { expect, test } from 'vitest';
import fs from 'node:fs/promises';
import { getImageSize } from './size';

test('size', async () => {
  for (const name of ['jpeg', 'png', 'webp']) {
    const content = await fs.readFile(
      `packages/website/src/image/formats/test-data/test.${name}`
    );
    const size = getImageSize(content);

    expect(size).toEqual({ width: 259, height: 194 });
  }
});
