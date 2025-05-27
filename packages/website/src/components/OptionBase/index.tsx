import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';
import { Typography, TypographyVariant } from '../Typography';

import styles from './index.module.scss';
import { useId } from 'react';

type InputProps = PropsMap['input'];

export interface OptionBaseProps extends Omit<InputProps, 'value'> {
  type: 'radio' | 'checkbox';
  variant?: TypographyVariant;
  onCheckedChanged?: (state: boolean) => void;
}

export function OptionBase({
  className,
  type,
  disabled,
  children,
  variant,
  onCheckedChanged,
  ...rest
}: OptionBaseProps) {
  const inputId = useId();

  return (
    <Typography
      className={classNames(styles.root, className)}
      data-disabled={disabled}
      variant={variant}
      for={inputId}
      as="label"
    >
      <input
        id={inputId}
        type={type}
        disabled={disabled}
        onChange={(event) => {
          const state = event.target.checked;

          onCheckedChanged?.(state);
        }}
        {...rest}
      />
      {children}
    </Typography>
  );
}
