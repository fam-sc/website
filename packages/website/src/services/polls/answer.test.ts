import { expect, test } from 'vitest';

import { isAnswerValid } from './answer';
import { QuestionAnswer, QuestionDescriptor } from './types';

test.each<[QuestionAnswer, QuestionDescriptor, boolean]>([
  [{ text: '123' }, { type: 'text' }, true],
  [{ text: '' }, { type: 'text' }, false],
  [
    { selectedIndex: 1 },
    { type: 'radio', options: [{ id: 1, title: '123' }] },
    true,
  ],
  [
    { selectedIndex: undefined },
    { type: 'radio', options: [{ id: 1, title: '123' }] },
    false,
  ],
  [
    { selectedIndices: [0] },
    { type: 'multicheckbox', options: [{ id: 1, title: '123' }] },
    true,
  ],
  [
    { selectedIndices: [] },
    { type: 'multicheckbox', options: [{ id: 1, title: '123' }] },
    false,
  ],
  [{ status: true }, { type: 'checkbox', requiredTrue: true }, true],
  [{ status: false }, { type: 'checkbox', requiredTrue: true }, false],
  [{ status: true }, { type: 'checkbox', requiredTrue: false }, true],
  [{ status: false }, { type: 'checkbox', requiredTrue: false }, true],
  [{ selected: 1 }, { type: 'score', items: [1, 2, 3] }, true],
  [{ selected: undefined }, { type: 'score', items: [1, 2, 3] }, false],
])('isAnswerValid', (input, descriptor, expected) => {
  const actual = isAnswerValid(input, descriptor);

  expect(
    actual,
    `${JSON.stringify(input)}; ${JSON.stringify(descriptor)}`
  ).toEqual(expected);
});
