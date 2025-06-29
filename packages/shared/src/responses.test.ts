import { expect, test } from 'vitest';

import { isErrorResponseBody, notFound, ok } from './responses';

test.each<[unknown, boolean]>([
  [{ message: 'Text' }, true],
  [{ message: 'Text', code: 1 }, true],
  [{}, false],
  [{ message: null }, false],
  [{ message: {} }, false],
  [{ message: 'Text', code: '' }, false],
  [null, false],
  [1, false],
])('isErrorResponseBody', (input, expected) => {
  const actual = isErrorResponseBody(input);

  expect(actual).toBe(expected);
});

test.each([ok({ a: 1 }), notFound()])('json headers', (response) => {
  const contentType = response.headers.get('Content-Type');

  expect(contentType).toBe('application/json');
});
