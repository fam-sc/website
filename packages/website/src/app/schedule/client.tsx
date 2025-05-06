'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { calculateCurrentLesson } from './date';
import { retrieveSavedSelectedGroup, saveSelectedGroup } from './storage';

import styles from './page.module.scss';

import { getTrueCurrentTime } from '@/api/time';
import { OptionSwitch } from '@/components/OptionSwitch';
import { CurrentLesson } from '@/components/ScheduleGrid';
import { ScheduleGridLoader } from '@/components/ScheduleGridLoader';
import { ScheduleGroupSelect } from '@/components/ScheduleGroupSelect';
import { Group } from '@/data/types';
import { useInterval } from '@/hooks/useInterval';
import { shortenGuid } from '@/utils/guid';
import { EditIcon } from '@/icons/EditIcon';
import { CheckIcon } from '@/icons/CheckIcon';
import { Schedule } from '@/api/schedule/types';
import { Button } from '@/components/Button';
import { scheduleToUpdateLinksPayload } from '@/api/schedule/utils';
import { updateScheduleLinks } from '@/api/schedule/client';
import { useNotification } from '@/components/Notification';

type Week = 1 | 2;

type ClientComponentProps = {
  canModify: boolean;
  initialWeek: Week;
  initialGroup: Group | null;
};

// 5 minutes
const TIME_UPDATE_INTERVAL = 5 * 60 * 1000;

const weekTextMap: Record<Week, string> = {
  [1]: 'Перший тиждень',
  [2]: 'Другий тиждень',
};

export function ClientComponent({
  canModify,
  initialWeek,
  initialGroup,
}: ClientComponentProps) {
  const router = useRouter();

  const [selectedWeek, setSelectedWeek] = useState<Week>(initialWeek);
  const [selectedGroup, setSelectedGroup] = useState(initialGroup?.campusId);
  const [isScheduleEditable, setScheduleEditable] = useState(false);

  const [currentLesson, setCurrentLesson] = useState<CurrentLesson>();

  const editedScheduleRef = useRef<Schedule | undefined>(undefined);

  const notification = useNotification();

  useEffect(() => {
    if (initialGroup === null) {
      const savedGroup = retrieveSavedSelectedGroup();

      if (savedGroup !== null) {
        setSelectedGroup(savedGroup);
      }
    }
  }, [initialGroup]);

  useEffect(() => {
    let url = '/schedule';

    if (selectedGroup) {
      url += `?group=${shortenGuid(selectedGroup)}`;
    }

    router.replace(url, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedGroup) {
      saveSelectedGroup(selectedGroup);
    }
  }, [selectedGroup]);

  useInterval(TIME_UPDATE_INTERVAL, () => {
    getTrueCurrentTime('Europe/Kyiv')
      .then((date) => {
        setCurrentLesson(calculateCurrentLesson(date));
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  });

  return (
    <>
      {canModify && (
        <Button
          hasIcon
          className={styles.edit}
          onClick={() => {
            const schedule = editedScheduleRef.current;

            if (isScheduleEditable) {
              if (schedule !== undefined && selectedGroup !== undefined) {
                const payload = scheduleToUpdateLinksPayload(schedule);
                updateScheduleLinks(selectedGroup, payload)
                  .then(() => {
                    setScheduleEditable(false);
                  })
                  .catch((error: unknown) => {
                    console.error(error);

                    notification.show('Не вдалось оновити розклад', 'error');
                  });
              }
            } else {
              setScheduleEditable(true);
            }
          }}
        >
          {isScheduleEditable ? <CheckIcon /> : <EditIcon />}
          {isScheduleEditable ? 'Зберегти' : 'Змінити'}
        </Button>
      )}

      <OptionSwitch
        disabled={isScheduleEditable}
        className={styles['week-switch']}
        options={[1, 2]}
        renderOption={(option) => weekTextMap[option]}
        selected={selectedWeek}
        onOptionSelected={(option) => {
          setSelectedWeek(option);
        }}
      />

      <ScheduleGroupSelect
        disabled={isScheduleEditable}
        className={styles['group-select']}
        selectedId={selectedGroup}
        onSelected={(group) => {
          setSelectedGroup(group.campusId);
        }}
      />

      <ScheduleGridLoader
        className={styles['schedule-grid']}
        week={selectedWeek}
        groupId={selectedGroup}
        currentLesson={currentLesson}
        isEditable={isScheduleEditable}
        onScheduleChanged={(newSchedule) => {
          editedScheduleRef.current = newSchedule;
        }}
      />
    </>
  );
}
