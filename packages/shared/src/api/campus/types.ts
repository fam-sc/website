// See docs/campus/openapi.yml

import {
  enum as zodEnum,
  object,
  string,
  number,
  array,
  literal,
  union,
  z,
} from 'zod/v4-mini';

export const weekday = zodEnum(['Пн', 'Вв', 'Ср', 'Чт', 'Пт', 'Сб']);

export const timeBreakpoints = [
  '8:30',
  '10:25',
  '12:20',
  '14:15',
  '16:10',
  '18:30',
  '20:20',
] as const;

export const time = zodEnum(timeBreakpoints);

export const group = object({
  id: string(),
  name: string(),
  faculty: string(),
  cathedra: object({
    id: number(),
    name: string(),
  }),
});

export const teacherPairType = zodEnum([
  'Прак on-line',
  'Лаб on-line',
  'Лек on-line',
  'Прак',
  'Лаб',
  'Лек',
]);

export const teacherPairTag = zodEnum(['lec', 'prac', 'lab']);

export const teacherPair = object({
  teacherName: string(),
  type: teacherPairType,
  name: string(),
  lecturerId: string(),
  time: time,
  place: string(),
  tag: teacherPairTag,
});

export const daySchedule = object({
  day: weekday,
  pairs: array(teacherPair),
});

export const lessonSchedule = object({
  groupCode: string(),
  scheduleFirstWeek: array(daySchedule),
  scheduleSecondWeek: array(daySchedule),
});

export const currentTime = object({
  currentWeek: union([literal(1), literal(2)]),
  currentDay: number(),
  currentLesson: number(),
});

export type Weekday = z.infer<typeof weekday>;
export type Time = z.infer<typeof time>;
export type Group = z.infer<typeof group>;
export type DaySchedule = z.infer<typeof daySchedule>;
export type LessonSchedule = z.infer<typeof lessonSchedule>;
export type TeacherPairType = z.infer<typeof teacherPairType>;
export type TeacherPairTag = z.infer<typeof teacherPairTag>;
export type CurrentTime = z.infer<typeof currentTime>;
