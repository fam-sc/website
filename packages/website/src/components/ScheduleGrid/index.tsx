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

export type CurrentLesson = { day: Day; time: Time | undefined };

export type ScheduleGridProps = {
  className?: string;
  week: DaySchedule[];
  currentLesson: CurrentLesson | undefined;
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
  currentLesson,
  className,
}: ScheduleGridProps) {
  return (
    <div className={classNames(styles.root, className)}>
      {week.flatMap(({ day, lessons }) => [
        <DayMarker key={day} day={day} isEmpty={lessons.length === 0} />,
        ...groupLessonsByTime(lessons).map(({ time, lessons }) => {
          const timeBreakpoint = timeBreakpoints.indexOf(time) + 1;
          const isNow =
            currentLesson !== undefined &&
            day === currentLesson.day &&
            time === currentLesson.time;

          const tiles = lessons.map((lesson, index) => (
            <ScheduleTile
              key={`${day}-${lesson.time}-${index}`}
              lesson={lesson}
              className={styles.tile}
              isNow={isNow}
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
