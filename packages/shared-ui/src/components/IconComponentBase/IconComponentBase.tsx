import { classNames } from '@sc-fam/shared';
import { createElement, ReactNode } from 'react';

import { impersonatedComponent } from '../../utils/impersonation';
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
    return createElement(
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
