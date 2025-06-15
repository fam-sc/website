import { ReactNode, Ref } from 'react';

import styles from './index.module.scss';

import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';
import { Typography } from '../Typography';

type InputProps = PropsMap['input'];

export interface TextInputProps extends InputProps {
  error?: string | boolean;
  endContent?: ReactNode;
  type?: 'text' | 'password' | 'email' | 'tel';
  variant?: 'bordered' | 'underline';
  ref?: Ref<HTMLInputElement>;

  onTextChanged?: (text: string) => void;
}

export function TextInput({
  className,
  error,
  disabled,
  variant = 'bordered',
  endContent,
  ref,
  onChange,
  onTextChanged,
  ...rest
}: TextInputProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <div
        className={classNames(
          styles.input,
          styles[`input-variant-${variant}`],
          error && styles['input-error'],
          disabled && styles['input-disabled']
        )}
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
