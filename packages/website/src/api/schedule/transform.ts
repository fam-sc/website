/* eslint-disable unicorn/no-array-callback-reference */
import {
  DaySchedule as CampusDaySchedule,
  LessonSchedule,
  Weekday,
} from '../campus/types';

import { createCachedTeacherResolver, TeacherResolver } from './teachers';
import {
  DaySchedule as ApiDaySchedule,
  Schedule as ApiSchedule,
} from './types';

import { Repository } from '@/data/repo';
import {
  Day,
  DaySchedule as DataDaySchedule,
  Schedule as DataSchedule,
} from '@/data/types/schedule';

export function campusDayToWeekdayNumber(value: Weekday): Day {
  switch (value) {
    case 'Пн': {
      return 1;
    }
    case 'Вв': {
      return 2;
    }
    case 'Ср': {
      return 3;
    }
    case 'Чт': {
      return 4;
    }
    case 'Пт': {
      return 5;
    }
    case 'Сб': {
      return 6;
    }
  }
}

export function campusDayScheduleToDaySchedule(
  schedule: CampusDaySchedule
): DataDaySchedule {
  return {
    day: campusDayToWeekdayNumber(schedule.day),
    lessons: schedule.pairs.map(({ name, place, time, tag, teacherName }) => ({
      name,
      place,
      time,
      type: tag,
      teacher: teacherName,
    })),
  };
}

export function campusScheduleToDataSchedule(
  value: LessonSchedule
): DataSchedule {
  return {
    groupCampusId: value.groupCode,
    firstWeek: value.scheduleFirstWeek.map(campusDayScheduleToDaySchedule),
    secondWeek: value.scheduleSecondWeek.map(campusDayScheduleToDaySchedule),
  };
}

async function dataScheduleWeekToApiScheduleWeek(
  value: DataDaySchedule,
  resolver: TeacherResolver
): Promise<ApiDaySchedule> {
  return {
    day: value.day,
    lessons: await Promise.all(
      value.lessons.map(async ({ teacher: teacherName, ...rest }) => {
        const teacher = await resolver.get(teacherName);
        if (teacher === undefined) {
          return { teacher: { name: teacherName, link: null }, ...rest };
        }

        return { teacher: { name: teacher.name, link: teacher.link }, ...rest };
      })
    ),
  };
}

export async function dataScheduleToApiSchedule(
  value: DataSchedule,
  repo: Repository
): Promise<ApiSchedule> {
  const teacherResolver = await createCachedTeacherResolver(repo);
  const [firstWeek, secondWeek] = await Promise.all(
    [value.firstWeek, value.secondWeek].map(async (week) => {
      return Promise.all(
        week.map((value) =>
          dataScheduleWeekToApiScheduleWeek(value, teacherResolver)
        )
      );
    })
  );

  return { groupCampusId: value.groupCampusId, firstWeek, secondWeek };
}
