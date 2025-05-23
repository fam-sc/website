import { ClientSession, MongoClient, ObjectId, WithId } from 'mongodb';

import { Poll, PollRespondent, ShortPoll } from '../types/poll';

import { EntityCollection } from './base';
import { pagination } from '../misc/pagination';

export class PollCollection extends EntityCollection<Poll> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'polls');
  }

  findShortPoll(id: string) {
    return this.findById<ShortPoll>(id, {
      projection: { title: 1, startDate: 1, endDate: 1 },
    });
  }

  findPollWithQuestionsAndAnswers(id: string) {
    return this.findById<Pick<Poll, 'questions' | 'respondents'>>(id, {
      projection: { questions: 1, respondents: 1 },
    });
  }

  addRespondent(id: string | ObjectId, respondent: PollRespondent) {
    return this.updateById(id, { $push: { respondents: respondent } });
  }

  closePoll(id: string | ObjectId) {
    return this.updateById(id, { $set: { endDate: new Date() } });
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
      total: result.metadata[0].totalCount as number,
      items: result.data as WithId<Poll>[],
    };
  }
}
