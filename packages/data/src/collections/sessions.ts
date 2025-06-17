import { Binary, ClientSession, MongoClient, ObjectId, WithId } from 'mongodb';

import { AuthSession } from '../types';
import {
  User,
  UserPersonalInfo,
  UserRole,
  UserWithPassword,
  UserWithRoleAndAvatar,
} from '../types/user';

import { EntityCollection } from './base';

type UserProjection = Partial<Record<`user.${keyof User | '_id'}`, -1 | 0 | 1>>;

export class SessionCollection extends EntityCollection<AuthSession> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'sessions');
  }

  async findBySessionId(sessionId: bigint) {
    return this.findOne({ sessionId });
  }

  async deleteBySessionId(sessionId: bigint) {
    return this.deleteOne({ sessionId });
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
    projection: UserProjection
  ): Promise<T | null> {
    const result = await this.aggregate<{
      user: [T];
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

    return result?.user[0] ?? null;
  }

  async getUserWithRole(
    sessionId: bigint
  ): Promise<UserWithRoleAndAvatar | null> {
    const user = await this.getUserBase<
      WithId<{ role: UserRole; hasAvatar?: boolean }>
    >(sessionId, {
      'user._id': 1,
      'user.role': 1,
      'user.hasAvatar': 1,
    });

    return (
      user && {
        id: user._id.toString(),
        role: user.role,
        hasAvatar: user.hasAvatar ?? false,
      }
    );
  }

  async getUserWithRoleAndGroup(
    sessionId: bigint
  ): Promise<(UserWithRoleAndAvatar & { academicGroup: string }) | null> {
    const user = await this.getUserBase<
      WithId<UserWithRoleAndAvatar & { academicGroup: string }>
    >(sessionId, {
      'user._id': 1,
      'user.role': 1,
      'user.hasAvatar': 1,
      'user.academicGroup': 1,
    });

    return (
      user && {
        id: user._id.toString(),
        role: user.role,
        hasAvatar: user.hasAvatar,
        academicGroup: user.academicGroup,
      }
    );
  }

  async sessionExists(sessionId: bigint): Promise<boolean> {
    const result = await this.findOne(
      { sessionId },
      { projection: { _id: 1 } }
    );

    return result !== null;
  }

  async getUserPersonalInfo(
    sessionId: bigint
  ): Promise<UserPersonalInfo | null> {
    const user = await this.getUserBase<UserPersonalInfo>(sessionId, {
      'user.firstName': 1,
      'user.lastName': 1,
      'user.parentName': 1,
    });

    return user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          parentName: user.parentName,
        }
      : null;
  }

  async getUserWithPassword(
    sessionId: bigint
  ): Promise<UserWithPassword | null> {
    const user = await this.getUserBase<WithId<{ passwordHash: Binary }>>(
      sessionId,
      {
        'user._id': 1,
        'user.passwordHash': 1,
      }
    );

    return user && { id: user._id, passwordHash: user.passwordHash };
  }
}
