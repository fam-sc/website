import { ClientSession, MongoClient, ObjectId } from 'mongodb';

import { Poll, PollRespondent } from '../types';

import { EntityCollection } from './base';

export class PollCollection extends EntityCollection<Poll> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'polls');
  }

  addRespondent(id: ObjectId, respondent: PollRespondent) {
    return this.updateOne({ _id: id }, { $push: { respondents: respondent } });
  }
}
