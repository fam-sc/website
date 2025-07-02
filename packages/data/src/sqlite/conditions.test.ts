import { expect, test } from 'vitest';

import { and, Conditions, conditionsToExpression, or } from './conditions';

type TestType = {
  a?: number;
  b?: number;
  c?: number;
};

test.each<[Conditions<TestType>, string]>([
  [{ a: 1 }, '"a"=?'],
  [{ a: 1, b: 2 }, '"a"=? AND "b"=?'],
  [and<TestType>({ a: 1 }, { c: 2 }), '("a"=?) AND ("c"=?)'],
  [or<TestType>({ a: 1 }, { c: 2 }), '("a"=?) OR ("c"=?)'],
  [
    and<TestType>({ a: 1 }, or<TestType>({ b: 1 }, { c: 2 })),
    '("a"=?) AND (("b"=?) OR ("c"=?))',
  ],
])('conditionsToExpression', (input, expected) => {
  const actual = conditionsToExpression(input);

  expect(actual).toEqual(expected);
});
