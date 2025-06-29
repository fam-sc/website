import { expect, test } from 'vitest';

import { richTextCharacterLength } from './length';
import { RichTextString } from './types';

test.each<[RichTextString, number]>([
  ['abc', 3],
  [['abc', '34'], 5],
  [{ name: 'a', children: [] }, 0],
  [{ name: 'a', children: ['a', { name: 'b', children: ['b'] }] }, 2],
])('richTextCharacterLength', (richText, expected) => {
  const actual = richTextCharacterLength(richText);

  expect(actual).toEqual(expected);
});
