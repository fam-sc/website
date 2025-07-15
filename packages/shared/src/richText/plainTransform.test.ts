import { expect, test } from 'vitest';

import { richTextToPlainText } from './plainTransform';
import { RichTextString } from './types';

test.each<[RichTextString, string]>([
  ['', ''],
  ['123', '123'],
  ['   123   321  ', '123 321'],
  [['123', '321', '    abc  '], '123 321 abc'],
  [{ name: 'div', children: ['abc', 'edf'] }, 'abc edf'],
])('richTextToPlainText', (richText, expected) => {
  const actual = richTextToPlainText(richText);

  expect(actual).toEqual(expected);
});
