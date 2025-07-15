import { expect, test } from 'vitest';

import { parseInt } from './parseInt';

test.each<[unknown, number | undefined]>([
  ['1', 1],
  ['123', 123],
  ['abc', undefined],
  ['', undefined],
  [null, undefined],
  [undefined, undefined],
])('parseInt', (input, expected) => {
  const actual = parseInt(input);

  expect(actual).toEqual(expected);
});
