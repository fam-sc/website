import { describe, expect, test } from 'vitest';

import { isPromise } from './typecheck';

describe('isPromise', () => {
  test('true', () => {
    const promise = new Promise(() => {});

    expect(isPromise(promise)).toBe(true);
  });

  test('false', () => {
    expect(isPromise(123)).toBe(false);
  });
});
