import React, { Attributes } from 'react';

import styles from './index.module.scss';

import { WithDataSpace } from '@/types/react';
import { classNames } from '@/utils/classNames';
import { impersonatedComponent } from '@/utils/impersonation';

type Header = `h${1 | 2 | 3 | 4 | 5 | 6}`;

export type TypographyVariant = 'caption' | 'body' | 'bodyLarge' | Header;
export type TypographyWeight = 'plain' | 'bold';

export interface TypographyProps
  extends WithDataSpace<'variant' | 'weight' | 'has-icon'> {
  hasIcon?: boolean;
  variant?: TypographyVariant;
  weight?: TypographyWeight;
}

function isHeader(value: TypographyVariant): value is Header {
  return value.startsWith('h');
}

export const Typography = impersonatedComponent<TypographyProps, 'p'>(
  'p',
  ({
    as: _as,
    className,
    variant = 'body',
    weight = 'plain',
    hasIcon,
    children,
    ...rest
  }) => {
    const elementName = _as === 'p' && isHeader(variant) ? variant : _as;

    return React.createElement(
      elementName,
      {
        className: classNames(styles.root, className),
        'data-variant': variant,
        'data-has-icon': hasIcon,
        'data-weight': weight,
        ...rest,
      } as Attributes,
      children
    );
  }
);
