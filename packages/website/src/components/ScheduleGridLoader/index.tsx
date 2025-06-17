import { Schedule } from '@/api/schedule/types';
import { CurrentLesson, ScheduleGrid } from '../ScheduleGrid';

import { getSchedule } from '@/api/schedule/client';
import { useDataLoader } from '@/hooks/useDataLoader';
import { broadcastUpdatedLesson } from '@/utils/schedule/broadcast';
import { DataLoadingContainer } from '../DataLoadingContainer';

import styles from './index.module.scss';

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
  const [scheduleState, onRetry, setScheduleState] = useDataLoader(
    () =>
      groupId === undefined ? Promise.resolve(undefined) : getSchedule(groupId),
    [groupId]
  );

  return (
    <DataLoadingContainer
      className={className}
      value={scheduleState}
      onRetry={onRetry}
    >
      {(schedule) =>
        schedule && (
          <ScheduleGrid
            className={styles.schedule}
            week={schedule.weeks[week - 1]}
            currentLesson={currentLesson}
            isEditable={isEditable}
            onScheduleChanged={(newWeek, target) => {
              const newWeeks = [...schedule.weeks] as Schedule['weeks'];
              newWeeks[week - 1] = newWeek;

              const newSchedule = broadcastUpdatedLesson(
                { ...schedule, weeks: newWeeks },
                target
              );

              setScheduleState(newSchedule);
              onScheduleChanged?.(newSchedule);
            }}
          />
        )
      }
    </DataLoadingContainer>
  );
}
