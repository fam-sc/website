import { timeBreakpoints } from '@shared-schedule/constants';
import { useMemo } from 'react';

import { Day, DaySchedule, Lesson, Time } from '@/api/schedule/types';
import { classNames } from '@/utils/classNames';

import { DayMarker } from './DayMarker';
import styles from './ScheduleGrid.module.scss';
import { TileGroup } from './TileGroup';
import { TimeMarkers } from './TimeMarkers';
import { groupSchedule } from './transform';

export type CurrentLesson = { day: Day; time: Time | undefined };

export type ScheduleGridProps = {
  className?: string;
  week: DaySchedule[];
  currentLesson: CurrentLesson | undefined;

  isEditable?: boolean;
  onScheduleChanged?: (value: DaySchedule[], target: Lesson) => void;
};

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

export function ScheduleGrid({
  week,
  currentLesson,
  isEditable,
  onScheduleChanged,
  className,
}: ScheduleGridProps) {
  const groupedWeek = useMemo(() => groupSchedule(week), [week]);

  return (
    <div className={classNames(styles.root, className)}>
      <TimeMarkers key="time-markers" count={maxTimeBreakpointIndex(week)} />

      {groupedWeek.flatMap(({ day, lessons: dayLessons }, dayIndex) => [
        <DayMarker key={day} day={day} isEmpty={dayLessons.length === 0} />,
        ...dayLessons.map(({ time, lessons }) => {
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
              onLessonChanged={({ index, value: lesson }) => {
                const newDayLessons = [...week[dayIndex].lessons];
                newDayLessons[index] = lesson;

                const newWeek = [...week];
                newWeek[dayIndex] = { day, lessons: newDayLessons };

                onScheduleChanged?.(newWeek, lesson);
              }}
            />
          );
        }),
      ])}
    </div>
  );
}
