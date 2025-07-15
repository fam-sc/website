import { expect, test } from 'vitest';

import { searchParamsToObject } from './searchParams';

test.each<[Record<string, string>]>([
  [{}],
  [{ a: '1' }],
  [{ a: '1', b: '2' }],
  [{ a: 'кирилиця' }],
])('searchParamsToObject', (data) => {
  const params = new URLSearchParams(data);

  const actual = searchParamsToObject(params);
  expect(actual).toEqual(data);
});
