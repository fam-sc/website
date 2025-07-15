import { describe, expect, test } from 'vitest';

import { getDataUrlContent } from './dataUrl';

describe('getDataUrlContent', () => {
  test('ok', () => {
    const base64 = 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==';

    const actual = getDataUrlContent(base64);
    const expected = Buffer.from('Hello, World!', 'utf8');

    expect(actual).toEqual(expected);
  });

  test('error', () => {
    expect(() => getDataUrlContent('123')).toThrowError();
  });
});
