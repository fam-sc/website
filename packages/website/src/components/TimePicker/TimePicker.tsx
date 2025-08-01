import { ChangeEvent } from 'react';

import { classNames } from '@/utils/classNames';
import { Time } from '@/utils/time';

import styles from './TimePicker.module.scss';

export interface TimePickerProps {
  disabled?: boolean;
  className?: string;

  time: Time;
  onTimeChanged?: (value: Time) => void;
}

export function TimePicker({
  disabled,
  className,
  time,
  onTimeChanged,
}: TimePickerProps) {
  function onChange(event: ChangeEvent<HTMLInputElement>) {
    onTimeChanged?.(event.target.value as Time);
  }

  return (
    <input
      type="time"
      className={classNames(styles.root, className)}
      disabled={disabled}
      value={time}
      onChange={onChange}
    />
  );
}
