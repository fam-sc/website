import { describe, expect, test } from 'vitest';

import { toLocalISOString } from './date.js';

describe('toLocalISOString', () => {
  test('ok', () => {
    const date = new Date(2023, 11, 31, 21, 0, 0);
    const actual = toLocalISOString(date);

    expect(actual).toBe('2023-12-31T21:00:00.000Z');
  });
});
