import { timeBreakpoints } from '@shared-schedule/constants';

import { Day, DaySchedule, Lesson, Time } from '@/api/schedule/types';

export type IndexedLesson = { index: number; value: Lesson };

export type LessonGroup = {
  time: Time;
  lessons: IndexedLesson[];
};

type GroupedDay = {
  day: Day;
  lessons: LessonGroup[];
};

type GroupedWeek = GroupedDay[];

function groupLessonsByTime(lessons: Lesson[]): LessonGroup[] {
  const groupMap = new Map<Time, LessonGroup>();

  // eslint-disable-next-line unicorn/no-for-loop
  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i];

    let group = groupMap.get(lesson.time);
    if (group === undefined) {
      group = { time: lesson.time, lessons: [] };
      groupMap.set(lesson.time, group);
    }

    group.lessons.push({ index: i, value: lesson });
  }

  // Sort by time. It's important for grid when it's in vertical mode.
  return [...groupMap.values()].sort((a, b) => {
    const aOrder = timeBreakpoints.indexOf(a.time);
    const bOrder = timeBreakpoints.indexOf(b.time);

    return aOrder - bOrder;
  });
}

export function groupSchedule(schedule: DaySchedule[]): GroupedWeek {
  return schedule.map(({ day, lessons }) => ({
    day,
    lessons: groupLessonsByTime(lessons),
  }));
}
