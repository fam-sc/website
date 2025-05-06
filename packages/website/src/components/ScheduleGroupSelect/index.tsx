import { Select } from '../Select';

import { getGroups } from '@/api/schedule/client';
import { Group } from '@/data/types';
import { useDataLoader } from '@/hooks/useDataLoader';
import { shortenGuid } from '@/utils/guid';

export type ScheduleGroupSelectProps = {
  className?: string;
  disabled?: boolean;
  selectedId: string | undefined;
  onSelected: (value: Group) => void;
};

export function ScheduleGroupSelect({
  disabled,
  className,
  selectedId,
  onSelected,
}: ScheduleGroupSelectProps) {
  const [items, isPending] = useDataLoader(getGroups, [], []);

  return (
    <Select
      className={className}
      items={items.map((item) => ({ key: item.campusId, title: item.name }))}
      placeholder="Виберіть групу"
      disabled={isPending || disabled}
      selectedItem={
        selectedId === undefined ? undefined : shortenGuid(selectedId)
      }
      onItemSelected={(key) => {
        const group = items.find((group) => group.campusId === key);

        if (group !== undefined) {
          onSelected(group);
        }
      }}
    />
  );
}
