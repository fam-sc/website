import { TableDescriptor, valueIn } from '@sc-fam/shared-sql/builder';
import { EntityCollection } from '@sc-fam/shared-sql/collection';

import { ScheduleTeacher, ScheduleWithTeachers } from '../types/schedule';

function uniqueTeachers(
  schedule: Pick<ScheduleWithTeachers, 'weeks'>
): ScheduleTeacher[] {
  const result = new Map<string, ScheduleTeacher>();

  for (const week of schedule.weeks) {
    for (const { lessons } of week) {
      for (const { teacher } of lessons) {
        result.set(teacher.name, teacher);
      }
    }
  }

  return [...result.values()];
}

export class ScheduleTeacherCollection extends EntityCollection<ScheduleTeacher>(
  'schedule_teachers'
) {
  static descriptor(): TableDescriptor<ScheduleTeacher> {
    return { name: 'TEXT NOT NULL PRIMARY KEY', link: 'TEXT' };
  }

  insertFromSchedule(schedule: Pick<ScheduleWithTeachers, 'weeks'>) {
    return this.insertOrReplaceManyAction(uniqueTeachers(schedule));
  }

  findByName(name: string) {
    return this.findOneWhere({ name });
  }

  findByNames(names: string[]) {
    return this.findManyWhere({ name: valueIn(names) });
  }
}
