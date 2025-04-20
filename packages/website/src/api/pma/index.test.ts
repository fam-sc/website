import { expect, test } from 'vitest';

import { getTeachers } from '.';

// Знайдемо Данила Юрійовича заради тесту.
// Наврядчи зав кафедри зникне з сайту.
test('Find head of the faculty', async () => {
  const teachers = await getTeachers();

  const target = teachers.find(
    (teacher) => teacher.link === '/teachers/tavrov-danilo-yuriyovich'
  );

  expect(target).not.toBeUndefined();
});
