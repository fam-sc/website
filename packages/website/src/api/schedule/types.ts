import { Time } from '@shared/api/campus/types';

import { Day, ScheduleTeacher } from '@data/types/schedule';

export type { Day } from '@data/types/schedule';

export type { Time } from '@shared/api/campus/types';
export { timeBreakpoints } from '@shared/api/campus/types';

export type Lesson = {
  type: 'lec' | 'prac' | 'lab';
  name: string;
  teacher: ScheduleTeacher;
  time: Time;
  place: string;
  link?: string;
};

export type DaySchedule = {
  day: Day;
  lessons: Lesson[];
};

export type Schedule = {
  groupCampusId: string;
  weeks: [DaySchedule[], DaySchedule[]];
};

export type UpdateScheduleLinksPayload = Record<string, string | null>;
