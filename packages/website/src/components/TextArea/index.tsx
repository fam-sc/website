import { Typography } from '../Typography';

import styles from './index.module.scss';

import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

type HTMLTextAreaProps = PropsMap['textarea'];

export interface TextAreaProps extends HTMLTextAreaProps {
  onTextChanged?: (value: string) => void;
}

export function TextArea({
  value,
  className,
  onChange,
  onTextChanged,
  ...rest
}: TextAreaProps) {
  return (
    <Typography
      as="textarea"
      className={classNames(styles.root, className)}
      value={value}
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
