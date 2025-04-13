import styles from './index.module.scss';

import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

type HTMLSelectProps = PropsMap['select'];

export interface SelectProps<T extends string = string>
  extends HTMLSelectProps {
  items: { key: T; title: string }[];
  selectedItem?: T;
  placeholder: string;

  onItemSelected?: (value: T) => void;
}

export function Select<T extends string>({
  items,
  selectedItem,
  placeholder,
  onItemSelected,
  className,
  ...rest
}: SelectProps<T>) {
  return (
    <select
      {...rest}
      value={selectedItem}
      className={classNames(styles.root, className)}
      onChange={(event) => {
        const selectedIndex = event.target.selectedIndex - 1;

        onItemSelected?.(items[selectedIndex].key);
      }}
    >
      <button>
        <selectedcontent />

        <svg viewBox="0 0 16 16">
          <path d="M0 4 H16 L8 12Z" />
        </svg>
      </button>

      <option value="" hidden disabled>
        {placeholder}
      </option>

      {items.map(({ key, title }) => (
        <option key={key} value={key}>
          {title}
        </option>
      ))}
    </select>
  );
}
