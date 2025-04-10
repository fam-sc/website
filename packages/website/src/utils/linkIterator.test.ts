import { expect, test } from 'vitest';

import { linkIterator, LinkIteratorItem } from './linkIterator';

test.each<[string, LinkIteratorItem[]]>([
  ['123', ['123']],
  ['google.com', [{ href: 'https://google.com', text: 'google.com' }]],
  [
    '123 google.com',
    ['123 ', { href: 'https://google.com', text: 'google.com' }],
  ],
  [
    '123 google.com 32',
    ['123 ', { href: 'https://google.com', text: 'google.com' }, ' 32'],
  ],
])('iterator test', (input, expected) => {
  const actual: LinkIteratorItem[] = [];

  for (const part of linkIterator(input)) {
    actual.push(part);
  }

  expect(actual).toEqual(expected);
});
