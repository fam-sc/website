import { ReactNode } from 'react';

import styles from './index.module.scss';

import { WithDataSpace } from '@/types/react';
import { classNames } from '@/utils/classNames';
import { impersonatedComponent } from '@/utils/impersonation';
import React from 'react';

export type IconComponentBaseProps = WithDataSpace<'rounding' | 'hover'> & {
  className?: string;
  rounding?: 'none' | 'rounded' | 'circle';
  hover?: 'background' | 'fill';

  children: ReactNode;
};

export const IconComponentBase = impersonatedComponent<
  IconComponentBaseProps,
  'button'
>('button', ({ as, rounding, hover, className, children, ...rest }) => {
  return React.createElement(
    as,
    {
      ...rest,
      className: classNames(styles.root, className),
      'data-rounding': rounding ?? 'rounded',
      'data-hover': hover ?? 'background',
    },
    children
  );
});
