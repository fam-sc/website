import { MouseEvent, useCallback, useState } from 'react';

import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

import { SelectHeader } from '../SelectHeader';
import { SelectItems } from '../SelectItems';
import styles from './index.module.scss';

type DivProps = PropsMap['div'];

export interface SelectBaseProps<T extends string = string> extends DivProps {
  items: { key: T; title: string }[];
  selectedItem?: T;

  disabled?: boolean;
  headerClassName?: string;

  isOpen: boolean;
  onOpenChanged: (value: boolean) => void;

  switchOpen: (event: MouseEvent) => void;

  onItemSelected?: (value: T) => void;
}

export function SelectBase<K extends string>({
  items,
  selectedItem,
  disabled,
  headerClassName,
  isOpen,
  onOpenChanged,
  onItemSelected,
  switchOpen,
  className,
  children,
  ...rest
}: SelectBaseProps<K>) {
  const [itemsScrollY, setItemsScrollY] = useState<number>(0);

  const itemOnClick = useCallback(
    (event: MouseEvent) => {
      const key = (event.target as HTMLElement).dataset.key;

      if (key !== undefined) {
        if (key !== selectedItem) {
          onItemSelected?.(key as K);
        }

        onOpenChanged(false);
      }
    },
    [selectedItem, onOpenChanged, onItemSelected]
  );

  const onBlur = useCallback(() => {
    onOpenChanged(false);
  }, [onOpenChanged]);

  return (
    <div
      aria-disabled={disabled}
      className={classNames(
        styles.root,
        isOpen && styles[`root-open`],
        className
      )}
      onBlur={onBlur}
      {...rest}
    >
      <SelectHeader
        disabled={disabled}
        className={classNames(styles.header, headerClassName)}
        onClick={switchOpen}
      >
        {children}
      </SelectHeader>

      {isOpen && (
        <SelectItems
          items={items}
          selectedKey={selectedItem}
          scrollY={itemsScrollY}
          onItemClick={itemOnClick}
          onRetainScrollY={setItemsScrollY}
        />
      )}
    </div>
  );
}
