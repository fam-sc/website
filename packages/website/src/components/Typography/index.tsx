import React, { ReactElement } from 'react';

import styles from './index.module.scss';

import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';
import { ImpersonatedProps } from '@/utils/impersonation';

type Header = `h${1 | 2 | 3 | 4 | 5 | 6}`;

export type TypographyVariant = 'body' | 'bodyLarge' | Header;

export interface TypographyProps {
  variant?: TypographyVariant;
}

function isHeader(value: TypographyVariant): value is Header {
  return value.startsWith('h');
}

export function Typography<As extends keyof PropsMap = 'p'>({
  className,
  as: _as,
  variant = 'body',
  children,
  ...rest
}: ImpersonatedProps<TypographyProps, As>): ReactElement {
  const elementName =
    _as === undefined ? (isHeader(variant) ? variant : 'p') : _as;

  return React.createElement(
    elementName,
    {
      className: classNames(styles.root, className),
      'data-variant': variant,
      ...rest,
    },
    children
  );
}
