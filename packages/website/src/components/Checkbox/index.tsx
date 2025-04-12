import { Typography, TypographyVariant } from '../Typography';

import styles from './index.module.scss';

import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

type InputProps = PropsMap['input'];

export interface CheckboxProps extends InputProps {
  variant?: TypographyVariant;
}

export function Checkbox({
  children,
  disabled,
  variant,
  className,
  ...rest
}: CheckboxProps) {
  return (
    <Typography
      className={classNames(styles.root, className)}
      data-disabled={disabled}
      variant={variant}
      as="label"
    >
      <input type="checkbox" disabled={disabled} {...rest} />
      {children}
    </Typography>
  );
}
