'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { calculateCurrentLesson } from './date';

import styles from './page.module.scss';

import { getTrueCurrentTime } from '@/api/time';
import { OptionSwitch } from '@/components/OptionSwitch';
import { CurrentLesson } from '@/components/ScheduleGrid';
import { ScheduleGridLoader } from '@/components/ScheduleGridLoader';
import { ScheduleGroupSelect } from '@/components/ScheduleGroupSelect';
import { Group } from '@/data/types';
import { useInterval } from '@/hooks/useInterval';

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
  const [selectedGroup, setSelectedGroup] = useState(initialGroup);

  const [currentLesson, setCurrentLesson] = useState<CurrentLesson>();

  useEffect(() => {
    let url = '/schedule';

    if (selectedGroup !== null) {
      url += `?group=${selectedGroup.campusId}`;
    }

    router.replace(url, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        selected={selectedGroup ?? undefined}
        onSelected={(group) => {
          setSelectedGroup(group);
        }}
      />

      <ScheduleGridLoader
        className={styles['schedule-grid']}
        week={selectedWeek}
        groupId={selectedGroup?.campusId}
        currentLesson={currentLesson}
      />
    </>
  );
}
