import { TableDescriptor } from '@sc-fam/shared-sql/builder';
import { EntityCollection } from '@sc-fam/shared-sql/collection';

import { RawPollRespondent } from '../types/poll';

export class PollRespondentCollection extends EntityCollection<RawPollRespondent>(
  'poll_respondents'
) {
  static descriptor(): TableDescriptor<RawPollRespondent> {
    return {
      pollId: 'INTEGER NOT NULL',
      date: 'INTEGER NOT NULL',
      answers: 'TEXT NOT NULL',
      userId: 'INTEGER NOT NULL',
    };
  }
}
