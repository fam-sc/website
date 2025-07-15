import { expect, test } from 'vitest';

import { findNearestTimePoint, Time } from './time';

const points: Time[] = [
  '8:30',
  '10:25',
  '12:20',
  '14:15',
  '16:10',
  '18:30',
  '20:20',
];

test.each<[Time, Time]>([
  ['8:30', '8:30'],
  ['10:25', '10:25'],
  ['10:24', '10:25'],
  ['12:00', '12:20'],
])('findNearestTimePoint', (target, expected) => {
  const actual = findNearestTimePoint(points, target);

  expect(actual).toEqual(expected);
});
