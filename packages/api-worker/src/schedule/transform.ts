import {
  DaySchedule as CampusDaySchedule,
  LessonSchedule,
  Weekday,
} from '@shared/api/campus/types';

import { TeacherMap } from './teachers';
import {
  DaySchedule as ApiDaySchedule,
  Schedule as ApiSchedule,
} from '@shared/api/schedule/types';

import {
  Day,
  DaySchedule as DataDaySchedule,
  Schedule as DataSchedule,
  ScheduleWithTeachers as DataScheduleWithTeachers,
  LessonId,
} from '@data/types/schedule';
import { convertToKeyMap } from '@shared/keyMap';

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

function getUniqueTeachersFromWeek(
  week: { pairs: { teacherName: string }[] }[],
  out: Set<string>
) {
  for (const { pairs } of week) {
    for (const { teacherName } of pairs) {
      out.add(teacherName);
    }
  }
}

export function getUniqueTeachers(value: LessonSchedule): Set<string> {
  const result = new Set<string>();

  getUniqueTeachersFromWeek(value.scheduleFirstWeek, result);
  getUniqueTeachersFromWeek(value.scheduleSecondWeek, result);

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
    links: null,
    weeks: [value.scheduleFirstWeek, value.scheduleSecondWeek].map(
      (schedule) => ({
        days: schedule.map((day) => campusDayScheduleToDaySchedule(day)),
      })
    ) as DataSchedule['weeks'],
  };
}

function dataScheduleWeekToApiScheduleWeek(
  { day, lessons }: DataDaySchedule,
  links: Record<LessonId, string>,
  teacherMap: TeacherMap
): ApiDaySchedule {
  return {
    day,
    lessons: lessons.map(({ teacher: teacherName, type, name, ...rest }) => {
      const teacher = teacherMap.get(teacherName);
      if (teacher === undefined) {
        throw new Error(`Cannot find teacher by given name: ${teacherName}`);
      }

      const link = links[`${type}-${name}-${teacherName}`];

      return { ...rest, teacher, link, type, name };
    }),
  };
}

export function dataScheduleToApiSchedule(
  value: Omit<DataScheduleWithTeachers, 'links'>,
  links: Record<LessonId, string>
): ApiSchedule {
  const teachers = convertToKeyMap(value.teachers, 'name');
  const weeks = value.weeks.map(({ days }) =>
    days.map((value) =>
      dataScheduleWeekToApiScheduleWeek(value, links, teachers)
    )
  );

  return {
    groupCampusId: value.groupCampusId,
    weeks: weeks as ApiSchedule['weeks'],
  };
}
