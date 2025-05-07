import { expect, test } from 'vitest';
import { parseCronTimeToLocal } from './cron';

test.each<[string, { hour: number; minute: number }]>([
  ['20 4 * * *', { hour: 7, minute: 20 }],
  ['8 5 * * *', { hour: 8, minute: 8 }],
])('parseCronTimeToLocal', (input, expected) => {
  const actual = parseCronTimeToLocal(input);

  expect(actual).toEqual(expected);
});
