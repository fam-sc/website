import { TableDescriptor } from '@sc-fam/shared-sql/builder';
import { EntityCollection } from '@sc-fam/shared-sql/collection';

import { RawLesson } from '../types/schedule';

export class ScheduleLessonCollection extends EntityCollection<RawLesson>(
  'schedule_lessons'
) {
  static descriptor(): TableDescriptor<RawLesson> {
    return {
      groupCampusId: 'TEXT NOT NULL',
      week: 'INTEGER NOT NULL',
      day: 'INTEGER NOT NULL',
      type: 'INTEGER NOT NULL',
      name: 'TEXT NOT NULL',
      place: 'TEXT NOT NULL',
      time: 'TEXT NOT NULL',
      teacher: 'TEXT NOT NULL',
    };
  }
}
