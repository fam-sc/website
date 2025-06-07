import { expect, test } from 'vitest';
import {
  getSessionId,
  newSessionId,
  parseSessionIdString,
  SESSION_ID_COOKIE,
} from '.';

test('newSessionId/smoke', async () => {
  await newSessionId();
});

test.each(['123', undefined])('getSessionId', (value) => {
  const request = new Request('https://localhost:3000/');

  if (value) {
    request.headers.set('Cookie', `${SESSION_ID_COOKIE}=${value}`);
  }

  const actual = getSessionId(request);

  expect(actual).toBe(value);
});

test.each([
  ['123', BigInt(123)],
  [undefined, undefined],
])('parseSessionIdString', (value, expected) => {
  const actual = parseSessionIdString(value);

  expect(actual).toBe(expected);
});
