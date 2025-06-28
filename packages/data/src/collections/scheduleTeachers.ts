import { ScheduleTeacher, ScheduleWithTeachers } from '../types/schedule';

import { EntityCollection } from './base';
import { valueIn } from '../sqlite/modifier';
import { TableDescriptor } from '../sqlite/types';

function uniqueTeachers(schedule: ScheduleWithTeachers): ScheduleTeacher[] {
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

  insertFromSchedule(schedule: ScheduleWithTeachers) {
    return this.insertOrReplaceManyAction(uniqueTeachers(schedule));
  }

  findByName(name: string) {
    return this.findOneWhere({ name });
  }

  findByNames(names: string[]) {
    return this.findManyWhere({ name: valueIn(names) });
  }
}
