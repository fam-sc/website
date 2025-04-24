export type Day = 1 | 2 | 3 | 4 | 5 | 6;

export type Lesson = {
  type: 'lec' | 'prac' | 'lab';
  name: string;
  teacher: string;
  time: string;
  place: string;
};

export type DaySchedule = {
  day: Day;
  lessons: Lesson[];
};

export type Schedule = {
  groupCampusId: string;
  firstWeek: DaySchedule[];
  secondWeek: DaySchedule[];
};

export type ScheduleTeacher = {
  name: string;
  link: string | null;
};
