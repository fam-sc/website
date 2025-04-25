import { Time, timeBreakpoints } from '@/api/campus/types';
import { CurrentLesson } from '@/components/ScheduleGrid';
import { Day } from '@/data/types/schedule';

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
  if (dayMinutes < getBreakpointDayMinutes(timeBreakpoints[0])) {
    return undefined;
  }

  for (let i = 1; i < timeBreakpoints.length; i++) {
    if (getBreakpointDayMinutes(timeBreakpoints[i]) >= dayMinutes) {
      return timeBreakpoints[i - 1];
    }
  }

  return undefined;
}

export function calculateCurrentLesson(date: Date): CurrentLesson {
  const day = normalizeWeekday(date.getDay());
  const time = findNeasestBreakpoint(getDayMinutes(date));

  return { day, time };
}
