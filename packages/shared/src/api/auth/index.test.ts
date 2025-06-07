import { expect, test } from 'vitest';
import {
  getSessionId,
  newSessionId,
  parseSessionIdString,
  SESSION_ID_COOKIE,
} from '.';
import { NextRequest } from 'next/server';

test('newSessionId/smoke', async () => {
  await newSessionId();
});

test.each(['123', undefined])('getSessionId', (value) => {
  const request = new NextRequest('https://localhost:3000/');

  if (value) {
    request.cookies.set(SESSION_ID_COOKIE, value);
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
