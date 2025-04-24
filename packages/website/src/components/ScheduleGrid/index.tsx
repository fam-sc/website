import { ScheduleTile } from '../ScheduleTile';
import { Typography } from '../Typography';

import styles from './index.module.scss';

import {
  Day,
  DaySchedule,
  Lesson,
  Time,
  timeBreakpoints,
} from '@/api/schedule/types';
import { classNames } from '@/utils/classNames';

export type ScheduleGridProps = {
  className?: string;
  week: DaySchedule[];
  currentDay: Day;
  currentLesson: number;
};

type LessonGroup = {
  time: Time;
  lessons: Lesson[];
};

const days = [
  'Понеділок',
  'Вівторок',
  'Середа',
  'Четвер',
  "П'ятниця",
  'Субота',
] as const;

function getColumnCount(week: DaySchedule[]): number {
  let result = week.length;

  for (let i = week.length - 1; i >= 0; i--) {
    if (week[i].lessons.length === 0) {
      result -= 1;
    }
  }

  return result;
}

function getRowCount(week: DaySchedule[]): number {
  let result = 0;

  for (const { lessons } of week) {
    result = Math.max(result, lessons.length);
  }

  return result;
}

function groupLessonsByTime(lessons: Lesson[]): LessonGroup[] {
  const groupMap = new Map<string, LessonGroup>();

  for (const lesson of lessons) {
    let group = groupMap.get(lesson.time);
    if (group === undefined) {
      group = { time: lesson.time, lessons: [] };
      groupMap.set(lesson.time, group);
    }

    group.lessons.push(lesson);
  }

  return [...groupMap.values()];
}

function DayMarker({ day, isEmpty }: { day: Day; isEmpty: boolean }) {
  return (
    <Typography
      className={styles['day-marker']}
      style={{ '--day': day }}
      data-is-empty={isEmpty}
    >
      {days[day - 1]}
    </Typography>
  );
}

export function ScheduleGrid({
  week,
  currentDay,
  currentLesson,
  className,
}: ScheduleGridProps) {
  return (
    <div
      className={classNames(styles.root, className)}
      style={{
        '--row-count': getRowCount(week),
        '--column-count': getColumnCount(week),
      }}
    >
      {week.flatMap(({ day, lessons }) => [
        <DayMarker key={day} day={day} isEmpty={lessons.length === 0} />,
        ...groupLessonsByTime(lessons).map(({ time, lessons }) => {
          const timeBreakpoint = timeBreakpoints.indexOf(time) + 1;

          const tiles = lessons.map((lesson, index) => (
            <ScheduleTile
              key={`${day}-${lesson.time}-${index}`}
              lesson={lesson}
              className={styles.tile}
              isNow={day === currentDay && timeBreakpoint === currentLesson}
              style={{
                '--day': day,
                '--time': timeBreakpoint,
              }}
            />
          ));

          return tiles.length === 1 ? (
            tiles[0]
          ) : (
            <div className={styles['tile-group']} key={`${day}-${time}-group`}>
              {tiles}
            </div>
          );
        }),
      ])}
    </div>
  );
}
