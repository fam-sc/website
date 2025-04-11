import { JSX } from 'react';

import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';

type ButtonVariant = 'flat' | 'solid' | 'outlined';
type ButtonColor = 'primary';

type ButtonProps = JSX.IntrinsicElements['button'] & {
  variant?: ButtonVariant;
  color?: ButtonColor;
};

export function Button({ className, variant, color, ...rest }: ButtonProps) {
  return (
    <button
      data-variant={variant ?? 'flat'}
      data-color={color ?? 'primary'}
      className={classNames(styles.root, className)}
      {...rest}
    />
  );
}
