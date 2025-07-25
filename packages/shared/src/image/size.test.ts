import fs from 'node:fs/promises';

import { expect, test } from 'vitest';

import { getImageSize } from './size.js';

test('size', async () => {
  for (const name of ['jpeg', 'png', 'webp']) {
    const content = await fs.readFile(
      `packages/shared/src/image/formats/test-data/test.${name}`
    );
    const size = getImageSize(content);

    expect(size).toEqual({ width: 259, height: 194 });
  }
});
