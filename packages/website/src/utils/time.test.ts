import { expect, test } from 'vitest';

import { parseTimeString, secondsToTime, Time } from './time';

test.each<[Time]>([['04:20'], ['00:00'], ['01:05']])('roundtrip', (input) => {
  const seconds = parseTimeString(input);
  const actual = secondsToTime(seconds);

  expect(actual).toEqual(input);
});
