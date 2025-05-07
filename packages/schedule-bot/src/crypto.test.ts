import { expect, test } from 'vitest';
import { verifyHmac } from './crypto';
import { toHexString } from './hex';

test('verifyHmac', async () => {
  const key = '123';
  const keyBuffer = new TextEncoder().encode(key);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const data = '321';
  const dataBuffer = new TextEncoder().encode(data);

  const signedBuffer = await crypto.subtle.sign(
    { name: 'HMAC', hash: 'SHA-256' },
    cryptoKey,
    dataBuffer
  );
  const signed = toHexString([...new Uint8Array(signedBuffer)]);

  const result = await verifyHmac(key, data, signed);

  expect(result).toBe(true);
});
