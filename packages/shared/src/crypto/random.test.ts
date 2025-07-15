import { test } from 'vitest';

import { randomBytes } from './random';

test('smoke', async () => {
  await randomBytes(10);
});
