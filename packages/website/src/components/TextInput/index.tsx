import { ReactNode } from 'react';

import styles from './index.module.scss';

import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';
import { Typography } from '../Typography';

type InputProps = PropsMap['input'];

export interface TextInputProps extends InputProps {
  error?: string | false;
  endContent?: ReactNode;
  type?: 'text' | 'password';

  onTextChanged?: (text: string) => void;
}

export function TextInput({
  className,
  error,
  disabled,
  endContent,
  onChange,
  onTextChanged,
  ...rest
}: TextInputProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <div
        className={styles.input}
        data-state={error === undefined ? undefined : 'error'}
        data-disabled={disabled}
      >
        <input
          type="text"
          disabled={disabled}
          onChange={
            onChange ??
            ((event) => {
              onTextChanged?.(event.target.value);
            })
          }
          {...rest}
        />

        {endContent && (
          <div className={styles['end-content']}>{endContent}</div>
        )}
      </div>

      {error && <Typography className={styles.error}>{error}</Typography>}
    </div>
  );
}
