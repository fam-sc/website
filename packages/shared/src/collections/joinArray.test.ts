import { expect, test } from 'vitest';

import { joinArray } from './joinArray';

test.each<[number[], number[]]>([
  [[], []],
  [[100], [100]],
  [
    [100, 200],
    [100, 0, 200],
  ],
  [
    [100, 200, 300],
    [100, 0, 200, 1, 300],
  ],
])('joinArray', (input, expected) => {
  const actual = joinArray(input, (i) => i);

  expect(actual).toEqual(expected);
});
