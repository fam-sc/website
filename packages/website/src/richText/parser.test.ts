import { expect, test } from 'vitest';

import { parseHtmlToRichText } from './parser';
import { RichTextNode } from './types';

test.each<[string, RichTextNode]>([
  ['', []],
  ['some text', 'some text'],
  ['<p>some text</p>', { name: 'p', children: ['some text'] }],
])('parseHtmlToRichText', async (input, expected) => {
  const actual = await parseHtmlToRichText(input, {
    parseImageToPath: () => {
      throw new Error('Not implemented');
    },
  });

  expect(actual).toEqual(expected);
});
