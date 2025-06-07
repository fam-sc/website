import { expect, test } from 'vitest';
import { deleteUndefined } from './deleteUndefined';

test.each<[object, object]>([
  [{}, {}],
  [{ a: 1 }, { a: 1 }],
  [{ a: 1, b: undefined }, { a: 1 }],
  [
    { a: 1, b: null },
    { a: 1, b: null },
  ],
  [{ a: undefined }, {}],
])('deleteUndefined', (input, expected) => {
  const inputCopy = { ...input };
  const actual = deleteUndefined(input);

  expect(actual).toEqual(expected);

  // Check that argument is unchanged.
  expect(input).toEqual(inputCopy);
});
