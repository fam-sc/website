import { ReactNode } from 'react';
import React from 'react';

import { classNames } from '@/utils/classNames';
import { impersonatedComponent } from '@/utils/impersonation';

import styles from './IconComponentBase.module.scss';

export type IconComponentBaseProps = {
  className?: string;
  rounding?: 'none' | 'rounded' | 'circle';
  hover?: 'background' | 'fill';

  children: ReactNode;
};

export const IconComponentBase = impersonatedComponent<
  IconComponentBaseProps,
  'button'
>(
  ({
    as = 'button',
    rounding = 'rounded',
    hover = 'background',
    className,
    children,
    ...rest
  }) => {
    return React.createElement(
      as,
      {
        ...rest,
        className: classNames(
          styles.root,
          styles[`root-rounding-${rounding}`],
          styles[`root-hover-${hover}`],
          className
        ),
      },
      children
    );
  }
);
