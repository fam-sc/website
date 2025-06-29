import { describe, expect, test } from 'vitest';

import { resolveSizes } from './sizes';
import { ImageSizes } from './types';

describe('resolveSizes', () => {
  test('undefined', () => {
    expect(resolveSizes(undefined)).toBe(undefined);
  });

  test('string', () => {
    expect(resolveSizes('128px')).toBe('128px');
  });

  test.each<[ImageSizes, string]>([
    [{ default: '1vw' }, '1vw'],
    [{ 820: '50vw', default: '40vw' }, '(min-width: 820px) 50vw, 40vw'],
  ])('object', (input, expected) => {
    const actual = resolveSizes(input);

    expect(actual).toBe(expected);
  });
});
