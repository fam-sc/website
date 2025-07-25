import { test } from 'vitest';

import { randomBytes } from './random.js';

test('smoke', async () => {
  await randomBytes(10);
});
