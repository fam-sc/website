// See docs/campus/openapi.yml

import { string, z } from 'zod';

export const weekday = z.enum(['Пн', 'Вв', 'Ср', 'Чт', 'Пт', 'Сб']);

export const time = z.string().regex(/^([12]|0?)[0-9]:[0-5][0-9]$/);

export const group = z.object({
  id: z.string(),
  name: z.string(),
  faculty: z.string(),
  cathedra: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export const teacherPairType = z.enum([
  'Прак on-line',
  'Лаб on-line',
  'Лек on-line',
  'Прак',
  'Лаб',
  'Лек',
]);

export const teacherPairTag = z.enum(['lec', 'prac', 'lab']);

export const teacherPair = z.object({
  teacherName: z.string(),
  type: teacherPairType,
  name: z.string(),
  lecturerId: z.string(),
  time: time,
  place: z.string(),
  tag: teacherPairTag,
});

export const daySchedule = z.object({
  day: weekday,
  pairs: z.array(teacherPair),
});

export const lessonSchedule = z.object({
  groupCode: string(),
  scheduleFirstWeek: z.array(daySchedule),
  scheduleSecondWeek: z.array(daySchedule),
});

export const currentTime = z.object({
  currentWeek: z.number(),
  currentDay: z.number(),
  currentLesson: z.number(),
});

export type Weekday = z.infer<typeof weekday>;
export type Time = z.infer<typeof time>;
export type Group = z.infer<typeof group>;
export type DaySchedule = z.infer<typeof daySchedule>;
export type LessonSchedule = z.infer<typeof lessonSchedule>;
export type TeacherPairType = z.infer<typeof teacherPairType>;
export type CurrentTime = z.infer<typeof currentTime>;
