import { Time } from '@sc-fam/shared/api/campus/types.js';
import { getWeekday, parseTime } from '@sc-fam/shared/chrono';
import { timeBreakpoints } from '@sc-fam/shared-schedule';

import { Day } from '@/api/schedule/types';
import { CurrentLesson } from '@/components/schedule/ScheduleGrid';

const LESSON_MINUTES = 90;

function getDayMinutes(date: Date): number {
  return date.getUTCHours() * 60 + date.getUTCMinutes();
}

function getBreakpointDayMinutes(time: Time): number {
  const { hour, minute } = parseTime(time);

  return hour * 60 + minute;
}

function findNeasestBreakpoint(dayMinutes: number): Time | undefined {
  for (const breakpoint of timeBreakpoints) {
    const breakpointMinutes = getBreakpointDayMinutes(breakpoint);

    if (
      dayMinutes >= breakpointMinutes &&
      dayMinutes <= breakpointMinutes + LESSON_MINUTES
    ) {
      return breakpoint;
    }
  }

  return undefined;
}

export function calculateCurrentLesson(date: Date): CurrentLesson {
  const day = getWeekday(date) as Day;
  const time = findNeasestBreakpoint(getDayMinutes(date));

  return { day, time };
}
