import { MongoClient, ClientSession, Binary } from 'mongodb';
import { PendingUser } from '../types/user';
import { EntityCollection } from './base';

export class PendingUserCollection extends EntityCollection<PendingUser> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'pending-users');
  }

  findByToken(token: Binary) {
    return this.findOne({ token });
  }
}
