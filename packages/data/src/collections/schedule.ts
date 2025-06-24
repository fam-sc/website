import { DataQuery, query } from '../sqlite/query';
import { buildUpdateWhereQuery } from '../sqlite/queryBuilder';
import { TableDescriptors } from '../sqlite/types';
import {
  Day,
  DaySchedule,
  LessonId,
  LessonWithTeacher,
  RawLesson,
  RawSchedule,
  Schedule,
  ScheduleWeek,
  ScheduleWithTeachers,
} from '../types/schedule';

import { EntityCollection } from './base';

function splitToWeeks<Input extends RawLesson, T>(
  rawLessons: Omit<Input, 'groupCampusId'>[],
  mapEntry: (input: Omit<Input, 'week' | 'day'>) => T
): [ScheduleWeek<T>, ScheduleWeek<T>] {
  type Item = Partial<Record<Day, DaySchedule<T>>>;

  const result: [Item, Item] = [{}, {}];

  for (const { week, day, ...rest } of rawLessons) {
    const weekMap = result[week - 1];
    let daySchedule = weekMap[day];
    if (daySchedule === undefined) {
      daySchedule = { day, lessons: [] };
      weekMap[day] = daySchedule;
    }

    daySchedule.lessons.push(mapEntry(rest as Omit<Input, 'week' | 'day'>));
  }

  return [Object.values(result[0]), Object.values(result[1])];
}

export class ScheduleCollection extends EntityCollection<RawLesson>(
  'schedule_lessons'
) {
  static descriptor(): TableDescriptors<[RawLesson, RawSchedule]> {
    return [
      [
        'schedule_lessons',
        {
          groupCampusId: 'TEXT NOT NULL',
          week: 'INTEGER NOT NULL',
          day: 'INTEGER NOT NULL',
          type: 'INTEGER NOT NULL',
          name: 'TEXT NOT NULL',
          place: 'TEXT NOT NULL',
          time: 'TEXT NOT NULL',
          teacher: 'TEXT NOT NULL',
        },
      ],
      [
        'schedule',
        {
          groupCampusId: 'TEXT NOT NULL PRIMARY KEY',
          links: 'TEXT',
        },
      ],
    ];
  }

  findByGroupWithTeachers(
    groupCampusId: string
  ): DataQuery<ScheduleWithTeachers | null> {
    type R = RawLesson & {
      lesson_name: string;
      teacher_link: string | null;
    };

    const scheduleQuery = this.selectAllAction<R>(
      `SELECT week, day, place, teacher, time, type, link, schedule_teachers.link as teacher_link, schedule_lessons.name as lesson_name
      FROM schedule_lessons 
      RIGHT JOIN schedule_teachers ON schedule_lessons.teacher=schedule_teachers.name 
      WHERE groupCampusId=?`,
      [groupCampusId]
    );

    const linksQuery = this.selectOneAction<{ links: string }>(
      'SELECT links FROM schedule WHERE groupCampusId=?',
      [groupCampusId]
    );

    return query.merge([scheduleQuery, linksQuery], ([lessons, links]) => {
      return lessons.length > 0
        ? {
            groupCampusId,
            weeks: splitToWeeks<R, LessonWithTeacher>(
              lessons,
              ({ teacher, teacher_link, lesson_name, ...rest }) => ({
                ...rest,
                name: lesson_name,
                teacher: {
                  name: teacher,
                  link: teacher_link,
                },
              })
            ),
            links: links ? JSON.parse(links.links) : null,
          }
        : null;
    });
  }

  upsertWeeks({ groupCampusId, weeks }: ScheduleWithTeachers) {
    return [
      this.deleteWhere({ groupCampusId }),
      ...this.insertOrReplaceManyAction(
        weeks
          .map((week, index) =>
            week.map(({ day, lessons }) =>
              lessons.map(({ teacher, ...rest }) => ({
                groupCampusId,
                week: (index + 1) as 1 | 2,
                day,
                teacher: teacher.name,
                ...rest,
              }))
            )
          )
          // eslint-disable-next-line unicorn/no-magic-array-flat-depth
          .flat(2)
      ),
    ];
  }

  updateLinks(groupCampusId: string, links: Schedule['links']) {
    const updated = { links: JSON.stringify(links) };

    return this.client
      .prepare(
        buildUpdateWhereQuery<RawSchedule>(
          'schedule',
          { groupCampusId },
          updated
        )
      )
      .bind(updated.links, groupCampusId)
      .run();
  }

  async getLinks(groupCampusId: string): Promise<Record<LessonId, string>> {
    const links = await this.selectOne<{ links: string }>(
      'SELECT links FROM schedule WHERE groupCampusId=?',
      [groupCampusId]
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return links ? JSON.parse(links.links) : {};
  }

  // findSchedulesWithGroupIds(ids: string[]) {
  //   return this.find({ groupCampusId: { $in: ids } });
  // }
}
