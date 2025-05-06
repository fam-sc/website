import { Schedule } from '@/api/schedule/types';
import { IndeterminateCircularProgress } from '../IndeterminateCircularProgress';
import { CurrentLesson, ScheduleGrid } from '../ScheduleGrid';

import styles from './index.module.scss';

import { getSchedule } from '@/api/schedule/client';
import { useDataLoader } from '@/hooks/useDataLoader';
import { classNames } from '@/utils/classNames';

export type ScheduleGridLoaderProps = {
  className?: string;
  week: 1 | 2;
  groupId: string | undefined;
  currentLesson: CurrentLesson | undefined;
  isEditable?: boolean;
  onScheduleChanged?: (value: Schedule) => void;
};

export function ScheduleGridLoader({
  className,
  groupId,
  week,
  currentLesson,
  isEditable,
  onScheduleChanged,
}: ScheduleGridLoaderProps) {
  const [schedule, isPending, setSchedule] = useDataLoader(
    () =>
      groupId === undefined ? Promise.resolve(undefined) : getSchedule(groupId),
    [groupId]
  );

  return (
    <div className={classNames(styles.root, className)}>
      {isPending && (
        <div className={styles['loading-container']}>
          <IndeterminateCircularProgress
            className={styles['loading-indicator']}
          />
        </div>
      )}

      {schedule && (
        <ScheduleGrid
          week={schedule.weeks[week - 1]}
          currentLesson={currentLesson}
          isEditable={isEditable}
          onScheduleChanged={(newWeek) => {
            const newWeeks = [...schedule.weeks] as Schedule['weeks'];
            newWeeks[week - 1] = newWeek;

            const newSchedule = { ...schedule, weeks: newWeeks };

            setSchedule(newSchedule);
            onScheduleChanged?.(newSchedule);
          }}
        />
      )}
    </div>
  );
}
