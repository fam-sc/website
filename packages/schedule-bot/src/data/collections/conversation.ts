import { TableDescriptor } from '@sc-fam/shared-sql/builder';
import { EntityCollection } from '@sc-fam/shared-sql/collection';

import { Conversation, ConversationState } from '../types';

export class ConversationCollection extends EntityCollection<Conversation>(
  'conversations'
) {
  static descriptor(): TableDescriptor<Conversation> {
    return {
      telegramId: 'INTEGER NOT NULL PRIMARY KEY',
      state: 'INTEGER NOT NULL',
    };
  }

  async getState(telegramId: number) {
    const result = await this.findOneWhere({ telegramId }, ['state']);

    return result?.state;
  }

  setState(telegramId: number, state: ConversationState) {
    return this.insertOrReplace({ telegramId, state });
  }
}
