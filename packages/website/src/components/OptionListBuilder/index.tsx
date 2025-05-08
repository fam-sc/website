import { CloseIcon } from '@/icons/CloseIcon';
import { IconButton } from '../IconButton';
import { TextInput } from '../TextInput';
import { useLayoutEffect, useRef } from 'react';

import styles from './index.module.scss';
import { Typography } from '../Typography';
import { classNames } from '@/utils/classNames';

export type OptionListBuilderProps = {
  items: string[];
  onItemsChanged?: (items: string[]) => void;
};

export function OptionListBuilder({
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
    <Typography as="ol" className={styles.root}>
      {items.map((item, i) => (
        <li key={i}>
          <div>
            <TextInput
              ref={i === items.length - 1 ? lastInputRef : undefined}
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
              hover="fill"
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
