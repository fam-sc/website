import React from 'react';

import { Typography } from '../Typography';

import { classNames } from '@/utils/classNames';
import { impersonatedComponent } from '@/utils/impersonation';

import styles from './index.module.scss';

type ButtonVariant = 'flat' | 'solid' | 'outlined';
type ButtonColor = 'primary';

export interface ButtonProps {
  hasIcon?: boolean;
  disabled?: boolean;
  className?: string;
  buttonVariant?: ButtonVariant;
  color?: ButtonColor;
}

export const Button = impersonatedComponent<ButtonProps, 'button'>(
  'button',
  ({
    className,
    buttonVariant = 'flat',
    color = 'primary',
    disabled,
    ...rest
  }) => {
    return (
      <Typography
        disabled={disabled}
        className={classNames(
          styles.root,
          styles[`root-variant-${buttonVariant}`],
          styles[`root-color-${color}`],
          className
        )}
        {...rest}
      />
    );
  }
);
