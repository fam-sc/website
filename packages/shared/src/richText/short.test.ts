import { expect, test } from 'vitest';

import { shortenRichText } from './short';
import { RichTextString } from './types';

const MAX_LENGTH = 20;

test.each<[RichTextString, RichTextString]>([
  ['Text', 'Text'],
  ['Loooooooooooooooooooooooooong text', 'Loooooooooooooooooooooooooong'],
  ['012345678912345sometextsometext', '012345678912345sometextsometext'],
  [
    ['012345678912345', { name: 'i', children: ['styledstyled'] }],
    ['012345678912345', { name: 'i', children: ['styledstyled'] }],
  ],
  [
    [
      '012345678912345',
      { name: 'i', children: ['styledstyled'] },
      'othertextothertext',
    ],
    ['012345678912345', { name: 'i', children: ['styledstyled'] }],
  ],
  [
    [
      '123',
      {
        name: '#image',
        filePath: 'rich-text-image/123',
        sizes: [{ width: 0, height: 0 }],
      },
    ],
    ['123'],
  ],
])('shortenRichText', (input, expected) => {
  const actual = shortenRichText(input, MAX_LENGTH);

  expect(actual).toEqual(expected);
});
