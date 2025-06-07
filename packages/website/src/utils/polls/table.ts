import { PollResultsTable } from '@/api/polls/types';
import {
  PollQuestion,
  PollRespondent,
  PollRespondentAnswer,
} from '@data/types/poll';
import { indexMany } from '../indexMany';
import { formatDateTime } from '../date';

export function answerToString(
  answer: PollRespondentAnswer,
  question: PollQuestion
): string {
  switch (question.type) {
    case 'text': {
      if (answer.text === undefined) {
        throw new Error('Invalid answer: no text');
      }

      return answer.text;
    }
    case 'radio': {
      if (answer.selectedIndex === undefined) {
        throw new Error('Invalid answer: no selectedIndex');
      }

      return question.options[answer.selectedIndex].title;
    }
    case 'multicheckbox': {
      if (answer.selectedIndices === undefined) {
        throw new Error('Invalid answer: no selectedIndices');
      }

      return indexMany(question.options, answer.selectedIndices)
        .map((question) => question.title)
        .join('; ');
    }
    case 'checkbox': {
      if (answer.status === undefined) {
        throw new Error('Invalid answer: no status');
      }

      return answer.status ? '+' : '-';
    }
  }
}

export function pollResultsToTable(
  questions: PollQuestion[],
  respondents: PollRespondent[]
): PollResultsTable {
  const columns = ['Дата', ...questions.map(({ title }) => title)];
  const data = respondents.map((respondent) => [
    formatDateTime(respondent.date),
    ...respondent.answers.map((answer, i) =>
      answerToString(answer, questions[i])
    ),
  ]);

  return { questions: columns, data };
}
