import React from 'react';

import { Typography } from '../Typography';

import { WithDataSpace } from '@/types/react';
import { classNames } from '@/utils/classNames';
import { impersonatedComponent } from '@/utils/impersonation';

import styles from './index.module.scss';

type ButtonVariant = 'flat' | 'solid' | 'outlined';
type ButtonColor = 'primary';

export interface ButtonProps extends WithDataSpace<'button-variant' | 'color'> {
  hasIcon?: boolean;
  disabled?: boolean;
  className?: string;
  buttonVariant?: ButtonVariant;
  color?: ButtonColor;
}

export const Button = impersonatedComponent<ButtonProps, 'button'>(
  'button',
  ({ className, buttonVariant, color, disabled, ...rest }) => {
    return (
      <Typography
        data-button-variant={buttonVariant ?? 'flat'}
        data-color={color ?? 'primary'}
        disabled={disabled}
        className={classNames(styles.root, className)}
        {...rest}
      />
    );
  }
);
