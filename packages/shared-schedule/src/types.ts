import { infer as zodInfer } from 'zod/v4-mini';

import { days, timeBreakpoints } from './constants';
import type { lessonType } from './schema';

export type Time = (typeof timeBreakpoints)[number];
export type Day = (typeof days)[number];

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
  disciplineLink?: string;
  link?: string;
};

export type DaySchedule = {
  day: Day;
  lessons: Lesson[];
};

export type Schedule = {
  groupName: string;
  weeks: [DaySchedule[], DaySchedule[]];
};
