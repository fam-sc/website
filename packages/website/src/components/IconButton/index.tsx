import { JSX, ReactNode } from 'react';

import styles from './index.module.scss';

import { WithDataSpace } from '@/types/react';
import { classNames } from '@/utils/classNames';

type ButtonProps = JSX.IntrinsicElements['button'];

export interface IconButtonProps
  extends ButtonProps,
    WithDataSpace<'rounding' | 'hover'> {
  rounding?: 'none' | 'rounded' | 'circle';
  hover?: 'background' | 'fill';

  children: ReactNode;
}

export function IconButton({
  rounding,
  hover,
  className,
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      className={classNames(styles.root, className)}
      data-rounding={rounding ?? 'rounded'}
      data-hover={hover ?? 'background'}
      {...rest}
    >
      {children}
    </button>
  );
}
