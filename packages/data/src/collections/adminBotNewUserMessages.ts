import { TableDescriptor } from '@sc-fam/shared-sql/builder';
import { EntityCollection } from '@sc-fam/shared-sql/collection';

import { AdminBotNewUserMessage } from '../types/adminBot';

export class AdminBotNewUserMessagesCollection extends EntityCollection<AdminBotNewUserMessage>(
  'admin_bot_new_user_messages'
) {
  static descriptor(): TableDescriptor<AdminBotNewUserMessage> {
    return {
      chatId: 'INTEGER NOT NULL',
      messageId: 'INTEGER NOT NULL',
      newUserId: 'INTEGER NOT NULL',
    };
  }

  getMessagesByNewUserId(newUserId: number) {
    return this.findManyWhereAction({ newUserId }, ['chatId', 'messageId']);
  }

  deleteMessagesByNewUserId(newUserId: number) {
    return this.deleteWhere({ newUserId });
  }
}
