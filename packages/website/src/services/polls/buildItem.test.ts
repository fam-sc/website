import { expect, test } from 'vitest';

import { isValidItem, QuestionBuildItem } from './buildItem';

test.each<[QuestionBuildItem, boolean]>([
  [{ key: 1, title: '' }, false],
  [{ key: 1, title: 'Title', descriptor: { type: 'text' } }, true],
  [
    {
      key: 1,
      title: 'Title',
      descriptor: { type: 'checkbox', requiredTrue: false },
    },
    true,
  ],
  [
    { key: 1, title: 'Title', descriptor: { type: 'score', items: [1, 2] } },
    true,
  ],
  [{ key: 1, title: 'Title', descriptor: { type: 'score', items: [] } }, false],
  [
    {
      key: 1,
      title: 'Title',
      descriptor: { type: 'multicheckbox', options: [{ id: 1, title: '1' }] },
    },
    true,
  ],
  [
    {
      key: 1,
      title: 'Title',
      descriptor: { type: 'multicheckbox', options: [] },
    },
    false,
  ],
])('isValidItem', (input, expected) => {
  const actual = isValidItem(input);

  expect(actual).toEqual(expected);
});
