import { expect, test } from 'vitest';

import { isValidSlug, textToSlug } from './slug';

test.each<[string, boolean]>([
  ['test', true],
  ['---_123-testTest', true],
  ['тест  !', false],
])('isValidSlug', (input, expected) => {
  const actual = isValidSlug(input);

  expect(actual).toEqual(expected);
});

test.each<[string, string]>([
  ['test', 'test'],
  ['test test', 'test-test'],
  ['  test  test ', 'test-test'],
])('textToSlug', (input, expected) => {
  const actual = textToSlug(input);

  expect(actual).toEqual(expected);
});

test.each<[string, string]>([
  ['test', 'test'],
  ['test test', 'test-test'],
  ['test_test', 'test_test'],
  ['  test  test123 ', 'test-test123'],
  [' пес патрон', 'pes-patron'],
  [' пес патрон. 123', 'pes-patron-123'],
  ['їжак', 'yizhak'],
  ['Жїак', 'zhiak'],
])('textToSlug', (input, expected) => {
  const actual = textToSlug(input);

  expect(actual).toEqual(expected);
});
