import { classNames } from '@sc-fam/shared';
import { toLocalISOString } from '@sc-fam/shared/chrono';
import { ComponentProps } from 'react';

import styles from './DatePicker.module.scss';

export interface DatePickerProps
  extends Omit<ComponentProps<'input'>, 'value' | 'min' | 'max'> {
  type?: 'date' | 'datetime-local';
  value?: string | Date;
  min?: string | Date;
  max?: string | Date;
  onValueChanged?: (value: Date) => void;
}

function dateToString(value: Date | string | undefined, isDate: boolean) {
  if (value === undefined || typeof value === 'string') {
    return value;
  }

  const offset = isDate ? -14 : -8;

  return toLocalISOString(value).slice(0, offset);
}

export function DatePicker({
  className,
  value,
  min,
  max,
  onValueChanged,
  type = 'datetime-local',
  ...rest
}: DatePickerProps) {
  const isDate = type === 'date';

  return (
    <input
      className={classNames(styles.root, className)}
      type={type}
      value={dateToString(value, isDate)}
      min={dateToString(min, isDate)}
      max={dateToString(max, isDate)}
      onChange={(event) => {
        const { value } = event.target;

        onValueChanged?.(new Date(value));
      }}
      {...rest}
    />
  );
}
