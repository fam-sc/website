import { useEffect, useState, useTransition } from 'react';

import { Select } from '../Select';

import { getGroups } from '@/api/schedule/client';
import { Group } from '@/data/types';

export type ScheduleGroupSelectProps = {
  className?: string;
  selectedId: string | undefined;
  onSelected: (value: Group) => void;
};

type KeyGroup = {
  key: string;
  title: string;
};

export function ScheduleGroupSelect({
  className,
  selectedId,
  onSelected,
}: ScheduleGroupSelectProps) {
  const [items, setItems] = useState<KeyGroup[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const groups = await getGroups();

        startTransition(() => {
          setItems(
            groups.map((item) => ({ key: item.campusId, title: item.name }))
          );
        });
      } catch (error: unknown) {
        console.error(error);
      }
    });
  }, []);

  return (
    <Select
      className={className}
      items={items}
      placeholder="Виберіть групу"
      disabled={isPending}
      selectedItem={selectedId}
      onItemSelected={(key) => {
        const group = items.find((group) => group.key === key);

        if (group !== undefined) {
          onSelected({ campusId: group.key, name: group.title });
        }
      }}
    />
  );
}
