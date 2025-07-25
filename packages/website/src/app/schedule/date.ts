import { Time } from '@sc-fam/shared/api/campus/types.js';
import { timeBreakpoints } from '@sc-fam/shared-schedule';

import { Day } from '@/api/schedule/types';
import { CurrentLesson } from '@/components/ScheduleGrid';

const LESSON_MINUTES = 90;

// Normalize Sunday-Saturday (0-6) weekday to Monday-Sunday (1-7)
function normalizeWeekday(value: number): Day {
  return value === 0 ? 6 : ((value + 1) as Day);
}

function getDayMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

function getBreakpointDayMinutes(time: Time): number {
  const colonIndex = time.indexOf(':');
  const hour = Number.parseInt(time.slice(0, colonIndex));
  const minute = Number.parseInt(time.slice(colonIndex + 1));

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
  const day = normalizeWeekday(date.getDay());
  const time = findNeasestBreakpoint(getDayMinutes(date));

  return { day, time };
}
