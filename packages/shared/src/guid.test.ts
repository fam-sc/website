import { expect, test } from 'vitest';

import { normalizeGuid, shortenGuid } from './guid.js';

test.each<[string, string]>([
  ['00000001-0000-0000-0000-000000000000', '1'],
  ['10000000-0000-0000-0000-000000000000', '10000000'],
  ['00012345-0000-0000-0000-000000000000', '12345'],
  [
    '00001234-0100-0000-0000-000000000000',
    '00001234-0100-0000-0000-000000000000',
  ],
])('shortenGuid', (input, expected) => {
  const actual = shortenGuid(input);

  expect(actual).toEqual(expected);
});

test.each<[string, string]>([
  ['1', '00000001-0000-0000-0000-000000000000'],
  ['10000000', '10000000-0000-0000-0000-000000000000'],
  ['12345', '00012345-0000-0000-0000-000000000000'],
  [
    '00001234-0100-0000-0000-000000000000',
    '00001234-0100-0000-0000-000000000000',
  ],
])('normalizeGuid', (input, expected) => {
  const actual = normalizeGuid(input);

  expect(actual).toEqual(expected);
});
