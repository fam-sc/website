import { expect, test } from 'vitest';

import { getNumberVariant, NumberVariant } from './numberVariants';

test.each<[number, NumberVariant]>([
  [1, 'one'],
  [2, 'few'],
  [3, 'few'],
  [4, 'few'],
  [5, 'many'],
  [10, 'many'],
  [20, 'many'],
  [21, 'one'],
  [22, 'few'],
  [25, 'many'],
])('getNumberVariant', (input, expected) => {
  const actual = getNumberVariant(input);

  expect(actual).toEqual(expected);
});
