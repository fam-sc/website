import {
  LessonSchedule,
  TeacherPair,
} from '@sc-fam/shared/api/campus/types.js';

function getUniqueValuesFromWeek<R>(
  week: { pairs: TeacherPair[] }[],
  get: (pair: TeacherPair) => R,
  out: Set<R>
) {
  for (const { pairs } of week) {
    for (const pair of pairs) {
      out.add(get(pair));
    }
  }
}

function getUniqueValues<R>(
  value: LessonSchedule,
  get: (pair: TeacherPair) => R
): Set<R> {
  const result = new Set<R>();

  getUniqueValuesFromWeek(value.scheduleFirstWeek, get, result);
  getUniqueValuesFromWeek(value.scheduleSecondWeek, get, result);

  return result;
}

export function getUniqueTeachers(value: LessonSchedule): Set<string> {
  return getUniqueValues(value, ({ teacherName }) => teacherName);
}

export function getUniqueLessonNames(value: LessonSchedule): string[] {
  return [...getUniqueValues(value, ({ name }) => name)];
}
