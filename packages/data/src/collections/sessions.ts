import {
  ClientSession,
  Document,
  MongoClient,
  ObjectId,
  WithId,
} from 'mongodb';

import { AuthSession } from '../types';
import { UserRole, UserWithRole } from '../types/user';

import { EntityCollection } from './base';

export class SessionCollection extends EntityCollection<AuthSession> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'sessions');
  }

  async getUserIdBySessionId(sessionId: bigint): Promise<string | null> {
    const result = await this.findOne<{ userId: ObjectId }>(
      { sessionId },
      { projection: { userId: 1 } }
    );

    return result?.userId.toString() ?? null;
  }

  private async getUserBase<T>(
    sessionId: bigint,
    projection: Document
  ): Promise<WithId<T> | undefined> {
    const result = await this.aggregate<{
      user: [WithId<T>];
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
      {
        $project: projection,
      },
    ]).next();

    return result?.user[0];
  }

  async getUserWithRole(sessionId: bigint): Promise<UserWithRole | null> {
    const user = await this.getUserBase<{ role: UserRole }>(sessionId, {
      'user._id': 1,
      'user.role': 1,
    });

    return user === undefined
      ? null
      : { id: user._id.toString(), role: user.role };
  }

  async getUserWithRoleAndGroup(
    sessionId: bigint
  ): Promise<(UserWithRole & { academicGroup: string }) | null> {
    const user = await this.getUserBase<
      UserWithRole & { academicGroup: string }
    >(sessionId, {
      'user._id': 1,
      'user.role': 1,
      'user.academicGroup': 1,
    });

    return user === undefined
      ? null
      : {
          id: user._id.toString(),
          role: user.role,
          academicGroup: user.academicGroup,
        };
  }

  async sessionExists(sessionId: bigint): Promise<boolean> {
    const result = await this.findOne(
      { sessionId },
      { projection: { _id: 1 } }
    );

    return result !== null;
  }
}
