import styles from './index.module.scss';

import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';
import { Typography } from '../Typography';
import { MouseEvent, useState } from 'react';

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
  selectedItem,
  placeholder,
  onItemSelected,
  className,
  disabled,
  ...rest
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const itemOnClick = (event: MouseEvent) => {
    const key = (event.target as HTMLElement).dataset.key;

    if (key !== undefined) {
      if (key !== selectedItem) {
        onItemSelected?.(key as T);
      }

      setIsOpen(false);
    }
  };

  return (
    <div
      aria-disabled={disabled}
      data-open={isOpen}
      className={classNames(styles.root, className)}
      onBlur={() => {
        setTimeout(() => {
          setIsOpen(false);
        }, 100);
      }}
      {...rest}
    >
      <button
        disabled={disabled}
        className={styles.header}
        onClick={() => {
          setIsOpen((state) => !state);
        }}
      >
        <Typography>
          {items.find((item) => item.key === selectedItem)?.title ??
            placeholder}
        </Typography>

        <svg viewBox="0 0 16 16">
          <path d="M0 4 H16 L8 12Z" />
        </svg>
      </button>

      {isOpen && (
        <ul className={styles.items}>
          {items.map(({ key, title }) => (
            <Typography as="li" key={key} data-key={key} onClick={itemOnClick}>
              {title}
            </Typography>
          ))}
        </ul>
      )}
    </div>
  );
}
