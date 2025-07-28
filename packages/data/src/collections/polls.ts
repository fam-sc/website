import { Conditions } from '../sqlite/conditions';
import { isNull } from '../sqlite/modifier';
import { query } from '../sqlite/query';
import { TableDescriptor } from '../sqlite/types';
import {
  Poll,
  PollQuestion,
  PollRespondent,
  PollRespondentAnswer,
  RawPoll,
} from '../types/poll';
import { EntityCollection } from './base';
import { PollRespondentCollection } from './pollRespondents';

export class PollCollection extends EntityCollection<RawPoll>('polls') {
  static descriptor(): TableDescriptor<RawPoll> {
    return {
      id: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT',
      title: 'TEXT NOT NULL',
      startDate: 'INTEGER NOT NULL',
      endDate: 'INTEGER',
      questions: 'TEXT NOT NULL',
      slug: 'TEXT NOT NULL',
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

    const { questions } = questionsValue;

    return {
      questions: JSON.parse(questions) as PollQuestion[],
      respondents: respondents.map(({ date, answers }) => {
        return {
          date,
          answers: JSON.parse(answers) as PollRespondentAnswer[],
        };
      }),
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
}
