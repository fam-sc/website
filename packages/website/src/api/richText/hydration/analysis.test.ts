import { RichTextString } from '@sc-fam/shared/richText/types.js';
import { expect, test } from 'vitest';

import { getImageSizeMap, ImageDataMap } from './analysis';

test.each<[RichTextString, ImageDataMap]>([
  ['123', {}],
  [
    {
      name: '#image',
      filePath: 'rich-text-image/file-path',
      format: 'png',
      sizes: [{ width: 1, height: 2 }],
    },
    {
      'rich-text-image/file-path': {
        format: 'png',
        sizes: [{ width: 1, height: 2 }],
      },
    },
  ],
  [
    [
      {
        name: '#image',
        filePath: 'rich-text-image/file-path',
        format: 'png',
        sizes: [{ width: 1, height: 2 }],
      },
      {
        name: '#image',
        filePath: 'rich-text-image/file-path-2',
        format: 'png',
        sizes: [{ width: 3, height: 4 }],
      },
    ],
    {
      'rich-text-image/file-path': {
        format: 'png',
        sizes: [{ width: 1, height: 2 }],
      },
      'rich-text-image/file-path-2': {
        format: 'png',
        sizes: [{ width: 3, height: 4 }],
      },
    },
  ],
])('getImageSizeMap', (input, expected) => {
  const actual = getImageSizeMap(input);

  expect(actual).toEqual(expected);
});
