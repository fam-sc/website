import { rateLimitOnFetch } from '@sc-fam/shared';
import {
  addCalendar,
  addCalendarList,
  addEvent,
  Calendar,
  deleteCalendar,
} from '@sc-fam/shared/api/google';
import {
  alignDateByWeek,
  DAY_MS,
  getTimeZoneOffset,
  HOUR_MS,
  MINUTE_MS,
  parseTime,
  toLocalISOString,
  WEEK_MS,
} from '@sc-fam/shared/chrono';
import {
  Day,
  getScheduleForGroup,
  Lesson,
  Time,
} from '@sc-fam/shared-schedule';
import { LESSON_DURATION } from '@sc-fam/shared-schedule';

import { formatDateToReccurenceRuleDate } from './date';
import { createLessonDescription } from './formatter';
import { ExportSchedulePayload } from './types';

const TIME_ZONE = 'Europe/Kyiv';

export type LessonTiming = {
  week: number;
  day: Day;
  time: Time;
};

type ExportLessonOptions = {
  access: string;
  calendarId: string;
  startDate: Date;
  reccurence: string[];
  offset: number;
};

export function getLessonDateFromTiming(
  startDate: Date,
  timing: LessonTiming,
  offset: number
) {
  const { hour, minute } = parseTime(timing.time);

  let alignedDate = alignDateByWeek(startDate);
  alignedDate += (timing.week - 1) * WEEK_MS;
  alignedDate += (timing.day - 1) * DAY_MS;
  alignedDate += hour * HOUR_MS;
  alignedDate += minute * MINUTE_MS;

  alignedDate -= offset;

  return new Date(alignedDate);
}

function exportLesson(
  lesson: Lesson,
  timing: LessonTiming,
  options: ExportLessonOptions
) {
  const startDate = getLessonDateFromTiming(
    options.startDate,
    timing,
    options.offset
  );

  const endDate = new Date(startDate.getTime() + LESSON_DURATION);

  const { place } = lesson;

  return rateLimitOnFetch(() =>
    addEvent(
      options.access,
      { calendarId: options.calendarId, sendUpdates: 'all' },
      {
        start: {
          dateTime: toLocalISOString(startDate),
          timeZone: TIME_ZONE,
        },
        end: {
          dateTime: toLocalISOString(endDate),
          timeZone: TIME_ZONE,
        },
        summary: lesson.name,
        eventType: 'default',
        visibility: 'default',
        location: place.length > 0 ? place : undefined,
        description: createLessonDescription(lesson),
        recurrence: options.reccurence,
      }
    )
  );
}

export async function exportScheduleToGoogleCalendar(
  access: string,
  groupName: string,
  payload: ExportSchedulePayload
) {
  const schedule = await getScheduleForGroup(groupName);
  if (schedule === null) {
    throw new Error('Cannot find schedule');
  }

  let calendar: Calendar | undefined;

  try {
    calendar = await addCalendar(access, {
      summary: payload.title,
    });

    await addCalendarList(access, {
      id: calendar.id,
      colorId: payload.colorId,
      notificationSettings: {},
    });

    const until = formatDateToReccurenceRuleDate(new Date(payload.endDate));
    const reccurenceRule = `RRULE:FREQ=WEEKLY;INTERVAL=2;UNTIL=${until}`;

    const startDate = new Date(payload.startDate);

    const options: ExportLessonOptions = {
      access,
      calendarId: calendar.id,
      startDate,
      reccurence: [reccurenceRule],
      offset: getTimeZoneOffset(startDate, 'Europe/Kiev'),
    };

    const jobs = schedule.weeks
      .entries()
      .map(([weekIndex, week]) =>
        week.map(({ day, lessons }) =>
          lessons.map((lesson) =>
            exportLesson(
              lesson,
              { week: weekIndex, day, time: lesson.time },
              options
            )
          )
        )
      )
      .toArray()
      .flat(2);

    await Promise.all(jobs);
  } catch (error: unknown) {
    if (calendar) {
      // Try to cleanup after error.
      await deleteCalendar(access, calendar.id);
    }

    throw error;
  }
}
