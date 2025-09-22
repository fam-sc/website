import { TeacherPair } from '@sc-fam/shared/api/campus/types.js';
import { expect, test } from 'vitest';

import { getUniqueTeachers } from './utils';

function lesson(teacher: string): TeacherPair {
  return {
    lecturerId: '',
    name: '',
    place: '',
    tag: 'lab',
    teacherName: teacher,
    time: '10:25:00',
    type: 'Лаб',
  };
}

test('getUniqueTeachers', () => {
  const actual = getUniqueTeachers({
    groupCode: '0',
    scheduleFirstWeek: [{ day: 'Пн', pairs: [lesson('1')] }],
    scheduleSecondWeek: [
      { day: 'Пн', pairs: [lesson('1'), lesson('2')] },
      { day: 'Вв', pairs: [lesson('3')] },
    ],
  });

  const expected = new Set(['1', '2', '3']);

  expect(actual).toEqual(expected);
});
