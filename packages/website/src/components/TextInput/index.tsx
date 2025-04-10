import { JSX } from 'react';

import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';

type InputProps = JSX.IntrinsicElements['input'];

export interface TextInputProps extends InputProps {
  isError?: boolean;
  onTextChanged?: (text: string) => void;
}

export function TextInput({
  className,
  onChange,
  onTextChanged,
  isError,
  ...rest
}: TextInputProps) {
  console.log(isError);
  return (
    <input
      type="text"
      className={classNames(
        styles.root,
        isError ? styles['root-error'] : undefined,
        className
      )}
      onChange={
        onChange ??
        ((event) => {
          onTextChanged?.(event.target.value);
        })
      }
      {...rest}
    />
  );
}
