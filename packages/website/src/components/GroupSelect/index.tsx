import { Select } from '../Select';

import { getGroups } from '@/api/groups/client';
import { Group } from '@shared/api/groups/types';
import { useDataLoader } from '@/hooks/useDataLoader';
import { shortenGuid } from '@shared/guid';
import { useEffect, useMemo } from 'react';
import { useNotification } from '../Notification';

export type GroupSelectProps = {
  className?: string;
  disabled?: boolean;
  selectedId: string | undefined;
  onSelected: (value: Group) => void;
};

export function GroupSelect({
  disabled,
  className,
  selectedId,
  onSelected,
}: GroupSelectProps) {
  const [itemsState] = useDataLoader(getGroups, []);
  const items = useMemo(
    () =>
      typeof itemsState === 'object'
        ? itemsState.value.map((item) => ({
            key: item.campusId,
            title: item.name,
          }))
        : [],
    [itemsState]
  );

  const notification = useNotification();

  useEffect(() => {
    if (itemsState === 'error') {
      notification.show(
        'Сталася помилка при завантаженні списку груп',
        'error'
      );
    }
  }, [notification, itemsState]);

  return (
    <Select
      className={className}
      items={items}
      placeholder="Виберіть групу"
      disabled={typeof itemsState !== 'object' || disabled}
      selectedItem={
        selectedId === undefined ? undefined : shortenGuid(selectedId)
      }
      onItemSelected={(key) => {
        const group = items.find((group) => group.key === key);

        if (group !== undefined) {
          onSelected({ campusId: key, name: group.title });
        }
      }}
    />
  );
}
