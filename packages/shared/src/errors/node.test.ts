import { describe, expect, test } from 'vitest';
import { isFileNotFoundError } from './node';
import fs from 'node:fs/promises';
import { fail } from 'node:assert';

describe('isFileNotFoundError', () => {
  test('not found', async () => {
    try {
      await fs.readFile('./.should-not-exist');
      fail('.should-not exist file exists');
    } catch (error: unknown) {
      expect(isFileNotFoundError(error)).toBe(true);
    }
  });

  test('other error', () => {
    const error = new Error('123');

    expect(isFileNotFoundError(error)).toEqual(false);
  });
});
