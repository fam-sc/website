import { ReactNode } from 'react';

import styles from './index.module.scss';

import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

type InputProps = PropsMap['input'];

export interface TextInputProps extends InputProps {
  isError?: boolean;
  endContent?: ReactNode;
  type?: 'text' | 'password';

  onTextChanged?: (text: string) => void;
}

export function TextInput({
  className,
  isError,
  endContent,
  onChange,
  onTextChanged,
  ...rest
}: TextInputProps) {
  return (
    <div
      data-state={isError ? 'error' : undefined}
      className={classNames(styles.root, className)}
    >
      <input
        type="text"
        onChange={
          onChange ??
          ((event) => {
            onTextChanged?.(event.target.value);
          })
        }
        {...rest}
      />

      {endContent && <div className={styles['end-content']}>{endContent}</div>}
    </div>
  );
}
