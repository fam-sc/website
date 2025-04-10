import { JSX, ReactNode } from 'react';

import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';

type ButtonProps = JSX.IntrinsicElements['button'];

export interface IconButtonProps extends ButtonProps {
  children: ReactNode;
}

export function IconButton({ className, children, ...rest }: IconButtonProps) {
  return (
    <button className={classNames(styles.root, className)} {...rest}>
      {children}
    </button>
  );
}
