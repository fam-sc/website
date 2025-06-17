import { useCallback, useEffect, useRef, useState } from 'react';

import { calculateCurrentLesson } from './date';
import { retrieveSavedSelectedGroup, saveSelectedGroup } from './storage';

import styles from './page.module.scss';

import { getTrueCurrentTime } from '@/api/time';
import { OptionSwitch } from '@/components/OptionSwitch';
import { CurrentLesson } from '@/components/ScheduleGrid';
import { ScheduleGridLoader } from '@/components/ScheduleGridLoader';
import { GroupSelect } from '@/components/GroupSelect';
import { useInterval } from '@/hooks/useInterval';
import { shortenGuid } from '@shared/guid';
import { EditIcon } from '@/icons/EditIcon';
import { CheckIcon } from '@/icons/CheckIcon';
import { Schedule } from '@/api/schedule/types';
import { Button } from '@/components/Button';
import { scheduleToUpdateLinksPayload } from '@/api/schedule/utils';
import { updateScheduleLinks } from '@/api/schedule/client';
import { useNotification } from '@/components/Notification';
import { useAuthInfo } from '@/auth/context';
import { UserRole } from '@data/types/user';
import { Group } from '@/api/groups/types';
import { useNavigate } from 'react-router';
import { Title } from '@/components/Title';

type Week = 1 | 2;

type ClientComponentProps = {
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
  initialWeek,
  initialGroup,
}: ClientComponentProps) {
  const navigate = useNavigate();

  const { user } = useAuthInfo();
  const canModify = user !== null && user.role >= UserRole.GROUP_HEAD;

  const [selectedWeek, setSelectedWeek] = useState<Week>(initialWeek);
  const [selectedGroup, setSelectedGroup] = useState(initialGroup);
  const [isScheduleEditable, setScheduleEditable] = useState(false);

  const [currentLesson, setCurrentLesson] = useState<CurrentLesson>();

  const editedScheduleRef = useRef<Schedule | undefined>(undefined);

  const notification = useNotification();

  useEffect(() => {
    if (initialGroup === null) {
      const savedGroup = retrieveSavedSelectedGroup();

      if (savedGroup !== null) {
        // TODO: Fix it
        // setSelectedGroup(savedGroup);
      }
    }
  }, [initialGroup]);

  useEffect(() => {
    let url = '/schedule';

    if (selectedGroup) {
      url += `?group=${shortenGuid(selectedGroup.campusId)}`;
    }

    void navigate(url, { preventScrollReset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedGroup) {
      saveSelectedGroup(selectedGroup.campusId);
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
      <Title>
        {selectedGroup ? `Розклад групи ${selectedGroup.name}` : 'Розклад'}
      </Title>

      {canModify && (
        <Button
          hasIcon
          className={styles.edit}
          onClick={() => {
            const schedule = editedScheduleRef.current;

            if (isScheduleEditable) {
              if (schedule !== undefined && selectedGroup !== null) {
                const payload = scheduleToUpdateLinksPayload(schedule);
                updateScheduleLinks(selectedGroup.campusId, payload)
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
        renderOption={useCallback((option: 1 | 2) => weekTextMap[option], [])}
        selected={selectedWeek}
        onOptionSelected={setSelectedWeek}
      />

      <GroupSelect
        disabled={isScheduleEditable}
        className={styles['group-select']}
        selectedId={selectedGroup?.campusId}
        onSelected={setSelectedGroup}
      />

      <ScheduleGridLoader
        className={styles['schedule-grid']}
        week={selectedWeek}
        groupId={selectedGroup?.campusId}
        currentLesson={currentLesson}
        isEditable={isScheduleEditable}
        onScheduleChanged={useCallback((newSchedule: Schedule) => {
          editedScheduleRef.current = newSchedule;
        }, [])}
      />
    </>
  );
}
