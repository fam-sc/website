import { DaySchedule, Lesson, Schedule } from '@shared/api/schedule/types';

function broadcastUpdatedLessonToDay(
  value: DaySchedule,
  changed: Lesson
): DaySchedule {
  return {
    day: value.day,
    lessons: value.lessons.map((target) => {
      if (
        target.type === changed.type &&
        target.name === changed.name &&
        target.teacher.name === changed.teacher.name
      ) {
        return { ...target, link: changed.link };
      }

      return target;
    }),
  };
}

export function broadcastUpdatedLesson(
  schedule: Schedule,
  lesson: Lesson
): Schedule {
  return {
    groupCampusId: schedule.groupCampusId,
    weeks: schedule.weeks.map((week) =>
      week.map((day) => broadcastUpdatedLessonToDay(day, lesson))
    ) as Schedule['weeks'],
  };
}
