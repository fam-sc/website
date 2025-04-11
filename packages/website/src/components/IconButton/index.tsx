import { JSX, ReactNode } from 'react';

import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';

type ButtonProps = JSX.IntrinsicElements['button'];

export interface IconButtonProps extends ButtonProps {
  rounding?: 'none' | 'rounded' | 'circle';
  children: ReactNode;
}

export function IconButton({
  rounding,
  className,
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      className={classNames(styles.root, className)}
      data-rounding={rounding ?? 'rounded'}
      {...rest}
    >
      {children}
    </button>
  );
}
