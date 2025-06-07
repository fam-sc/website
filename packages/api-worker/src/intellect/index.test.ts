import { expect, test } from 'vitest';

import { findTeacherByName } from '.';

// Знайдемо Данила Юрійовича заради тесту.
// Наврядчи зав кафедри зникне з КПІ Інтелект.
test('Find head of the faculty', async () => {
  const teacher = await findTeacherByName('Тавров Данило Юрійович');

  expect(teacher?.userIdentifier).toEqual('tdy3');
});
