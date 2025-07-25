import { UserRole } from '@sc-fam/data';
import { shortenGuid } from '@sc-fam/shared';
import { getCurrentTime } from '@sc-fam/shared/api/campus/index.js';
import { getTrueCurrentTime } from '@sc-fam/shared/api/time/index.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { Group } from '@/api/groups/types';
import { updateScheduleLinks } from '@/api/schedule/client';
import { Schedule } from '@/api/schedule/types';
import { scheduleToUpdateLinksPayload } from '@/api/schedule/utils';
import { useAuthInfo } from '@/auth/context';
import { Button } from '@/components/Button';
import { GroupSelect } from '@/components/GroupSelect';
import { useNotification } from '@/components/Notification';
import { OptionSwitch } from '@/components/OptionSwitch';
import { CurrentLesson } from '@/components/ScheduleGrid';
import { ScheduleGridLoader } from '@/components/ScheduleGridLoader';
import { Title } from '@/components/Title';
import { useInterval } from '@/hooks/useInterval';
import { CheckIcon } from '@/icons/CheckIcon';
import { EditIcon } from '@/icons/EditIcon';
import { repository } from '@/utils/repo';

import { Route } from './+types/page';
import { calculateCurrentLesson } from './date';
import styles from './page.module.scss';
import { retrieveSavedSelectedGroup, saveSelectedGroup } from './storage';

type Week = 1 | 2;

// 5 minutes
const TIME_UPDATE_INTERVAL = 5 * 60 * 1000;

const weekTextMap: Record<Week, string> = {
  [1]: 'Перший тиждень',
  [2]: 'Другий тиждень',
};

export async function loader({ request, context }: Route.LoaderArgs) {
  const { currentWeek } = await getCurrentTime();

  const { searchParams } = new URL(request.url);
  const rawGroup = searchParams.get('group');
  const groupId = rawGroup !== null && rawGroup.length > 0 ? rawGroup : null;

  const group =
    groupId !== null
      ? await repository(context).groups().findByCampusId(groupId).get()
      : null;

  return { initialWeek: currentWeek, initialGroup: group };
}

export default function Page({
  loaderData: { initialWeek, initialGroup },
}: Route.ComponentProps) {
  const navigate = useNavigate();

  const { user } = useAuthInfo();
  const canModify = user !== null && user.role >= UserRole.GROUP_HEAD;

  const [selectedWeek, setSelectedWeek] = useState<Week>(initialWeek);
  const [selectedGroup, setSelectedGroup] = useState<{
    campusId: string;
    name?: string;
  } | null>(initialGroup);
  const [isScheduleEditable, setScheduleEditable] = useState(false);

  const [currentLesson, setCurrentLesson] = useState<CurrentLesson>();

  const editedScheduleRef = useRef<Schedule | undefined>(undefined);

  const notification = useNotification();

  useEffect(() => {
    if (initialGroup === null) {
      const savedGroup = retrieveSavedSelectedGroup();

      if (savedGroup !== null) {
        setSelectedGroup({ campusId: savedGroup });
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
  }, [selectedGroup?.campusId]);

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
        {selectedGroup?.name
          ? `Розклад групи ${selectedGroup.name}`
          : 'Розклад'}
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
        onGroupsLoaded={useCallback((groups: Group[]) => {
          setSelectedGroup((selectedGroup) => {
            if (selectedGroup && selectedGroup.name === undefined) {
              const group = groups.find(
                ({ campusId }) => campusId === selectedGroup.campusId
              );

              return group ?? null;
            }

            return selectedGroup;
          });
        }, [])}
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
