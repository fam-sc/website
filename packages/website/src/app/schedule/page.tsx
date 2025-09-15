import { UserRole } from '@sc-fam/data';
import { getCurrentTime } from '@sc-fam/shared/api/campus/index.js';
import { MINUTE_MS } from '@sc-fam/shared/chrono';
import { useNotification } from '@sc-fam/shared-ui';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { Group } from '@/api/groups/types';
import { updateScheduleLinks } from '@/api/schedule/client';
import { Schedule } from '@/api/schedule/types';
import { useAuthInfo } from '@/auth/context';
import { Button } from '@/components/Button';
import { GroupSelect } from '@/components/GroupSelect';
import { OptionSwitch } from '@/components/OptionSwitch';
import { CurrentLesson } from '@/components/schedule/ScheduleGrid';
import { ScheduleGridLoader } from '@/components/schedule/ScheduleGridLoader';
import { Title } from '@/components/Title';
import { useCurrentTime } from '@/hooks/useCurrentTime';
import { CalendarIcon } from '@/icons/CalendarIcon';
import { CheckIcon } from '@/icons/CheckIcon';
import { EditIcon } from '@/icons/EditIcon';
import { scheduleToUpdateLinksPayload } from '@/services/schedule/links';

import { Route } from './+types/page';
import { calculateCurrentLesson } from './date';
import styles from './page.module.scss';
import { retrieveSavedSelectedGroup, saveSelectedGroup } from './storage';

type Week = 1 | 2;

const TIME_UPDATE_INTERVAL = MINUTE_MS;

const weekTextMap: Record<Week, string> = {
  [1]: 'Перший тиждень',
  [2]: 'Другий тиждень',
};

const ExportScheduleDialog = React.lazy(async () => {
  const { ExportScheduleDialog } = await import(
    '@/components/schedule/ExportScheduleDialog'
  );

  return { default: ExportScheduleDialog };
});

export async function loader({ request }: Route.LoaderArgs) {
  const { currentWeek } = await getCurrentTime();

  const { searchParams } = new URL(request.url);
  const rawGroup = searchParams.get('group');

  return {
    initialWeek: currentWeek,
    initialGroup: rawGroup,
  };
}

export default function Page({
  loaderData: { initialWeek, initialGroup },
}: Route.ComponentProps) {
  const navigate = useNavigate();

  const { user } = useAuthInfo();
  const canModify = user !== null && user.role >= UserRole.GROUP_HEAD;

  const [selectedWeek, setSelectedWeek] = useState<Week>(initialWeek);
  const [selectedGroup, setSelectedGroup] = useState(initialGroup);
  const [isScheduleEditable, setScheduleEditable] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<CurrentLesson>();
  const [exportDialogShown, setExportDialogShown] = useState(false);

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
      url += `?group=${selectedGroup}`;
    }

    void navigate(url, { preventScrollReset: true });
  }, [navigate, selectedGroup]);

  useEffect(() => {
    if (selectedGroup) {
      saveSelectedGroup(selectedGroup);
    }
  }, [selectedGroup]);

  useCurrentTime(TIME_UPDATE_INTERVAL, 'Europe/Kiev', (now) => {
    setCurrentLesson(calculateCurrentLesson(now));
  });

  return (
    <>
      <Title>
        {selectedGroup ? `Розклад групи ${selectedGroup}` : 'Розклад'}
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
        renderOption={useCallback((option: 1 | 2) => weekTextMap[option], [])}
        selected={selectedWeek}
        onOptionSelected={setSelectedWeek}
      />

      <GroupSelect
        disabled={isScheduleEditable}
        className={styles['group-select']}
        selected={selectedGroup ?? undefined}
        onSelected={setSelectedGroup}
        onGroupsLoaded={useCallback((groups: Group[]) => {
          setSelectedGroup((selectedGroup) => {
            if (
              selectedGroup !== null &&
              !groups.some(({ name }) => name === selectedGroup)
            ) {
              return null;
            }

            return selectedGroup;
          });
        }, [])}
      />

      <ScheduleGridLoader
        className={styles['schedule-grid']}
        week={selectedWeek}
        group={selectedGroup ?? undefined}
        currentLesson={currentLesson}
        isEditable={isScheduleEditable}
        onScheduleChanged={useCallback((newSchedule: Schedule) => {
          editedScheduleRef.current = newSchedule;
        }, [])}
      />

      {selectedGroup && (
        <Button
          hasIcon
          className={styles.export}
          buttonVariant="solid"
          onClick={() => {
            setExportDialogShown(true);
          }}
        >
          <CalendarIcon />
          Експортувати
        </Button>
      )}

      {exportDialogShown && selectedGroup && (
        <ExportScheduleDialog
          group={selectedGroup}
          onClose={() => setExportDialogShown(false)}
        />
      )}
    </>
  );
}
