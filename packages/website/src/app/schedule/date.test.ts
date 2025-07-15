import { expect, test } from 'vitest';

import { CurrentLesson } from '@/components/ScheduleGrid';

import { calculateCurrentLesson } from './date';

test.each<[string, CurrentLesson | undefined]>([
  ['2024-04-24T12:20', { day: 4, time: '12:20' }],
  ['2024-04-24T12:21', { day: 4, time: '12:20' }],
  ['2024-04-24T08:10', { day: 4, time: undefined }],
  ['2024-04-24T23:10', { day: 4, time: undefined }],
])('calculateCurrentLesson', (dateString, expected) => {
  const actual = calculateCurrentLesson(new Date(dateString));

  expect(actual).toEqual(expected);
});
