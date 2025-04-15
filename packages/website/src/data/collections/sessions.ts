import { MongoClient } from 'mongodb';

import { AuthSession, UserRole } from '../types';

import { EntityCollection } from './base';

export class SessionCollection extends EntityCollection<AuthSession> {
  constructor(client: MongoClient) {
    super(client, 'sessions');
  }

  async getUserRole(sessionId: bigint): Promise<UserRole | null> {
    const result = await this.collection()
      .aggregate<{ user: [{ role: UserRole }] }>([
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
          $project: { user: { role: 1 } },
        },
      ])
      .next();

    return result?.user[0].role ?? null;
  }
}
