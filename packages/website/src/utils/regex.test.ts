import { describe, expect, test } from 'vitest';

import { urlRegex } from './regex';

describe('urlRegex', () => {
  test.each<[string]>([
    ['www.google.com'],
    ['http://google.com/'],
    ['https://google.com/'],
    ['http://google.com/a/b/c'],
  ])('match', (input) => {
    const actual = input.match(urlRegex);

    expect(actual).toEqual([input]);
  });

  test.each<[string]>([['www.google'], ['google']])('no match', (input) => {
    const actual = input.match(urlRegex);

    expect(actual).toBeNull();
  });
});
