import {
  Conditions,
  isNull,
  query,
  TableDescriptor,
} from '@sc-fam/shared-sql/builder';
import { EntityCollection } from '@sc-fam/shared-sql/collection';

import {
  Poll,
  PollQuestion,
  PollRespondent,
  PollRespondentAnswer,
  RawPoll,
  RawPollRespondent,
} from '../types/poll';
import { PollRespondentCollection } from './pollRespondents';

type Respondent = Pick<RawPollRespondent, 'date' | 'answers'> & {
  userId?: number;
};

function parseRespondents<T extends Respondent>(respondents: T[]) {
  return respondents.map(({ answers, ...rest }) => {
    return {
      answers: JSON.parse(answers) as PollRespondentAnswer[],
      ...rest,
    };
  });
}

export class PollCollection extends EntityCollection<RawPoll>('polls') {
  static descriptor(): TableDescriptor<RawPoll> {
    return {
      id: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT',
      title: 'TEXT NOT NULL',
      startDate: 'INTEGER NOT NULL',
      endDate: 'INTEGER',
      questions: 'TEXT NOT NULL',
      slug: 'TEXT NOT NULL',
      spreadsheetId: 'TEXT',
    };
  }

  findShortPollBySlug(slug: string) {
    return this.findOneWhere({ slug }, ['id', 'title', 'startDate', 'endDate']);
  }

  private findEndDateAndQuestionsBase(filter: Conditions<RawPoll>) {
    return this.findOneWhereAction(filter, [
      'id',
      'slug',
      'endDate',
      'questions',
      'title',
    ]).map((result) => {
      if (result === null) {
        return null;
      }

      const { questions, ...rest } = result;

      return {
        questions: JSON.parse(questions) as PollQuestion[],
        ...rest,
      };
    });
  }

  findEndDateAndQuestionsBySlug(slug: string) {
    return this.findEndDateAndQuestionsBase({ slug });
  }

  findEndDateAndQuestionsById(id: number) {
    return this.findEndDateAndQuestionsBase({ id });
  }

  hasUserResponded(pollId: number, userId: number) {
    return this.getCollection(PollRespondentCollection)
      .count({ pollId, userId })
      .map((count) => count > 0);
  }

  insertPoll({
    questions,
    ...rest
  }: Pick<Poll, 'title' | 'slug' | 'startDate' | 'endDate' | 'questions'>) {
    return this.insert({ questions: JSON.stringify(questions), ...rest });
  }

  async findPollWithQuestionsAndAnswers(id: number) {
    const questionQuery = this.findOneWhereAction({ id }, ['questions']);
    const answersQuery = this.getCollection(
      PollRespondentCollection
    ).findManyWhereAction({ pollId: id }, ['date', 'answers']);

    const [questionsValue, respondents] = await query
      .merge([questionQuery, answersQuery], this.queryContext)
      .get();

    if (questionsValue === null) {
      return null;
    }

    return {
      questions: JSON.parse(questionsValue.questions) as PollQuestion[],
      respondents: parseRespondents(respondents),
    };
  }

  async findPollForSpreadsheet(id: number) {
    type Respondent = Pick<RawPollRespondent, 'date' | 'answers' | 'userId'>;

    const questionQuery = this.findOneWhereAction({ id }, [
      'questions',
      'spreadsheetId',
    ]);

    const answersQuery = this.selectAllAction<Respondent>(
      `SELECT date, poll_respondents.userId, answers
      FROM polls
      INNER JOIN poll_respondents ON polls.id = poll_respondents.pollId
      LEFT JOIN poll_spreadsheet_entries ON polls.spreadsheetId = poll_spreadsheet_entries.spreadsheetId
      WHERE poll_spreadsheet_entries.userId IS NULL AND polls.id = ?`,
      [id]
    );

    const [questionsValue, respondents] = await query
      .merge([questionQuery, answersQuery], this.queryContext)
      .get();

    if (questionsValue === null) {
      return null;
    }

    return {
      spreadsheetId: questionsValue.spreadsheetId,
      questions: JSON.parse(questionsValue.questions) as PollQuestion[],
      newRespondents: parseRespondents(respondents),
    };
  }

  addRespondent(id: number, respondent: PollRespondent) {
    return this.getCollection(PollRespondentCollection).insert({
      pollId: id,
      answers: JSON.stringify(respondent.answers),
      date: respondent.date,
      userId: respondent.userId,
    });
  }

  async closePoll(id: number) {
    // Do not update endDate if it's already not null
    return this.updateWhere({ id, endDate: isNull() }, { endDate: Date.now() });
  }

  async getPage(index: number, size: number) {
    const [total, items] = await query
      .merge(
        [
          this.count(),
          this.getPageBase(index * size, size, {}, ['id', 'title', 'slug']),
        ],
        this.queryContext
      )
      .get();

    return { total, items };
  }

  setSpreadsheet(pollId: number, spreadsheetId: string) {
    return this.updateWhere({ id: pollId }, { spreadsheetId });
  }
}
