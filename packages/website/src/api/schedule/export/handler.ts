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
  HOUR_MS,
  MINUTE_MS,
  parseTime,
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
};

export function getLessonDateFromTiming(startDate: Date, timing: LessonTiming) {
  const { hour, minute } = parseTime(timing.time);

  let alignedDate = alignDateByWeek(startDate);
  alignedDate += (timing.week - 1) * WEEK_MS;
  alignedDate += (timing.day - 1) * DAY_MS;
  alignedDate += hour * HOUR_MS;
  alignedDate += minute * MINUTE_MS;

  return new Date(alignedDate);
}

async function exportLesson(
  lesson: Lesson,
  timing: LessonTiming,
  options: ExportLessonOptions
) {
  const startDate = getLessonDateFromTiming(options.startDate, timing);
  const endDate = new Date(startDate.getTime() + LESSON_DURATION);

  console.log(startDate.toISOString());

  const { place } = lesson;

  await addEvent(
    options.access,
    { calendarId: options.calendarId, sendUpdates: 'all' },
    {
      start: {
        dateTime: startDate.toISOString(),
        timeZone: TIME_ZONE,
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: TIME_ZONE,
      },
      summary: lesson.name,
      eventType: 'default',
      visibility: 'default',
      location: place.length > 0 ? place : undefined,
      description: createLessonDescription(lesson),
      recurrence: options.reccurence,
    }
  );
}

export async function exportScheduleToGoogleCalendar(
  access: string,
  groupId: string,
  payload: ExportSchedulePayload
) {
  const schedule = await getScheduleForGroup(groupId);
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

    const options: ExportLessonOptions = {
      access,
      calendarId: calendar.id,
      startDate: new Date(payload.startDate),
      reccurence: [reccurenceRule],
    };

    let weekIndex = 1;

    for (const week of schedule.weeks) {
      for (const { day, lessons } of week) {
        for (const lesson of lessons) {
          await exportLesson(
            lesson,
            { week: weekIndex, day, time: lesson.time },
            options
          );
        }
      }

      weekIndex += 1;
    }
  } catch (error: unknown) {
    if (calendar) {
      // Try to cleanup after error.
      await deleteCalendar(access, calendar.id);
    }

    throw error;
  }
}
