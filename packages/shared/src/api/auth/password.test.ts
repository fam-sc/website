import { expect, test } from 'vitest';
import { hashPassword, verifyPassword } from './password';

test('hashPassword verify', async () => {
  const input = '1234';
  const hash = await hashPassword(input);
  const isSame = await verifyPassword(hash, input);

  expect(isSame).toBe(true);
});
