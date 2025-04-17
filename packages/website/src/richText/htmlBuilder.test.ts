import { expect, test } from 'vitest';

import { richTextToHtml } from './htmlBuilder';
import { RichTextString } from './types';

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
    { name: '#image', filePath: '123', width: 100, height: 100 },
    '<img src="https://media.sc-fam.workers.dev/123" width="100" height="100"/>',
  ],
])('richTextToHtml', (input, expected) => {
  const actual = richTextToHtml(input);

  expect(actual).toEqual(expected);
});
