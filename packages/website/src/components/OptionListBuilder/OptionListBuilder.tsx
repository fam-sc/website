import { classNames } from '@sc-fam/shared';
import { RefObject, useCallback, useLayoutEffect, useRef } from 'react';

import { CloseIcon } from '@/icons/CloseIcon';

import { IconButton } from '../IconButton';
import { TextInput } from '../TextInput';
import { Typography } from '../Typography';
import styles from './OptionListBuilder.module.scss';

export type OptionListBuilderProps = {
  className?: string;
  disabled?: boolean;

  items: string[];
  onItemsChanged?: (items: string[]) => void;
};

type OptionProps = {
  text: string;
  disabled?: boolean;
  index: number;

  inputRef?: RefObject<HTMLInputElement | null>;
  onTextChanged?: (value: string, index: number) => void;
  onRemove: (index: number) => void;
};

function Option({
  index,
  text,
  disabled,
  inputRef,
  onTextChanged,
  onRemove,
}: OptionProps) {
  const onInputTextChanged = useCallback(
    (text: string) => {
      onTextChanged?.(text, index);
    },
    [onTextChanged, index]
  );

  const onRemoveClick = useCallback(() => {
    onRemove(index);
  }, [onRemove, index]);

  return (
    <li>
      <div>
        <TextInput
          ref={inputRef}
          disabled={disabled}
          className={styles.input}
          variant="underline"
          value={text}
          onTextChanged={onInputTextChanged}
        />

        <IconButton
          className={styles.remove}
          disabled={disabled}
          hover="fill"
          title="Видалити елемент"
          onClick={onRemoveClick}
        >
          <CloseIcon />
        </IconButton>
      </div>
    </li>
  );
}

export function OptionListBuilder({
  className,
  disabled,
  items,
  onItemsChanged,
}: OptionListBuilderProps) {
  const lastInputRef = useRef<HTMLInputElement>(null);
  const addingNewItemRef = useRef<boolean>(false);

  const onItemChanged = useCallback(
    (text: string, index: number) => {
      const copy = [...items];
      copy[index] = text;

      onItemsChanged?.(copy);
    },
    [items, onItemsChanged]
  );

  const onRemoveItem = useCallback(
    (index: number) => {
      const copy = [...items];
      copy.splice(index, 1);

      onItemsChanged?.(copy);
    },
    [items, onItemsChanged]
  );

  useLayoutEffect(() => {
    if (addingNewItemRef.current) {
      lastInputRef.current?.focus();
      addingNewItemRef.current = false;
    }
  }, [items]);

  return (
    <Typography as="ol" className={classNames(styles.root, className)}>
      {items.map((item, i) => (
        <Option
          key={i}
          index={i}
          text={item}
          disabled={disabled}
          onTextChanged={onItemChanged}
          onRemove={onRemoveItem}
          inputRef={i === items.length ? lastInputRef : undefined}
        />
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
