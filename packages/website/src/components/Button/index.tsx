import React from 'react';

import { Typography } from '../Typography';

import styles from './index.module.scss';

import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';
import { ImpersonatedProps } from '@/utils/impersonation';

type ButtonVariant = 'flat' | 'solid' | 'outlined';
type ButtonColor = 'primary';

export interface ButtonProps {
  variant?: ButtonVariant;
  color?: ButtonColor;
}

export function Button<As extends keyof PropsMap = 'button'>({
  as: _as,
  className,
  variant,
  color,
  ...rest
}: ImpersonatedProps<ButtonProps, As>) {
  return (
    <Typography<As>
      as={(_as ?? 'button') as As}
      data-variant={variant ?? 'flat'}
      data-color={color ?? 'primary'}
      className={classNames(styles.root, className)}
      {...rest}
    />
  );
}
