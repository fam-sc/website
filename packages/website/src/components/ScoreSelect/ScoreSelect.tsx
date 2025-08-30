import { classNames } from '@sc-fam/shared';
import { ChangeEvent, ComponentProps, useCallback, useId } from 'react';

import { Typography } from '../Typography';
import { ScoreSelectAdapter } from './adapter';
import styles from './ScoreSelect.module.scss';

export interface ScoreSelectProps<T> {
  className?: string;
  disabled?: boolean;

  items: readonly number[];
  adapter: ScoreSelectAdapter<T>;

  selected: T;
  onSelectedChanged: (value: T) => void;
}

interface ScoreChoiceProps
  extends Pick<
    ComponentProps<'input'>,
    'name' | 'checked' | 'type' | 'disabled'
  > {
  value: number;
  onCheckedChanged: (value: number, state: boolean) => void;
}

function ScoreChoice({
  value,
  name,
  type,
  disabled,
  checked,
  onCheckedChanged,
}: ScoreChoiceProps) {
  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onCheckedChanged(value, event.target.checked);
    },
    [value, onCheckedChanged]
  );

  return (
    <Typography
      as="label"
      variant="bodyLarge"
      className={classNames(
        styles.choice,
        checked && styles[`choice-checked`],
        disabled && styles['choice-disabled']
      )}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span>{value}</span>
    </Typography>
  );
}

export function ScoreSelect<T>({
  items,
  className,
  disabled,
  adapter,
  onSelectedChanged,
  selected,
}: ScoreSelectProps<T>) {
  const name = useId();

  const onItemCheckedChanged = useCallback(
    (value: number, checked: boolean) => {
      onSelectedChanged(adapter.onCheckedSelected(selected, value, checked));
    },
    [adapter, selected, onSelectedChanged]
  );

  return (
    <div className={classNames(styles.root, className)}>
      {items.map((item) => (
        <ScoreChoice
          key={item}
          value={item}
          name={name}
          type={adapter.inputType}
          checked={adapter.isChecked(selected, item)}
          onCheckedChanged={onItemCheckedChanged}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
