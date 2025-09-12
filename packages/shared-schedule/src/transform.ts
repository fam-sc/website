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
  Time as CampusTime,
  Weekday,
} from '@sc-fam/shared/api/campus/types.js';
import { Teacher } from '@sc-fam/shared/api/pma/types.js';

import { lessonId } from './lesson';
import {
  DaySchedule as ApiDaySchedule,
  LessonType as ApiLessonType,
  Schedule as ApiSchedule,
  Time,
} from './types';

const campusDayMap: Record<Weekday, Day> = {
  Пн: 1,
  Вв: 2,
  Ср: 3,
  Чт: 4,
  Пт: 5,
  Сб: 6,
};

const campusLessonTypeToDataLessonTypeMap: Record<TeacherPairTag, LessonType> =
  {
    lec: LessonType.LECTURE,
    lab: LessonType.LAB,
    prac: LessonType.PRACTICE,
  };

const dataLessonTypeToApiMap: Record<LessonType, ApiLessonType> = {
  [LessonType.LECTURE]: 'lec',
  [LessonType.PRACTICE]: 'prac',
  [LessonType.LAB]: 'lab',
};

function campusDayToWeekdayNumber(value: Weekday): Day {
  return campusDayMap[value];
}

function campusLessonTypeToDataLessonType(type: TeacherPairTag): LessonType {
  return campusLessonTypeToDataLessonTypeMap[type];
}

function dataLessonTypeToApi(type: LessonType): ApiLessonType {
  return dataLessonTypeToApiMap[type];
}

function campusTimeToApiTime(time: CampusTime): Time {
  const lastColon = time.lastIndexOf(':');

  return time.slice(0, lastColon) as Time;
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
      time: campusTimeToApiTime(time),
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
): Pick<DataScheduleWithTeachers, 'weeks'> {
  return {
    weeks: [value.scheduleFirstWeek, value.scheduleSecondWeek].map((schedule) =>
      schedule.map((day) => campusDayScheduleToDaySchedule(day, teachers))
    ) as DataScheduleWithTeachers['weeks'],
  };
}

function dataScheduleWeekToApiScheduleWeek(
  { day, lessons }: DataDaySchedule<LessonWithTeacher>,
  links: Record<LessonId, string>
): ApiDaySchedule {
  return {
    day,
    lessons: lessons.map(({ teacher, type, name, ...rest }) => {
      const lessonType = dataLessonTypeToApi(type);
      const link = links[lessonId(lessonType, name, teacher.name)];

      return {
        ...rest,
        type: lessonType,
        teacher,
        name,
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
    groupName: schedule.groupName,
    weeks: weeks as ApiSchedule['weeks'],
  };
}
