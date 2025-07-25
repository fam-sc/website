import {
  Day,
  DaySchedule as DataDaySchedule,
  LessonId,
  LessonType,
  LessonWithTeacher,
  ScheduleWithTeachers as DataScheduleWithTeachers,
} from '@sc-fam/data';
import {
  DaySchedule as CampusDaySchedule,
  LessonSchedule,
  TeacherPairTag,
  Weekday,
} from '@sc-fam/shared/api/campus/types.js';
import { Teacher } from '@sc-fam/shared/api/pma/types.js';

import {
  DaySchedule as ApiDaySchedule,
  LessonType as ApiLessonType,
  Schedule as ApiSchedule,
} from './types';

function campusDayToWeekdayNumber(value: Weekday): Day {
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

function campusLessonTypeToDataLessonType(type: TeacherPairTag): LessonType {
  switch (type) {
    case 'lec': {
      return LessonType.LECTURE;
    }
    case 'prac': {
      return LessonType.PRACTICE;
    }
    case 'lab': {
      return LessonType.LAB;
    }
  }
}

function dataLessonTypeToApi(type: LessonType): ApiLessonType {
  switch (type) {
    case LessonType.LECTURE: {
      return 'lec';
    }
    case LessonType.PRACTICE: {
      return 'prac';
    }
    case LessonType.LAB: {
      return 'lab';
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
  schedule: CampusDaySchedule,
  teachers: Teacher[]
): DataDaySchedule<LessonWithTeacher> {
  return {
    day: campusDayToWeekdayNumber(schedule.day),
    lessons: schedule.pairs.map(({ name, place, time, tag, teacherName }) => ({
      name,
      place,
      time,
      type: campusLessonTypeToDataLessonType(tag),
      teacher: teachers.find(({ name }) => name === teacherName) ?? {
        name: teacherName,
        link: null,
      },
    })),
  };
}

export function campusScheduleToDataSchedule(
  value: LessonSchedule,
  teachers: Teacher[]
): DataScheduleWithTeachers {
  return {
    lastUpdateTime: 0,
    groupCampusId: value.groupCode,
    weeks: [value.scheduleFirstWeek, value.scheduleSecondWeek].map((schedule) =>
      schedule.map((day) => campusDayScheduleToDaySchedule(day, teachers))
    ) as DataScheduleWithTeachers['weeks'],
    links: undefined,
  };
}

function dataScheduleWeekToApiScheduleWeek(
  { day, lessons }: DataDaySchedule<LessonWithTeacher>,
  links: Record<LessonId, string>
): ApiDaySchedule {
  return {
    day,
    lessons: lessons.map(({ teacher, type, name, ...rest }) => {
      const link = links[`${type}-${name}-${teacher.name}`];

      return {
        ...rest,
        teacher,
        name,
        type: dataLessonTypeToApi(type),
        link,
      };
    }),
  };
}

export function dataScheduleToApiSchedule(
  schedule: DataScheduleWithTeachers
): ApiSchedule {
  const links = schedule.links ?? {};

  const weeks = schedule.weeks.map((days) =>
    days.map((value) => dataScheduleWeekToApiScheduleWeek(value, links))
  );

  return {
    groupCampusId: schedule.groupCampusId,
    weeks: weeks as ApiSchedule['weeks'],
  };
}
