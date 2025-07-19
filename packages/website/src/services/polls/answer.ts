import { QuestionAnswer, QuestionDescriptor, QuestionType } from './types';

type AnswerConfigMap = {
  [T in QuestionType]: {
    empty: QuestionAnswer<T>;
    validate: (
      answer: QuestionAnswer<T>,
      descriptor: QuestionDescriptor<T>
    ) => boolean;
  };
};

const config: AnswerConfigMap = {
  text: {
    empty: { text: '' },
    validate: ({ text }) => text.length > 0,
  },
  multicheckbox: {
    empty: { selectedIndices: [] },
    validate: ({ selectedIndices }) => selectedIndices.length > 0,
  },
  radio: {
    empty: { selectedIndex: undefined },
    validate: ({ selectedIndex }) => selectedIndex !== undefined,
  },
  checkbox: {
    empty: { status: false },
    validate: ({ status }, { requiredTrue }) => !requiredTrue || status,
  },
  score: {
    empty: { selected: undefined },
    validate: ({ selected }) => selected !== undefined,
  },
};

export function isAnswerValid<T extends QuestionType>(
  answer: QuestionAnswer<T>,
  descriptor: QuestionDescriptor<T>
): boolean {
  return config[descriptor.type].validate(answer, descriptor);
}

export function getEmptyAnswer<T extends QuestionType>(
  type: T
): QuestionAnswer<T> {
  return config[type].empty;
}
