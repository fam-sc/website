import { MongoClient, WithId } from 'mongodb';

import { User } from '../types';

import { EntityCollection } from './base';

export class UserCollection extends EntityCollection<User> {
  constructor(client: MongoClient) {
    super(client, 'users');
  }

  getUserByEmail(email: string): Promise<WithId<User> | null> {
    return this.collection().findOne({ email });
  }
}
