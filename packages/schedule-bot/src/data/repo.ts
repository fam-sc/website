import { createRepository } from '@sc-fam/shared-sql/repo';

import { ConversationCollection } from './collections/conversation';

export const botRepository = createRepository({
  conversations: ConversationCollection,
});
