import { TableDescriptor } from '@sc-fam/shared-sql/builder';
import { EntityCollection } from '@sc-fam/shared-sql/collection';

import { RawScheduleBotUser, ScheduleBotOptions } from '../types';

type NewUserInfo = {
  telegramId: number;
} & (
  | {
      userId: number;
    }
  | { academicGroup: string }
);

export class ScheduleBotUserCollection extends EntityCollection<RawScheduleBotUser>(
  'schedule_bot_users'
) {
  static descriptor(): TableDescriptor<RawScheduleBotUser> {
    return {
      telegramId: 'INTEGER NOT NULL PRIMARY KEY',
      startTime: 'INTEGER',
      endTime: 'INTEGER',
      notificationEnabled: 'INTEGER',
      userId: 'INTEGER',
      academicGroup: 'TEXT',
    };
  }

  async userHasLinkedBot(telegramId: number): Promise<boolean> {
    const result = await this.count({ telegramId }).get();

    return result > 0;
  }

  findAllUsersToSendNotification(currentTime: number) {
    return this.selectAll<{
      telegramId: number;
      userId: number | null;
      academicGroup: string;
    }>(
      `SELECT telegramId, schedule_bot_users.userId as userId, coalesce(users.academicGroup, schedule_bot_users.academicGroup) as academicGroup
      FROM schedule_bot_users
      LEFT JOIN users ON schedule_bot_users.userId = users.id
      WHERE notificationEnabled=1 AND (startTime IS NULL OR startTime >= ?) AND (endTime IS NULL OR endTime <= ?)`,
      [currentTime, currentTime]
    );
  }

  async hasUserByTelegramId(telegramId: number) {
    const count = await this.count({ telegramId }).get();

    return count > 0;
  }

  addUser(info: NewUserInfo) {
    return this.insert({
      notificationEnabled: 1,
      startTime: null,
      endTime: null,
      ...info,
    });
  }

  async addOrUpdateGroup(telegramId: number, academicGroup: string) {
    const exists = await this.count({ telegramId }).get();

    await (exists
      ? this.updateWhere({ telegramId }, { academicGroup })
      : this.addUser({ telegramId, academicGroup }));
  }

  async getOptionsByUserId(userId: number): Promise<ScheduleBotOptions | null> {
    const result = await this.findOneWhere({ userId }, [
      'notificationEnabled',
      'startTime',
      'endTime',
    ]);

    return result
      ? { ...result, notificationEnabled: result.notificationEnabled === 1 }
      : null;
  }

  updateOptionsByUserId(
    userId: number,
    { notificationEnabled, startTime, endTime }: ScheduleBotOptions
  ) {
    return this.updateWhere(
      { userId },
      { notificationEnabled: notificationEnabled ? 1 : 0, startTime, endTime }
    );
  }

  async switchNotificationEnabled(telegramId: number) {
    const result = await this.selectOne<{ notificationEnabled: number }>(
      `UPDATE schedule_bot_users
      SET notificationEnabled = 1 - notificationEnabled
      WHERE telegramId=?
      RETURNING notificationEnabled`,
      [telegramId]
    );

    return result ? result.notificationEnabled === 1 : null;
  }

  async getUserIdByTelegrmId(telegramId: number) {
    const result = await this.findOneWhere({ telegramId }, ['userId']);

    return result?.userId ?? null;
  }

  getUserAndAcademicGroup(telegramId: number) {
    return this.selectOne<{ userId: number | null; academicGroup: string }>(
      `SELECT schedule_bot_users.userId as userId, coalesce(users.academicGroup, schedule_bot_users.academicGroup) as academicGroup
      FROM schedule_bot_users
      LEFT JOIN users ON users.id = schedule_bot_users.userId
      WHERE telegramId=?`,
      [telegramId]
    );
  }
}
