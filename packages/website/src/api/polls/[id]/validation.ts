import { PollQuestion, PollRespondentAnswer } from '@sc-fam/data';

import { QuestionType } from '@/services/polls/types';

type ValidatorMap = {
  [K in QuestionType]: (
    answer: PollRespondentAnswer,
    question: PollQuestion<K>
  ) => boolean;
};

function isValidIndexInOptions(index: number, values: unknown[]): boolean {
  return Number.isInteger(index) && index >= 0 && index < values.length;
}

const validators: ValidatorMap = {
  text: ({ text }) => text !== undefined,
  checkbox: ({ status }, { requiredTrue }) =>
    status !== undefined && (!requiredTrue || status),
  multicheckbox: ({ selectedIndices }, { options }) =>
    selectedIndices !== undefined &&
    selectedIndices.every((index) => isValidIndexInOptions(index, options)),
  radio: ({ selectedIndex }, { options }) =>
    selectedIndex !== undefined &&
    isValidIndexInOptions(selectedIndex, options),
  score: ({ selected }, { items }) => items.includes(selected),
};

export function isValidAnswer<T extends QuestionType>(
  question: PollQuestion<T>,
  answer: PollRespondentAnswer
): boolean {
  return validators[question.type](answer, question);
}

export function isValidAnswers(
  questions: PollQuestion[],
  answers: PollRespondentAnswer[]
): boolean {
  if (questions.length !== answers.length) {
    return false;
  }

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const answer = answers[i];

    if (!isValidAnswer(question, answer)) {
      return false;
    }
  }

  return true;
}
