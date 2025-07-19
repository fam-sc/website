import { PollQuestion as ApiQuestion } from '@/api/polls/types';
import {
  QuestionDescriptor,
  QuestionDescriptorContent,
  QuestionType,
} from '@/services/polls/types';

export type QuestionItem<T extends QuestionType = QuestionType> = {
  title: string;
  descriptor: QuestionDescriptor<T>;
};

type ConfigMap = {
  [T in QuestionType]: {
    getDescriptor: (question: ApiQuestion<T>) => QuestionDescriptorContent<T>;
  };
};

function getOptionsDescriptor<T extends 'multicheckbox' | 'radio'>(
  question: ApiQuestion<T>
) {
  return {
    options: question.options.map(({ title }, id) => ({ id, title })),
  };
}

const config: ConfigMap = {
  text: { getDescriptor: () => ({}) },
  multicheckbox: { getDescriptor: getOptionsDescriptor },
  radio: { getDescriptor: getOptionsDescriptor },
  checkbox: { getDescriptor: ({ requiredTrue }) => ({ requiredTrue }) },
  score: { getDescriptor: ({ items }) => ({ items }) },
};

export function apiQuestionToItem<T extends QuestionType>(
  question: ApiQuestion<T>
): QuestionItem<T> {
  const { type } = question;
  const content = config[type].getDescriptor(question);

  return {
    title: question.title,
    descriptor: { type, ...content },
  };
}
