'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './page.module.scss';

import { getGroups, getSchedule } from '@/api/schedule/client';
import { Schedule } from '@/api/schedule/types';
import { OptionSwitch } from '@/components/OptionSwitch';
import { ScheduleGrid } from '@/components/ScheduleGrid';
import { Select } from '@/components/Select';
import { Group } from '@/data/types';

type Week = 1 | 2;

type ClientComponentProps = {
  initialWeek: Week;
  initialGroup: Group | null;
};

type KeyGroup = {
  key: string;
  title: string;
};

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
  const [schedule, setSchedule] = useState<Schedule>();
  const [groups, setGroups] = useState<KeyGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState(initialGroup);

  useEffect(() => {
    if (selectedGroup !== null) {
      getSchedule(selectedGroup.campusId)
        .then((value) => {
          setSchedule(value);
        })
        .catch((error: unknown) => {
          console.error(error);
        });
    }
  }, [selectedGroup]);

  useEffect(() => {
    getGroups()
      .then((result) => {
        setGroups(
          result.map((group) => ({ key: group.campusId, title: group.name }))
        );
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    let url = '/schedule';

    if (selectedGroup !== null) {
      url += `?group=${selectedGroup.campusId}`;
    }

    router.replace(url, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup]);

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

      <Select
        className={styles['group-select']}
        placeholder="Виберіть групу"
        items={groups}
        selectedItem={selectedGroup?.campusId}
        onItemSelected={(key) => {
          const group = groups.find((group) => group.key === key);

          if (group !== undefined) {
            setSelectedGroup({ campusId: group.key, name: group.title });
          }
        }}
      />

      {schedule === undefined ? undefined : (
        <ScheduleGrid
          className={styles['schedule-grid']}
          week={schedule.weeks[selectedWeek - 1]}
          currentDay={1}
          currentLesson={1}
        />
      )}
    </>
  );
}
