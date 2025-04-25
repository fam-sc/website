'use client';

import { useEffect, useState } from 'react';
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
  const router = useRouter();

  const [selectedWeek, setSelectedWeek] = useState<Week>(initialWeek);
  const [selectedGroup, setSelectedGroup] = useState(initialGroup?.campusId);

  const [currentLesson, setCurrentLesson] = useState<CurrentLesson>();

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
      <OptionSwitch
        className={styles['week-switch']}
        options={[1, 2]}
        renderOption={(option) => weekTextMap[option]}
        selected={selectedWeek}
        onOptionSelected={(option) => {
          setSelectedWeek(option);
        }}
      />

      <ScheduleGroupSelect
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
      />
    </>
  );
}
