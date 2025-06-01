import { Time } from '@shared/api/campus/types';

import { Day, ScheduleTeacher } from '@data/types/schedule';
import { z } from 'zod';

export type { Day } from '@data/types/schedule';

export type { Time } from '@shared/api/campus/types';
export { timeBreakpoints } from '@shared/api/campus/types';

export const lessonType = z.enum(['lec', 'prac', 'lab']);

export type LessonType = z.infer<typeof lessonType>;

export type Lesson = {
  type: LessonType;
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
