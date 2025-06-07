import { expect, test } from 'vitest';
import { coerce, lerp } from './math';

test.each([
  [0, 1],
  [0.5, 2],
  [1, 3],
])('lerp', (fraction, expected) => {
  const actual = lerp(1, 3, fraction);

  expect(actual).toEqual(expected);
});

test.each([
  [0, 1],
  [1, 1],
  [2, 2],
  [3, 3],
  [4, 3],
  [5, 3],
])('coerce', (value, expected) => {
  const actual = coerce(value, 1, 3);

  expect(actual).toEqual(expected);
});
