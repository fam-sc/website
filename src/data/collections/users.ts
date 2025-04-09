import { MongoClient } from 'mongodb';

import { User } from '../types';

import { EntityCollection } from './base';

export class UserCollection extends EntityCollection<User> {
  constructor(client: MongoClient) {
    super(client, 'users');
  }
}
