import { getTimeZoneOffset, toLocalISOString } from '@sc-fam/shared/chrono';
import { afterAll, describe, expect, test } from 'vitest';

import { getLessonDateFromTiming } from './handler';

describe('getLessonDateFromTiming', () => {
  const currentTz = process.env.TZ;

  test('getLessonDateFromTiming', () => {
    for (const tz of ['UTC', 'Europe/Kiev']) {
      process.env.TZ = tz;

      const startDate = new Date('2025-09-02T00:00:00Z');
      const result = getLessonDateFromTiming(
        startDate,
        {
          day: 1,
          time: '08:30',
          week: 1,
        },
        getTimeZoneOffset(startDate, 'Europe/Kiev')
      );

      expect(toLocalISOString(result), `timezone=${tz}`).toEqual(
        '2025-09-01T05:30:00.000Z'
      );
    }
  });

  afterAll(() => {
    process.env.TZ = currentTz;
  });
});
