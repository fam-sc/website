import { describe, expect, test } from 'vitest';

import {
  equals,
  greaterOrEquals,
  isNoBinding,
  isNull,
  Modifier,
  notEquals,
  notNull,
  valueIn,
  valueNotIn,
} from './modifier';

test.each<[Modifier, string]>([
  [equals('1'), '=?'],
  [notEquals('1'), '!=?'],
  [greaterOrEquals('1'), '>=?'],
  [valueIn([1, 2, 3]), 'IN (?,?,?)'],
  [valueNotIn([1, 2, 3]), 'NOT IN (?,?,?)'],
  [isNull(), 'IS NULL'],
  [notNull(), 'IS NOT NULL'],
])('expression', (modifier, expected) => {
  expect(modifier.expression).toEqual(expected);
});

describe('isNoBinding', () => {
  test('true', () => {
    expect(isNoBinding(isNull().binding)).toBe(true);
  });

  test('false', () => {
    expect(isNoBinding(equals('1').binding)).toBe(false);
  });
});
