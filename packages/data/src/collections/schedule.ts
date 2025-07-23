import { DataQuery, query } from '../sqlite/query';
import { TableDescriptor } from '../sqlite/types';
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
import { ScheduleLessonCollection } from './scheduleLessons';

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

export class ScheduleCollection extends EntityCollection<RawSchedule>(
  'schedule'
) {
  static descriptor(): TableDescriptor<RawSchedule> {
    return {
      groupCampusId: 'TEXT NOT NULL PRIMARY KEY',
      links: 'TEXT',
      lastUpdateTime: 'INTEGER NOT NULL',
    };
  }

  getSchedule(groupCampusId: string): DataQuery<ScheduleWithTeachers | null> {
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

    const metaQuery = this.findOneWhereAction({ groupCampusId }, [
      'links',
      'lastUpdateTime',
    ]);

    return query.merge([scheduleQuery, metaQuery]).map(([lessons, meta]) => {
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
            links: meta && meta.links ? JSON.parse(meta.links) : null,
            lastUpdateTime: meta?.lastUpdateTime ?? 0,
          }
        : null;
    });
  }

  upsertWeeks({ groupCampusId, weeks }: ScheduleWithTeachers) {
    const lessons = this.getCollection(ScheduleLessonCollection);

    return [
      lessons.deleteWhere({ groupCampusId }),
      ...lessons.insertOrReplaceManyAction(
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
    return this.updateWhere(
      { groupCampusId },
      { links: JSON.stringify(links) }
    );
  }

  updateLastUpdateTime(groupCampusId: string, time: number) {
    return this.updateWhereAction({ groupCampusId }, { lastUpdateTime: time });
  }

  getLinks(groupCampusId: string): DataQuery<Record<LessonId, string>> {
    return this.findOneWhereAction({ groupCampusId }, ['links']).map(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (result) => (result && result.links ? JSON.parse(result.links) : {})
    );
  }
}
