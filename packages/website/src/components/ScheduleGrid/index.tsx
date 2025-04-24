import { ScheduleTile } from '../ScheduleTile';
import { Typography } from '../Typography';

import styles from './index.module.scss';

import { Day, DaySchedule, timeBreakpoints } from '@/api/schedule/types';
import { classNames } from '@/utils/classNames';

export type ScheduleGridProps = {
  className?: string;
  week: DaySchedule[];
  currentDay: Day;
  currentLesson: number;
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

function DayMarker({ day }: { day: Day }) {
  return (
    <Typography className={styles['day-marker']} style={{ '--day': day }}>
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
      {week.map(({ day }) => (
        <DayMarker key={day} day={day} />
      ))}
      {week.flatMap(({ day, lessons }) =>
        lessons.map((lesson) => {
          const timeBreakpoint = timeBreakpoints.indexOf(lesson.time) + 1;

          return (
            <ScheduleTile
              key={`${day}-${lesson.time}`}
              lesson={lesson}
              className={styles.tile}
              isNow={day === currentDay && timeBreakpoint === currentLesson}
              style={{
                '--day': day,
                '--time': timeBreakpoint,
              }}
            />
          );
        })
      )}
    </div>
  );
}
