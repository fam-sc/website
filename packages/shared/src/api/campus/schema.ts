// See docs/campus/openapi.yml

import {
  array,
  enum as zodEnum,
  literal,
  number,
  object,
  string,
  union,
} from 'zod/v4-mini';

import { timeBreakpoints } from './constants.js';

export const weekday = zodEnum(['Пн', 'Вв', 'Ср', 'Чт', 'Пт', 'Сб']);
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
