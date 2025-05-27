import {
  ClientSession,
  MongoClient,
  ObjectId,
  UpdateResult,
  WithId,
} from 'mongodb';

import {
  Poll,
  PollRespondent,
  PollWithEndDateAndRespondents,
  ShortPoll,
} from '../types/poll';

import { EntityCollection, resolveObjectId } from './base';
import { pagination } from '../misc/pagination';
import { emptyUpdateResult } from '../misc/result';

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

  findPollWithEndDateAndAnswers(id: string) {
    return this.findById<PollWithEndDateAndRespondents>(id, {
      projection: { endDate: 1, 'respondents.userId': 1 },
    });
  }

  addRespondent(id: string | ObjectId, respondent: PollRespondent) {
    return this.updateById(id, { $push: { respondents: respondent } });
  }

  async closePoll(id: string | ObjectId): Promise<UpdateResult<Poll>> {
    let objectId: ObjectId;
    try {
      objectId = resolveObjectId(id);
    } catch {
      return emptyUpdateResult();
    }

    // Do not update endDate if it's already not null
    return this.updateOne(
      { _id: objectId, endDate: null },
      { $set: { endDate: new Date() } }
    );
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
