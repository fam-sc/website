import { useLayoutEffect, useRef } from 'react';

import { CloseIcon } from '@/icons/CloseIcon';
import { classNames } from '@/utils/classNames';

import { IconButton } from '../IconButton';
import { TextInput } from '../TextInput';
import { Typography } from '../Typography';
import styles from './index.module.scss';

export type OptionListBuilderProps = {
  className?: string;
  disabled?: boolean;

  items: string[];
  onItemsChanged?: (items: string[]) => void;
};

export function OptionListBuilder({
  className,
  disabled,
  items,
  onItemsChanged,
}: OptionListBuilderProps) {
  const lastInputRef = useRef<HTMLInputElement>(null);
  const addingNewItemRef = useRef<boolean>(false);

  useLayoutEffect(() => {
    if (addingNewItemRef.current) {
      lastInputRef.current?.focus();
      addingNewItemRef.current = false;
    }
  }, [items]);

  return (
    <Typography as="ol" className={classNames(styles.root, className)}>
      {items.map((item, i) => (
        <li key={i}>
          <div>
            <TextInput
              ref={i === items.length - 1 ? lastInputRef : undefined}
              disabled={disabled}
              className={styles.input}
              variant="underline"
              value={item}
              onTextChanged={(text) => {
                const copy = [...items];
                copy[i] = text;

                onItemsChanged?.(copy);
              }}
            />

            <IconButton
              className={styles.remove}
              disabled={disabled}
              hover="fill"
              title="Видалити елемент"
              onClick={() => {
                const copy = [...items];
                copy.splice(i, 1);

                onItemsChanged?.(copy);
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </li>
      ))}

      <li key="add-option">
        <div>
          <TextInput
            className={classNames(styles.input, styles['input-add'])}
            disabled={disabled}
            variant="underline"
            placeholder="Додати елемент"
            onFocus={() => {
              addingNewItemRef.current = true;
              onItemsChanged?.([...items, '']);
            }}
          />
        </div>
      </li>
    </Typography>
  );
}
