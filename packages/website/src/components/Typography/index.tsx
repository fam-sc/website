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
  const baseProps = { className: classNames(styles.root, className), ...rest };

  if (isHeader(variant)) {
    return React.createElement(variant, baseProps, children);
  }

  return React.createElement(
    _as ?? 'p',
    { 'data-variant': variant, ...baseProps },
    children
  );
}
