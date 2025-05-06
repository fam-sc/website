import { ReactNode } from 'react';

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

  isEditable?: boolean;
  onScheduleChanged?: (value: DaySchedule[], target: Lesson) => void;
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

function maxTimeBreakpointIndex(days: DaySchedule[]): number {
  let maxTimeIndex = -1;

  for (const { lessons } of days) {
    for (const { time } of lessons) {
      const timeIndex = timeBreakpoints.indexOf(time);

      maxTimeIndex = Math.max(timeIndex, maxTimeIndex);
    }
  }

  return maxTimeIndex;
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

function TimeMarker({ index }: { index: number }) {
  return (
    <Typography className={styles['time-marker']} style={{ '--index': index }}>
      {timeBreakpoints[index]}
    </Typography>
  );
}

function TimeMarkers({ count }: { count: number }) {
  const result: ReactNode[] = [];

  for (let i = 0; i <= count; i++) {
    result.push(<TimeMarker index={i} />);
  }

  return result;
}

type TileGroupProps = {
  day: Day;
  time: Time;
  isNow: boolean;
  isEditable?: boolean;
  lessons: Lesson[];

  onLessonChanged: (value: Lesson) => void;
};

function TileGroup({
  day,
  time,
  isNow,
  lessons,
  isEditable,
  onLessonChanged,
}: TileGroupProps) {
  const timeBreakpoint = timeBreakpoints.indexOf(time) + 1;

  const style = {
    '--day': day,
    '--time': timeBreakpoint,
  };

  const tiles = lessons.map((lesson, index) => (
    <ScheduleTile
      key={`${day}-${lesson.time}-${index}`}
      lesson={lesson}
      className={classNames(styles['base-tile'], styles.tile)}
      isNow={isNow}
      isEditable={isEditable}
      onLinkChanged={(link) => {
        onLessonChanged({ ...lesson, link });
      }}
      style={style}
    />
  ));

  return tiles.length === 1 ? (
    tiles[0]
  ) : (
    <div className={styles['base-tile']} style={style}>
      {tiles}
    </div>
  );
}

export function ScheduleGrid({
  week,
  currentLesson,
  isEditable,
  onScheduleChanged,
  className,
}: ScheduleGridProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <TimeMarkers count={maxTimeBreakpointIndex(week)} />

      {week.flatMap(({ day, lessons: dayLessons }, weekIndex) => [
        <DayMarker key={day} day={day} isEmpty={dayLessons.length === 0} />,
        ...groupLessonsByTime(dayLessons).map(({ time, lessons }) => {
          const isNow =
            currentLesson !== undefined &&
            day === currentLesson.day &&
            time === currentLesson.time;

          return (
            <TileGroup
              key={`${day}-${time}`}
              day={day}
              time={time}
              lessons={lessons}
              isNow={isNow}
              isEditable={isEditable}
              onLessonChanged={(lesson) => {
                const replaceIndex = dayLessons.findIndex(
                  (value) =>
                    value.type === lesson.type &&
                    value.name === lesson.name &&
                    value.teacher === lesson.teacher &&
                    value.time === lesson.time
                );

                const newDayLessons = [...dayLessons];
                newDayLessons.splice(replaceIndex, 1, lesson);

                const newWeek = [...week];
                newWeek.splice(weekIndex, 1, {
                  day,
                  lessons: newDayLessons,
                });

                onScheduleChanged?.(newWeek, lesson);
              }}
            />
          );
        }),
      ])}
    </div>
  );
}
