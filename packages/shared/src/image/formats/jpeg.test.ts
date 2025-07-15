import fs from 'node:fs/promises';

import { expect, test } from 'vitest';

import { getSize } from './jpeg';

test('size', async () => {
  const content = await fs.readFile(
    'packages/shared/src/image/formats/test-data/test.jpeg'
  );
  const size = getSize(content);

  expect(size).toEqual({ width: 259, height: 194 });
});
