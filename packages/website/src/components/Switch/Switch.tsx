import { classNames } from '@sc-fam/shared';
import { ChangeEvent, useCallback } from 'react';

import { Typography } from '../Typography';
import styles from './Switch.module.scss';

export interface SwitchProps {
  disabled?: boolean;
  className?: string;
  checked: boolean;
  onCheckedChanged?: (state: boolean) => void;
  children?: ReactNode;
}

export function Switch({
  disabled,
  className,
  checked,
  onCheckedChanged,
  children,
}: SwitchProps) {
  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { target } = event;

      onCheckedChanged?.(target.checked);
    },
    [onCheckedChanged]
  );

  return (
    <Typography
      as="label"
      className={classNames(
        styles.root,
        disabled && styles['root-disabled'],
        className
      )}
    >
      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        className={styles.input}
      />
      {children}
    </Typography>
  );
}
