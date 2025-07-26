import { TeacherPair } from '@sc-fam/shared/api/campus/types.js';
import { describe, expect, test } from 'vitest';

import { getTeachers, getUniqueTeachers } from './teachers';

function lesson(teacher: string): TeacherPair {
  return {
    lecturerId: '',
    name: '',
    place: '',
    tag: 'lab',
    teacherName: teacher,
    time: '10:25',
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

describe('getTeachers', () => {
  test('only PMA', async () => {
    const result = await getTeachers(['Тавров Данило Юрійович']);

    expect(result).toEqual([
      {
        name: 'Тавров Данило Юрійович',
        link: 'https://pma.fpm.kpi.ua/teachers/tavrov-danilo-yuriyovich',
      },
    ]);
  });

  test('non PMA', async () => {
    const result = await getTeachers(['Шепелєва Олена Володимирівна']);

    expect(result).toEqual([
      {
        name: 'Шепелєва Олена Володимирівна',
        link: 'https://intellect.kpi.ua/profile/hov65',
      },
    ]);
  });
});
