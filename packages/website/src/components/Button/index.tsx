import React from 'react';

import { Typography } from '../Typography';

import styles from './index.module.scss';

import { WithDataSpace } from '@/types/react';
import { classNames } from '@/utils/classNames';
import { impersonatedComponent } from '@/utils/impersonation';

type ButtonVariant = 'flat' | 'solid' | 'outlined';
type ButtonColor = 'primary';

export interface ButtonProps extends WithDataSpace<'button-variant' | 'color'> {
  className?: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
}

export const Button = impersonatedComponent<ButtonProps, 'button'>(
  'button',
  ({ className, variant, color, ...rest }) => {
    return (
      <Typography
        data-button-variant={variant ?? 'flat'}
        data-color={color ?? 'primary'}
        className={classNames(styles.root, className)}
        {...rest}
      />
    );
  }
);
