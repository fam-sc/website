import { ClientSession, MongoClient, ObjectId } from 'mongodb';

import { AuthSession, UserRole } from '../types';

import { EntityCollection } from './base';

export class SessionCollection extends EntityCollection<AuthSession> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'sessions');
  }

  async getUserWithRole(
    sessionId: bigint
  ): Promise<{ id: ObjectId; role: UserRole } | null> {
    const result = await this.aggregate<{
      user: [{ _id: ObjectId; role: UserRole }];
    }>([
      // Find session by id
      { $match: { sessionId } },
      // Join user by userId, save it as 'user'
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'userId',
          as: 'user',
        },
      },
      // Select only role from user
      {
        $project: { user: { _id: 1, role: 1 } },
      },
    ]).next();

    const user = result?.user[0];

    return user === undefined ? null : { id: user._id, role: user.role };
  }
}
