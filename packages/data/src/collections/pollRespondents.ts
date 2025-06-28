import { TableDescriptor } from '../sqlite/types';
import { RawPollRespondent } from '../types/poll';
import { EntityCollection } from './base';

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
