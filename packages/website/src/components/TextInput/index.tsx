import { ReactNode, Ref } from 'react';

import styles from './index.module.scss';

import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';
import { Typography } from '../Typography';

type InputProps = PropsMap['input'];

export interface TextInputProps extends InputProps {
  error?: string | false;
  endContent?: ReactNode;
  type?: 'text' | 'password';
  variant?: 'bordered' | 'underline';
  ref?: Ref<HTMLInputElement>;

  onTextChanged?: (text: string) => void;
}

export function TextInput({
  className,
  error,
  disabled,
  variant,
  endContent,
  ref,
  onChange,
  onTextChanged,
  ...rest
}: TextInputProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <div
        className={styles.input}
        data-variant={variant ?? 'bordered'}
        data-state={error ? 'error' : undefined}
        data-disabled={disabled}
      >
        <Typography
          as="input"
          type="text"
          ref={ref}
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
