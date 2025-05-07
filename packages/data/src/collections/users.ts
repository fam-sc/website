import { ClientSession, MongoClient, ObjectId, WithId } from 'mongodb';

import { User } from '../types';

import { EntityCollection } from './base';

export class UserCollection extends EntityCollection<User> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'users');
  }

  getUserByEmail(email: string): Promise<WithId<User> | null> {
    return this.findOne({ email });
  }

  updateTelegramUserId(id: ObjectId, telegramUserId: number) {
    return this.updateOne({ _id: id }, { $set: { telegramUserId } });
  }

  findByTelegramUserId(id: number) {
    return this.findOne({ telegramUserId: id });
  }

  findAllUsersWithLinkedTelegram() {
    return this.find({ telegramUserId: { $not: { $eq: null } } });
  }
}
