import { ClientSession, MongoClient, ObjectId } from 'mongodb';

import { Poll, PollRespondent } from '../types';

import { EntityCollection } from './base';

export class PollCollection extends EntityCollection<Poll> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'polls');
  }

  addRespondent(id: string | ObjectId, respondent: PollRespondent) {
    return this.updateById(id, { $push: { respondents: respondent } });
  }
}
