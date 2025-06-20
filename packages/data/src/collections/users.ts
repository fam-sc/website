import { Binary, ClientSession, MongoClient, ObjectId, WithId } from 'mongodb';

import { ShortUser, User, UserPersonalInfo, UserRole } from '../types/user';

import { EntityCollection } from './base';

import { deleteUndefined } from '@shared/deleteUndefined';

export class UserCollection extends EntityCollection<User> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'users');
  }

  findUserByEmail(email: string): Promise<WithId<User> | null> {
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

  findAllNonApprovedUsers(academicGroup?: string): Promise<ShortUser[]> {
    return this.find(
      deleteUndefined({
        academicGroup,
        role: UserRole.STUDENT_NON_APPROVED,
      })
    )
      .project<WithId<ShortUser>>({
        academicGroup: 1,
        firstName: 1,
        lastName: 1,
        parentName: 1,
        email: 1,
        role: 1,
        hasAvatar: 1,
      })
      .map(({ _id, ...rest }) => ({ ...rest, id: _id.toString() }))
      .toArray();
  }

  updateRole(id: string, role: UserRole) {
    return this.updateById(id, { $set: { role } });
  }

  updatePassword(id: string | ObjectId, passwordHash: Binary) {
    return this.updateById(id, { $set: { passwordHash } });
  }

  updateHasAvatar(id: string, hasAvatar: boolean) {
    return this.updateById(id, { $set: { hasAvatar } });
  }

  async getUserAcademicGroup(id: string): Promise<string | null> {
    const result = await this.findById<{ academicGroup: string }>(id, {
      projection: {
        academicGroup: { role: 1 },
      },
    });

    return result?.academicGroup ?? null;
  }

  async getPage(index: number, size: number) {
    const result = await this.aggregate<{
      data: WithId<Omit<ShortUser, 'id'>>[];
    }>([
      {
        $match: {
          role: { $ne: UserRole.ADMIN },
        },
      },
      {
        $facet: {
          data: [{ $skip: index * size }, { $limit: size }],
        },
      },
      {
        $project: {
          data: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            parentName: 1,
            academicGroup: 1,
            email: 1,
            role: 1,
          },
        },
      },
    ]).next();

    if (result === null) {
      return [];
    }

    return result.data.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    }));
  }

  async getPersonalInfo(
    id: string | ObjectId
  ): Promise<UserPersonalInfo | null> {
    return this.findById(id, {
      projection: { firstName: 1, lastName: 1, parentName: 1 },
    });
  }

  async updatePersonalInfo(
    id: string | ObjectId,
    { firstName, lastName, parentName }: UserPersonalInfo
  ) {
    return this.updateById(id, { $set: { firstName, lastName, parentName } });
  }
}
