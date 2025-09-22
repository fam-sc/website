import { describe, expect, test } from 'vitest';

import { getTeachers } from './teachers';

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
