import { describe, expect, test } from 'vitest';

import { isErrorWithCode } from './code';

describe('isErrorWithCode', () => {
  test.each([[''], [1], [null], [undefined], [{ abc: 1 }]])(
    'false',
    (input) => {
      expect(isErrorWithCode(input, 1)).toBe(false);
    }
  );

  test('true', () => {
    const error = new Error('123');
    (error as { code?: number }).code = 1;

    expect(isErrorWithCode(error, 1)).toBe(true);
  });
});
