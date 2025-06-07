import { PropsMap } from '@/types/react';
import styles from './index.module.scss';
import { classNames } from '@/utils/classNames';
import { toLocalISOString } from '@shared/date';

type InputProps = PropsMap['input'];

export interface DatePickerProps
  extends Omit<InputProps, 'value' | 'min' | 'max'> {
  value?: Date;
  min?: Date;
  max?: Date;
  onValueChanged?: (value: Date) => void;
}

function dateToString(value: Date | undefined) {
  return value ? toLocalISOString(value).slice(0, -8) : undefined;
}

export function DatePicker({
  className,
  value,
  min,
  max,
  onValueChanged,
  ...rest
}: DatePickerProps) {
  return (
    <input
      className={classNames(styles.root, className)}
      type="datetime-local"
      value={dateToString(value)}
      min={dateToString(min)}
      max={dateToString(max)}
      onChange={(event) => {
        const { value } = event.target;

        onValueChanged?.(new Date(value));
      }}
      {...rest}
    />
  );
}
