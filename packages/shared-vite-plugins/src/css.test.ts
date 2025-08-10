import { describe, expect, test } from 'vitest';

import { cssNameGenerator, encodeNumber } from './css';

test.each<[number, string]>([
  [1, 'b'],
  [2, 'c'],
  [100, 'Ob'],
])('encodeNumber', (input, expected) => {
  const actual = encodeNumber(input);

  expect(actual).toEqual(expected);
});

describe('cssNameGenerator', () => {
  test('single', () => {
    const generator = cssNameGenerator();

    const actual = generator('1', '1');

    expect(actual).toBe('scb');
  });

  test('twice', () => {
    const generator = cssNameGenerator();

    const actual1 = generator('1', '1');
    const actual2 = generator('1', '2');

    expect(actual1).toBe('scb');
    expect(actual2).toBe('scc');
  });

  test('twice same', () => {
    const generator = cssNameGenerator();

    const actual1 = generator('1', '1');
    const actual2 = generator('1', '1');

    expect(actual1).toBe('scb');
    expect(actual2).toBe('scb');
  });
});
