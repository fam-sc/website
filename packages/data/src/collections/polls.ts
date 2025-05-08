import { ClientSession, MongoClient } from 'mongodb';

import { Poll } from '../types';

import { EntityCollection } from './base';

export class PollCollection extends EntityCollection<Poll> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'polls');
  }
}
