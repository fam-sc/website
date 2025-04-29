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
};

export function ScheduleGridLoader({
  className,
  groupId,
  week,
  currentLesson,
}: ScheduleGridLoaderProps) {
  const [schedule, isPending] = useDataLoader(
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
        />
      )}
    </div>
  );
}
