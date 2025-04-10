import { expect, test } from 'vitest';

import { parseHtmlToRichText } from './parser';
import { RichTextNode } from './types';

test.each<[string, RichTextNode]>([
  ['', []],
  ['some text', 'some text'],
  ['<p>some text</p>', { name: 'p', children: ['some text'] }],
  ['<div><p>some text</p></div>', { name: 'p', children: ['some text'] }],
  [
    'google.com',
    {
      name: 'a',
      attrs: { href: 'https://google.com' },
      children: ['google.com'],
    },
  ],
  [
    'abc google.com cba',
    [
      'abc ',
      {
        name: 'a',
        attrs: { href: 'https://google.com' },
        children: ['google.com'],
      },
      ' cba',
    ],
  ],
  [
    '<a href="https://google.com">google.com</a>',
    {
      name: 'a',
      attrs: { href: 'https://google.com' },
      children: ['google.com'],
    },
  ],
])('richText transform', (input, expected) => {
  const actual = parseHtmlToRichText(input);

  expect(actual).toEqual(expected);
});
