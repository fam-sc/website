type Time = '8:30' | '10:25' | '12:20' | '14:15' | '16:10' | '18:30' | '20:20';

export type Day = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// `${type}-${name}-${teacher.name}`
export type LessonId = string;

export type Lesson = {
  type: 'lec' | 'prac' | 'lab';
  name: string;
  teacher: string;
  time: Time;
  place: string;
};

export type DaySchedule = {
  day: Day;
  lessons: Lesson[];
};

export type ScheduleWeek = {
  days: DaySchedule[];
};

export type Schedule = {
  groupCampusId: string;
  weeks: [ScheduleWeek, ScheduleWeek];

  // null means that links weren't fetched (doesn't mean that it's empty)
  // undefined means that it's empty.
  links?: Record<LessonId, string> | null;
};

export type ScheduleTeacher = {
  name: string;
  link: string | null;
};

export interface ScheduleWithTeachers extends Schedule {
  teachers: ScheduleTeacher[];
}
