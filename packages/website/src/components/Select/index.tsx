import { useCallback, useState } from 'react';

import { PropsMap } from '@/types/react';

import { SelectBase } from '../SelectBase';
import { Typography } from '../Typography';

type DivProps = PropsMap['div'];

export interface SelectProps<T extends string = string> extends DivProps {
  items: { key: T; title: string }[];
  selectedItem?: T;
  placeholder: string;
  disabled?: boolean;

  onItemSelected?: (value: T) => void;
}

export function Select<T extends string>({
  items,
  placeholder,
  selectedItem,
  ...rest
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const switchOpen = useCallback(() => {
    setIsOpen((state) => !state);
  }, []);

  return (
    <SelectBase
      items={items}
      isOpen={isOpen}
      onOpenChanged={setIsOpen}
      switchOpen={switchOpen}
      {...rest}
    >
      <Typography>
        {items.find((item) => item.key === selectedItem)?.title ?? placeholder}
      </Typography>
    </SelectBase>
  );
}
