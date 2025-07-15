type Time = '8:30' | '10:25' | '12:20' | '14:15' | '16:10' | '18:30' | '20:20';

export type Day = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// `${type}-${name}-${teacher.name}`
export type LessonId = string;

export const enum LessonType {
  LECTURE = 0,
  PRACTICE = 1,
  LAB = 2,
}

export type Lesson = {
  type: LessonType;
  name: string;
  teacher: string;
  time: Time;
  place: string;
};

export type LessonWithTeacher = Omit<Lesson, 'teacher'> & {
  teacher: ScheduleTeacher;
};

export type DaySchedule<T = Lesson> = {
  day: Day;
  lessons: T[];
};

export type ScheduleWeek<T = Lesson> = DaySchedule<T>[];

export type Schedule<T = Lesson> = {
  groupCampusId: string;
  weeks: [ScheduleWeek<T>, ScheduleWeek<T>];

  // undefined means that link wasn't fetched.
  // null means that it's empty.
  links: Record<LessonId, string> | undefined | null;
};

export type ScheduleWithTeachers = Schedule<LessonWithTeacher>;

export type RawSchedule = {
  groupCampusId: string;
  links: string | null | undefined;
};

export interface RawLesson extends Lesson {
  groupCampusId: string;
  week: 1 | 2;
  day: Day;
}

export type ScheduleTeacher = {
  name: string;
  link: string | null;
};
