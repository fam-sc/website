import { shortenGuid } from '@sc-fam/shared';
import { useCallback, useEffect, useMemo } from 'react';

import { getGroups } from '@/api/groups/client';
import { Group } from '@/api/groups/types';
import { useDataLoader } from '@/hooks/useDataLoader';

import { useNotification } from '../Notification';
import { SearchableSelect } from '../SearchableSelect';

export type GroupSelectProps = {
  className?: string;
  disabled?: boolean;
  selectedId: string | undefined;
  onSelected: (value: Group) => void;
  onGroupsLoaded?: (groups: Group[]) => void;
};

function prefixSearch(item: { title: string }, query: string): boolean {
  return item.title.startsWith(query);
}

export function GroupSelect({
  disabled,
  className,
  selectedId,
  onSelected,
  onGroupsLoaded,
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
  }, [notification, itemsState, onGroupsLoaded]);

  useEffect(() => {
    if (typeof itemsState === 'object') {
      onGroupsLoaded?.(itemsState.value);
    }
  }, [itemsState, onGroupsLoaded]);

  const onItemSelected = useCallback(
    (key: string) => {
      const group = items.find((group) => group.key === key);

      if (group !== undefined) {
        onSelected({ campusId: key, name: group.title });
      }
    },
    [items, onSelected]
  );

  return (
    <SearchableSelect
      className={className}
      items={items}
      placeholder="Виберіть групу"
      disabled={typeof itemsState !== 'object' || disabled}
      selectedItem={
        selectedId === undefined ? undefined : shortenGuid(selectedId)
      }
      onItemSelected={onItemSelected}
      search={prefixSearch}
    />
  );
}
