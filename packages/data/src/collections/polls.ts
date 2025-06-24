import { isNull } from '../sqlite/modifier';
import {
  Poll,
  PollRespondent,
  PollWithEndDateAndRespondents,
  RawPoll,
} from '../types/poll';

import { EntityCollection } from './base';

export class PollCollection extends EntityCollection<RawPoll>('polls') {
  findShortPoll(id: number) {
    return this.findOneWhere({ id }, ['id', 'title', 'startDate', 'endDate']);
  }

  insertPoll({
    questions,
    ...rest
  }: Pick<Poll, 'title' | 'startDate' | 'endDate' | 'questions'>) {
    return this.insert({ questions: JSON.stringify(questions), ...rest });
  }

  findPollWithQuestionsAndAnswers(id: number) {
    return this.findById<Pick<Poll, 'questions' | 'respondents'>>(id, {
      projection: { questions: 1, respondents: 1 },
    });
  }

  findPollWithEndDateAndAnswers(id: number) {
    return this.findById<PollWithEndDateAndRespondents>(id, {
      projection: { endDate: 1, 'respondents.userId': 1 },
    });
  }

  addRespondent(id: number, respondent: PollRespondent) {
    return this.updateById(id, { $push: { respondents: respondent } });
  }

  async closePoll(id: number) {
    // Do not update endDate if it's already not null
    return this.updateWhere({ id, endDate: isNull() }, { endDate: Date.now() });
  }

  async getPage(index: number, size: number) {
    const result = await this.aggregate([
      {
        $sort: {
          date: -1,
        },
      },
      pagination(index, size),
    ]).next();

    if (result === null) {
      return { total: 0, items: [] };
    }

    return {
      total: (result.metadata[0]?.totalCount ?? 0) as number,
      items: result.data as WithId<Poll>[],
    };
  }
}
