import { PollQuestion, PollRespondentAnswer } from '@data/types/poll';
import { describe, expect, test } from 'vitest';
import { isValidAnswer, isValidAnswers } from './validation';

test.each<[PollQuestion, PollRespondentAnswer, boolean]>([
  [{ type: 'text', title: '' }, { text: '123' }, true],
  [{ type: 'text', title: '' }, { selectedIndex: 0 }, false],
  [{ type: 'checkbox', title: '', requiredTrue: true }, { status: true }, true],
  [
    { type: 'checkbox', title: '', requiredTrue: false },
    { status: true },
    true,
  ],
  [
    { type: 'checkbox', title: '', requiredTrue: true },
    { status: false },
    false,
  ],
  [{ type: 'checkbox', title: '', requiredTrue: true }, { text: '' }, false],
  [
    { type: 'radio', title: '', options: [{ title: 'Option 1' }] },
    { selectedIndex: 0 },
    true,
  ],
  [
    {
      type: 'radio',
      title: '',
      options: [{ title: 'Option 1' }, { title: 'Option 2' }],
    },
    { selectedIndex: 0 },
    true,
  ],
  [
    {
      type: 'radio',
      title: '',
      options: [{ title: 'Option 1' }, { title: 'Option 2' }],
    },
    { selectedIndex: 1 },
    true,
  ],
  [
    {
      type: 'radio',
      title: '',
      options: [{ title: 'Option 1' }, { title: 'Option 2' }],
    },
    { selectedIndex: -1 },
    false,
  ],
  [
    {
      type: 'radio',
      title: '',
      options: [{ title: 'Option 1' }, { title: 'Option 2' }],
    },
    { selectedIndex: 2 },
    false,
  ],
  [
    {
      type: 'radio',
      title: '',
      options: [{ title: 'Option 1' }, { title: 'Option 2' }],
    },
    { selectedIndex: 0.5 },
    false,
  ],
  [
    {
      type: 'radio',
      title: '',
      options: [{ title: 'Option 1' }, { title: 'Option 2' }],
    },
    { text: '' },
    false,
  ],
  [
    { type: 'multicheckbox', title: '', options: [{ title: 'Option 1' }] },
    { selectedIndices: [0] },
    true,
  ],
  [
    {
      type: 'multicheckbox',
      title: '',
      options: [{ title: 'Option 1' }, { title: 'Option 2' }],
    },
    { selectedIndices: [0] },
    true,
  ],
  [
    {
      type: 'multicheckbox',
      title: '',
      options: [{ title: 'Option 1' }, { title: 'Option 2' }],
    },
    { selectedIndices: [0, 1] },
    true,
  ],
  [
    {
      type: 'multicheckbox',
      title: '',
      options: [{ title: 'Option 1' }, { title: 'Option 2' }],
    },
    { selectedIndices: [-1, 1] },
    false,
  ],
  [
    {
      type: 'multicheckbox',
      title: '',
      options: [{ title: 'Option 1' }, { title: 'Option 2' }],
    },
    { selectedIndices: [0, 2] },
    false,
  ],
  [
    {
      type: 'multicheckbox',
      title: '',
      options: [{ title: 'Option 1' }, { title: 'Option 2' }],
    },
    { text: '' },
    false,
  ],
])('isValidAnswer', (question, answer, expected) => {
  const actual = isValidAnswer(question, answer);

  expect(actual).toEqual(expected);
});

describe('isValidAnswers', () => {
  test('ok', () => {
    const actual = isValidAnswers(
      [
        { type: 'text', title: 'Question' },
        { type: 'checkbox', title: '', requiredTrue: true },
      ],
      [{ text: '' }, { status: true }]
    );

    expect(actual).toBe(true);
  });

  test('different length', () => {
    const actual = isValidAnswers(
      [
        { type: 'text', title: 'Question' },
        { type: 'checkbox', title: '', requiredTrue: true },
      ],
      [{ text: '' }]
    );

    expect(actual).toBe(false);
  });

  test('invalid', () => {
    const actual = isValidAnswers(
      [
        { type: 'text', title: 'Question' },
        { type: 'checkbox', title: '', requiredTrue: true },
      ],
      [{ text: '' }, { text: '' }]
    );

    expect(actual).toBe(false);
  });
});
