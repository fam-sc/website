import type { Time } from '@shared/api/campus/types';
import { infer as zodInfer } from 'zod/v4-mini';

import type { lessonType } from './schema';

export type { Time } from '@shared/api/campus/types';

export type Day = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type LessonType = zodInfer<typeof lessonType>;

export type ScheduleTeacher = {
  name: string;
  link: string | null;
};

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
