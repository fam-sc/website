import { expect, test } from 'vitest';

import { isTelegramUrl, urlToChatId } from './utils';

test.each([
  ['https://google.com', false],
  ['https://t.me/abc', true],
])('isTelegramUrl', (input, expected) => {
  const actual = isTelegramUrl(input);

  expect(actual).toBe(expected);
});

test.each([['https://t.me/abc', '@abc']])('urlToChatId', (input, expected) => {
  const actual = urlToChatId(input);

  expect(actual).toBe(expected);
});
