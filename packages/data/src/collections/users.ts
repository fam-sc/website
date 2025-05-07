import { ClientSession, MongoClient, WithId } from 'mongodb';

import { User } from '../types';

import { EntityCollection } from './base';

export class UserCollection extends EntityCollection<User> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'users');
  }

  getUserByEmail(email: string): Promise<WithId<User> | null> {
    return this.findOne({ email });
  }
}
