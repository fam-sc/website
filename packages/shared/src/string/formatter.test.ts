import { expect, test } from 'vitest';

import { formatTwoDigit } from './formatter';

test.each<[number, string]>([
  [0, '00'],
  [1, '01'],
  [10, '10'],
])('formatTwoDigit', (input, expected) => {
  const actual = formatTwoDigit(input);

  expect(actual).toEqual(expected);
});
