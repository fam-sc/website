/* eslint-disable unicorn/no-array-callback-reference */
import { Repository } from '@data/repo';
import {
  DaySchedule as CampusDaySchedule,
  LessonSchedule,
  Weekday,
} from '@shared/api/campus/types';

import { resolveTeachers, TeacherMap } from './teachers';
import {
  DaySchedule as ApiDaySchedule,
  Schedule as ApiSchedule,
} from './types';

import {
  Day,
  DaySchedule as DataDaySchedule,
  Schedule as DataSchedule,
} from '@data/types/schedule';

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

function getUniqueTeachersFromWeek(week: DataDaySchedule[], out: Set<string>) {
  for (const { lessons } of week) {
    for (const { teacher } of lessons) {
      out.add(teacher);
    }
  }
}

function getUniqueTeachers(value: DataSchedule): Set<string> {
  const result = new Set<string>();

  getUniqueTeachersFromWeek(value.firstWeek, result);
  getUniqueTeachersFromWeek(value.secondWeek, result);

  return result;
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
      link: null,
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

function dataScheduleWeekToApiScheduleWeek(
  value: DataDaySchedule,
  teacherMap: TeacherMap
): ApiDaySchedule {
  return {
    day: value.day,
    lessons: value.lessons.map(({ teacher: teacherName, link, ...rest }) => {
      const teacher = teacherMap.get(teacherName);
      if (teacher === undefined) {
        throw new Error('Cannot find teacher by given name');
      }

      return { teacher, link: link ?? undefined, ...rest };
    }),
  };
}

export async function dataScheduleToApiSchedule(
  value: DataSchedule,
  repo?: Repository
): Promise<ApiSchedule> {
  const teachers = await resolveTeachers(getUniqueTeachers(value), repo);
  const weeks = [value.firstWeek, value.secondWeek].map((week) =>
    week.map((value) => dataScheduleWeekToApiScheduleWeek(value, teachers))
  );

  return {
    groupCampusId: value.groupCampusId,
    weeks: weeks as [ApiDaySchedule[], ApiDaySchedule[]],
  };
}
