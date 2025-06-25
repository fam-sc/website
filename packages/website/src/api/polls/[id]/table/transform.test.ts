import { describe, expect, test } from 'vitest';
import { answerToString, pollResultsToTable } from './transform';
import { PollQuestion } from '@data/types/poll';

describe('answerToString', () => {
  describe('text', () => {
    test('ok', () => {
      const text = '123';
      const actual = answerToString(
        { text },
        { type: 'text', title: 'Question 1' }
      );

      expect(actual).toEqual(text);
    });

    test('error', () => {
      expect(() =>
        answerToString(
          { text: '123' },
          { type: 'radio', title: 'Question 1', options: [] }
        )
      ).toThrowError();
    });
  });

  describe('radio', () => {
    test('ok', () => {
      const actual = answerToString(
        { selectedIndex: 1 },
        {
          type: 'radio',
          title: 'Question 1',
          options: [{ title: 'Option 1' }, { title: 'Option 2' }],
        }
      );

      expect(actual).toEqual('Option 2');
    });

    test('error', () => {
      const question = {
        type: 'radio',
        title: 'Question 1',
        options: [{ title: 'Option 1' }, { title: 'Option 2' }],
      } as PollQuestion;

      expect(() =>
        answerToString({ selectedIndex: -1 }, question)
      ).toThrowError();

      expect(() =>
        answerToString({ selectedIndex: 3 }, question)
      ).toThrowError();

      expect(() =>
        answerToString({ selectedIndex: 0.5 }, question)
      ).toThrowError();

      expect(() => answerToString({ text: '' }, question)).toThrowError();
    });
  });

  describe('multicheckbox', () => {
    test('ok', () => {
      const actual = answerToString(
        { selectedIndices: [0, 1] },
        {
          type: 'multicheckbox',
          title: 'Question 1',
          options: [{ title: 'Option 1' }, { title: 'Option 2' }],
        }
      );

      expect(actual).toEqual('Option 1; Option 2');
    });

    test('error', () => {
      const question = {
        type: 'multicheckbox',
        title: 'Question 1',
        options: [{ title: 'Option 1' }, { title: 'Option 2' }],
      } as PollQuestion;

      expect(() =>
        answerToString({ selectedIndices: [-1] }, question)
      ).toThrowError();

      expect(() =>
        answerToString({ selectedIndices: [3] }, question)
      ).toThrowError();

      expect(() =>
        answerToString({ selectedIndices: [0.5] }, question)
      ).toThrowError();

      expect(() => answerToString({ text: '' }, question)).toThrowError();
    });
  });

  describe('checkbox', () => {
    test.each([
      [true, '+'],
      [false, '-'],
    ])('ok', (status, expected) => {
      const actual = answerToString(
        { status },
        { type: 'checkbox', title: 'title', requiredTrue: false }
      );

      expect(actual).toBe(expected);
    });

    test('error', () => {
      expect(() =>
        answerToString(
          { text: '' },
          { type: 'checkbox', title: 'title', requiredTrue: true }
        )
      ).toThrowError();
    });
  });
});

describe('pollResultsToTable', () => {
  test('ok', () => {
    const date = new Date(2025, 5, 7);
    const actual = pollResultsToTable(
      [
        { type: 'text', title: 'Question 1' },
        { type: 'checkbox', title: 'Question 2', requiredTrue: true },
      ],
      [
        {
          date: date.getTime(),
          answers: [
            {
              text: 'Text',
            },
            {
              status: true,
            },
          ],
        },
      ]
    );

    expect(actual).toEqual({
      questions: ['Дата', 'Question 1', 'Question 2'],
      data: [['7 червня 2025 р. о 00:00', 'Text', '+']],
    });
  });
});
