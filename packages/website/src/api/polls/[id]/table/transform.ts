import {
  AnonymousPollRespondent,
  PollQuestion,
  PollRespondentAnswer,
} from '@sc-fam/data';
import { formatDateTime } from '@sc-fam/shared/chrono';
import { indexMany } from '@sc-fam/shared/collections';

import { PollResultsTable } from '@/api/polls/types';
import { QuestionType } from '@/services/polls/types';

type StringifierMap = {
  [K in QuestionType]: (
    answer: PollRespondentAnswer,
    question: PollQuestion<K>
  ) => string;
};

function notUndefined<K extends keyof PollRespondentAnswer>(
  answer: PollRespondentAnswer,
  key: K
): NonNullable<PollRespondentAnswer[K]> {
  const value = answer[key];
  if (value === undefined) {
    throw new Error(`Invalid answer: no ${key}`);
  }

  return value;
}

const stringifierMap: StringifierMap = {
  text: (answer) => notUndefined(answer, 'text'),
  radio: (answer, { options }) => {
    const index = notUndefined(answer, 'selectedIndex');

    return options[index].title;
  },
  multicheckbox: (answer, { options }) => {
    const indices = notUndefined(answer, 'selectedIndices');

    return indexMany(options, indices)
      .map(({ title }) => title)
      .join('; ');
  },
  checkbox: (answer) => {
    const status = notUndefined(answer, 'status');

    return status ? '+' : '-';
  },
  score: (answer) => {
    const score = notUndefined(answer, 'selected');

    return score.toString();
  },
};

export function answerToString<T extends QuestionType>(
  answer: PollRespondentAnswer,
  question: PollQuestion<T>
): string {
  return stringifierMap[question.type](answer, question);
}

export function pollResultsToTable(
  questions: PollQuestion[],
  respondents: AnonymousPollRespondent[]
): PollResultsTable {
  const columns = ['Дата', ...questions.map(({ title }) => title)];
  const data = respondents.map((respondent) => [
    formatDateTime(new Date(respondent.date)),
    ...respondent.answers.map((answer, i) =>
      answerToString(answer, questions[i])
    ),
  ]);

  return { questions: columns, data };
}
