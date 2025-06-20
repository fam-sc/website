// See docs/campus/openapi.yml

import { z } from 'zod/v4-mini';

export const weekday = z.enum(['Пн', 'Вв', 'Ср', 'Чт', 'Пт', 'Сб']);

export const timeBreakpoints = [
  '8:30',
  '10:25',
  '12:20',
  '14:15',
  '16:10',
  '18:30',
  '20:20',
] as const;

export const time = z.enum(timeBreakpoints);

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
  groupCode: z.string(),
  scheduleFirstWeek: z.array(daySchedule),
  scheduleSecondWeek: z.array(daySchedule),
});

export const currentTime = z.object({
  currentWeek: z.union([z.literal(1), z.literal(2)]),
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
