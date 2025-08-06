import { Teacher } from '@sc-fam/shared/api/pma/types.js';
import { Lesson } from '@sc-fam/shared-schedule';
import { expect, test } from 'vitest';

import { createLessonDescription } from './formatter';

function lesson(name: string, link: string | null, teacher: Teacher): Lesson {
  return {
    name,
    place: '',
    teacher,
    time: '10:25',
    type: 'lec',
    link: link ?? undefined,
  };
}

test.each<[Lesson, string]>([
  [
    lesson('Leson', null, { name: 'Teacher', link: null }),
    '<b>Викладач:</b> Teacher',
  ],
  [
    lesson('Leson', null, { name: 'Teacher', link: 'link' }),
    '<b>Викладач:</b> <a href="link">Teacher</a>',
  ],
  [
    lesson('Leson', 'lesson-link', { name: 'Teacher', link: 'link' }),
    '<b>Викладач:</b> <a href="link">Teacher</a><br/><b>Посилання</b>: <a href="lesson-link">lesson-link</a>',
  ],
])('createLessonDescription', (input, expected) => {
  const actual = createLessonDescription(input);

  expect(actual).toEqual(expected);
});
