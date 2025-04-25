import { useEffect, useState, useTransition } from 'react';

import { IndeterminateCircularProgress } from '../IndeterminateCircularProgress';
import { CurrentLesson, ScheduleGrid } from '../ScheduleGrid';

import styles from './index.module.scss';

import { getSchedule } from '@/api/schedule/client';
import { Schedule } from '@/api/schedule/types';
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
  const [isPending, startTransition] = useTransition();
  const [schedule, setSchedule] = useState<Schedule>();

  useEffect(() => {
    if (groupId !== undefined) {
      startTransition(async () => {
        try {
          const value = await getSchedule(groupId);

          startTransition(() => {
            setSchedule(value);
          });
        } catch (error: unknown) {
          console.error(error);
        }
      });
    }
  }, [groupId]);

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
