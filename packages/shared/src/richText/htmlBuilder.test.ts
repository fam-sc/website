import { expect, test } from 'vitest';

import { richTextToHtml } from './htmlBuilder.js';
import { RichTextString } from './types.js';

test.each<[RichTextString, string]>([
  ['123', '123'],
  [{ name: 'p' }, '<p/>'],
  [{ name: 'p', attrs: { attr: '1' } }, '<p attr="1"/>'],
  [{ name: 'p', attrs: { attr: '1', attr2: '2' } }, '<p attr="1" attr2="2"/>'],
  [
    { name: 'p', attrs: { attr: '1', attr2: '2' }, children: ['123'] },
    '<p attr="1" attr2="2">123</p>',
  ],
  [
    { name: 'p', children: [{ name: 'span', children: ['text'] }] },
    '<p><span>text</span></p>',
  ],
  [
    {
      name: '#image',
      filePath: 'rich-text-image/123',
      sizes: [
        { width: 100, height: 100 },
        { width: 200, height: 200 },
      ],
    },
    `<img src="https://media.sc-fam.org/rich-text-image/123/200" srcset="https://media.sc-fam.org/rich-text-image/123/100 100w,https://media.sc-fam.org/rich-text-image/123/200 200w" width="200" height="200"/>`,
  ],
])('richTextToHtml', (input, expected) => {
  const actual = richTextToHtml(input, {
    mediaUrl: 'https://media.sc-fam.org',
  });

  expect(actual).toEqual(expected);
});
