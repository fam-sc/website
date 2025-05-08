import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';
import { Typography, TypographyVariant } from '../Typography';

import styles from './index.module.scss';

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
  return (
    <Typography
      className={classNames(styles.root, className)}
      data-disabled={disabled}
      variant={variant}
      as="label"
    >
      <input
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
