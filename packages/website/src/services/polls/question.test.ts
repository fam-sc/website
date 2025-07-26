import { expect, test } from 'vitest';

import { PollQuestion as ApiQuestion } from '@/api/polls/types';

import { apiQuestionToItem, QuestionItem } from './question';

const inputOptions: { title: string }[] = [
  { title: 'Option 1' },
  { title: 'Option 2' },
];
const expectedOptions: { id: number; title: string }[] = [
  { id: 0, title: 'Option 1' },
  { id: 1, title: 'Option 2' },
];

test.each<[ApiQuestion, QuestionItem]>([
  [
    { type: 'text', title: 'Title' },
    { title: 'Title', descriptor: { type: 'text' } },
  ],
  [
    { type: 'checkbox', title: 'Title', requiredTrue: true },
    { title: 'Title', descriptor: { type: 'checkbox', requiredTrue: true } },
  ],
  [
    {
      type: 'radio',
      title: 'Title',
      options: inputOptions,
    },
    {
      title: 'Title',
      descriptor: {
        type: 'radio',
        options: expectedOptions,
      },
    },
  ],
  [
    {
      type: 'multicheckbox',
      title: 'Title',
      options: inputOptions,
    },
    {
      title: 'Title',
      descriptor: {
        type: 'multicheckbox',
        options: expectedOptions,
      },
    },
  ],
  [
    {
      type: 'score',
      title: 'Title',
      items: [1, 2, 3],
    },
    {
      title: 'Title',
      descriptor: {
        type: 'score',
        items: [1, 2, 3],
      },
    },
  ],
])('apiQuestionToItem', (input, expected) => {
  const actual = apiQuestionToItem(input);

  expect(actual).toEqual(expected);
});
