import { Time } from '@/api/campus/types';

export type Day = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Lesson = {
  type: 'lec' | 'prac' | 'lab';
  name: string;
  teacher: string;
  time: Time;
  place: string;
  link: string | null;
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
