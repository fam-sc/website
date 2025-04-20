import { expect, test } from 'vitest';

import { searchTeachersByName } from '.';

// Знайдемо Данила Юрійовича заради тесту.
// Наврядчи зав кафедри зникне з КПІ Інтелект.
test('Find head of the faculty', async () => {
  const teacher = await searchTeachersByName('Тавров Данило Юрійович');

  expect(teacher?.profile).toEqual('https://intellect.kpi.ua/profile/tdy3');
});
