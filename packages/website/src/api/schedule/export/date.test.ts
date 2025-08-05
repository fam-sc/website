import { expect, test } from 'vitest';

import { formatDateToReccurenceRuleDate } from './date';

test.each<[Date, string]>([
  [new Date('2025-01-02T00:00:00Z'), '20250102'],
  [new Date('2025-10-20T00:00:00Z'), '20251020'],
])('formatDateToReccurenceRuleDate', (input, expected) => {
  const actual = formatDateToReccurenceRuleDate(input);

  expect(actual).toEqual(expected);
});
