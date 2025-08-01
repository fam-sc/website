import { TableDescriptor } from '../sqlite/types';
import { RawScheduleBotUser, ScheduleBotOptions } from '../types';
import { EntityCollection } from './base';

export class ScheduleBotUserCollection extends EntityCollection<RawScheduleBotUser>(
  'schedule_bot_users'
) {
  static descriptor(): TableDescriptor<RawScheduleBotUser> {
    return {
      id: 'INTEGER NOT NULL PRIMARY KEY',
      telegramId: 'INTEGER NOT NULL',
      startTime: 'INTEGER',
      endTime: 'INTEGER',
      notificationEnabled: 'INTEGER',
    };
  }

  async userHasLinkedBot(telegramId: number): Promise<boolean> {
    const result = await this.count({ telegramId }).get();

    return result > 0;
  }

  findAllUsersToSendNotification(currentTime: number) {
    return this.selectAll<{
      id: number;
      telegramId: number;
      academicGroup: string;
    }>(
      `SELECT id, telegramId, users.academicGroup as academicGroup
      FROM schedule_bot_users
      INNER JOIN users ON schedule_bot_users.id = users.id
      WHERE notificationEnabled=1 AND startTime >= ? AND endTime <= ?`,
      [currentTime, currentTime]
    );
  }

  addUser(id: number, telegramId: number) {
    return this.insert({
      id,
      telegramId,
      notificationEnabled: 1,
      startTime: null,
      endTime: null,
    });
  }

  async getUserOptions(id: number): Promise<ScheduleBotOptions | null> {
    const result = await this.findOneWhere({ id }, [
      'notificationEnabled',
      'startTime',
      'endTime',
    ]);

    return result
      ? { ...result, notificationEnabled: result.notificationEnabled === 1 }
      : null;
  }

  updateUserOptions(
    id: number,
    { notificationEnabled, startTime, endTime }: ScheduleBotOptions
  ) {
    return this.updateWhere(
      { id },
      { notificationEnabled: notificationEnabled ? 1 : 0, startTime, endTime }
    );
  }
}
