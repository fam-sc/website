import { DataQuery, query, TableDescriptor } from '@sc-fam/shared-sql/builder';
import { EntityCollection } from '@sc-fam/shared-sql/collection';

import {
  Day,
  DaySchedule,
  LessonId,
  LessonWithTeacherAndDiscipline,
  RawLesson,
  RawSchedule,
  Schedule,
  ScheduleWeek,
  ScheduleWithTeachersAndDisciplineLink,
} from '../types/schedule';
import { ScheduleLessonCollection } from './scheduleLessons';

function splitToWeeks<Input extends RawLesson, T>(
  rawLessons: Omit<Input, 'groupName'>[],
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

export class ScheduleCollection extends EntityCollection<RawSchedule>(
  'schedule'
) {
  static descriptor(): TableDescriptor<RawSchedule> {
    return {
      groupName: 'TEXT NOT NULL PRIMARY KEY',
      links: 'TEXT',
      lastUpdateTime: 'INTEGER NOT NULL',
    };
  }

  getSchedule(
    groupName: string
  ): DataQuery<ScheduleWithTeachersAndDisciplineLink | null> {
    type R = RawLesson & {
      lesson_name: string;
      teacher_link: string | null;
      discipline_link: string | null;
    };

    const scheduleQuery = this.selectAllAction<R>(
      `SELECT week, day, place, teacher, time, type, schedule_teachers.link as teacher_link, schedule_lessons.name as lesson_name, disciplines.link as discipline_link
      FROM schedule_lessons 
      LEFT JOIN schedule_teachers ON schedule_lessons.teacher=schedule_teachers.name
      LEFT JOIN disciplines ON schedule_lessons.name=disciplines.name
      WHERE groupName=?`,
      [groupName]
    );

    const metaQuery = this.findOneWhereAction({ groupName }, [
      'links',
      'lastUpdateTime',
    ]);

    return query.merge([scheduleQuery, metaQuery]).map(([lessons, meta]) => {
      return lessons.length > 0
        ? {
            groupName,
            weeks: splitToWeeks<R, LessonWithTeacherAndDiscipline>(
              lessons,
              ({
                teacher,
                teacher_link,
                lesson_name,
                discipline_link,
                ...rest
              }) => ({
                ...rest,
                name: lesson_name,
                disciplineLink: discipline_link,
                teacher: {
                  name: teacher,
                  link: teacher_link,
                },
              })
            ),
            links: meta && meta.links ? JSON.parse(meta.links) : null,
            lastUpdateTime: meta?.lastUpdateTime ?? 0,
          }
        : null;
    });
  }

  upsertWeeks({
    groupName,
    weeks,
  }: Pick<ScheduleWithTeachersAndDisciplineLink, 'groupName' | 'weeks'>) {
    const lessons = this.getCollection(ScheduleLessonCollection);

    return [
      lessons.deleteWhere({ groupName }),
      ...lessons.insertOrReplaceManyAction(
        weeks
          .map((week, index) =>
            week.map(({ day, lessons }) =>
              lessons.map(({ teacher, name, place, time, type }) => ({
                groupName,
                week: (index + 1) as 1 | 2,
                day,
                teacher: teacher.name,
                name,
                place,
                time,
                type,
              }))
            )
          )
          .flat(2)
      ),
    ];
  }

  insertPlaceholder(groupName: string) {
    return this.insertOrIgnoreAction({ groupName, lastUpdateTime: 0 });
  }

  updateLinks(groupName: string, links: Schedule['links']) {
    return this.updateWhere({ groupName }, { links: JSON.stringify(links) });
  }

  updateLastUpdateTime(groupName: string, time: number) {
    return this.updateWhereAction({ groupName }, { lastUpdateTime: time });
  }

  getLinks(groupName: string): DataQuery<Record<LessonId, string>> {
    return this.findOneWhereAction({ groupName }, ['links']).map(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (result) => (result && result.links ? JSON.parse(result.links) : {})
    );
  }
}
