import { classNames } from '@sc-fam/shared';
import { impersonatedComponent } from '@sc-fam/shared-ui';
import React, { Attributes, ReactNode } from 'react';

import styles from './Typography.module.scss';

type Header = `h${1 | 2 | 3 | 4 | 5 | 6}`;

export type TypographyVariant = 'caption' | 'body' | 'bodyLarge' | Header;
export type TypographyWeight = 'plain' | 'bold';

export interface TypographyProps {
  hasIcon?: boolean;
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  className?: string;
  children?: ReactNode;
}

function isHeader(value: TypographyVariant): value is Header {
  return value.startsWith('h');
}

export const Typography = impersonatedComponent<TypographyProps, 'p'>(
  ({
    as = 'p',
    className,
    variant = 'body',
    weight = 'plain',
    hasIcon,
    children,
    ...rest
  }) => {
    const elementName = as === 'p' && isHeader(variant) ? variant : as;

    return React.createElement(
      elementName,
      {
        className: classNames(
          styles.root,
          styles[`root-variant-${variant}`],
          weight === 'bold' && styles['root-weight-bold'],
          hasIcon && styles[`root-has-icon`],
          className
        ),
        ...rest,
      } as Attributes,
      children
    );
  }
);
