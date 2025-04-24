import { Day, ScheduleTeacher } from '@/data/types/schedule';
export type { Day } from '@/data/types/schedule';

export type Lesson = {
  type: 'lec' | 'prac' | 'lab';
  name: string;
  teacher: ScheduleTeacher;
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
