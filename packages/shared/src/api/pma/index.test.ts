import { expect, test } from 'vitest';

import { getDisciplines, getTeachers } from '.';

// Знайдемо Данила Юрійовича заради тесту.
// Наврядчи зав кафедри зникне з сайту.
test('Find head of the faculty', async () => {
  const teachers = await getTeachers();

  const target = teachers.find(
    (teacher) =>
      teacher.link ===
      'https://pma.fpm.kpi.ua/teachers/tavrov-danilo-yuriyovich'
  );

  expect(target).not.toBeUndefined();
});

test('Find frontend discipline', async () => {
  const disciplines = await getDisciplines();

  const target = disciplines.find(
    (discipline) => discipline.name === 'Front-end розробка'
  );

  expect(target).not.toBeUndefined();
});
