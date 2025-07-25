import { infer as zodInfer } from 'zod/v4-mini';

import type {
  currentTime,
  daySchedule,
  group,
  lessonSchedule,
  teacherPairTag,
  teacherPairType,
  time,
  weekday,
} from './schema.js';

export type Weekday = zodInfer<typeof weekday>;
export type Time = zodInfer<typeof time>;
export type Group = zodInfer<typeof group>;
export type DaySchedule = zodInfer<typeof daySchedule>;
export type LessonSchedule = zodInfer<typeof lessonSchedule>;
export type TeacherPairType = zodInfer<typeof teacherPairType>;
export type TeacherPairTag = zodInfer<typeof teacherPairTag>;
export type CurrentTime = zodInfer<typeof currentTime>;
