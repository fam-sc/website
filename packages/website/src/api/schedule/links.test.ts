import { lessonId } from '@sc-fam/shared-schedule';
import { expect, test } from 'vitest';

import { isValidLessonId, isValidPayload } from './links';

test.each<[unknown, boolean]>([
  [null, true],
  [1, false],
  [lessonId('lec', 'Name', 'Teacher'), true],
  ['lec-1', false],
])('isValidLessonId', (input, expected) => {
  const actual = isValidLessonId(input);

  expect(actual).toEqual(expected);
});

test.each<[unknown, boolean]>([
  [false, false],
  [null, false],
  [{ [lessonId('lec', 'Name', 'Teacher')]: 'link' }, true],
  [
    {
      [lessonId('lec', 'Name', 'Teacher')]: 'link',
      [lessonId('lec', 'Name', 'Teacher 2')]: 'link 2',
    },
    true,
  ],
  [{ ['lec']: 'link' }, false],
])('isValidPayload', (payload, expected) => {
  const actual = isValidPayload(payload);

  expect(actual).toEqual(expected);
});
