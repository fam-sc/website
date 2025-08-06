import { expect, test } from 'vitest';

import { CurrentLesson } from '@/components/schedule/ScheduleGrid';

import { calculateCurrentLesson } from './date';

test.each<[string, CurrentLesson | undefined]>([
  ['2025-04-24T12:20Z', { day: 4, time: '12:20' }],
  ['2025-04-24T12:21Z', { day: 4, time: '12:20' }],
  ['2025-04-24T08:10Z', { day: 4, time: undefined }],
  ['2025-04-24T23:10Z', { day: 4, time: undefined }],
])('calculateCurrentLesson', (dateString, expected) => {
  const actual = calculateCurrentLesson(new Date(dateString));

  expect(actual).toEqual(expected);
});
