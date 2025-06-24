import { expect, test } from 'vitest';
import { qMarks } from './expression';

test.each<[number, string]>([
  [0, ''],
  [1, '?'],
  [3, '?,?,?'],
])('qMarks', (n, expected) => {
  const actual = qMarks(n);

  expect(actual).toEqual(expected);
});
